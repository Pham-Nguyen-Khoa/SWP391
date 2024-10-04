const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/myAppointment.controller");


router.get("/", controller.index);


router.get("/detail/:AppointmentID", controller.detail);
router.get("/detail/prescription/:AppointmentID", controller.detailPrescription);
router.get("/detail/pond/:AppointmentID", controller.detailPond);
router.get("/detail/advice/:AppointmentID", controller.detailAdvice);
module.exports = router