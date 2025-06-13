const express = require("express");
const homeControllers = require("../app/controllers/homeControllers");

const router = express.Router();
router.get("/", homeControllers.dashboard);


module.exports = router;
