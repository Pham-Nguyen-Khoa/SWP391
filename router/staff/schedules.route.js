const express = require("express");
const router = express.Router();
const controller = require("../../controller/staff/schedules.controller.js");

router.get("/", controller.index);

router.post("/add", controller.addPost);


module.exports = router