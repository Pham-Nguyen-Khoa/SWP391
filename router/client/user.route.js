const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/user.controller");
const authValidate = require("../../validates/client/auth.validate");


router.get("/login", controller.login);
router.post("/login", controller.loginPost);



router.get("/register", controller.register);
router.post("/register", authValidate.registerPost,controller.registerPost);


router.get("/logout", controller.logout);




module.exports = router