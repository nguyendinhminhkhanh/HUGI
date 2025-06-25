const express = require("express");
const manageController = require("../app/controllers/manageController");

const router = express.Router();
router.get("/", manageController.personnel);


module.exports = router;
