const express = require("express");
const mypostController = require("../app/controllers/mypostController");

const router = express.Router();

router.get("/:id", mypostController.mypost);

module.exports = router;
