const md5 = require("md5");
const Account1 = require("../../models/account1.model");
const Customer = require("../../models/customer.model");
const Sequelize = require("../../config/database");
const db = require("../../config/database");

const sendMail = require("../../helpers/nodemailer");
const generate = require("../../helpers/generate");
const verifyEmailHelper = require("../../helpers/checkMail");

// [GET] localhost:/auth/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Trang đăng nhập",
  });
};

// [POST] localhost:/auth/login
module.exports.loginPost = async (req, res) => {
  const password = md5(req.body.Password);
  const email = req.body.Email;

  const user = await Account1.findOne({
    where: {
      Email: email,
    },
  });
 

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  if (user.Status == "Bị Block") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }
  if (user.Password !== password) {
    req.flash("error", "Mật khẩu không đúng");
    res.redirect("back");
    return;
  }

  res.cookie("token", user.Token , { httpOnly: true });
  // req.session.token = user.Token;

    // res.cookie("token", user.Token , { httpOnly: true });

  if (user.RoleID == "RL0004") {
    res.redirect("/koi");
  } else if (user.RoleID == "RL0001") {
    res.redirect("/admin/dashboard");
  } else if (user.RoleID == "RL0002") {
    res.redirect("/doctor/dashboard");
  } else if (user.RoleID == "RL0003") {
    res.redirect("/staff/appointment");
  }
};

// [GET] localhost:/auth/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Trang đăng ký ",
  });
};

// const generateUserId = async (rolePrefix, table, id) => {
//   const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
//   const [results] = await db.query(query);
//   const count = results[0].count + 1;
//   return `${rolePrefix}${String(count).padStart(4, "0")}`;
// };
const generateUserId = async (rolePrefix, table, id) => {
  const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const maxId = results[0].maxId || 0;
  const newId = maxId + 1;
  return `${rolePrefix}${String(newId).padStart(4, "0")}`;
};
// [POST] localhost:/auth/register
module.exports.registerPost = async (req, res) => {
    console.log(req.body);
  try {
    const password = md5(req.body.Password);

    const checkMail = await verifyEmailHelper.verifyEmail(req.body.Email);
    if (!checkMail) {
      req.flash("error", "Email không tồn tại! ");
      res.redirect("back");
      return;
    }
    const emailExisted = await Account1.findOne({
      where: {
        Email: req.body.Email,
      },
    });
    if (emailExisted) {
      req.flash("error", `Email ${req.body.Email} đã tồn tại!`);
      res.redirect("back");
      return;
    } else {
      const accountId = await generateUserId("AC", "account1", "AccountID");
      await Account1.create({
        AccountID: accountId, 
        Password: password,
        Email: req.body.Email,
        RoleID: "RL0004",
      });
      const customerId = await generateUserId("KH", "customer", "CustomerID");
      await Customer.create({
        CustomerID: customerId,
        FullName: req.body.FullName,
        PhoneNumber: req.body.PhoneNumber,
        Address: req.body.Address,
        Gender: req.body.Gender,
        Birthday: req.body.Birthday,
        AccountID: accountId,
      });

      req.flash("success", "Đăng ký thành công!");
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Tạo tài khoản thất tại");
    res.redirect("/auth/register");
  }
};

// [GET] localhost:/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  // req.session.destroy();
  console.log("hello")
  res.redirect(`/auth/login`);
};