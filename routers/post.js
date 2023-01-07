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
import { isLoggedIn } from "../middlewares/auth.js";
import { upload } from "../services/fileUpload.js";

const postRouter = express.Router();

postRouter.route("/").get(getPosts);
postRouter.route("/").post(isLoggedIn, upload.single("image"), createPost);

postRouter.route("/:id").get(getPostById);
postRouter.route("/get/most-liked").get(getMostLikedPost);
postRouter.route("/:id").delete(isLoggedIn, deletePost);

postRouter.route("/like/:id").patch(isLoggedIn, likePost);
postRouter.route("/dislike/:id").patch(isLoggedIn, disLikePost);

export default postRouter;
