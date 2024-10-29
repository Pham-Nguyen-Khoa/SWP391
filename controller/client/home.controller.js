
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");
const Account = require("../../models/account1.model");
const Customer = require("../../models/customer.model");
const Feedback = require("../../models/feedback.model");
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai")
const checkEmailHelper = require("../../helpers/checkMail");


// [GET] localhost:/koi
module.exports.index = async (req, res) => {
  let quertFeedBack =`Select * from feedback fb Join account1 ac on ac.AccountID = fb.AccountID Join customer cs on cs.AccountID = ac.AccountID where fb.Star = '5' ORDER BY fb.Time DESC`
  const [listFeedBack] = await Sequelize.query(quertFeedBack);
  console.log(listFeedBack);
  res.render("client/pages/home/index.pug", {
    pageTitle: res.locals.SettingGeneral.WebsiteName,
    listFeedBack: listFeedBack,
  });
};


// [GET] localhost:/koi/profile
module.exports.profile = async (req, res) => {
  res.render("client/pages/home/profile.pug", {
    pageTitle: "Trang thông tin cá nhân",
  });
};

// [POST] localhost:/koi/profile/save-avatar
module.exports.saveAvatar = async (req, res) => {
    console.log(req.body)
    const customerID = res.locals.userInfo.CustomerID;
    const avatar = req.body.Avatar
    console.log(avatar)
    const updateAvatar = await Customer.update({Avatar: avatar}, {where: {CustomerID: customerID}})
    if(updateAvatar) {
      req.flash("success", "Cập nhật ảnh đại diện thành công");
    } else {
      req.flash("error", "Cập nhật ảnh đại diện thất bại");
    }
    res.redirect("back")
}



// [GET] localhost:/koi/profile/edit
module.exports.editProfile = async (req, res) => {
  res.render("client/pages/home/profileEdit.pug", {
    pageTitle: "Trang chỉnh sửa thông tin cá nhân",
  });
};

// [POST] localhost:/koi/profile/edit
module.exports.editProfilePost = async (req, res) => {
  console.log(req.body)
  console.log("nerronmen")
  const {FullName, Email, PhoneNumber, Gender,Birthday,Address } = req.body
  console.log(Email)
  // console.log(Email)
  // console.log("fdsfd")
  const customerID = res.locals.userInfo.CustomerID
  const accountID = res.locals.userInfo.AccountID
  const emailExist = await Account.findOne(
    {
      raw: true,
      where:{
        Email: Email,
        AccountID: {
          [Op.ne]: accountID
        }
      }
    }
  )
  console.log(emailExist)
  if(emailExist) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
    return;
  }
  const isEmailValid = await checkEmailHelper.verifyEmail(Email);
  if(!isEmailValid) {
    req.flash("error", "Email không hợp lệ");
    res.redirect("back");
    return;
  }
  await Account.update({Email: Email}, {where: {AccountID: accountID}})
  const updateProfile = await Customer.update({FullName, PhoneNumber, Address, Birthday, Gender}, {where: {CustomerID: customerID}})
  if(updateProfile) {
    req.flash("success", "Cập nhật thông tin thành công");
  } else {
    req.flash("error", "Cập nhật thông tin thất bại");
  }
  res.redirect("back")
}


// [GET] localhost:/koi/contact
module.exports.contact = async (req, res) => {
  res.render("client/pages/home/contact.pug", {
    pageTitle: "Trang liên hệ",
  });
};


// [GET] localhost:/koi/aboutUs
module.exports.aboutUs = async (req, res) => {
  res.render("client/pages/home/aboutUs.pug", {
    pageTitle: "Trang về chúng tôi",
  });
};


// [GET] localhost:/koi/news
module.exports.news = async (req, res) => {
  res.render("client/pages/home/news.pug", {
    pageTitle: "Trang tin tức",
  });
};

// [GET] localhost:/koi/community
module.exports.community = async (req, res) => {
  res.render("client/pages/home/community.pug", {
    pageTitle: "Trang cộng đồng",
  });
};

// [GET] localhost:/koi/envConsult
module.exports.envConsult = async (req, res) => {
  res.render("client/pages/home/envConsult.pug", {
    pageTitle: "Trang tư vấn môi trường",
  });
};

// [GET] localhost:/koi/onlConsult
module.exports.onlConsult = async (req, res) => {
  res.render("client/pages/home/onlConsult.pug", {
    pageTitle: "Trang tư vấn Online",
  });
};

// [GET] localhost:/koi/checkUp
module.exports.checkUp = async (req, res) => {
  res.render("client/pages/home/checkUp.pug", {
    pageTitle: "Trang khám bệnh",
  });
};





const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// [POST] localhost:/koi/api/chat
module.exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Sử dụng mô hình gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
      details: error.message
    });
  }
};