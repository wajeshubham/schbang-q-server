import Interceptor from "../middlewares/interceptor.js";
import Post from "../models/post.js";
import CustomError from "../utils/customError.js";
import CustomResponse from "../utils/customResponse.js";

export const getPosts = Interceptor(async (req, res) => {
  const { skip, limit } = req.query;
  const posts = await Post.find().skip(skip).limit(limit);
  return res
    .status(200)
    .send(new CustomResponse(200, "Posts fetched successfully!", [], posts));
});

export const createPost = Interceptor(async (req, res) => {
  if (!req.file) return new CustomError("Please provide an image", 400, res);

  const { title, caption, tags } = req.body;

  if (!title || !caption)
    return new CustomError("Please fill all the required fields.", 400, res);

  const post = await Post.create({
    title,
    caption,
    tags,
    image: req.file.location,
  });
  return res
    .status(201)
    .send(new CustomResponse(201, "Posts added successfully!", [], post));
});

export const deletePost = Interceptor(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) return new CustomError("Post does not exist", 400, res);

  await Post.findByIdAndDelete(id);

  return res.status(200).send(
    new CustomResponse(200, "Posts deleted successfully!", [], {
      deletedPost: post,
    })
  );
});
