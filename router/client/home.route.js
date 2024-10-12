const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/home.controller");


router.get("/", controller.index);


router.get("/contact", controller.contact);

router.get("/aboutUs", controller.aboutUs);

router.get("/news", controller.news);

router.get("/community", controller.community);

router.get("/envConsult", controller.envConsult);

router.get("/onlConsult", controller.onlConsult);

router.get("/checkUp", controller.checkUp);

module.exports = router