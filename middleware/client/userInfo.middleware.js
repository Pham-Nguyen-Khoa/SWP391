// const Account = require("../../models/account.model");
const Account = require("../../models/account1.model");
const Customer = require("../../models/customer.model");
module.exports.userInfo = async (req, res, next) => {
  const token = req.cookies.token;
  // const token = req.session.token;
  // const user = await User.findOne({tokenUser: tokenUser});
  if(token){
    const user = await Account.findOne({
        where: {
          Token: token,
        },
      });
      if (user) {
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
      }
    }
  next();
};
