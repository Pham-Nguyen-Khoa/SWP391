
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");

const Setting = require("../../models/setting.model");
// [Get] /admin/setting/general
module.exports.settingGeneral = (req, res) => {
    res.render("admin/pages/setting/general",{
        pageTitle: "Cài đặt chung"
    })
  }
  
// [Get] /admin/setting/general/website-info
module.exports.settingWebsiteInfo = async (req, res) => {
    const settingData = await Setting.findOne({ 
        where: {
          SettingID: 1
        }
      });
    res.render("admin/pages/setting/website-info",{
        pageTitle: "Thông tin website | Admin",
        settingData: settingData
    })
  }

// [Patch] /admin/setting/general/website-info
module.exports.settingWebsiteInfoPatch = async (req, res) => {
  console.log(req.body);
  const settingData = await Setting.findOne({
    where: {
      SettingID: 1
    }
  });

  if (settingData) {
    const updatedData = {
      WebsiteName: req.body.WebsiteName,
      CompanyName: req.body.CompanyName,
      PhoneNumber: req.body.PhoneNumber,
      TimeOpen: req.body.TimeOpen,
      Email: req.body.Email,
      Address: req.body.Address,
      mapEmbed: req.body.mapEmbed,
      Copyright: req.body.Copyright,
    };
    const imageFields = ['Logo', 'BannerHome', 'BannerCommunity', 'ImageServiceHealthy', 'ImageServicePond', 'ImageServiceOnline'];
    
    imageFields.forEach(field => {
      if (req.body[field] && req.body[field][0]) {
        updatedData[field] = req.body[field][0];
      }
    });

    if (settingData) {
      await Setting.update(updatedData, {
        where: {
          SettingID: 1,
        },
      });
  } else {
    await Setting.create({
      SettingID: 1,
      WebsiteName: req.body.WebsiteName,
      CompanyName: req.body.CompanyName,
      PhoneNumber: req.body.PhoneNumber,
      TimeOpen: req.body.TimeOpen,
      Email: req.body.Email,
      Address: req.body.Address,
      Copyright: req.body.Copyright,
      Logo: req.body.Logo[0],
      BannerHome: req.body.BannerHome[0],
      BannerCommunity: req.body.BannerCommunity[0],
      ImageServiceHealthy: req.body.ImageServiceHealthy[0],
      ImageServicePond: req.body.ImageServicePond[0],
      ImageServiceOnline: req.body.ImageServiceOnline[0]
    });
  }
  req.flash("success", "Cập nhật thành công");
  res.redirect("/admin/setting/general/website-info");
}
}