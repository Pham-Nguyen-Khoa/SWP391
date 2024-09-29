const express = require("express");
const router = express.Router();
const controller = require("../../controller/doctor/appointment.controller.js");

router.get("/", controller.index);



router.get("/change-process/:AppointmentID/:Process", controller.changeProcess);

router.get("/detail/:AppointmentID", controller.detail);


module.exports = router