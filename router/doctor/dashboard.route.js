const express = require("express");
const router = express.Router();
const controller = require("../../controller/doctor/dashboard.controller.js");

router.get("/", controller.index);


module.exports = router