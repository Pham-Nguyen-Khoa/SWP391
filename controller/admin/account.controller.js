const Account = require("../../models/account1.model");
const Role = require("../../models/role.model");
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");
const Admin = require("../../models/admin.model");
const Staff = require("../../models/staff.model");
const Vet = require("../../models/vet.model");
const Customer = require("../../models/customer.model");

const generateUserId = async (rolePrefix, table, id) => {
  const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const maxId = results[0].maxId || 0;
  const newId = maxId + 1;
  return `${rolePrefix}${String(newId).padStart(4, "0")}`;
};
// [GET] /admin/account
module.exports.index = async (req, res) => {
  let find = {
    RoleID: "RL0004",
  };
  let table = "";
  let joinCondition = "";
  let queryFilter = "";

  if (req.query.filter == "vet") {
    table = "vet";
    // joinCondition = `${table}.AccountID = account1.AccountID  where account1.Deleted = 0`;
  }
  if (req.query.filter == "staff") {
    table = "staff";
    // joinCondition = `${table}.AccountID = account1.AccountID where account1.Deleted = 0`;
  }
  if (req.query.filter == "customer") {
    table = "customer";
    // joinCondition = `${table}.AccountID = account1.AccountID where account1.Deleted = 0 `;
  }
  if (req.query.filter == "admin") {
    table = "admin";
    // joinCondition = `${table}.AccountID = account1.AccountID where account1.Deleted = 0`;
  }
  joinCondition = `${table}.AccountID = account1.AccountID  where account1.Deleted = 0`;

  if (!req.query.filter) {
    queryFilter = `
      SELECT account1.*, 
            COALESCE(admin.FullName, staff.FullName, customer.FullName, vet.FullName) AS FullName,
            COALESCE(admin.PhoneNumber, staff.PhoneNumber, customer.PhoneNumber, vet.FullName) AS PhoneNumber,
            COALESCE(admin.Address, staff.Address, customer.Address, vet.Address) AS Address,
            COALESCE(admin.Gender, staff.Gender, customer.Gender, vet.Gender) AS Gender,
            COALESCE(admin.Birthday, staff.Birthday, customer.Birthday, vet.Birthday) AS Birthday,
            COALESCE(admin.Avatar, staff.Avatar, customer.Avatar, vet.Avatar) AS Avatar,
            COALESCE(vet.Specialization) AS Specialization,
            COALESCE(vet.Description) AS Description,
            COALESCE(vet.GoogleMeet) AS GoogleMeet
      FROM account1
      LEFT JOIN admin ON admin.AccountID = account1.AccountID
      LEFT JOIN staff ON staff.AccountID = account1.AccountID
      LEFT JOIN customer ON customer.AccountID = account1.AccountID
      LEFT JOIN vet ON vet.AccountID = account1.AccountID
      WHERE account1.RoleID != 'RL0001' and  account1.Deleted = 0
      ORDER BY account1.AccountID ASC
  `;
  } else {
    queryFilter = `SELECT * FROM account1 JOIN ${table} ON ${joinCondition}`;
  }
  var [listUser] = await Sequelize.query(queryFilter);
  res.render("admin/pages/account/index", {
    pageTitle: "Trang danh sách tài khoản",
    listUser: listUser,
  });
};

