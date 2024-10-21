const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const  Vet = require("../../models/vet.model");
const Appointment = require("../../models/appointment.model");
const Customer = require("../../models/customer.model");
const NodeMailer = require("../../helpers/nodemailer");
const KoiRecord = require("../../models/koiRecord.model");
const Bill = require("../../models/bill.model");
const Appointment_PondRecord = require("../../models/appointment_pondrecord.model");
const PondRecord = require("../../models/pondRecord.model");
const PondProfile = require("../../models/pondProfile.model");


// [Get] /staff/appointment
module.exports.index =  async (req, res) => {
    let queryListAppointment ;
    if(req.query.process == "pending"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name AS NameCustomer, v.FullName AS NameVet ,a.Address As AdressAppointment
                                FROM appointment a 
                                LEFT JOIN service s ON s.ServiceID = a.ServiceID 
                                LEFT JOIN customer c ON c.CustomerID = a.CustomerID 
                                LEFT JOIN vet v ON v.VetID = a.VetID where a.Process = 'Pending'`
    }
    if(req.query.process == "cancelled"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name AS NameCustomer, v.FullName AS NameVet ,a.Address As AdressAppointment
                                FROM appointment a 
                                LEFT JOIN service s ON s.ServiceID = a.ServiceID 
                                LEFT JOIN customer c ON c.CustomerID = a.CustomerID 
                                LEFT JOIN vet v ON v.VetID = a.VetID where a.Process = 'Cancelled'`
    }
    if(req.query.process == "accepted"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name AS NameCustomer, v.FullName AS NameVet ,a.Address As AdressAppointment
                                FROM appointment a 
                                LEFT JOIN service s ON s.ServiceID = a.ServiceID 
                                LEFT JOIN customer c ON c.CustomerID = a.CustomerID 
                                LEFT JOIN vet v ON v.VetID = a.VetID where a.Process = 'Accepted'`
    }
    if(req.query.process == "ready"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name AS NameCustomer, v.FullName AS NameVet ,a.Address As AdressAppointment
                                FROM appointment a 
                                LEFT JOIN service s ON s.ServiceID = a.ServiceID 
                                LEFT JOIN customer c ON c.CustomerID = a.CustomerID 
                                LEFT JOIN vet v ON v.VetID = a.VetID where a.Process = 'Ready'`
    }
    if(req.query.process == "successed"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name AS NameCustomer, v.FullName AS NameVet ,a.Address As AdressAppointment
                                FROM appointment a 
                                LEFT JOIN service s ON s.ServiceID = a.ServiceID 
                                LEFT JOIN customer c ON c.CustomerID = a.CustomerID 
                                LEFT JOIN vet v ON v.VetID = a.VetID where a.Process = 'Successed'`
    }
    if(req.query.process == "process"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name AS NameCustomer, v.FullName AS NameVet ,a.Address As AdressAppointment
                                FROM appointment a 
                                LEFT JOIN service s ON s.ServiceID = a.ServiceID 
                                LEFT JOIN customer c ON c.CustomerID = a.CustomerID 
                                LEFT JOIN vet v ON v.VetID = a.VetID where a.Process = 'Process'`
    }
   
    if(!req.query.process){
        // queryListAppointment = `SELECT * FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID`
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name AS NameCustomer, v.FullName AS NameVet ,a.Address As AdressAppointment
                                FROM appointment a 
                                LEFT JOIN service s ON s.ServiceID = a.ServiceID 
                                LEFT JOIN customer c ON c.CustomerID = a.CustomerID 
                                LEFT JOIN vet v ON v.VetID = a.VetID`
    }
    // if(req.query.date){
    //     queryListAppointment += ` where a.Date = '${req.query.date}'`;
    //   }
    // if(req.query.searchName && req.query.date ){
    //     queryListAppointment += ` and a.Name Like '%${req.query.searchName}%'`;
    // }
    // if(req.query.services){
    //     queryListAppointment += ` where a.ServiceID = '${req.query.services}'`;
    // }

    // if(req.query.sort){
    //     queryListAppointment += ` ORDER BY a.Date ${req.query.sort}`;
    // }
    // Filter by date
    let conditions = [];
if (req.query.date) {
    conditions.push(`a.Date = '${req.query.date}'`);
  }
  
  if (req.query.searchName) {
    conditions.push(`a.Name LIKE '%${req.query.searchName}%'`);
  }

  if (req.query.services) {
    conditions.push(`a.ServiceID = '${req.query.services}'`);
  }
  

  if (conditions.length > 0) {
    queryListAppointment += ' WHERE ' + conditions.join(' AND ');
  }
  

  if (req.query.sort) {
    queryListAppointment += ` ORDER BY a.Date ${req.query.sort}`;
  }
    
  
    const [listAppointment] = await Sequelize.query(queryListAppointment);
    const [listAppointmentOrigin] = await Sequelize.query(`SELECT a.*, s.*, c.*, a.Name As NameCustomer,a.Address As AdressAppointment FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID`);
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
            } else if (req.query.searchName) {
                filterType = 'search';
            }else if (req.query.process) {
                filterType = 'process';
            }
         
    res.render("staff/pages/appointment/index",{
        pageTitle: "Trang Lịch Hẹn ",
        listAppointment: listAppointment,
        listAppointmentOrigin: listAppointmentOrigin,
        date: req.query.date,
        dateFormat: dateFormat,
        sort: req.query.sort,
        filterType: filterType,
        searchName: req.query.searchName,
        processFilter: req.query.process
    })
  }
    

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
// function formatPrice(amount) {
//     return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"; 
// }
function formatPrice(price) {
    const [integerPart, decimalPart] = price.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedPrice = decimalPart
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
    return `${formattedPrice}đ`;
  }
// [Get] /staff/appointment/detail/:AppointmentID
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
    res.render("staff/pages/appointment/detail",{
        pageTitle: "Trang Chi Tiết Lịch Hẹn ",
        appoinmentInfo: appoinmentInfo,
        VetID: VetID,
        payCenter: payCenter
    })
  }



// [GET] /staff/appointment/change-process/:AppointmentID?process=?
module.exports.changeProcess =  async (req, res) => {
        const appointmentID = req.params.AppointmentID ; 
        const process = req.query.process;
        if(process){
            if(process == "pending"){
                await Appointment.update({
                    Process: "Accepted"
                },{
                    where:{
                        AppointmentID: appointmentID
                    }
                })
            }else if(process == "accepted"){
                await Appointment.update({
                    Process: "Ready"
                },{
                    where:{
                        AppointmentID: appointmentID
                    }
                })
            }else if(process == "process"){
                await Appointment.update({
                    Process: "Process"
                },{
                    where:{
                        AppointmentID: appointmentID
                    }
                })
            }
        }
        req.flash("success","Chuyển trạng thái thành công! ");
        res.redirect("back");
  }


// [GET] /staff/appointment/load-vets/:AppointmentID
module.exports.loadVets = async (req, res) => {
    const appointmentID = req.params.AppointmentID;
    const date = req.query.date;
    const time = req.query.time;
    const specialization = req.query.specialization;

    const availableVetsQuery = `
    SELECT DISTINCT v.VetID, v.FullName, v.Avatar
    FROM vet v
    JOIN schedule s ON v.VetID = s.VetID
    JOIN shiftdetail sd ON s.ScheduleID = sd.ScheduleID
    WHERE s.Time = '${date}' AND sd.Shift = '${time}' AND sd.AppointmentID IS NULL AND v.Specialization = '${specialization}'
`;
const [availableVets] = await Sequelize.query(availableVetsQuery);
    const listDoctor = await Vet.findAll({
        raw: true
    });

    const allShiftsQuery = `
    SELECT v.VetID, v.FullName, sd.Shift, sd.AppointmentID
    FROM vet v
    JOIN schedule s ON v.VetID = s.VetID
    JOIN shiftdetail sd ON s.ScheduleID = sd.ScheduleID
    WHERE s.Time = '${date}'
`;

    const [allShifts] = await Sequelize.query(allShiftsQuery);
    const vetShifts = allShifts.reduce((acc, shift) => {
        if (!acc[shift.VetID]) {
            acc[shift.VetID] = [];
        }
        acc[shift.VetID].push({
            shift: shift.Shift,
            isAvailable: shift.AppointmentID === null
        });
        return acc;
    }, {});
    const dataFormat = formatDate(date);
    res.render('staff/pages/appointment/assign-vet', {
        pageTitle: "Gán Bác Sĩ Cho Lịch Hẹn",
        appointmentID,
        dataFormat,
        time,
        availableVets,
        vetShifts
    });
}


// [GET] /staff/appointment/assign/:AppointmentID/:VetID
module.exports.assignVet = async (req, res) => {
   try {
    const appointmentID = req.params.AppointmentID;
    const vetID = req.params.VetID;
    await Appointment.update({
        VetID: vetID,
        Process: "Ready"
    },{
        where:{
            AppointmentID: appointmentID
        }
    })

    const appointment = await Appointment.findOne({
        where:{
            AppointmentID: appointmentID
        }
    })
    const appointmentDate = appointment.Date;
    const appointmentTime = appointment.Shift;
    const scheduleQuery = `
      SELECT * FROM schedule
      WHERE VetID = '${vetID}' AND Time = '${appointmentDate}'
      LIMIT 1
    `;
    const [schedule] = await Sequelize.query(scheduleQuery);
    if (!schedule) {
        throw new Error('Không tìm thấy lịch phù hợp');
    }
    await ShiftDetail.update(
        { AppointmentID: appointmentID },
        {
            where: {
                ScheduleID: schedule[0].ScheduleID,
                Shift: appointmentTime
            }
        }
    );
    const queryEmail = `SELECT ac.Email from appointment a Join customer c on c.CustomerID = a.CustomerID Join account1 ac on ac.AccountID = c.AccountID where a.AppointmentID ='${appointmentID}'`
    const [email] = await Sequelize.query(queryEmail);
    const doctorInfo = await Vet.findOne({
      raw: true,
      where: {
        VetID: vetID,
      },
    });
    const formatDateAppointment = formatDate(appointment.Date);
    if(appointment.ServiceID == "DV0003"){
        NodeMailer.sendMail(
            `${email[0].Email}`,
            "Thông báo đặt lịch thành công",
            "Bạn đã đặt lịch thành công với bác sĩ " + doctorInfo.FullName + " vào ngày " + formatDateAppointment + " vào lúc " + appointment.Shift + ". " +
            "Vào thời gian hẹn khách hàng hãy vào đường link Google Meet này để được bác sĩ tư vấn nhé: " + doctorInfo.GoogleMeet
        );
    }else if(appointment.ServiceID == "DV0002"){
      NodeMailer.sendMail(
        `${email[0].Email}`,
      "Thông báo đặt lịch thành công",
      "Bạn đã đặt lịch thành công với bác sĩ " + doctorInfo.FullName + " vào ngày " + formatDateAppointment + " vào lúc " + appointment.Shift + ". " +
       "Vào thời gian hẹn, bác sĩ sẽ đến địa chỉ của bạn để làm việc. Bạn hãy lưu ý nhé!" 
      );
    }
    
    req.flash("success", "Đã gán bác sĩ và cập nhật lịch thành công!");
    res.redirect(`/staff/appointment`);
   } catch (error) {
    req.flash("error", "Có lỗi xảy ra khi gán bác sĩ. Vui lòng thử lại.");
    res.redirect(`/staff/appointment`);
    
   }
}




// [Get] /staff/appointment/delete/:AppointmentID
module.exports.delete =  async (req, res) => {
   try {
    const appointmentID = req.params.AppointmentID  ;
   console.log(appointmentID)
   
   await ShiftDetail.update({
    AppointmentID: null
},{
    where:{
        AppointmentID: appointmentID
    }
})


    await Appointment.destroy({
        
        where:{
            AppointmentID: appointmentID
        }
    })
   
    req.flash("success", "Đã xóa lịch hẹn thành công!");
    res.redirect("back");
   } catch (error) {
    req.flash("error", "Có lỗi xảy ra khi xóa lịch hẹn. Vui lòng thử lại.");
    res.redirect("back");
   }
  }



// [GET] /staff/appointment/paymentCenter/:AppointmentID
module.exports.paymentCenter =  async (req, res) => {
    const appointmentID = req.params.AppointmentID;
    // console.log(appointmentID)
    // const appointmentPay = await Appointment.findOne({
    //     raw: true,
    //     where:{
    //         AppointmentID: appointmentID
    //     }
    // })
    let totalServiceFee = 1500000;
    let serviceDetails =[
      {description: "Dịch vụ khám sức khỏe", amount: 1500000}
    ]
   

    
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
    console.log(objectPayment)
    // console.log(serviceDetails)
    // console.log(fishCount.length)
    // console.log(totalServiceFee)

    res.render("staff/pages/appointment/paymentCenter",{
        pageTitle: "Trang Thanh Toán",
        objectPayment: objectPayment,
        appointmentID: appointmentID

    })
}




// [POST] /staff/appointment/paymentCenter/:AppointmentID
module.exports.paymentCenterPost =  async (req, res) => {
    const appointmentID = req.params.AppointmentID;
    const billID = await generateUserId("bill","BillID","BILL");
    const methodPay = (req.body.paymentMethod == "tranfer" ? "Thanh toán online" : "Tiền mặt" );
    const objectPaymentJS = JSON.parse(req.body.objectPayment)
    const totalFeeSplit = objectPaymentJS.totalServiceFeeFormat.split(".");
    let totalFee ="";
    totalFeeSplit.forEach((item) => {
        totalFee += item;
    });
    const totalFeeFormat = parseInt(totalFee);

    await Bill.create({
        BillID: billID,
        Method: methodPay,
        Total: totalFeeFormat,
        Status: "Đã thanh toán"
    })
    await Appointment.update({
        BillID: billID,
        Process: "Successed",
        StatusPaid: "Đã thanh toán",
        
    },{
        where:{
            AppointmentID: appointmentID
        }
    })
   

    req.flash("success", "♥ ♥ ♥ Chúc mừng bạn đã hoàn thành công việc ♥ ♥ ♥");
    res.redirect("/staff/appointment")
}
 