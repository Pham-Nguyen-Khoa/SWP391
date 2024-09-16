const md5 = require("md5");
const Account = require("../../models/account.model");
const Sequelize = require("../../config/database");
const db = require("../../config/database");
// [GET] localhost:/auth/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Trang đăng nhập",
  });
};

// [POST] localhost:/auth/login
module.exports.loginPost = async (req, res) => {
  const password = md5(req.body.password);
  const email = req.body.email;
  const user = await Account.findOne({
    where: {
      email: email,
    },
  });
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  if (user.password !== password) {
    req.flash("error", "Mật khẩu không đúng");
    res.redirect("back");
    return;
  }
  console.log(user);
  res.cookie("token", user.token);

  if (user.role_id == "4") {
    res.redirect("/koi");
  } else if (user.role_id == "1") {
    res.redirect("/admin/dashboard");
  } else if (user.role_id == "2") {
    res.redirect("/doctor/dashboard");
  } else if (user.role_id == "3") {
    res.redirect("/staff/dashboard");
  }
};

// [GET] localhost:/auth/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Trang đăng ký ",
  });
};

const generateUserId = async (rolePrefix) => {
  const query = `SELECT COUNT(*) AS count FROM account WHERE id LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const count = results[0].count + 1;
  return `${rolePrefix}${String(count).padStart(4, "0")}`; 
};
// [POST] localhost:/auth/register
module.exports.registerPost = async (req, res) => {
  try {
    const password = md5(req.body.password);
    const { email, fullName, phone, address } = req.body;
    const emailExisted = await Account.findOne({
      where: {
        email: email,
      },
    });
    if (emailExisted) {
      req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      res.redirect("back");
    } else {
      // await Account.create({
      //   fullName: fullName,
      //   email: email,
      //   password: password,
      //   phone: phone,
      //   address: address,
      //   role_id: "4",
      // });
      const userId = await generateUserId("KH");
      await Account.create({
        id: userId, // Use the generated user ID
        fullName: fullName,
        email: email,
        password: password,
        phone: phone,
        address: address,
        role_id: "4",
      });
      req.flash("success", "Đăng ký thành công!");
      res.redirect("/auth/login");
    }
  } catch (error) {
    req.flash("error", "Tạo tài khoản thất tại");
  }
};

// [GET] localhost:/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`/auth/login`);
};
