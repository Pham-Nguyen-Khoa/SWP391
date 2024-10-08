
const Setting = require("../../models/setting.model");

module.exports.SettingMiddleware = async (req, res, next) =>{
    console.log("HHello");
    const setting = await Setting.findOne({
        raw: true,
        where: {
            SettingID: 1,
        },
    });
    console.log(setting);

    res.locals.SettingGeneral = setting;
    console.log(res.locals.SettingGeneral);
  next();
};
