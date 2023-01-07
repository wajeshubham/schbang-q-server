import express from "express";
import {
  signup,
  login,
  subscribe,
  unsubscribe,
  logout,
  getMostActiveUser,
  getUserAnalytics,
} from "../controllers/user.js";
import {
  isLoggedIn,
  isLoggedOut,
  logUserActivity,
} from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.route("/signup").post(isLoggedOut, signup);
userRouter.route("/login").post(isLoggedOut, login);

userRouter
  .route("/logout")
  .post(isLoggedIn, logUserActivity("logout", "User has logged out"), logout);

userRouter
  .route("/subscribe")
  .post(
    isLoggedIn,
    logUserActivity("subscribe", "User is subscribing"),
    subscribe
  );
userRouter
  .route("/unsubscribe")
  .post(
    isLoggedIn,
    logUserActivity("unsubscribe", "User is unsubscribing"),
    unsubscribe
  );

userRouter.route("/get/most-active").get(isLoggedIn, getMostActiveUser);
userRouter.route("/get/analytics").get(isLoggedIn, getUserAnalytics);

export default userRouter;
