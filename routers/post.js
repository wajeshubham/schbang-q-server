import express from "express";
import {
  createPost,
  deletePost,
  disLikePost,
  getMostLikedPost,
  getPostById,
  getPosts,
  likePost,
} from "../controllers/post.js";
import { isLoggedIn, logUserActivity } from "../middlewares/auth.js";
import { upload } from "../services/fileUpload.js";

const postRouter = express.Router();

postRouter.route("/").get(getPosts);

postRouter
  .route("/")
  .post(
    isLoggedIn,
    logUserActivity("createPost", "User is creating a post"),
    upload.single("image"),
    createPost
  );

postRouter.route("/:id").get(getPostById);
postRouter.route("/get/most-liked").get(getMostLikedPost);

postRouter
  .route("/:id")
  .delete(
    isLoggedIn,
    logUserActivity("deletePost", "User is deleting a post"),
    deletePost
  );

postRouter
  .route("/like/:id")
  .patch(
    isLoggedIn,
    logUserActivity("like", "User has liked the post"),
    likePost
  );

postRouter
  .route("/dislike/:id")
  .patch(
    isLoggedIn,
    logUserActivity("dislike", "User has disliked the post"),
    disLikePost
  );

export default postRouter;
