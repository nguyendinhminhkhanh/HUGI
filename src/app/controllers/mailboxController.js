const socketIo = require("socket.io");
const Person = require("../models/User");
class mailboxController {

    async inbox(req, res) {
        res.render('message');
    }
    async mail_compose(req, res) {
        res.render('mail_compose');
    }
    async chat(req, res) {
        res.render('chat');
    }
    async contact(req, res) {
        const person = await Person.find().sort({ createdAt: -1 }).lean();
        res.render('contact',{person});
    }

}

module.exports = new mailboxController;
