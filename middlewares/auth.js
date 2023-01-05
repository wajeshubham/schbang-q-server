import jwt from "jsonwebtoken";
import User from "../models/user.js";
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
    req.user = await User.findById(decodedToken.id);
    // * if token is valid that  means user is already logged in
    return next(
      res
        .status(200)
        .cookie("token", token, options)
        .json(
          new CustomResponse(200, "Already logged in", [], {
            user: req.user,
            token,
          })
        )
    );
  } catch (error) {
    console.log(error);
    return next();
  }
});
