import express from "express";
import { addComment, deleteComment } from "../controllers/comment.js";

import { isLoggedIn } from "../middlewares/auth.js";

const commentRouter = express.Router();

commentRouter.route("/:postId").post(isLoggedIn, addComment);
commentRouter.route("/:id").delete(isLoggedIn, deleteComment);

export default commentRouter;
