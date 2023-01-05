import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import healthCheckRouter from "./routers/healthcheck.js";
import userRouter from "./routers/user.js";

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

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1", healthCheckRouter);
app.use("/api/v1/user", userRouter);

export default app;
