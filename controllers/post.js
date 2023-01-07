import interceptor from "../middlewares/interceptor.js";
import Comment from "../models/comment.js";
import Post from "../models/post.js";
import User from "../models/user.js";
import CustomError from "../utils/customError.js";
import CustomResponse from "../utils/customResponse.js";
import sendEmail from "../utils/sendEmail.js";

export const getPosts = interceptor(async (req, res) => {
  const { skip, limit } = req.query;
  const posts = await Post.find().skip(skip).limit(limit);

  return res
    .status(200)
    .send(new CustomResponse(200, "Posts fetched successfully!", [], posts));
});

export const getPostById = interceptor(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) return new CustomError("Post does not exist", 400, res);

  const comments = await Comment.find({ post: post._id }).select("content");

  return res.status(200).send(
    new CustomResponse(200, "Post fetched successfully!", [], {
      post,
      comments,
    })
  );
});

export const createPost = interceptor(async (req, res) => {
  if (!req.file) return new CustomError("Please provide an image", 400, res);

  const { title, caption, tags } = req.body;

  if (!title || !caption)
    return new CustomError("Please fill all the required fields.", 400, res);

  const post = await Post.create({
    title,
    caption,
    tags,
    image: req.file.location,
    owner: req.user?._id,
  });
  const subscribers = await User.find({ subscribed: true }).select(
    "email -_id"
  );
  const emails = Object.values(subscribers) ?? [];
  if (emails.length) {
    await sendEmail({
      email: emails,
      subject: `${req.user?.name} has uploaded a new post`,
      message: `
        Hello,

        ${req.user?.name} has uploaded a new post with title: ${post.title}. Please check this out here: ${process.env.SERVER_URL}/api/v1/post/${post._id}.

        Thanks and Regards
        SchbangQ

        NOTE: You are receiving this because you have subscribed to our notifications.
    `,
    });
  }
  return res
    .status(201)
    .send(new CustomResponse(201, "Posts added successfully!", [], post));
});

export const deletePost = interceptor(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) return new CustomError("Post does not exist", 400, res);
  if (!post?.owner?.equals(req.user?._id)) {
    return new CustomError("You are not authorized for this task", 401, res);
  }

  await Post.findByIdAndDelete(id);

  return res.status(200).send(
    new CustomResponse(200, "Posts deleted successfully!", [], {
      deletedPost: post,
    })
  );
});

export const likePost = interceptor(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) return new CustomError("Post does not exist", 400, res);

  const author = await User.findById(post.owner._id);

  let likes = await Post.find({ likes: req.user._id, _id: id }).populate(
    "likes"
  );
  if (likes.length > 0) {
    return new CustomError("Post is already liked!", 400, res);
  }

  await Post.findByIdAndUpdate(
    id,
    {
      $push: {
        likes: req.user._id,
      },
    },
    { new: true }
  );
  await sendEmail({
    email: author.email,
    subject: `${req.user?.name} liked your post`,
    message: `
      Hello ${author.name},

      ${req.user?.name} has liked your post with title: ${post.title}. Please check this out here: ${process.env.SERVER_URL}/api/v1/post/${post._id}.

      Thanks and Regards
      SchbangQ

      NOTE: You are receiving this because you have subscribed to our notifications.
  `,
  });
  return res.status(200).send(new CustomResponse(200, "Liked!", [], {}));
});

export const disLikePost = interceptor(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) return new CustomError("Post does not exist", 400, res);

  let likes = await Post.find({ likes: req.user._id, _id: id }).populate(
    "likes"
  );

  if (likes.length <= 0)
    return new CustomError("Post is already disliked!", 400, res);

  await Post.findByIdAndUpdate(
    id,
    {
      $pull: {
        likes: req.user._id,
      },
    },
    { new: true }
  );
  return res.status(200).send(new CustomResponse(200, "Disliked", [], {}));
});
