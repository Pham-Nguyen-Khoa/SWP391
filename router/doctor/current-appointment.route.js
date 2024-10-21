const express = require("express");
const router = express.Router();
const controller = require("../../controller/doctor/current-appointment.controller.js");

router.get("/", controller.index);
router.post("/", controller.indexPost);

router.get("/prescribe-medication", controller.prescribeMedication);

router.get("/prescribe-medication-fish", controller.prescribeMedicationFish);
router.get("/payment",controller.payment);
router.post("/payment", controller.paymentPost);
// router.post("/payment-fish", controller.paymentFishPost);
// router.get("/payment-fish", controller.paymentFish);
// router.get("/add-fish", controller.addFish);
// router.post("/healthyFish", controller.healthyFishPost);


// router.post("/payment-fish-center", controller.paymentFishCenterPost);
module.exports = router