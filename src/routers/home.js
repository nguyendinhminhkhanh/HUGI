const express = require("express");
const homeController = require("../app/controllers/homeController");

const router = express.Router();
router.get("/", homeController.dashboard);


module.exports = router;
