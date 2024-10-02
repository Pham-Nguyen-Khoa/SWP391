const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Vet = require("../../models/vet.model");
const Appointment = require("../../models/appointment.model");
const Customer = require("../../models/customer.model");

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; 
}
// [GET] localhost:/koi/my-appointment/
module.exports.index = async (req, res) => {
  const userInfo = res.locals.userInfo;
  const listAppointment = await Appointment.findAll({
    raw: true, 
    where: {
      CustomerID: userInfo.CustomerID
    },
    order: [['Date', 'DESC']]
  })
  listAppointment.forEach((item) => {
    item.DateFormat = formatDate(item.Date);
  })

    res.render("client/pages/my-appointment/index.pug", {
      pageTitle: "Đơn Hàng Của Bạn",
      listAppointment: listAppointment
    });
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
  // [GET] localhost:/koi/my-appointment/detail/:AppointmentID
module.exports.detail = async (req, res) => {
    const appointmentID = req.params.AppointmentID;
    const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , a.Name AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`;
    const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
    if(appoinmentInfo == null){
      res.redirect("/koi/my-appointment");
    }
    appoinmentInfo.Date = formatDate(appoinmentInfo.Date);
    appoinmentInfo.PriceFormat = formatPrice(appoinmentInfo.Price);
    appoinmentInfo.PriceTotalFormat = formatPrice(
      appoinmentInfo.Price + (appoinmentInfo.Price * 10) / 100
    );
    res.render("client/pages/my-appointment/detail", {
      pageTitle: "Trang Chi Tiết Đơn Hàng",
      appoinmentInfo: appoinmentInfo
    });


  };
  