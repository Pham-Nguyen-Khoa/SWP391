const Account = require("../../models/account.model");
module.exports.userInfo = async (req, res, next) => {
  const token = req.cookies.token;
  // const user = await User.findOne({tokenUser: tokenUser});
  if(token){
    const user = await Account.findOne({
        where: {
          token: token,
        },
      });
      res.locals.userInfo = user;
  }
  next();
};
