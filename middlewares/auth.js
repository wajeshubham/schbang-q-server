import jwt from "jsonwebtoken";
import User from "../models/user.js";
import CustomError from "../utils/customError.js";
import CustomResponse from "../utils/customResponse.js";
import { options } from "../utils/setCookie.js";
import interceptor from "./interceptor.js";

export const isLoggedOut = interceptor(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next();
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).select(
      "-lastActivityLog"
    );
    if (!user) {
      return next();
    }
    req.user = user;

    // * if token is valid that  means user is already logged in
    return next(
      res
        .status(200)
        .cookie("token", token, options)
        .json(
          new CustomResponse(
            200,
            "User is already logged in. Please logout first",
            [],
            {}
          )
        )
    );
  } catch (error) {
    console.log(error);
    return next();
  }
});

export const isLoggedIn = interceptor(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new CustomError("Please log in first", 401, res));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new CustomError("Please log in first", 401, res));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new CustomError("Please log in first", 401, res));
  }
});

export const logUserActivity = (actionType, message) =>
  interceptor(async (req, res, next) => {
    const user = await User.findById(req.user?.id);
    user.lastActivityLog?.push({
      message,
      actionType,
      date: new Date().toISOString(),
    });
    user.save();
    next();
  });
