// const Account = require("../../models/account.model");
const Account = require("../../models/account1.model");
const Customer = require("../../models/customer.model");
// const Role = require("../../models/role.model");
// const Role = require("../../models/roles.model");
module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  // const token = req.session.token;   
  // const token = localStorage.getItem("token");
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
    } else {
      const customer = await Customer.findOne({
        where: {
          AccountID: user.AccountID,
        },
      });

      if (customer) {
        res.locals.userInfo = {
          ...user.dataValues,
          ...customer.dataValues,
        };
      } else {
        res.locals.userInfo = { ...user.dataValues };
      }
      next();
    }
    
  }
};
