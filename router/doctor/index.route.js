const dashboardRoute = require("./dashboard.route");
const myAccountRoute = require("./my-account.route");
const scheduleRoute = require("./schedule.route");
const AppointmentRoute = require("./appointment.route");
const currentAppointmentRoute = require("./current-appointment.route");
const authMiddleware = require("../../middleware/admin/auth.middleware")
const chatRoute = require("./chat.route");
module.exports = (app) => {
  app.use(authMiddleware.requireAuth)
  app.use("/doctor/dashboard", dashboardRoute);
  app.use("/doctor/my-account", myAccountRoute);
  app.use("/doctor/schedule", scheduleRoute);
  app.use("/doctor/appointment", AppointmentRoute);
  app.use("/doctor/current-appointment", currentAppointmentRoute);
  app.use("/doctor/chat", chatRoute);
};