// [PATCH] /admin/account/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    let statusUpdate ='';
    if(status == "inactive"){
      statusUpdate ="Bị Block"
    }else{
      statusUpdate = "Kích hoạt"
    }
    const id = req.params.id;
    await Account.update(
      { Status: statusUpdate },
      {
        where: {
          AccountID: id,
        },
      }
    );
    if (status == "inactive") {
      req.flash("error", "Khóa tài khoản thành công");
    } else {
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
  var id = req.params.id;
  const user = await Account.findOne({
    raw: true,
    where: {
      AccountID: id,
    },
  });
  if (!user) {
    req.flash("Không tìm thấy tài khoản! ");
    return;
  }
  let dataInfo;
  if (user.RoleID == "RL0002") {
    dataInfo = await Vet.findOne({
      where: {
        AccountID: user.AccountID,
      },
    });
  } else if (user.RoleID == "RL0003") {
    dataInfo = await Staff.findOne({
      where: {
        AccountID: user.AccountID,
      },
    });
  } else if (user.RoleID == "RL0004") {
    dataInfo = await Customer.findOne({
      where: {
        AccountID: user.AccountID,
      },
    });
  } else if (user.RoleID == "RL0001") {
    dataInfo = await Admin.findOne({
      where: {
        AccountID: user.AccountID,
      },
    });
  }
  const data = {
    ...user,
    ...dataInfo?.dataValues,
  };
  const role = await Role.findAll({});
  res.render("admin/pages/account/edit", {
    pageTitle: "Trang chỉnh sửa tài khoản",
    data: data,
    roles: role,
  });
};

// // [PATCH] /admin/account/edit
// module.exports.editPatchJson = async (req, res) => {
//   const { id, fullName, phone, role_id, address, email } = req.body;
//   console.log(req.body);
//   console.log(id);
//   const emailExist = await Account.findOne({
//     where: {
//       email: email,
//       id: { [Op.ne]: id },
//     },
//   });
//   if (emailExist) {
//     req.flash("error", `Email ${req.body.email} đã tồn tại!`);
//     res.json({
//       success: false,
//       message: `Email ${req.body.email} đã tồn tại!`,
//     });
//     return;
//   }
//   let query = `UPDATE account SET fullName = '${req.body.fullName}', email = '${req.body.email}', role_id = '${req.body.role_id}', address = '${req.body.address}', phone = '${req.body.phone}' WHERE id = '${id}'`;
//   try {
//     await Sequelize.query(query);
//     res.json({ success: true, message: "Cập nhật tài khoản thành công!" });

//     // if (req.xhr) {
//     //   res.json({ success: true, message: "Cập nhật tài khoản thành công" });
//     // } else {
//     //   res.redirect("/admin/account");
//     // }
//   } catch (error) {
//     res.json({ success: false, message: "Cập nhật tài khoản thất bại" });
//     req.flash("error", "Cập nhật tài khoản thất bại");
//     res.redirect("/admin/account");
//   }
// };

// [PATCH] /admin/account/edit/:id
// module.exports.editPatch = async (req, res) => {
//   console.log();
//   console.log();
//   const id = req.params.id;
//   const emailExist = await Account.findOne({
//     where: {
//       email: req.body.email,
//       id: { [Op.ne]: id },
//     },
//   });
//   if (emailExist) {
//     req.flash("error", `Email ${req.body.email} đã tồn tại!`);
//     res.redirect("back");
//     return;
//   }
//   console.log(req.body);
//   let query = `UPDATE account SET fullName = '${req.body.fullName}', email = '${req.body.email}', role_id = '${req.body.role_id}',address = '${req.body.address}',phone = '${req.body.phone}',status='${req.body.status}'`;

//   if (req.body.password) {
//     const hashedPassword = md5(req.body.password);
//     query += `, password = '${hashedPassword}'`;
//   }
//   if (req.body.avatar) {
//     query += `,avatar = '${req.body.avatar}'`;
//   }
//   let newId = id;
//   if (req.body.role_id != req.body.role_i_old) {
//     let prefix = "";
//     if (req.body.role_id == 1) prefix = "AD"; 
//     else if (req.body.role_id == 2) prefix = "BS"; 
//     else if (req.body.role_id == 3) prefix = "NV"; 
//     else if (req.body.role_id == 4) prefix = "KH";
//     newId = await generateUserId(prefix);
//     query += `,id = '${newId}'`;
//   }

//   query += ` WHERE id = '${id}'`;
//   try {
//     await Sequelize.query(query);
//     req.flash("success", "Cập nhật tài khoản thành công");
//   } catch (error) {
//     console.error(error);
//     req.flash("error", "Cập nhật tài khoản thất bại");
//   }

