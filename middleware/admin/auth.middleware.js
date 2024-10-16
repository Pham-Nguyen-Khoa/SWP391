// const Account = require("../../models/account.model");
// const Role = require("../../models/roles.model");
const Account = require("../../models/account1.model");
const Admin = require("../../models/admin.model");
const Staff = require("../../models/staff.model");
const Role = require("../../models/role.model");
const Vet = require("../../models/vet.model");
module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  // const tokenSession = req.session.token;
  
  if (!token) {
    res.redirect("/auth/login");
    return;
  } else {
    const user = await Account.findOne({
      where: {
        Token: token,
      },
    });
    if (!user) {
      res.redirect("/auth/login");
      return;
    } 
    // else if (user.RoleID == "RL0004") {
    //   res.redirect("/koi");
    //   return;
    // }

    const role = String(user.RoleID);
    const route = (req.originalUrl || req.baseUrl || req.path).trim();

    if (
      role === "RL0001" &&
      (route.startsWith("/doctor") || route.startsWith("/staff"))
    ) {
      // req.flash("error", "Không thể truy cập !");
      // return res.redirect("/admin/dashboard");
      res.render("client/pages/errors/405",{
        pageTitle: "Không có quyền truy cập",
      })
    } else if (
      role === "RL0002" &&
      (route.startsWith("/admin") || route.startsWith("/staff"))
    ) {
      res.render("client/pages/errors/405",{
        pageTitle: "Không có quyền truy cập",
      })
    } else if (
      role === "RL0003" &&
      (route.startsWith("/admin") || route.startsWith("/doctor"))
    ) {

      res.render("client/pages/errors/405",{
        pageTitle: "Không có quyền truy cập",
      })
    }
    else if (
      role === "RL0004" &&
      (route.startsWith("/admin") || route.startsWith("/doctor") || route.startsWith("/staff"))
    ) {

      res.render("client/pages/errors/405",{
        pageTitle: "Không có quyền truy cập",
      })
    }
    const roleInfo = await Role.findOne({
      where: {
        RoleID: user.RoleID,
      },
    });
    if (role == "RL0001") {
      const admin = await Admin.findOne({
        where: {
          AccountID: user.AccountID,
        },
      });
      res.locals.role = roleInfo;
      res.locals.user = {
        ...user.dataValues,
        ...admin.dataValues,
      };
    } else if (role == "RL0003") {
      const staff = await Staff.findOne({
        where: {
          AccountID: user.AccountID,
        },
      });
      res.locals.role = roleInfo;
      res.locals.user = {
        ...user.dataValues,
        ...staff.dataValues,
      };
    }else if (role == "RL0002") {
      const vet = await Vet.findOne({
        where: {
          AccountID: user.AccountID,
        },
      });
      res.locals.role = roleInfo;
      res.locals.user = {
        ...user.dataValues,
        ...vet.dataValues,
      };
    }

    next();
  }
};
