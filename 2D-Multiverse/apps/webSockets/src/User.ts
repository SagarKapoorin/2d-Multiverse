import { Socket } from "socket.io";
import { io } from ".";
import { OutgoingMessage } from "./types";
import Space from "@repo/db/space";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";

dotenv.config({ path: "../../.env" });
const JWT_PASSWORD: string = process.env.JWT_SECRET || "no-value";

const roomUsers = new Map<string, Map<string, User>>();

export class User {
  public id: string;
  public userId?: string;
  private spaceId?: string;
  private x: number;
  private y: number;
  private socket: Socket;

  constructor(socket: Socket) {
    this.id = uuid();
    this.x = 0;
    this.y = 0;
    this.socket = socket;
    this.initHandlers();
  }

  initHandlers() {
    this.socket.on("message", async (data: any) => {
      const parsedData = data;

      switch (parsedData.type) {
        case "join":
          const spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;
          const userId = (jwt.verify(token, JWT_PASSWORD) as JwtPayload).userId;
          if (!userId) {
            this.socket.disconnect();
            return;
          }

          this.userId = userId;
          const space = await Space.findOne({ _id: spaceId }).exec();

          if (!space) {
            this.socket.disconnect();
            return;
          }

          this.spaceId = spaceId;

          this.socket.join(spaceId);

          this.x = Math.floor(Math.random() * (space.width || 0));
          this.y = Math.floor(Math.random() * (space.height || 0));

          if (!roomUsers.has(spaceId)) {
            roomUsers.set(spaceId, new Map());
          }
          roomUsers.get(spaceId)!.set(userId, this);

          const usersInRoom = Array.from(roomUsers.get(spaceId)!.values()).map(
            (user) => ({
              userId: user.userId,
              x: user.x,
              y: user.y,
            })
          );

          this.send({
            type: "space-joined",
            payload: {
              spawn: { x: this.x, y: this.y },
              users: usersInRoom,
              userId:this.userId
            },
          });

          this.socket.to(spaceId).emit(
            "message",
            JSON.stringify({
              type: "user-joined",
              payload: { userId: this.userId, x: this.x, y: this.y },
            })
          );
          break;

        case "move":
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;

          const xDisplacement = Math.abs(this.x - moveX);
          const yDisplacement = Math.abs(this.y - moveY);

          if (
            (xDisplacement === 1 && yDisplacement === 0) ||
            (xDisplacement === 0 && yDisplacement === 1)
          ) {
            this.x = moveX;
            this.y = moveY;

            this.socket.to(this.spaceId!).emit(
              "message",
              JSON.stringify({
                type: "movement",
                payload: { userId: this.userId, x: this.x, y: this.y },
              })
            );
          } else {
            this.send({
              type: "movement-rejected",
              payload: { x: this.x, y: this.y },
            });
          }
          break;
      }
    });
  }

  destroy() {
    if (this.spaceId && this.userId) {
      const room = roomUsers.get(this.spaceId);
      if (room) {
        room.delete(this.userId);

        this.socket.to(this.spaceId).emit(
          "message",
          JSON.stringify({
            type: "user-left",
            payload: { userId: this.userId },
          })
        );
      }
    }

    this.socket.leave(this.spaceId!);
  }

  send(payload: OutgoingMessage) {
    this.socket.emit("message", JSON.stringify(payload));
  }
}
