
const Setting = require("../../models/setting.model");

module.exports.SettingMiddleware = async (req, res, next) =>{
    console.log("HHello");
    console.log("meo meo")
    const setting = await Setting.findOne({
        raw: true,
        where: {
            SettingID: 1,
        },
    });

    res.locals.SettingGeneral = setting;
  next();
};
