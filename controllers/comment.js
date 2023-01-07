import interceptor from "../middlewares/interceptor.js";
import Comment from "../models/comment.js";
import Post from "../models/post.js";
import User from "../models/user.js";
import CustomError from "../utils/customError.js";
import CustomResponse from "../utils/customResponse.js";
import sendEmail from "../utils/sendEmail.js";

export const addComment = interceptor(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  if (!content)
    return new CustomError(
      "Please fill out some content for the comment.",
      400,
      res
    );
  const post = await Post.findById(postId).populate("owner").exec();

  if (!post) return new CustomError("Post does not exist", 400, res);

  const comment = await Comment.create({
    content,
    author: req.user?._id,
    post: postId,
  });

  const author = await User.findByIdAndUpdate(
    post.owner._id,
    {
      $push: {
        commentedPosts: comment._id,
      },
    },
    { new: true }
  );

  await sendEmail({
    email: author?.email,
    subject: `${req.user?.name} has commented on your post`,
    message: `
      Hello ${author?.name},

      ${req.user?.name} has commented on your post which says:
    
      -------------------------------

      ${comment.content}

      -------------------------------
      
      Please check this out here: ${process.env.SERVER_URL}/api/v1/post/${post._id}.

      Thanks and Regards
      SchbangQ

      NOTE: You are receiving this because you have subscribed to our notifications.
  `,
  });

  return res
    .status(200)
    .send(new CustomResponse(200, "Comment added successfully!", [], comment));
});

export const deleteComment = interceptor(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) return new CustomError("comment does not exist", 400, res);

  if (!comment?.author?.equals(req.user?._id)) {
    return new CustomError("You are not authorized for this task", 401, res);
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $pull: {
        commentedPosts: comment._id,
      },
    },
    { new: true }
  );

  await Comment.findByIdAndDelete(id);

  return res.status(200).send(
    new CustomResponse(200, "comment deleted successfully!", [], {
      deletedComment: comment,
    })
  );
});
