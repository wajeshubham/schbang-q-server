import { model, Schema } from "mongoose";
import validator from "validator";
import User from "./user.js";

const postSchema = new Schema(
  {
    image: {
      type: String,
      required: [validator.isURL, "Image is invalid"],
      trim: true,
      // ! Remove this and add s3 and make it required
      default:
        "https://wajeshubham-portfolio.s3.ap-south-1.amazonaws.com/docker.jpg",
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
