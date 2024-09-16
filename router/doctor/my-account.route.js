const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controller/doctor/my-account.controller.js");
const uploadMiddleware = require("../../middleware/admin/upload.middleware.js");
const validate = require("../../validates/admin/my-account.validate.js");
const upload = multer();

router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch(
  "/edit",
  upload.single("avatar"),
  uploadMiddleware.upload,
  validate.edit,
  controller.editPatch
);

module.exports = router;
