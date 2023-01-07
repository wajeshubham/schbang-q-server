import express from "express";
import { addComment, deleteComment } from "../controllers/comment.js";

import { isLoggedIn, logUserActivity } from "../middlewares/auth.js";

const commentRouter = express.Router();

commentRouter
  .route("/:postId")
  .post(
    isLoggedIn,
    logUserActivity("comment", "User is commenting"),
    addComment
  );

commentRouter
  .route("/:id")
  .delete(
    isLoggedIn,
    logUserActivity("deleteComment", "User is deleting the comment"),
    deleteComment
  );

export default commentRouter;
