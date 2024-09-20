const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Doctor = require("../../models/doctor.model");
const Account = require("../../models/account.model");

// [GET] localhost:/koi/appointment
module.exports.index = async (req, res) => {
  const listService = await Service.findAll({
    raw: true,
  });
  const listAccount = await Account.findAll({
    raw: true,
    where: {
      status: "active",
    },
  });
  const queryScheduleDoctor = `
    SELECT sc.AccountID,sc.Time, sd.Shift FROM schedule sc JOIN shiftdetail sd ON sc.ScheduleID = sd.ScheduleID ORDER BY sc.AccountID, sc.Time, sd.Shift;
    `;
  const [ScheduleDoctor] = await Sequelize.query(queryScheduleDoctor);
  console.log(ScheduleDoctor);
  var doctorSchedules = {};
  ScheduleDoctor.forEach((row) => {
    var doctorID = row.AccountID;
    var workDay = row.Time;
    var shift = row.Shift;
    if (!doctorSchedules[doctorID]) {
      doctorSchedules[doctorID] = {};
    }

    if (!doctorSchedules[doctorID][workDay]) {
      doctorSchedules[doctorID][workDay] = [];
    }
    doctorSchedules[doctorID][workDay].push(shift);
  });
  const listDoctor = await Doctor.findAll({
    raw: true,
  });

  res.render("client/pages/appointment/index.pug", {
    pageTitle: "Trang Đặt Lịch",
    listService: listService,
    doctorSchedules: doctorSchedules,
    listAccount: listAccount,
    listDoctor: listDoctor,
  });
};
