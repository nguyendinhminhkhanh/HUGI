const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Reaction type: like, love, haha, wow, sad, angry
    reaction: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      default: "like"
    }
  },
  { timestamps: true, collection: "likes" }
);

// Tránh 1 user like 2 lần cùng 1 post
LikeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);

module.exports = Like;
