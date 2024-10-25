const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controller/client/home.controller");
const uploadMiddleware = require("../../middleware/admin/upload.middleware.js");
const upload = multer();
const validation = require("../../validates/client/update-infomation");



router.get("/", controller.index);
router.get("/profile", controller.profile);
router.post("/profile/save-avatar", upload.single("Avatar"), uploadMiddleware.upload, controller.saveAvatar);
router.get("/profile/edit", controller.editProfile);
router.post("/profile/edit", validation.editProfilePost, controller.editProfilePost);

router.get("/contact", controller.contact);

router.get("/aboutUs", controller.aboutUs);

router.get("/news", controller.news);

router.get("/community", controller.community);

router.get("/envConsult", controller.envConsult);

router.get("/onlConsult", controller.onlConsult);

router.get("/checkUp", controller.checkUp);

router.post("/api/chat", controller.chat);
module.exports = router