const express = require("express");
const conceptController = require("../app/controllers/conceptController");

const router = express.Router();
router.get("/", conceptController.display);


module.exports = router;
