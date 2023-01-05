import express from "express";
import { createPost, deletePost, getPosts } from "../controllers/post.js";
import { upload } from "../services/fileUpload.js";

const postRouter = express.Router();

postRouter.route("/").get(getPosts);
postRouter.route("/").post(upload.single("image"), createPost);
postRouter.route("/:id").delete(deletePost);

export default postRouter;
