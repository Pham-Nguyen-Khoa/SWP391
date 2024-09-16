const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");
// [GET] /admin/account
module.exports.index = async (req, res) => {
  let find = {
    role_id: "4",
    deleted: "false",
  };
  if (req.query.filter == "doctor") {
    find.role_id = "2";
  }
  if (req.query.filter == "staff") {
    find.role_id = "3";
  }
  if (req.query.filter == "user") {
    find.role_id = "4";
  }
  if (req.query.filter == "admin") {
    find.role_id = "1";
  }
  if (!req.query.filter) {
    var listUser = await Account.findAll({
      where: {
        role_id: { [Op.ne]: "1" },
        deleted: "false",
      },
    });
  } else {
    var listUser = await Account.findAll({
      where: find,
    });
  }

  res.render("admin/pages/account/index", {
    pageTitle: "Trang danh sách tài khoản",
    listUser: listUser,
  });
};

// [PATCH] /admin/account/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    await Account.update(
      { status: status },
      {
        where: {
          id: id,
        },
      }
    );
    if(status =="inactive"){
      req.flash("success", "Khóa tài khoản thành công");
    }else{
      req.flash("success", "Mở tài khoản thành công");
    }
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("success", "Khóa tài khoản thất bại");
    res.redirect("back");
  }
};

// [GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const user = await Account.findOne({
    where: {
      id: id,
    },
  });
  const role = await Role.findAll({});
  res.render("admin/pages/account/edit", {
    pageTitle: "Trang chỉnh sửa tài khoản",
    data: user,
    roles: role,
  });
};

// [PATCH] /admin/account/edit  
module.exports.editPatchJson = async (req, res) => {
  const { id, fullName, phone, role_id, address, email } = req.body;
  console.log(req.body);
  console.log(id);
  const emailExist = await Account.findOne({
    where: {
      email: email,
      id: { [Op.ne]: id },
    },
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.json({
      success: false,
      message: `Email ${req.body.email} đã tồn tại!`,
    });
    return;
  }
  let query = `UPDATE account SET fullName = '${req.body.fullName}', email = '${req.body.email}', role_id = '${req.body.role_id}', address = '${req.body.address}', phone = '${req.body.phone}' WHERE id = '${id}'`;
  try {
    await Sequelize.query(query);
    res.json({ success: true, message: "Cập nhật tài khoản thành công!" });

    // if (req.xhr) {
    //   res.json({ success: true, message: "Cập nhật tài khoản thành công" });
    // } else {
    //   res.redirect("/admin/account");
    // }
  } catch (error) {
    res.json({ success: false, message: "Cập nhật tài khoản thất bại" });
    req.flash("error", "Cập nhật tài khoản thất bại");
    res.redirect("/admin/account");
  }
};

// [PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    where: {
      email: req.body.email,
      id: { [Op.ne]: id },
    },
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect("back");
    return;
  }
  console.log(req.body);
  let query = `UPDATE account SET fullName = '${req.body.fullName}', email = '${req.body.email}', role_id = '${req.body.role_id}',address = '${req.body.address}',phone = '${req.body.phone}',status='${req.body.status}'`;

  if (req.body.password) {
    const hashedPassword = md5(req.body.password);
    query += `, password = '${hashedPassword}'`;
  }
  if (req.body.avatar) {
    query += `,avatar = '${req.body.avatar}'`;
  }

  query += ` WHERE id = '${id}'`;
  try {
    await Sequelize.query(query);
    req.flash("success", "Cập nhật tài khoản thành công");
  } catch (error) {
    console.error(error);
    req.flash("error", "Cập nhật tài khoản thất bại");
  }
  res.redirect(`/admin/account/edit/${id}`);
};

// [DELETE] /admin/account/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `UPDATE account set deleted = 'true' where id = '${id}'`;
  await Sequelize.query(query);
  req.flash("success", "Đã xóa tài khoản thành công!");
  res.redirect("back");
};

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
  const roles = await Role.findAll({});
  console.log(roles);
  res.render("admin/pages/account/create", {
    pageTitle: "Trang tạo tài khoản",
    roles: roles,
  });
};

const generateUserId = async (rolePrefix) => {
  const query = `SELECT COUNT(*) AS count FROM account WHERE id LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const count = results[0].count + 1;
  return `${rolePrefix}${String(count).padStart(4, "0")}`; // e.g., KH0001, KH0002
};
// [POST] /admin/account/create
module.exports.createPost = async (req, res) => {
  const emailExisted = await Account.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (emailExisted) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect("back");
  } else {
    let prefix = "";
    if (req.body.role_id == 1) prefix = "AD"; // Admin
    else if (req.body.role_id == 2) prefix = "BS"; // Bác sĩ
    else if (req.body.role_id == 3) prefix = "NV"; // Nhân viên;
    else if (req.body.role_id == 4) prefix = "KH";
    const userId = await generateUserId(prefix);
    req.body.password = md5(req.body.password);
    console.log(req.body);
    const {
      fullName,
      email,
      address,
      password,
      phone,
      role_id,
      status,
      avatar,
    } = req.body;
    const query = `
    INSERT INTO account (id,fullName, email, password, address, phone, avatar, status, role_id)
    VALUES ('${userId}','${fullName}', '${email}', '${password}', '${address}', '${phone}', '${avatar}', '${status}', '${role_id}')
  `;
    await Sequelize.query(query);
    res.redirect("/admin/account");
  }
};
