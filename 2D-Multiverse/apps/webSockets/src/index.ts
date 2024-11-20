import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "./User";

const httpServer = createServer();

export const io = new Server(httpServer, {
  cors: {
    origin: ["*"],
    credentials: true,
  },
});

io.engine.generateId = (req: Request) => {
  return uuid();
};

io.on("connection", (socket) => {
  const user = new User(socket);
  socket.on("error", (error) => {
    console.error(`Socket error on socket ${socket.id}:`, error);
  });
  socket.on("disconnect", () => {
    console.log("closed");
    user?.destroy();
  });
  const count = io.engine.clientsCount;
  const count2 = io.of("/").sockets.size;
  console.log("Total clients (engine level): " + count);
  console.log("Total clients (namespace '/'): " + count2);

  (async () => {
    try {
      const sockets = await io.fetchSockets();
      console.log(`Total connected sockets: ${sockets.length}`);
      sockets.forEach((s) => {
        console.log(`Socket ID: ${s.id}`);
      });
    } catch (error) {
      console.error("Error fetching sockets:", error);
    }
  })();
});
io.on("error", (error) => {
  console.error("Socket.IO server error:", error);
});

const MONGO_URL: string =
  process.env.MONGO_URL ||
  "mongodb://localhost:27017/mydatabase"; /*for docker based port*/
// console.log(MONGO_URL);
mongoose
  .connect(MONGO_URL, {})
  .then(() => {
    httpServer.listen(5000, () => console.log(`Websockets is on Port:5000`));
  })
  .catch((error: Error) => console.log(`${error} did not connect`));
