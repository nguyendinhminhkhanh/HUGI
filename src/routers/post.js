const express = require("express");
const postController = require("../app/controllers/postController");
const router = express.Router();

router.get("/formCreate",postController.formCreate);
router.post("/create",postController.create);
router.post("/:id/comments",postController.comment);

module.exports = router;