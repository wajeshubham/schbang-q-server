import User from "../models/user.js";
import Interceptor from "../middlewares/interceptor.js";
import CustomError from "../utils/customError.js";
import setCookie from "../utils/setCookie.js";

export const signup = Interceptor(async (req, res, next) => {
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

export const login = Interceptor(async (req, res, next) => {
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
