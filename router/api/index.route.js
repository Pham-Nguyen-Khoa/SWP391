// const systemConfig = require("../../config/system");
// const dashboardRoute = require("./dashboard.route");
// const accounttRoute = require("./account.route");
// const myAccounttRoute = require("./my-account.route");
// const authMiddleware = require("../../middleware/admin/auth.middleware")
// const settingRoute = require("./setting.route");
// const chatRoute = require("./chat.route");
// const feedBackRoute = require("./feedback.route");
// const appointmentRoute = require("./appointment.route");
// const serviceRoute = require("./service.route");
const apiRoute = require("./api.route");
module.exports = (app) => {

  app.use("/api", apiRoute);
};
