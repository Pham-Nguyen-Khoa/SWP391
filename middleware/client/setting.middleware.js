
const Setting = require("../../models/setting.model");

module.exports.SettingMiddleware = async (req, res, next) =>{
    const setting = await Setting.findOne({
        raw: true,
        where: {
            SettingID: 1,
        },
    });
    res.locals.SettingGeneral = setting;
  next();
};
