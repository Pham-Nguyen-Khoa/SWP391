const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Vet = require("../../models/vet.model");
const Appointment = require("../../models/appointment.model");
const Customer = require("../../models/customer.model");

const generateUserId = async (rolePrefix, table, id) => {
  const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const maxId = results[0].maxId || 0;
  const newId = maxId + 1;
  return `${rolePrefix}${String(newId).padStart(4, "0")}`;
};

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
  // const listAccount = await Account.findAll({
  //   raw: true,
  //   where: {
  //     status: "active",
  //   },
  // });
  const queryScheduleDoctor = `
  SELECT sc.VetID, sc.Time, sd.Shift 
  FROM schedule sc 
  JOIN shiftdetail sd ON sc.ScheduleID = sd.ScheduleID 
  WHERE sd.appointmentID IS NULL
  ORDER BY sc.VetID, sc.Time, sd.Shift;
`;
  const [ScheduleDoctor] = await Sequelize.query(queryScheduleDoctor);
  console.log(ScheduleDoctor);
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

  res.render("client/pages/appointment/index.pug", {
    pageTitle: "Trang Đặt Lịch",
    listService: listService,
    doctorSchedules: doctorSchedules,
    listAccount: listAccount,
    listDoctor: listDoctor,
  });
};

// [POST] localhost:/koi/appointment
module.exports.indexPost = async (req, res) => {
  console.log(req.body);
  console.log(res.locals.userInfo);
  const AppointmentID = await generateUserId(
    "AP",
    "appointment",
    "AppointmentID"
  );
  if (req.body.service == "Tư Vấn Online") {
    const doctorID = req.body.doctor;
    const doctorInfo = await Vet.findOne({
      raw: true,
      where: {
        VetID: doctorID,
      },
    });

    const customerID = await Customer.findOne({
      raw: true,
      attributes: ["CustomerID"],
      where: {
        AccountID: res.locals.userInfo.AccountID,
      },
    });
    console.log(customerID);

    const serviceID = await Service.findOne({
      raw: true,
      attributes: ["ServiceID"],
      where: {
        Name: req.body.service,
      },
    });
    console.log(serviceID);
   
    await Appointment.create({
      AppointmentID: AppointmentID,
      CustomerID: customerID.CustomerID,
      ServiceID: serviceID.ServiceID,
      VetID: req.body.doctor,
      Name: req.body.FullName,
      PhoneNumber: req.body.PhoneNumber,
      Date: req.body.select_date,
      Shift: req.body.shift,
      StatusPaid: "Đã thanh toán",
    });

    //Update lại lịch của ông bác sĩ
    const queryUpdate = `
UPDATE shiftdetail sd
JOIN schedule sc ON sd.ScheduleID = sc.ScheduleID
SET sd.AppointmentID = '${AppointmentID}'
WHERE sc.VetID = '${req.body.doctor}'     
  AND sd.Shift = '${req.body.shift}' 
  AND sc.Time = '${req.body.select_date}';
`;
    await Sequelize.query(queryUpdate);
  } else {
  }

 

  res.redirect(`/koi/appointment/thankyou/${AppointmentID}`);
};
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; 
}
function formatPrice(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"; 
}
// [GET] localhost:/koi/appointment/thankyou/:AppointmentID
module.exports.thankyou = async (req, res) => {
  const appointmentID = req.params.AppointmentID;
  const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , c.FullName AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`;
  const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
  appoinmentInfo.Date = formatDate(appoinmentInfo.Date);
  appoinmentInfo.PriceFormat = formatPrice(appoinmentInfo.Price);
  appoinmentInfo.PriceTotalFormat = formatPrice(
    appoinmentInfo.Price + (appoinmentInfo.Price * 10) / 100
  );
  res.render("client/pages/appointment/thankyou", {
    pageTitle: "Trang Cảm Ơn",
    appoinmentInfo: appoinmentInfo
  });
};
