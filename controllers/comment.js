import interceptor from "../middlewares/interceptor.js";
import Comment from "../models/comment.js";
import CustomError from "../utils/customError.js";
import CustomResponse from "../utils/customResponse.js";

export const addComment = interceptor(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  if (!content)
    return new CustomError(
      "Please fill out some content for the comment.",
      400,
      res
    );
  const comment = await Comment.create({
    content,
    author: req.user?._id,
    postId: postId,
  });
  return res
    .status(200)
    .send(new CustomResponse(200, "Comment added successfully!", [], comment));
});
