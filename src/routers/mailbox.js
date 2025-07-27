const express = require("express");
const mailboxController = require("../app/controllers/mailboxController");

const router = express.Router();
router.get("/", mailboxController.inbox);
router.get("/mail_compose", mailboxController.mail_compose);
router.get("/chat", mailboxController.chat);

module.exports = router;
