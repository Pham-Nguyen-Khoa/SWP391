const express = require("express");
const router = express.Router();
const controller = require("../../controller/api/api.controller.js");

router.get("/", controller.index);
router.get("/account", controller.account);
router.get("/account/edit/:id", controller.edit);
router.patch("/account/:status/:id", controller.changeStatus);
router.post("/login", controller.loginPost);
router.post("/register", controller.registerPost);

module.exports = router