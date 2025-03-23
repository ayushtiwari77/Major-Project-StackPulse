import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import app from "./app.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";

const port = process.env.PORT || 3000;

//creating a http server
const server = http.createServer(app);
//creating io server for socket
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//io middleware
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("inValid project id "));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) return next(new Error("authentication Error"));

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded) return next(new Error("authentication Error"));

    socket.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
});

//io connection starting
io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("a user connected");

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const message = data.messages;

    const aiIsPresentInMessage = message.includes("@ai");
    socket.broadcast.to(socket.roomId).emit("project-message", data);

    if (aiIsPresentInMessage) {
      const prompt = message.replace("@ai", "");
      const result = await generateResult(prompt);

      io.to(socket.roomId).emit("project-message", {
        messages: result,
        sender: {
          user: {
            _id: "ai",
            email: "AI",
          },
        },
      });

      return;
    }
  });
});

//listening of the server
server.listen(port, () => {
  console.log(`server is working on port ${port}`);
});
