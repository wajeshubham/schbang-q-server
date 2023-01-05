import interceptor from "../middlewares/interceptor.js";
import Post from "../models/post.js";
import CustomResponse from "../utils/customResponse.js";

export const getPosts = interceptor(async (req, res, next) => {
  const posts = await Post.find();
  return res
    .status(200)
    .send(new CustomResponse(200, "Posts fetched successfully!", [], posts));
});

export const createPost = interceptor(async (req, res, next) => {
  return res
    .status(201)
    .send(new CustomResponse(201, "Posts created successfully!", [], {}));
});
