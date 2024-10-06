const express = require("express");
const router = express.Router();
const controller = require("../../controller/doctor/current-appointment.controller.js");

router.get("/", controller.index);
router.post("/", controller.indexPost);

router.get("/prescribe-medication", controller.prescribeMedication);
router.get("/payment", controller.payment);
router.post("/payment", controller.paymentPost);
module.exports = router