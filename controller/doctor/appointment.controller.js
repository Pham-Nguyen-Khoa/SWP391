const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Vet = require("../../models/vet.model");
const Appointment = require("../../models/appointment.model");
const Customer = require("../../models/customer.model");
const nodemailer = require("../../helpers/nodemailer");
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; 
}
// [Get] /doctor/appointment
module.exports.index = async (req, res) => {
  let queryListAppointment;
  const VetID = res.locals.user.VetID;
  if (req.query.process == "cancelled") {
    queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.VetID = '${VetID}' And  a.Process = 'Cancelled'`;
  }
  if (req.query.process == "ready") {
    queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.VetID = '${VetID}' And a.Process = 'Ready'`;
  }
  if (req.query.process == "successed") {
    queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.VetID = '${VetID}' And a.Process = 'Successed'`;
  }
  if (req.query.process == "process") {
    queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.VetID = '${VetID}' And a.Process = 'Process'`;
  }
  if (!req.query.process) {
    queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID Where a.VetID = '${VetID}' And a.Process !='Pending' And a.Process !='Accepted'`;
  }
  if(req.query.date){
    queryListAppointment += ` AND a.Date = '${req.query.date}'`;
  }
  if(req.query.sort){
    queryListAppointment += ` ORDER BY a.Date ${req.query.sort}`;
  }
  const [listAppointment] = await Sequelize.query(queryListAppointment);
  const [listAppointmentOrigin] = await Sequelize.query(
    `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID Where a.VetID = '${VetID}'  And a.Process !='Pending' And a.Process !='Accepted' `
  );
  listAppointment.forEach(appointment => {
    appointment.DateFormat = formatDate(appointment.Date);
  });
  let dateFormat = null;
  if (req.query.date) {
    dateFormat = formatDate(req.query.date);
  }
  let filterType = 'all';
  if (req.query.date) {
    filterType = 'date';
  } else if (req.query.process) {
    filterType = 'process';
  }
  res.render("doctor/pages/appointment/index", {
    pageTitle: "Trang Hồ Sơ Dịch Vụ",
    listAppointment: listAppointment,
    listAppointmentOrigin: listAppointmentOrigin,
    date: req.query.date,
    sort: req.query.sort,
    dateFormat: dateFormat,
    filterType: filterType,
    processFilter: req.query.process
  });
};

// [Get] /doctor/appointment/change-process/:AppointmentID/:Process
module.exports.changeProcess = async (req, res) => {
  try {
    const appointmentID = req.params.AppointmentID;
    const process = req.params.Process;
    const vetID = res.locals.user.VetID;
    const query = `SELECT ServiceID, VetID FROM appointment WHERE AppointmentID = '${appointmentID}'`;

    const result = await Sequelize.query(query);
    const ServiceID = result[0][0].ServiceID; 
    const VetID = result[0][0].VetID; 

      if(ServiceID == "DV0003"  && process == "process"){
        await Appointment.update(
          {
            Process: "Process",
          },
          {
            where: {
              AppointmentID: appointmentID,
            },
          }
        );
        req.flash("success", "Đổi trạng thái thành công! ");
      res.redirect("back");
      }
      if(ServiceID == "DV0003"  && process == "success"){
        await Appointment.update(
          {
            Process: "Successed",
          },
          {
            where: {
              AppointmentID: appointmentID,
            },
          }
        );
        req.flash("success", "Đổi trạng thái thành công! ");
      res.redirect("/doctor/appointment");
      }
      if(ServiceID != "DV0003" && process == "process"){
        await Appointment.update(
          {
            Process: "Process",
          },
          {
            where: {
              AppointmentID: appointmentID,
            },
          }
      )
      req.flash("success", "Đổi trạng thái thành công! ");
      res.redirect("back");
    }

    // if(process == "Confirmed"){
    //   console.log("ok")
    //   await Appointment.update(
    //     {
    //       Process: "Accepted",
    //     },
    //     {
    //       where: {
    //         AppointmentID: appointmentID,
    //       },
    //     }
    //   );
    //   const queryCustomerID = `Select CustomerID from appointment where AppointmentID = '${appointmentID}'`;
    //   const CustomerID = await Sequelize.query(queryCustomerID);
    //   const queryAccountID = `Select AccountID from customer where CustomerID = '${CustomerID}'`;
    //   const AccountID = await Sequelize.query(queryAccountID)
    //   const queryEmail = `Select Email from account1 where AccountID = '${AccountID}'`;
    //   const email = await Sequelize.query(queryEmail);
    //   req.flash("success", "Đổi trạng thái thành công! ");
    //   res.redirect("back");
    // }
    // if(process == "Process"){
    //   const countOrderProgress = await Appointment.count({
    //     where: {
    //         VetID: vetID,
    //         Process: 'Process'
    //     }
    // });
    //   if(countOrderProgress >= 1){
    //     req.flash("error", "Hiện tại chỉ cho phép 1 đơn trong quá trình làm.");
    //     res.redirect("back");
    //   }else{
    //     await Appointment.update(
    //       {
    //         Process: "Process",
    //       },
    //       {
    //         where: {
    //           AppointmentID: appointmentID,
    //         },
    //       }
    //     );
    //     req.flash("success", "Đổi trạng thái thành công! ");
    //   res.redirect("back");
    //   }
      
    // }
  } catch (error) {
    req.flash("error", "Đổi trạng thái thất bại! ");
    res.redirect("back");
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
function formatPrice(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}
// [Get] /doctor/appointment/detail/:AppointmentID
module.exports.detail = async (req, res) => {
  const appointmentID = req.params.AppointmentID;
  const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , a.Name AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`;
  const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
  appoinmentInfo.Date = formatDate(appoinmentInfo.Date);
  appoinmentInfo.PriceFormat = formatPrice(appoinmentInfo.Price);
  appoinmentInfo.PriceTotalFormat = formatPrice(
    appoinmentInfo.Price + (appoinmentInfo.Price * 10) / 100
  );
  res.render("doctor/pages/appointment/detail", {
    pageTitle: "Trang Chi Tiết Lịch Hẹn ",
    appoinmentInfo: appoinmentInfo,
  });
};
