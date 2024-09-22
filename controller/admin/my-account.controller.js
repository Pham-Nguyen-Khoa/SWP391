const md5 = require("md5");
const { Op } = require("sequelize");
const Sequelize = require("../../config/database");
const { query } = require("express");
const Account = require("../../models/account1.model");

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
  try {
    const emailExist = await Account.findOne({
      where: {
        email: req.body.Email,
        AccountID: { [Op.ne]: res.locals.user.AccountID },
      },
    });
    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      res.redirect("back");
      return;
    }
    let queryUpdateAccount = `Update account1 Set Email ='${req.body.Email}'`
    if(req.body.Password){
      const newPassword  = md5(req.body.Password)
      queryUpdateAccount += `, Password = '${newPassword}'`;
    }
    queryUpdateAccount += `WHERE AccountID = '${res.locals.user.AccountID}'`;
    await Sequelize.query(queryUpdateAccount);

    let  queryUpdateAdmin =  `Update admin  SET FullName = '${req.body.FullName}', PhoneNumber ='${req.body.PhoneNumber}',Address = '${req.body.Address}',Gender='${req.body.Gender}',Birthday='${req.body.Birthday}'`
    if(req.body.Avatar){
      queryUpdateAdmin += `, Avatar = '${req.body.Avatar}'`;
    }
    queryUpdateAdmin += `WHERE AccountID = '${res.locals.user.AccountID}'`;
    await Sequelize.query(queryUpdateAdmin);
    req.flash("success", "Cập nhật trang cá nhân thành công!");
    res.redirect("back");
  }catch{
    req.flash("error", "Cập nhật trang cá nhân thất bại!");
    res.redirect("back");
  }
};
