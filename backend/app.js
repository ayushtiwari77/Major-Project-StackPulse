// import dotenv from "dotenv";
// // // setup of env file
// // dotenv.config();

import express from "express";
import morgan from "morgan";
import connect from "./db/db.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import projectRouter from "./routes/project.routes.js";
import aiRouter from "./routes/ai.routes.js";

//connecting database
connect();

//creating express server
const app = express();

//using middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/project", projectRouter);
app.use("/ai", aiRouter);
//server started dummy route
app.get("/", (req, res) => {
  res.send("server is working super fine");
});

export default app;
