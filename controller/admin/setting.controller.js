
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");
const Setting = require("../../models/setting.model");
const { setIframe } = require("../../helpers/setIframe");
const verifyEmailHelper = require("../../helpers/checkMail");
const Service = require("../../models/service.model");

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
console.log("------------------------------")
const test = setIframe(req.body.mapEmbed)
  console.log(test)
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
      MapEmbed: setIframe(req.body.mapEmbed),
    };
    const imageFields = ['Logo', 'BannerHome', 'BannerCommunity', 'ImageServiceHealthy', 'ImageServicePond', 'ImageServiceOnline'];
    
    imageFields.forEach(field => {
      if (req.body[field] && req.body[field][0]) {
        updatedData[field] = req.body[field][0];
      }
    });

    if(req.body.ImageServiceOnline){
      await Service.update({
        Thumbnail: req.body.ImageServiceOnline[0]
      }, {
        where: {
          ServiceID: "DV0003"
        }
      })
    }
    if(req.body.ImageServiceHealthy){
      await Service.update({
        Thumbnail: req.body.ImageServiceHealthy[0]
      }, {
        where: {
          ServiceID: "DV0001"
        }
      })
    }
    if(req.body.ImageServicePond){
      await Service.update({
        Thumbnail: req.body.ImageServicePond[0]
      }, {
        where: {
          ServiceID: "DV0002"
        }
      })
    }

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
      ImageServiceOnline: req.body.ImageServiceOnline[0],
      MapEmbed: setIframe(req.body.mapEmbed),
    });
  }
  req.flash("success", "Cập nhật thành công");
  res.redirect("/admin/setting/general/website-info");
}
}

// [Get] /admin/setting/general/social-network
module.exports.settingSocialNetwork = async (req, res) => {
  const settingData = await Setting.findOne({ 
    where: {
      SettingID: 1
    }
  });
    res.render("admin/pages/setting/social-network",{
        pageTitle: "Mạng xã hội | Admin",
        setting: settingData
    })
  }

// [Patch] /admin/setting/general/social-network
module.exports.settingSocialNetworkPatch = async (req, res) => {
  try {
    const settingData = await Setting.findOne({
      where: {
        SettingID: 1
      }
    });
    if (settingData) {
      const updatedData = {
        Facebook: req.body.Facebook,
        Instagram: req.body.Instagram,
        Messenger: req.body.Messenger,
      };
      await Setting.update(updatedData, {
        where: {
          SettingID: 1,
        },
      });
    } else {
      await Setting.create({
        SettingID: 1,
        Facebook: req.body.Facebook,
        Instagram: req.body.Instagram,
        Messenger: req.body.Messenger,
      });
    }
    req.flash("success", "Cập nhật thành công");
    res.redirect("/admin/setting/general/social-network");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/setting/general/social-network");
  }
}

// [Get] /admin/setting/general/email-config
module.exports.settingEmailConfig = async (req, res) => {
  const settingData = await Setting.findOne({
    where: {
      SettingID: 1
    }
  });
  res.render("admin/pages/setting/email-config",{
    pageTitle: "Cấu hình email | Admin",
    settingData: settingData
  })
}

// [Patch] /admin/setting/general/email-config
module.exports.settingEmailConfigPatch = async (req, res) => {

    const settingData = await Setting.findOne({
      where: {
        SettingID: 1
      }
    });
    const checkMail = await verifyEmailHelper.verifyEmail(req.body.Email);
    if (!checkMail) {
      req.flash("error", "Email không tồn tại! ");
      res.redirect("back");
      return;
    }
    if (checkMail) {
      const updatedData = {
        EmailSend: req.body.Email,
        AppPassword: req.body.AppPassword,
      };
      await Setting.update(updatedData, {
        where: {
          SettingID: 1,
        },
      });
    } 
    req.flash("success", "Cập nhật thành công");
    res.redirect("/admin/setting/general/email-config");


}
  

