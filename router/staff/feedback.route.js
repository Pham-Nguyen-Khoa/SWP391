const express = require("express");
const router = express.Router();
const controller = require("../../controller/staff/feedback.controller.js");

router.get("/", controller.index);


module.exports = router