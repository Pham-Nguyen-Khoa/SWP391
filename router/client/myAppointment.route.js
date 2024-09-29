const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/myAppointment.controller");


router.get("/", controller.index);


router.get("/detail/:AppointmentID", controller.detail);


module.exports = router