const express = require("express");
const profileController = require("../app/controllers/profileController");

const router = express.Router();
router.get("/", profileController.profile);


module.exports = router;
