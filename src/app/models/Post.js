const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    user_info: {
      username: { type: String, required: true },
      avatar: { type: String },
    },

    content: { type: String, default: "" },

    // media: { type: String, default: "" },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "file"],
          default: "image",
        },
        url: { type: String, required: true },
        alt:  { type: String },
      },
    ],

    // Quyền hiển thị (public/friends/private)
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },

    status: {
      type: String,
      enum: ["active", "hidden", "deleted"],
      default: "active",
    },

    likes_count: { type: Number, default: 0, min: 0 },
    comments_count: { type: Number, default: 0, min: 0 },

    shares_count: { type: Number, default: 0, min: 0 }, // số lượt chia sẻ
  },
  { timestamps: true, collection: "posts" }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
