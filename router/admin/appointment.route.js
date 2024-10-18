const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/appointment.controller.js");


// [GET] /admin/appointment/detail/:AppointmentID
router.get("/detail/:AppointmentID", controller.detail);

module.exports = router