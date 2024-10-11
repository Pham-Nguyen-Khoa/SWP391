const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controller/admin/setting.controller.js");
const uploadMiddleware = require("../../middleware/admin/upload.middleware.js");
const upload = multer();

router.get("/general", controller.settingGeneral);
router.get("/general/website-info", controller.settingWebsiteInfo);
router.patch("/general/website-info", 
        upload.fields([
                { name: "Logo", maxCount: 1 },
                { name: "Favicon", maxCount: 1 },
                { name: "BannerHome", maxCount: 1 },
                { name: "BannerCommunity", maxCount: 1 },
                { name: "ImageServiceHealthy", maxCount: 1 },
                { name: "ImageServicePond", maxCount: 1 },
                { name: "ImageServiceOnline", maxCount: 1 },
            ]), 
        uploadMiddleware.uploadMultiple, 
controller.settingWebsiteInfoPatch);
router.get("/general/social-network", controller.settingSocialNetwork);
router.patch("/general/social-network", controller.settingSocialNetworkPatch);
router.get("/general/email-config", controller.settingEmailConfig);
router.patch("/general/email-config", controller.settingEmailConfigPatch);
module.exports = router