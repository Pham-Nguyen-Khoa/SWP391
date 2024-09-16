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
    } else if (user.role_id == "4") {
      res.redirect("/koi");
      return;
    } else {
      const role = await Role.findOne({
        where: {
          id: user.role_id,
        },
      });
      res.locals.role = role;
      res.locals.user = user;
    }
    next();
  }
};
