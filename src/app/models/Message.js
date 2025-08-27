const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender:{ type: String, required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true,collection: "messages"}
);

messageSchema.index({ from: 1, to: 1, createdAt: -1 });
const Message = mongoose.model("Message", messageSchema, "messages");
module.exports = Message;
