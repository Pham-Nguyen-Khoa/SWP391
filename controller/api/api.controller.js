
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");
const Account = require("../../models/account1.model");
const Role = require("../../models/role.model");
const Admin = require("../../models/admin.model");
const Staff = require("../../models/staff.model");
const Vet = require("../../models/vet.model");
const Customer = require("../../models/customer.model");
const removeDiacritics = require('remove-diacritics'); 
const Service = require("../../models/service.model");
const Account1 = require("../../models/account1.model");
const sendMail = require("../../helpers/nodemailer");
const generate = require("../../helpers/generate");
const verifyEmailHelper = require("../../helpers/checkMail");


// [Get] /api/
module.exports.index = async (req, res) => {
    try {
        const listService = await Service.findAll({
            raw: true,
            nest: true
        });
        
        if (!listService || listService.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dịch vụ nào',
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách dịch vụ thành công',
            data: listService
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách dịch vụ',
            error: error.message
        });
    }
}




// [GET] /api/account
module.exports.account = async (req, res) => {
    const page = req.query.page || 1;
    if(page < 1){
      req.flash("error", "Trang không tồn tại");
      res.redirect("/admin/account");
      return;
    }
    const limit = 5;
    let skip = (page-1)*limit;
  
    let find = {
      RoleID: "RL0004",
    };
    let table = "";
    let model = Account;
    let joinCondition = "";
    let queryFilter = "";
  
    if (req.query.filter == "vet") {
      table = "vet";
      model = Vet;
      // joinCondition = `${table}.AccountID = account1.AccountID  where account1.Deleted = 0`;
    }
    if (req.query.filter == "staff") {
      table = "staff";
      model = Staff;
      // joinCondition = `${table}.AccountID = account1.AccountID where account1.Deleted = 0`;
    }
    if (req.query.filter == "customer") {
      table = "customer";
      model = Customer;
      // joinCondition = `${table}.AccountID = account1.AccountID where account1.Deleted = 0 `;
    }
    if (req.query.filter == "admin") {
      table = "admin";
      model = Admin;
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
  
  
    let totalUsers = await model.count({
    });
    
  
    if(req.query.search){
      listUser = listUser.filter(user =>
        removeDiacritics(user.FullName.toLowerCase()).includes(removeDiacritics(req.query.search.toLowerCase()))
      );
       totalUsers = listUser.length;
    }
    const totalPages = Math.ceil(totalUsers / limit);
    listUser = listUser.slice(skip, skip + limit);
    
    return res.status(200).json({
        success: true,
        message: "Lấy danh sách tài khoản thành công",
        data: {
          users: listUser,
          pagination: {
            totalPages: totalPages,
            currentPage: parseInt(page),
            limit: limit,
            totalUsers: totalUsers
          }
        }
      });
  };





  // [PATCH] /api/account/:status/:id
  module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;
        let statusUpdate = status === "inactive" ? "Bị Block" : "Kích hoạt";

        await Account.update(
            { Status: statusUpdate },
            {
                where: {
                    AccountID: id,
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: status === "inactive" 
                ? "Khóa tài khoản thành công"
                : "Mở tài khoản thành công"
        });
    } catch (error) {
        console.error('Error changing account status:', error);
        return res.status(500).json({
            success: false,
            message: "Thay đổi trạng thái tài khoản thất bại",
            error: error.message
        });
    }
};



// [GET] /api/account/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id.trim();
        console.log(id)
        const user = await Account.findOne({
            raw: true,
            where: {
                AccountID: id,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản!"
            });
        }

        let dataInfo;
        if (user.RoleID == "RL0002") {
            dataInfo = await Vet.findOne({
                where: { AccountID: user.AccountID },
            });
        } else if (user.RoleID == "RL0003") {
            dataInfo = await Staff.findOne({
                where: { AccountID: user.AccountID },
            });
        } else if (user.RoleID == "RL0004") {
            dataInfo = await Customer.findOne({
                where: { AccountID: user.AccountID },
            });
        } else if (user.RoleID == "RL0001") {
            dataInfo = await Admin.findOne({
                where: { AccountID: user.AccountID },
            });
        }

        const data = {
            ...user,
            ...dataInfo?.dataValues,
        };

        const roles = await Role.findAll({ raw: true });

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin tài khoản thành công",
            data: {
                accountInfo: data,
                roles: roles
            }
        });

    } catch (error) {
        console.error('Error fetching account details:', error);
        return res.status(500).json({
            success: false,
            message: "Lấy thông tin tài khoản thất bại",
            error: error.message
        });
    }
};



const generateUserId = async (rolePrefix, table, id) => {
    const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
    const [results] = await db.query(query);
    const maxId = results[0].maxId || 0;
    const newId = maxId + 1;
    return `${rolePrefix}${String(newId).padStart(4, "0")}`;
  };



// [POST] /api/login

  module.exports.loginPost = async (req, res) => {
    try {
        const password = md5(req.body.Password);
        const email = req.body.Email;

        const user = await Account1.findOne({
            where: {
                Email: email,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email không tồn tại!"
            });
        }

        if (user.Status == "Bị Block") {
            return res.status(403).json({
                success: false,
                message: "Tài khoản đã bị khóa!"
            });
        }

        if (user.Password !== password) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không đúng"
            });
        }

        // Tạo response data dựa vào role
        let redirectUrl = "";
        switch(user.RoleID) {
            case "RL0004": redirectUrl = "/koi"; break;
            case "RL0001": redirectUrl = "/admin/account"; break;
            case "RL0002": redirectUrl = "/doctor/dashboard"; break;
            case "RL0003": redirectUrl = "/staff/appointment"; break;
        }

        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                token: user.Token,
                redirectUrl: redirectUrl,
                role: user.RoleID
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi trong quá trình đăng nhập",
            error: error.message
        });
    }
};






// [POST] /api/register
module.exports.registerPost = async (req, res) => {
    try {
        const password = md5(req.body.Password);

        const checkMail = await verifyEmailHelper.verifyEmail(req.body.Email);
        if (!checkMail) {
            return res.status(400).json({
                success: false,
                message: "Email không tồn tại!"
            });
        }

        const emailExisted = await Account1.findOne({
            where: {
                Email: req.body.Email,
            },
        });

        if (emailExisted) {
            return res.status(409).json({
                success: false,
                message: `Email ${req.body.Email} đã tồn tại!`
            });
        }

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

        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công!",
            data: {
                accountId: accountId,
                customerId: customerId,
                email: req.body.Email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: "Đăng ký tài khoản thất bại",
            error: error.message
        });
    }
};