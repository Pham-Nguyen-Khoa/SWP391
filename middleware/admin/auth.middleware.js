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
    }

    const role = String(user.role_id); 
    const route = (req.originalUrl || req.baseUrl || req.path).trim(); 

    if (
      role === "1" &&
      (route.startsWith("/doctor") || route.startsWith("/staff"))
    ) {
      req.flash("error", "Không thể truy cập !");
      return res.redirect("/admin/dashboard");
    } else if (
      role === "2" &&
      (route.startsWith("/admin") || route.startsWith("/staff"))
    ) {
      req.flash("error", "Không thể truy cập !");
      return res.redirect("/doctor/dashboard");
    } else if (
      role === "3" &&
      (route.startsWith("/admin") || route.startsWith("/doctor"))
    ) {
      req.flash("error", "Không thể truy cập !");
      return res.redirect("/staff/dashboard");
    }
    const roleInfo = await Role.findOne({
      where: {
        id: user.role_id,
      },
    });
    res.locals.role = roleInfo;
    res.locals.user = user;

    next();
  }
};
