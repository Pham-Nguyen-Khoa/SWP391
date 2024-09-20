const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controller/admin/account.controller.js");
const uploadMiddleware = require("../../middleware/admin/upload.middleware.js");
const  validate = require("../../validates/admin/account.validate.js");
const upload = multer();

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:id", controller.edit);
// router.patch('/edit', controller.editPatchJson);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadMiddleware.upload,
  controller.editPatch
);

router.delete("/delete/:id", controller.delete);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadMiddleware.upload,
  validate.create,
  controller.createPost
);




module.exports = router;
