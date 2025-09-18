const mongoose = require("mongoose");

// Tạo Schema
const CommentSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_info: {
      username: { type: String, required: true },
      avatar: { type: String },
    },
    content: { type: String, required: true },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "file"],
          default: "image",
        },
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "hidden", "deleted"],
      default: "approved",
    },
    likes_count: { type: Number, default: 0 },
    dislikes_count: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "comments" }
);

// Tạo Model từ Schema
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
