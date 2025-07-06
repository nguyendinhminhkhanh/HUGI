const express = require("express");
const manageController = require("../app/controllers/manageController");

const router = express.Router();
router.get("/", manageController.personnel);
router.get("/personnel/form-add", manageController.addForm);
router.delete("/personnel/:id", manageController.removePersonnel);
router.post("/personnel/add", manageController.addPersonnel);

router.get("/personnel/edit/:id", manageController.editPersonnel);
router.post("/personnel/update/:id", manageController.updatePersonnel);


module.exports = router;
