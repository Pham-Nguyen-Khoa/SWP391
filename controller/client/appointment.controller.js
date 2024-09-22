const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const  Vet = require("../../models/vet.model");

// [GET] localhost:/koi/appointment
module.exports.index = async (req, res) => {
  const listService = await Service.findAll({
    raw: true,
  });
  queryFilter = `
      SELECT account1.*, 
            COALESCE(admin.FullName, staff.FullName, customer.FullName, vet.FullName) AS FullName,
            COALESCE(admin.PhoneNumber, staff.PhoneNumber, customer.PhoneNumber, vet.FullName) AS PhoneNumber,
            COALESCE(admin.Address, staff.Address, customer.Address, vet.Address) AS Address,
            COALESCE(admin.Gender, staff.Gender, customer.Gender, vet.Gender) AS Gender,
            COALESCE(admin.Birthday, staff.Birthday, customer.Birthday, vet.Birthday) AS Birthday,
            COALESCE(admin.Avatar, staff.Avatar, customer.Avatar, vet.Avatar) AS Avatar,
            COALESCE(vet.Specialization) AS Specialization,
            COALESCE(vet.Description) AS Description,
            COALESCE(vet.GoogleMeet) AS GoogleMeet
      FROM account1
      LEFT JOIN admin ON admin.AccountID = account1.AccountID
      LEFT JOIN staff ON staff.AccountID = account1.AccountID
      LEFT JOIN customer ON customer.AccountID = account1.AccountID
      LEFT JOIN vet ON vet.AccountID = account1.AccountID
      WHERE account1.RoleID != 'RL0001' and  account1.Deleted = 0
      ORDER BY account1.AccountID ASC
  `;
  const [listAccount] = await Sequelize.query(queryFilter);
  console.log(listAccount)
  // const listAccount = await Account.findAll({
  //   raw: true,
  //   where: {
  //     status: "active",
  //   },
  // });
  const queryScheduleDoctor = `
    SELECT sc.VetID,sc.Time, sd.Shift FROM schedule sc JOIN shiftdetail sd ON sc.ScheduleID = sd.ScheduleID ORDER BY sc.VetID, sc.Time, sd.Shift;
    `;

  const [ScheduleDoctor] = await Sequelize.query(queryScheduleDoctor);
  console.log(ScheduleDoctor)
  var doctorSchedules = {};
  ScheduleDoctor.forEach((row) => {
    var doctorID = row.VetID;
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
  const listDoctor = await Vet.findAll({
    raw: true,
  });
  console.log(listDoctor)

  res.render("client/pages/appointment/index.pug", {
    pageTitle: "Trang Đặt Lịch",
    listService: listService,
    doctorSchedules: doctorSchedules,
    listAccount: listAccount,
    listDoctor: listDoctor,
  });
};
