const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/chat.controller.js");

router.get("/", controller.chat);


module.exports = router