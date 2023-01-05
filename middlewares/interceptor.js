import CustomError from "../utils/customError.js";

export default (func) => async (req, res, next) => {
  try {
    return await Promise.resolve(func(req, res, next));
  } catch (e) {
    console.log("Error: ", e);
    return next(new CustomError("internal server error", 500, res));
  }
};