//   res.redirect(`/admin/account/edit/${newId}`);
// };
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const emailExist = await Account.findOne({
      where: {
        email: req.body.Email,
        AccountID: { [Op.ne]: id },
      },
    });

    if (emailExist) {
      req.flash("error", `Email ${req.body.Email} đã tồn tại!`);
      res.redirect("back");
      return;
    }

    let query = `UPDATE account1 SET Email = '${req.body.Email}', RoleID = '${req.body.RoleID}', Status = '${req.body.Status}'`;

    if (req.body.Password) {
      const newPassword = md5(req.body.Password);
      query += `, Password = '${newPassword}'`;
    }

    query += ` WHERE AccountID = '${id}'`;
    await Sequelize.query(query);
    if (req.body.RoleID == req.body.RoleID_old) {
      const avatar = req.body.Avatar || req.body.OldAvatar;
      const currentRole = req.body.RoleID;
      if (currentRole == "RL0001") {
        await Admin.update(
          {
            FullName: req.body.FullName,
            PhoneNumber: req.body.PhoneNumber,
            Address: req.body.Address,
            Gender: req.body.Gender,
            Birthday: req.body.Birthday,
            Avatar: avatar,
          },
          {
            where: {
              AccountID: id,
            },
          }
        );
      } else if (currentRole == "RL0002") {
        await Vet.update(
          {
            FullName: req.body.FullName,
            PhoneNumber: req.body.PhoneNumber,
            Address: req.body.Address,
            Gender: req.body.Gender,
            Birthday: req.body.Birthday,
            Avatar: avatar,
            GoogleMeet: req.body.GoogleMeetLink,
            Specialization: req.body.Specialization,
            Description: req.body.Description,
          },
          {
            where: { AccountID: id },
          }
        );
      } else if (currentRole == "RL0003") {
        await Staff.update(
          {
            FullName: req.body.FullName,
            PhoneNumber: req.body.PhoneNumber,
            Address: req.body.Address,
            Gender: req.body.Gender,
            Birthday: req.body.Birthday,
            Avatar: avatar,
          },
          {
            where: { AccountID: id },
          }
        );
      } else if (currentRole == "RL0004") {
        await Customer.update(
          {
            FullName: req.body.FullName,
            PhoneNumber: req.body.PhoneNumber,
            Address: req.body.Address,
            Gender: req.body.Gender,
            Birthday: req.body.Birthday,
            Avatar: avatar,
          },
          {
            where: { AccountID: id },
          }
        );
      }
    } else {
      const changeRole = req.body.RoleID;
      const prefixRole = req.body.RoleID_old;
      const avatar = req.body.Avatar || req.body.OldAvatar;
      let table;
      if (prefixRole == "RL0001") table = Admin;
      else if (prefixRole == "RL0002") table = Vet;
      else if (prefixRole == "RL0003") table = Staff;
      else if (prefixRole == "RL0004") table = Customer;
      if (changeRole == "RL0001") {
        await Admin.create({
          AdminID: await generateUserId("AD", "admin", "AdminID"),
          FullName: req.body.FullName,
          PhoneNumber: req.body.PhoneNumber,
          Address: req.body.Address,
          Gender: req.body.Gender,
          Birthday: req.body.Birthday,
          AccountID: id,
          Avatar: avatar,
        });
        await table.destroy({
          where: {
            AccountID: id,
          },
        });
      } else if (changeRole == "RL0002") {
        await Vet.create({
          VetID: await generateUserId("BS", "vet", "VetID"),
          FullName: req.body.FullName,
          PhoneNumber: req.body.PhoneNumber,
          Address: req.body.Address,
          Gender: req.body.Gender,
          Birthday: req.body.Birthday,
          AccountID: id,
          Avatar: avatar,
          GoogleMeet: req.body.GoogleMeetLink,
          Specialization: req.body.Specialization,
          Description: req.body.Description,
        });
        await table.destroy({
          where: {
            AccountID: id,
          },
        });
      } else if (changeRole == "RL0003") {
        await Staff.create({
          StaffID: await generateUserId("NV", "staff", "StaffID"),
          FullName: req.body.FullName,
          PhoneNumber: req.body.PhoneNumber,
          Address: req.body.Address,
          Gender: req.body.Gender,
          Birthday: req.body.Birthday,
          AccountID: id,
          Avatar: avatar,
        });
        await table.destroy({
          where: {
            AccountID: id,
          },
        });
      } else if (changeRole == "RL0004") {
        await Customer.create({
          CustomerID: await generateUserId("KH", "customer", "CustomerID"),
          FullName: req.body.FullName,
          PhoneNumber: req.body.PhoneNumber,
          Address: req.body.Address,
          Gender: req.body.Gender,
          Birthday: req.body.Birthday,
          AccountID: id,
          Avatar: avatar,
        });
        await table.destroy({
          where: {
            AccountID: id,
          },
        });
      }
    }
    req.flash("success","Cập nhật tài khoản thành công! ");
    res.redirect(`/admin/account/edit/${id}`);
  } catch (error) {
    req.flash("error","Cập nhật tài khoản thất bại! ");
    res.redirect("back");
  }
};
// [DELETE] /admin/account/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const query = `UPDATE account1 set Deleted = 1 where AccountID = '${id}'`;
    await Sequelize.query(query);
    req.flash("success", "Đã xóa tài khoản thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("success", "Xóa tài khoản thất bại! ");
    res.redirect("back");
  }
};

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
  const roles = await Role.findAll({});
  res.render("admin/pages/account/create", {
    pageTitle: "Trang tạo tài khoản",
    roles: roles,
  });
};

