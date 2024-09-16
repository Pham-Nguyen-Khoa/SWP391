const dashboardRoute = require("./dashboard.route");
const myAccountRoute = require("./my-account.route");
const authMiddleware = require("../../middleware/admin/auth.middleware")
module.exports = (app) => {
  app.use(authMiddleware.requireAuth)
  app.use("/doctor/dashboard", dashboardRoute);
  app.use("/doctor/my-account", myAccountRoute);
  
};
