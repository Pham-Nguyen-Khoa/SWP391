// const Account = require("../../models/account.model");
const Account1 = require("../../models/account1.model");
const sendMail = require("../../helpers/nodemailer");
const generate = require("../../helpers/generate");
const Sequelize = require("../../config/database");
const { Op } = require("sequelize");
const Forgot_Password = require("../../models/register.model");
const db = require("../../config/database");
const md5 = require("md5");

// [GET] localhost:/auth/password/forgot
module.exports.forgot = async (req, res) => {
  res.render("client/pages/forgot-password/index.pug", {
    pageTitle: "Trang khôi phục mật khẩu",
  });
};

// [POST] localhost:/auth/password/forgot
module.exports.forgotPost = async (req, res) => {
  const email = req.body.email;
  const user = await Account1.findOne({
    where: {
      Email: email,
    },
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!  ");
    res.redirect("back");
  } else {
    res.redirect(`/auth/password/otp?email=${email}`);
  }
};

// [GET] localhost:/auth/password/otp
module.exports.otp = async (req, res) => {
  const email = req.query.email;
  const existingOtp = await Forgot_Password.findOne({
    where: {
      email: email,
      created_at: {
        [Op.gt]: new Date(Date.now() - 3 * 60 * 1000) // Check if OTP is within the last 3 minutes
      }
    }
  });
  if (!existingOtp) {
  const otp = generate.generateRandomNumber(6);
  const query = `Insert into forgot_password(email,otp) VALUES ('${email}','${otp}')`;
  await Sequelize.query(query);
  const messageMail = `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h2 style="color: #4CAF50;">Xác minh tài khoản</h2>
      <p>Chào bạn,</p>
      <p>Mã OTP của bạn là: <b style="font-size: 24px; color: #FF5733;">${otp}</b></p>
      <p>Mã này tồn tại trong 3 phút.</p>
      <p>Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
      <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
    </div>`;
  sendMail.sendMail(
    email,
    "Mã OTP xác minh lấy lại mật khẩu", 
    messageMail
    );
  }

  res.render("client/pages/forgot-password/otp.pug", {
    pageTitle: "Trang OTP",
    email: email,
  });
};

// [POST] localhost:/auth/password/otp
module.exports.otpPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const forgotPassword = await Forgot_Password.findOne({
    where: {
      email: email,
      otp: otp,
    },
  });
  if (!forgotPassword) {
    req.flash("error", "Mã OTP không đúng!");
    res.redirect("back");
    return;
  } 
  const existingOtp = await Forgot_Password.findOne({
    where: {
      email: email,
      otp: otp,
      created_at: {
        [Op.lt]: new Date(Date.now() - 3 * 60 * 1000) 
      }
    },
    order: [['created_at', 'DESC']], 
    limit: 1 
  });
  
  if (existingOtp) {
    req.flash("error", "Mã OTP đã hết hạn!");
    const email = req.body.email;
    const resetOtp = true;
    return res.render("client/pages/forgot-password/otp.pug", {
      email: email,
      resetOtp: resetOtp,
    });
  } 
  
  const user = await Account1.findOne({
    where: {
      Email: email,
    },
  });
  res.cookie("tokenUserForgot", user.Token);
  res.redirect("/auth/password/reset-password");
};

// [GET] localhost:/auth/password/reset-password
module.exports.reset = async (req, res) => {
  res.render("client/pages/forgot-password/reset-password.pug", {
    pageTitle: "Trang đặt lại mật khẩu",
  });
};

// [POST] localhost:/auth/password/reset-password
module.exports.resetPost = async (req, res) => {
  const password = md5(req.body.password);
  const tokenUserForgot = req.cookies.tokenUserForgot;
  console.log(password);
  console.log(tokenUserForgot);
  // await Account.update(
  //   {
  //     password: password,
  //   },
  //   {
  //     where: {
  //       token: tokenUserForgot
  //     }
  //   }
  // );
  await Account1.update(
    {
      Password: password,
    },
    {
      where: {
        Token: tokenUserForgot,
      },
    }
  );
  req.flash("success", "Cập nhật tài khoản thành công! ");
  res.redirect("/auth/login");
};
