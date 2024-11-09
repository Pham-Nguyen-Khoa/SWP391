const systemConfig = require("../../config/system");
const homeRoute = require("./home.route");
const userRoute = require("./user.route");
const  appointmentRoute = require("./appointment.route");
const forgotpPasswordRoute = require("./forgotPassword.route");
const myAppointmentRoute = require("./myAppointment.route");
const middleware = require("../../middleware/client/userInfo.middleware");
const authMiddleware = require("../../middleware/client/auth.middleware");
const settingMiddleware = require("../../middleware/client/setting.middleware");
const controller = require("../../controller/client/home.controller");
module.exports = (app) => {
  app.use(settingMiddleware.SettingMiddleware);
  app.get("/", (req, res) => {
    res.redirect("/koi");
  });
  app.use("/koi",middleware.userInfo , homeRoute);
  app.use("/auth", userRoute);
  app.use("/auth/password/", forgotpPasswordRoute);
  app.use("/koi/appointment",authMiddleware.requireAuth , middleware.userInfo ,appointmentRoute);
  app.use("/koi/my-appointment", authMiddleware.requireAuth ,middleware.userInfo ,myAppointmentRoute);
  // app.use("/",middleware.userInfo , controller.index);
};


