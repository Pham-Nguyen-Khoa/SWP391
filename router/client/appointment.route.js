const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/appointment.controller");


router.get("/", controller.index);

router.post("/", controller.indexPost);


router.get("/thankyou/:AppointmentID", controller.thankyou);
module.exports = router