import { model, Schema } from "mongoose";
import User from "./user.js";
import Post from "./post.js";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

export default model("Comment", commentSchema);
