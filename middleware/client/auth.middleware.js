const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/auth/login");
  } else {
    const user = await Account.findOne({
      where: {
        token: token,
      },
    });
    if (!user) {
      res.redirect("/auth/login");
      return;
    } else {
      res.locals.user = user;
    }
    next();
  }
};
