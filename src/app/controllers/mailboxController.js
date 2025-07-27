const socketIo = require("socket.io");
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

}

module.exports = new mailboxController;
