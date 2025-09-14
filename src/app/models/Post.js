const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    user_info: {
      username: { type: String, required: true },
      avatar: String
    },

    content: { type: String, default: "" }, // Nội dung text, có thể rỗng nếu chỉ có ảnh/video

    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "video", "file"],
          default: "image"
        },
        url: { type: String, required: true },
        alt: String
      }
    ],

    // Quyền hiển thị (public/friends/private)
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public"
    },

    status: {
      type: String,
      enum: ["active", "hidden", "deleted"],
      default: "active"
    },

    likes_count: { type: Number, default: 0, min: 0 },
    dislikes_count: { type: Number, default: 0, min: 0 },
    comments_count: { type: Number, default: 0, min: 0 },

    shares_count: { type: Number, default: 0, min: 0 } // số lượt chia sẻ
  },
  { timestamps: true, collection: "posts" }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
