const socketIo = require("socket.io");
class mailboxController {

    async inbox(req, res) {
        res.render('message');
    }
    async mail_compose(req, res) {
        res.render('mail_compose');
    }

}

module.exports = new mailboxController;
