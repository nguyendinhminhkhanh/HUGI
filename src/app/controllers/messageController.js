const Message = require("../models/Message");

// Tạo roomId từ 2 userId (sắp xếp để không bị trùng)
function generateRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("_");
}

class MessageController {
  // [POST] /messages/send
  async sendMessage(req, res) {
    try {
      console.log("📩 Dữ liệu nhận từ form:", req.body);
      const { from, to, content } = req.body;
      if (!from || !to || !content) {
        return res.status(400).json({ error: "Thiếu dữ liệu" });
      }

      const roomId = generateRoomId(from, to);

      const message = new Message({
        from,
        to,
        roomId,
        content,
      });

      await message.save();

      return res.status(201).json({
        message: "Gửi tin nhắn thành công",
        data: message,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }

  // [GET] /messages/:userId1/:userId2
  async getMessages(req, res) {
    try {
      const { userId1, userId2 } = req.params;
      const roomId = generateRoomId(userId1, userId2);

      const messages = await Message.find({ roomId })
        .sort({ createdAt: 1 }) // sắp xếp tăng dần theo thời gian
        .populate("from", "name email") // chỉ lấy name, email
        .populate("to", "name email");

      return res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
}

module.exports = new MessageController();
