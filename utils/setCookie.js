import CustomResponse from "./customResponse.js";

export const options = {
  expires: new Date(
    Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  domain: process.env.COOKIE_DOMAIN,
};

const setCookie = (user, res, status) => {
  const token = user.generateJWT();
  user.password = undefined;
  res
    .status(status)
    .cookie("token", token, options)
    .json(new CustomResponse(status, "success", [], { user, token }));
};

export default setCookie;
