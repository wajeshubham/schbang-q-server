import { model, Schema } from "mongoose";
import User from "./user.js";

const postSchema = new Schema(
  {
    image: {
      type: String,
      required: [true, "Image is invalid"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
      trim: true,
    },
    tags: [String],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export default model("Post", postSchema);