// [POST] /admin/account/create
module.exports.createPost = async (req, res) => {
  const {
    FullName,
    Email,
    Address,
    Gender,
    Birthday,
    Password,
    PhoneNumber,
    RoleID,
    Status,
    Avatar,
  } = req.body;

  try {
    const emailExisted = await Account.findOne({
      where: {
        Email: Email,
      },
    });

    if (emailExisted) {
      req.flash("error", `Email ${Email} đã tồn tại!`);
      return res.redirect("back");
    }

    const accountId = await generateUserId("AC", "account1", "AccountID");

    await Account.create({
      AccountID: accountId,
      Password: md5(Password),
      Email: Email,
      RoleID: RoleID,
      Status: Status,
    });

    if (RoleID == "RL0001") {
      await Admin.create({
        AdminID: await generateUserId("AD", "admin", "AdminID"),
        FullName: FullName,
        PhoneNumber: PhoneNumber,
        Address: Address,
        Gender: Gender,
        Birthday: Birthday,
        AccountID: accountId,
        Avatar: Avatar,
      });
    } else if (RoleID == "RL0003") {
      await Staff.create({
        StaffID: await generateUserId("NV", "staff", "StaffID"),
        FullName: FullName,
        PhoneNumber: PhoneNumber,
        Address: Address,
        Gender: Gender,
        Birthday: Birthday,
        AccountID: accountId,
        Avatar: Avatar,
      });
    } else if (RoleID == "RL0004") {
      await Customer.create({
        CustomerID: await generateUserId("KH", "customer", "CustomerID"),
        FullName: FullName,
        PhoneNumber: PhoneNumber,
        Address: Address,
        Gender: Gender,
        Birthday: Birthday,
        AccountID: accountId,
        Avatar: Avatar,
      });
    } else if (RoleID == "RL0002") {
      await Vet.create({
        VetID: await generateUserId("BS", "vet", "VetID"),
        FullName: FullName,
        PhoneNumber: PhoneNumber,
        Address: Address,
        Gender: Gender,
        Birthday: Birthday,
        AccountID: accountId,
        Avatar: Avatar,
        GoogleMeet: req.body.GoogleMeetLink,
        Specialization: req.body.Specialization,
        Description: req.body.Description,
      });
    }

    req.flash("success", "Tạo tài khoản thành công!");
    return res.redirect("/admin/account");
  } catch (error) {
    console.error(error);
    req.flash("error", "Tạo tài khoản thất bại!");
    return res.redirect("back");
  }
};
