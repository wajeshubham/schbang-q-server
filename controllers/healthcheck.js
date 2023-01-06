import interceptor from "../middlewares/interceptor.js";
import CustomResponse from "../utils/customResponse.js";

export const healthcheck = interceptor((req, res) => {
  res.status(200).json(new CustomResponse(200, "pong", [], {}));
});
