const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Vet = require("../../models/vet.model");
const Appointment = require("../../models/appointment.model");
const Customer = require("../../models/customer.model");
const nodemailer = require("../../helpers/nodemailer");
const KoiRecord = require("../../models/koiRecord.model");
const Bill = require("../../models/bill.model");
const Appointment_PondRecord = require("../../models/appointment_pondrecord.model");
const PondRecord = require("../../models/pondRecord.model");
const PondProfile = require("../../models/pondProfile.model");
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
        req.flash("success", "♥ ♥ ♥ Chúc mừng bạn đã hoàn thành công việc ♥ ♥ ♥");
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
// // [Get] /doctor/appointment/detail/:AppointmentID
// module.exports.detail = async (req, res) => {
//   const appointmentID = req.params.AppointmentID;
//   const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , a.Name AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`;
//   const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
//   appoinmentInfo.Date = formatDate(appoinmentInfo.Date);
//   appoinmentInfo.PriceFormat = formatPrice(appoinmentInfo.Price);
//   appoinmentInfo.PriceTotalFormat = formatPrice(
//     appoinmentInfo.Price + (appoinmentInfo.Price * 10) / 100
//   );
//   res.render("doctor/pages/appointment/detail", {
//     pageTitle: "Trang Chi Tiết Lịch Hẹn ",
//     appoinmentInfo: appoinmentInfo,
//   });
// };

