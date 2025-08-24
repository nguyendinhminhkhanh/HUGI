const socketIo = require("socket.io");
const Person = require("../models/User");
const Message = require("../models/Message");
const User = require("../models/User");
const { mongooseToObject } = require("../../util/mongose");
class mailboxController {
  async inbox(req, res) {
    res.render("message");
  }
  async mail_compose(req, res) {
    res.render("mail_compose");
  }
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
  async contact(req, res) {
    const person = await Person.find().sort({ createdAt: -1 }).lean();
    res.render("contact", { person });
  }
}

module.exports = new mailboxController();
