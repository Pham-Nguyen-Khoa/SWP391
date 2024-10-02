const express = require("express");
const router = express.Router();
const controller = require("../../controller/doctor/schedule.controller.js");

router.get("/", controller.index);


module.exports = router