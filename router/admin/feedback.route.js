const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/feedback.controller.js");

router.get("/", controller.index);

router.get("/analyze", controller.analyze);


module.exports = router