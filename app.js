import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

import healthCheckRouter from "./routers/healthcheck.js";
import userRouter from "./routers/user.js";
import postRouter from "./routers/post.js";
import { upload } from "./services/fileUpload.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", healthCheckRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

export default app;
