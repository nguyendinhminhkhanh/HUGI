const express = require("express");
const mailboxController = require("../app/controllers/mailboxController");  
const messageController = require("../app/controllers/messageController");  

const router = express.Router();
router.get("/", mailboxController.inbox);
router.get("/mail_compose", mailboxController.mail_compose);
router.get("/chat", mailboxController.chat);
router.get("/chat/:id", mailboxController.chat);
router.get("/contact", mailboxController.contact);
router.post("/messages/send", messageController.sendMessage);
module.exports = router;
