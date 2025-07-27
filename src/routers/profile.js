const express = require("express");
const profileController = require("../app/controllers/profileController");

const router = express.Router();
router.get("/", profileController.profile);
router.post("/editAvatar", profileController.editAvatar);


module.exports = router;
