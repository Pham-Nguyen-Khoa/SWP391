const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/service.controller.js");

router.get("/", controller.index);
router.get("/service-info", controller.serviceInfo);
router.get("/fee-ship", controller.feeShip);
router.post("/fee-ship", controller.feeShipPost);
router.get("/edit/:id", controller.edit);
router.post("/editFish/:id", controller.editFishPost);
router.post("/editOnline/:id", controller.editOnlinePost);
router.post("/editPond/:id", controller.editPondPost);
router.get("/stop/:id", controller.stop);
router.get("/start/:id", controller.start);



module.exports = router