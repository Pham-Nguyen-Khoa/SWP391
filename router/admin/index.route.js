const systemConfig = require("../../config/system");
const dashboardRoute = require("./dashboard.route");
const accounttRoute = require("./account.route");
const myAccounttRoute = require("./my-account.route");
const authMiddleware = require("../../middleware/admin/auth.middleware")
const settingRoute = require("./setting.route");
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(authMiddleware.requireAuth);
  app.use(PATH_ADMIN + "/dashboard", dashboardRoute);
  app.use(PATH_ADMIN + "/account", accounttRoute);
  app.use(PATH_ADMIN + "/my-account", myAccounttRoute);
  app.use(PATH_ADMIN + "/setting", settingRoute);
};
