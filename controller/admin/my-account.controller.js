const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const { Op } = require("sequelize");
const Sequelize = require("../../config/database");
const { query } = require("express");

// [Get] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Trang cá nhân",
  });
};

// [Get] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// [Get] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    console.log(res.locals.user.id)
  try {
    const emailExist = await Account.findOne({
      where: {
        email: req.body.email,
        id: { [Op.ne]: res.locals.user.id },
      },
    });
    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      res.redirect("back");
      return;
    }
    const { fullName, email, address, password, phone } = req.body;
    let query = `Update account set  fullName = '${fullName}', email = '${email}',address='${address}',phone='${phone}'`;
    if (req.body.password) {
      req.body.password = md5(req.body.password);
      query += `,password = '${req.body.password}'`;
    }
    if (req.body.avatar) {
      query += `,avatar = '${req.body.avatar}'`;
    }
    query += ` WHERE id = '${res.locals.user.id}'`;
    await Sequelize.query(query);
    req.flash("success", "Cập nhật trang cá nhân thành công!");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật trang cá nhân thất bại!");
    res.redirect("back");
  }

  // res.render("admin/pages/my-account/edit", {
  //   pageTitle: "Chỉnh sửa thông tin cá nhân",
  // });
};
