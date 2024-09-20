const systemConfig = require("../../config/system");
const homeRoute = require("./home.route");
const userRoute = require("./user.route");
const  appointmentRoute = require("./appointment.route");
const forgotpPasswordRoute = require("./forgotPassword.route");
const middleware = require("../../middleware/client/userInfo.middleware");
const authMiddleware = require("../../middleware/client/auth.middleware");

module.exports = (app) => {
  app.use("/koi",middleware.userInfo , homeRoute);
  app.use("/auth", userRoute);
  app.use("/auth/password/", forgotpPasswordRoute);
  app.use("/koi/appointment",authMiddleware.requireAuth , appointmentRoute);
};


