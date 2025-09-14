const ShareSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Có thể thêm message khi share
    message: { type: String, default: "" },

    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public"
    }
  },
  { timestamps: true, collection: "shares" }
);

// Tránh 1 user share cùng 1 post nhiều lần (nếu muốn hạn chế)
ShareSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

const Share = mongoose.model("Share", ShareSchema);

module.exports = Share;
