const express = require("express");
const router = express.Router();
const controller = require("../../controller/staff/appointment.controller.js");



// [GET] /staff/appointment/
router.get("/", controller.index);


// [GET] /staff/appointment/detail/:AppointmentID
router.get("/detail/:AppointmentID", controller.detail);



// [GET] /staff/appointment/change-process/:AppointmentID?process=?
router.get("/change-process/:AppointmentID", controller.changeProcess);



// [GET] /staff/appointment/load-vets/:AppointmentID
router.get("/load-vets/:AppointmentID", controller.loadVets);


// [GET] /staff/appointment/assign/:AppointmentID/:VetID
router.get("/assign/:AppointmentID/:VetID", controller.assignVet);

module.exports = router