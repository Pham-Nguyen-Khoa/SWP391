const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/forgot_password.controller");
const validate = require("../../validates/client/auth.validate");
router.get("/forgot", controller.forgot);
router.post("/forgot", controller.forgotPost);
router.get("/otp", controller.otp);
router.post("/otp", controller.otpPost);
router.get("/reset-password", controller.reset);
router.post("/reset-password", validate.resetPassword, controller.resetPost);


module.exports = router