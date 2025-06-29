const express = require("express");
const manageController = require("../app/controllers/manageController");

const router = express.Router();
router.get("/", manageController.personnel);
router.get("/personnel/form-add", manageController.addForm);
router.delete("/personnel/:id", manageController.removePersonnel);


module.exports = router;
