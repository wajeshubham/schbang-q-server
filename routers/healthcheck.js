import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.js";

const healthCheckRouter = Router();

healthCheckRouter.route("/healthcheck").get(healthcheck);

export default healthCheckRouter;
