import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import Space from "@repo/db/space";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
import { v4 as uuid } from "uuid";
//Aim-> to create a User Class contains user detail and message:joined or moved

dotenv.config({ path: '../../.env' }); 
const JWT_PASSWORD:string=process.env.JWT_SECRET||"no-value";


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
            // console.log(data);
            const parsedData = (data);
            // console.log(parsedData);
            switch (parsedData.type) {
                case "join":
                    console.log("join received");
                    const spaceId = parsedData.payload.spaceId;
                    console.log(spaceId);
                    const token = parsedData.payload.token;
                    const userId = (jwt.verify(token, JWT_PASSWORD) as JwtPayload).userId;
                    if (!userId) {
                        this.socket.disconnect();
                        return;
                    }

                    this.userId = userId;
                    const space = await Space.findOne({
                            _id: spaceId 
                        }
                    ).exec();

                    if (!space) {
                        console.log("not found");
                        this.socket.disconnect();
                        return;
                    }

                    this.spaceId = spaceId;
                    RoomManager.getInstance().addUser(spaceId, this);
                    //placing at random loacation.
                    this.x = Math.floor(Math.random() * (space.width || 0));
                    this.y = Math.floor(Math.random() * (space.height || 0));

                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            users: RoomManager.getInstance().rooms.get(spaceId)?.filter((x:User) => x.id !== this.id)?.map((u:User) => ({ id: u.id })) ?? []
                        }
                    });
                    //sending broadcast message that user joined to all
                    RoomManager.getInstance().broadcast({
                        type: "user-joined",
                        payload: {
                            userId: this.userId,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.spaceId!);

                    break;

                case "move":
                    console.log(parsedData.payload);
                    const moveX = parsedData.payload.x;
                    const moveY = parsedData.payload.y;
                    //allowed one step at a time
                    const xDisplacement = Math.abs(this.x - moveX);
                    const yDisplacement = Math.abs(this.y - moveY);
                    console.log(xDisplacement);
                    console.log(yDisplacement);
                    if ((xDisplacement === 1 && yDisplacement === 0) || (xDisplacement === 0 && yDisplacement === 1)) {
                        this.x = moveX;
                        this.y = moveY;
                        //brodcast message for movement
                        console.log("working");
                        RoomManager.getInstance().broadcast({
                            type: "movement",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                        }, this, this.spaceId!);
                        return;
                    }

                    this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y
                        }
                    });
                    break;
            }
        });
    }

    destroy() {
        //user left
        console.log("destroyed");
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.userId
            }
        }, this, this.spaceId!);
        RoomManager.getInstance().removeUser(this, this.spaceId!);
    }
    send(payload: OutgoingMessage) {
        this.socket.emit("message", JSON.stringify(payload));
    }
}
