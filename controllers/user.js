import User from "../models/user.js";
import interceptor from "../middlewares/interceptor.js";
import CustomError from "../utils/customError.js";
import setCookie from "../utils/setCookie.js";
import CustomResponse from "../utils/customResponse.js";

export const signup = interceptor(async (req, res, next) => {
  const { name, email, password, username } = req.body;
  if (!email || !name || !password || !username) {
    return next(
      new CustomError("Please provide all the required fields", 400, res)
    );
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new CustomError("User with this email already exists", 400, res)
    );
  }
  const user = await User.create({
    name,
    email,
    password,
    username,
  });

  setCookie(user, res, 201);
});

export const login = interceptor(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new CustomError("Please provide all the required fields", 400, res)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("Invalid email or password", 400, res));
  }
  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    return next(new CustomError("Invalid email or password", 400, res));
  }

  user.lastLoggedIn = new Date();
  setCookie(user, res, 200);
});

export const logout = interceptor(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res
    .status(200)
    .json(new CustomResponse(200, "Logged out successfully", [], {}));
});

export const subscribe = interceptor(async (req, res, next) => {
  if (req.user?.subscribed)
    return new CustomError(
      "You are already subscribed to our notifications",
      400,
      res
    );

  const user = await User.findById(req.user?._id);
  user.subscribed = true;
  user.save({
    validateBeforeSave: true,
  });
  return res
    .status(200)
    .json(
      new CustomResponse(
        200,
        "You are successfully subscribed to the notifications!",
        [],
        {}
      )
    );
});

export const unsubscribe = interceptor(async (req, res, next) => {
  if (!req.user?.subscribed)
    return new CustomError(
      "You are not subscribed to our notifications",
      400,
      res
    );

  const user = await User.findById(req.user?._id);
  user.subscribed = false;
  user.save({
    validateBeforeSave: true,
  });
  return res
    .status(200)
    .json(
      new CustomResponse(
        200,
        "You are unsubscribed to the notifications!",
        [],
        {}
      )
    );
});
