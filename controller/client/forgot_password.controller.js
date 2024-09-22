// const Account = require("../../models/account.model");
const Account1 = require("../../models/account1.model");
const sendMail = require("../../helpers/nodemailer");
const generate = require("../../helpers/generate");
const Sequelize = require("../../config/database");
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
  const otp = generate.generateRandomNumber(6);
  const query = `Insert into forgot_password(email,otp) VALUES ('${email}','${otp}')`;
  await Sequelize.query(query);
  sendMail.sendMail(
    email,
    "Mã OTP xác minh lấy lại mật khẩu",
    `Mã OTP của bạn là: <b>${otp}</b>. Mã này tồn tại trong 3 phút`
  );

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
  // const user = await Account.findOne({
  //   where: {
  //     email: email,
  //   },
  // });
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
