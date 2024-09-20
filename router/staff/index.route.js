const dashboardRoute = require("./dashboard.route");
const myAccountRoute = require("./my-account.route");
const schedulesRoute = require("./schedules.route");
const authMiddleware = require("../../middleware/admin/auth.middleware")
module.exports = (app) => {
  app.use(authMiddleware.requireAuth)
  app.use("/staff/dashboard", dashboardRoute);
  app.use("/staff/my-account", myAccountRoute);
  app.use("/staff/schedules", schedulesRoute);
  
};
