const express = require("express");
const passport = require("passport");
const imgUploader = require("../middleware/imgUploader");
const controller = require("../controllers/record.controller");

const router = express.Router(); //create module router here

router.get("/", controller.getAll);
router.post("/", imgUploader.single("image"), controller.newRecord);
router.get("/:id", controller.getById);
router.put("/:id", imgUploader.single("image"), controller.updRecord);
router.delete("/:id", controller.deleteRecord);

module.exports = router;
