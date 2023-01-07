import express from "express";
import {
  signup,
  login,
  subscribe,
  unsubscribe,
  logout,
  getMostActiveUser,
} from "../controllers/user.js";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.route("/signup").post(isLoggedOut, signup);
userRouter.route("/login").post(isLoggedOut, login);

userRouter.route("/logout").post(isLoggedIn, logout);
userRouter.route("/subscribe").post(isLoggedIn, subscribe);
userRouter.route("/unsubscribe").post(isLoggedIn, unsubscribe);

userRouter.route("/get/most-active").get(isLoggedIn, getMostActiveUser);

export default userRouter;
