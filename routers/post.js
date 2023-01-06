import express from "express";
import { createPost, deletePost, getPosts } from "../controllers/post.js";
import { isLoggedIn } from "../middlewares/auth.js";
import { upload } from "../services/fileUpload.js";

const postRouter = express.Router();

postRouter.route("/").get(getPosts);
postRouter.route("/").post(isLoggedIn, upload.single("image"), createPost);
postRouter.route("/:id").delete(isLoggedIn, deletePost);

export default postRouter;
