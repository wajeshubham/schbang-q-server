import express from "express";
import { createPost, getPosts } from "../controllers/post.js";

const postRouter = express.Router();

postRouter.route("/").get(getPosts);
postRouter.route("/").post(createPost);

export default postRouter;