function formatCurrency(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const generateUserId = async (table, id, rolePrefix) => {
  const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const maxId = results[0].maxId || 0; 
  const newId = maxId + 1;
  return `${rolePrefix}${String(newId).padStart(4, "0")}`;
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
// [Get] /doctor/appointment/detail/:AppointmentID
module.exports.detail =  async (req, res) => {
  const appointmentID = req.params.AppointmentID;
  console.log(appointmentID)
  const query = `SELECT ServiceID, VetID FROM appointment WHERE AppointmentID = '${appointmentID}'`;

  const result = await Sequelize.query(query);
  const ServiceID = result[0][0].ServiceID; 
  const VetID = result[0][0].VetID; 
      const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , a.Name AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a LEFT JOIN service s ON s.ServiceID = a.ServiceID LEFT JOIN customer c ON c.CustomerID = a.CustomerID LEFT  JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`
  const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
  console.log(appoinmentInfo)
  appoinmentInfo.Date = formatDate(appoinmentInfo.Date);
  appoinmentInfo.PriceFormat = formatPrice(appoinmentInfo.Price)
  appoinmentInfo.PriceTotalFormat = formatPrice(appoinmentInfo.Price +  (appoinmentInfo.Price * 10/100 ))
  const checkDoctorSuccess = `select ap.*,k.* from appointment ap join koirecord k on ap.AppointmentID = k.AppointmentID WHERE ap.StatusPaid='Chưa thanh toán' and ap.AppointmentID = '${appointmentID}' and ap.Address IS NULL AND ap.ServiceID = 'DV0001'`
  const checkPayCenter = await Sequelize.query(checkDoctorSuccess);
  console.log(checkPayCenter)
  let payCenter ="";
  if (checkPayCenter.length > 0 && checkPayCenter[0].length > 0) {
      payCenter = "thanh toán";
  }
  console.log(payCenter)
  if(appoinmentInfo.ServiceID == "DV0001" && appoinmentInfo.StatusPaid =="Đã thanh toán" && appoinmentInfo.BillID != null && appoinmentInfo.Process =="Successed"){
      let totalServiceFee = 1500000;
      let serviceDetails =[
        {description: "Dịch vụ khám sức khỏe", amount: 1500000}
      ]
      if(appoinmentInfo.Distance){
          const distance = appoinmentInfo.Distance;
        const baseFee = 100000; // Phí cơ bản cho 10km
        const additionalFee = Math.ceil(distance / 10) * baseFee; 
        serviceDetails.push({ description: `Phí di chuyển`, amount: additionalFee });  
        if(appoinmentInfo.Address != null){
          totalServiceFee += additionalFee;
          // serviceDetails.push({ description: `Phí di chuyển`, amount: 100000 });
        }
        }
     
  
      
      const fishCount = await KoiRecord.findAll({
          raw: true,
          where:{
              AppointmentID: appointmentID
          }
      })
      fishCount.forEach((fish,index) => {
          if(index > 0){
              totalServiceFee += 200000
              serviceDetails.push({description: `Phí khám thêm cá ${index + 1}`,amount: 200000});
          }
      })
      const serviceDetailsFormat = serviceDetails.map(service => ({
          description: service.description,
          amount: formatCurrency(service.amount)
      }))
      const totalServiceFeeFormat = formatCurrency(totalServiceFee)
      const objectPayment = {
          serviceDetailsFormat,
          totalServiceFeeFormat
      }
     return  res.render("staff/pages/appointment/detail",{
          pageTitle: "Trang Chi Tiết Lịch Hẹn ",
          appoinmentInfo: appoinmentInfo,
          VetID: VetID,
          payCenter: payCenter,
          objectPayment: objectPayment
      })
  }else if(appoinmentInfo.ServiceID == "DV0002" && appoinmentInfo.StatusPaid =="Đã thanh toán" && appoinmentInfo.BillID != null && appoinmentInfo.Process =="Successed"){
      const appointmentPondRecords = await Appointment_PondRecord.findAll({
          raw: true,
          where: {
              AppointmentID: appoinmentInfo.AppointmentID
          }
      });
      const pondRecordIDs = appointmentPondRecords.map(record => record.PondRecordID);
        const pondRecords = await PondRecord.findAll({
          raw: true,
          where: {
            PondRecordID: pondRecordIDs
          }
        })
        const pondProfiles = await PondProfile.findAll({
          raw: true,
          where: {
            PondRecordID: pondRecordIDs
          }
        })
        let totalServiceFee = 1000000;
        let serviceDetails = [
          { description: "Dịch vụ cải thiện môi trường", amount: 1000000 }
      ];
      if(appoinmentInfo.Distance){
        const distance = appoinmentInfo.Distance;
      const baseFee = 100000; // Phí cơ bản cho 10km
      const additionalFee = Math.ceil(distance / 10) * baseFee; 
      serviceDetails.push({ description: `Phí di chuyển`, amount: additionalFee });  
      if(appoinmentInfo.Address != null){
        totalServiceFee += additionalFee;
        // serviceDetails.push({ description: `Phí di chuyển`, amount: 100000 });
      }
      }
      
      pondProfiles.forEach((pond, index) => {
        const volume = parseFloat(pond.Volume);
        if (index > 0) {
            totalServiceFee += 200000; 
            serviceDetails.push({ description: `Phí khám thêm hồ ${index + 1}`, amount: 200000 });
        }
        if (volume >= 1000 && volume <= 1200) {
            totalServiceFee += 200000;
            serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (1000L - 1200L)`, amount: 200000 });
        } else if (volume > 1200 && volume <= 1500) {
            totalServiceFee += 400000;
            serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (1200L - 1500L)`, amount: 400000 });
        } else if (volume > 1500) {
            totalServiceFee += 600000;
            serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (>1500L)`, amount: 600000 });
            }
        });
        const objectPayment = {
          totalFee: formatCurrency(totalServiceFee),
          serviceDetails: serviceDetails.map(detail => ({
              description: detail.description,
              amount: formatCurrency(detail.amount)
              }))
          };
          return res.render("staff/pages/appointment/detail",{
              pageTitle: "Trang Chi Tiết Lịch Hẹn ",
              appoinmentInfo: appoinmentInfo,
              VetID: VetID,
              payCenter: payCenter,
              objectPayment: objectPayment
          })
  }
  res.render("doctor/pages/appointment/detail",{
      pageTitle: "Trang Chi Tiết Lịch Hẹn ",
      appoinmentInfo: appoinmentInfo,
      VetID: VetID,
      payCenter: payCenter
  })
}