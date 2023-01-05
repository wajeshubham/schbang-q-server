import express from "express";
import { signup, login } from "../controllers/user.js";
import { isLoggedOut } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.route("/signup").post(isLoggedOut, signup);
userRouter.route("/login").post(isLoggedOut, login);

export default userRouter;
