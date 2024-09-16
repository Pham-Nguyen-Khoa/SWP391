const systemConfig = require("../../config/system");
const homeRoute = require("./home.route");
const userRoute = require("./user.route");
const middleware = require("../../middleware/client/userInfo.middleware");

module.exports = (app) => {
  app.use("/koi",middleware.userInfo , homeRoute);
  app.use("/auth", userRoute);
};


