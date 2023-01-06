import User from "../models/user.js";
import interceptor from "../middlewares/interceptor.js";
import CustomError from "../utils/customError.js";
import setCookie from "../utils/setCookie.js";
import CustomResponse from "../utils/customResponse.js";
import sendEmail from "../utils/sendEmail.js";

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
  await sendEmail({
    email: user.email,
    subject: "Welcome to our subscriber's list",
    message: `
Hello ${user.name},

We are really glad to see you in our subscriber's list. You will be notified when there is a new post or someone liked/commented on your post.

Thanks and Regards
SchbangQ
    `,
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
  await sendEmail({
    email: user.email,
    subject: "You are unsubscribed :-(",
    message: `
Hello ${user.name},

We are really sad to see you go. You will not receive any notification from us.

Thanks and Regards
SchbangQ
    `,
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
