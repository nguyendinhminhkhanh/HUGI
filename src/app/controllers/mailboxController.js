const socketIo = require("socket.io");
const Person = require("../models/User");
const Message = require("../models/Message");
const User = require("../models/User");
const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require("../../util/mongose");
class mailboxController {
  //[GET]/mailbox
  async inbox(req, res) {
    try {
      const userId = req.session.existingUser._id.toString();

      // Lấy tất cả message mà user tham gia
      const messages = await Message.find({
        $or: [{ from: userId }, { to: userId }],
      })
        .sort({ createdAt: -1 })
        .populate("from", "name email")
        .populate("to", "name email");

      // Gom nhóm theo roomId (lấy tin nhắn mới nhất cho mỗi room)
      const map = new Map();
      for (const msg of messages) {
        if (!map.has(msg.roomId)) {
          // clone để thêm trường mới
          const msgObj = msg.toObject();
          // xác định partner
          if (msg.from._id.toString() === userId) {
            msgObj.partner = msg.to.toObject(); // nếu mình là from => partner là to
          } else {
            msgObj.partner = msg.from.toObject(); // ngược lại
          }
          map.set(msg.roomId, msgObj);
        }
      }

      const conversations = Array.from(map.values());
      console.log(conversations);
      console.log(userId);

      res.render("message", {
        conversations: mutipleMongooseToObject(conversations),
        userId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }

  async mail_compose(req, res) {
    res.render("mail_compose");
  }

  //[GET] mailbox/chat/:id
  async chat(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (!user) {
        console.log("Không tìm thấy user");
        return null;
      }
      console.log("User:", user);
      res.render("chat", { user: mongooseToObject(user) });
    } catch (err) {
      console.error("Lỗi khi tìm user:", err);
      return null;
    }
  }
  //[GET]/mailbox/contact
  async contact(req, res) {
    const person = await Person.find().sort({ createdAt: -1 }).lean();
    res.render("contact", { person });
  }
}

module.exports = new mailboxController();
