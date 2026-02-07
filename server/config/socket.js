import dotenv from "dotenv";
dotenv.config(); 
import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});
console.log(process.env.FRONTEND_URL)

io.on("connection", (socket) => {

  socket.on("join", (userId) => {
    if (!userId) {
      return;
    }

    socket.join(userId.toString());
    // console.log("User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


export { io, app, server };
