
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