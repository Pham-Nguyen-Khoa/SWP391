const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Vet = require("../../models/vet.model");
const Appointment = require("../../models/appointment.model");
const Customer = require("../../models/customer.model");
const Medicine = require("../../models/medicine.model");
const PondProfile = require("../../models/pondProfile.model");
const PondRecord = require("../../models/pondRecord.model");
const Prescription = require("../../models/prescription.model");
const Prescription_Medicine = require("../../models/prescription_medicine.model");
const Bill = require("../../models/bill.model");
const Appointment_PondRecord = require("../../models/appointment_pondrecord.model");
const FishRecord = require("../../models/koiRecord.model");
const FishProfile = require("../../models/koiProfile.model");
const PondSetting = require("../../models/pondSetting.model");
const Feedback = require("../../models/feedback.model");


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; 
}
// [GET] localhost:/koi/my-appointment/
module.exports.index = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 5;
  let skip = (page-1)*limit;
  const userInfo = res.locals.userInfo;
  console.log(userInfo);
  if( userInfo.RoleID != "RL0004"){
    res.redirect("/auth/login");
    return;
  }
  let listAppointment = await Appointment.findAll({
    raw: true, 
    where: {
      CustomerID: userInfo.CustomerID
    },
    order: [['Date', 'DESC']]
  })
  listAppointment.forEach((item) => {
    item.DateFormat = formatDate(item.Date);
  })
  const totalAppointment = listAppointment.length;
  const totalPages = Math.ceil(totalAppointment / limit);
  listAppointment = listAppointment.slice(skip, skip + limit);
  console.log(listAppointment);
    res.render("client/pages/my-appointment/index.pug", {
      pageTitle: "Đơn Hàng Của Bạn",
      listAppointment: listAppointment,
      totalPages: totalPages,
      currentPage: page
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
  function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}
  // [GET] localhost:/koi/my-appointment/detail/:AppointmentID
module.exports.detail = async (req, res) => {
        const appointmentID = req.params.AppointmentID;
        const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , a.Name AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`;
        const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
        
        if(appoinmentInfo == null){
          res.redirect("/koi/my-appointment");
          return;
        }
        let feedBack = ""
        if(appoinmentInfo.Process == "Successed"){
           feedBack = await Feedback.findOne({
            raw: true,
            where:{
              AppointmentID: appointmentID
            }
          })
        }
       
        
        appoinmentInfo.Date = formatDate(appoinmentInfo.Date);
        appoinmentInfo.PriceFormat = formatPrice(appoinmentInfo.Price);
        appoinmentInfo.PriceTotalFormat = formatPrice(
          appoinmentInfo.Price + (appoinmentInfo.Price * 10) / 100
        );
      // Cải thiện môi trường
  if(appoinmentInfo.Name == "Cải Thiện Môi Trường"){
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


          // if (index > 0) {
          //   totalServiceFee += 200000; 
          //   serviceDetails.push({ description: `Phí khám thêm hồ ${index + 1}`, amount: 200000 });
          // }
          // if (volume >= 1000 && volume <= 1200) {
          //   totalServiceFee += 200000;
          //   serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (1000L - 1200L)`, amount: 200000 });
          // } else if (volume > 1200 && volume <= 1500) {
          //   totalServiceFee += 400000;
          //   serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (1200L - 1500L)`, amount: 400000 });
          // } else if (volume > 1500) {
          //   totalServiceFee += 600000;
          //   serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (>1500L)`, amount: 600000 });
          // }
          const objectPayment = {
            totalFee: formatCurrency(totalServiceFee),
            serviceDetails: serviceDetails.map(detail => ({
                description: detail.description,
                amount: formatCurrency(detail.amount)
                }))
            };
            

              res.render("client/pages/my-appointment/detail-enviroment", {
                pageTitle: "Trang Chi Tiết Đơn Hàng",
                appoinmentInfo: appoinmentInfo,
                objectPayment: objectPayment,
                feedBack: feedBack


              });
              return;
                // End Cải thiện môi trường
        }else if(appoinmentInfo.Name == "Khám Sức Khỏe"){
          const FishIDs = await FishRecord.findAll({
            raw: true,
            where: {
                AppointmentID: appoinmentInfo.AppointmentID
            }
        });
        const KoiIDs = FishIDs.map(id => id.KoiID);
          // const fishRecords = await FishRecord.findAll({
          //   raw: true,
          //   where: {
          //     PondRecordID: pondRecordIDs
          //   }
          // })
          const fishProfiles = await FishProfile.findAll({
            raw: true,
            where: {
              KoiID: KoiIDs
            }
          })
          console.log(fishProfiles)
          let totalServiceFee = 1500000;
          let serviceDetails = [
            { description: "Dịch vụ khám sức khỏe", amount: 1500000 }
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
      
        fishProfiles.forEach((fish, index) => {
          if(index > 0){
            totalServiceFee += 200000;
            serviceDetails.push({ description: `Phí khám thêm cá ${index + 1}`, amount: 200000 });
          }
        })
        // pondProfiles.forEach((pond, index) => {
        //   const volume = parseFloat(pond.Volume);
        //   if (index > 0) {
        //       totalServiceFee += 200000; 
        //       serviceDetails.push({ description: `Phí khám thêm hồ ${index + 1}`, amount: 200000 });
        //   }
        //   if (volume >= 1000 && volume <= 1200) {
        //       totalServiceFee += 200000;
        //       serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (1000L - 1200L)`, amount: 200000 });
        //   } else if (volume > 1200 && volume <= 1500) {
        //       totalServiceFee += 400000;
        //       serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (1200L - 1500L)`, amount: 400000 });
        //   } else if (volume > 1500) {
        //       totalServiceFee += 600000;
        //       serviceDetails.push({ description: `Phí dịch vụ cho hồ ${index + 1} (>1500L)`, amount: 600000 });
        //       }
        //   });
          const objectPayment = {
            totalFee: formatCurrency(totalServiceFee),
            serviceDetails: serviceDetails.map(detail => ({
                description: detail.description,
                amount: formatCurrency(detail.amount)
                }))
            };
            console.log(objectPayment)
              res.render("client/pages/my-appointment/detail-healthyFish", {
                pageTitle: "Trang Chi Tiết Đơn Hàng",
                appoinmentInfo: appoinmentInfo,
                objectPayment: objectPayment,
                feedBack: feedBack

              });
              return;
            }



  // Tư vấn Online
    res.render("client/pages/my-appointment/detail", {
      pageTitle: "Trang Chi Tiết Đơn Hàng",
      appoinmentInfo: appoinmentInfo,
      feedBack: feedBack
    });


  };
  
  //koi/my-appointment/detail/prescription/:AppointmentID
  module.exports.detailPrescription = async (req, res) => {
    const appointmentID = req.params.AppointmentID;
    const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , a.Name AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`;
    const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
   
    const appointmentPondRecords = await Appointment_PondRecord.findAll({
      raw: true,
      where: {
          AppointmentID: appoinmentInfo.AppointmentID
      }
  });
  if(appoinmentInfo.Name == "Khám Sức Khỏe"){
    const koiRecords = await FishRecord.findAll({
      raw: true,
      where: {
          AppointmentID: appoinmentInfo.AppointmentID
      }
  });
  const koiIDs = koiRecords.map(record => record.KoiID);
  const koiProfiles = await FishProfile.findAll({
    raw: true,
    where: {
      KoiID: koiIDs
    }
  });
  console.log(koiProfiles);
  const prescriptions = await Promise.all(koiProfiles.map(async (koiProfile) => {
    const queryMedicine = `SELECT m.*, pm.MorningUse, pm.AfternoonUse, pm.EveningUse, pm.Quantity FROM prescription_medicine pm JOIN medicine m ON m.MedicineID = pm.MedicineID WHERE pm.PrescriptID = '${koiProfile.PrescriptID}'`;
    const listMedicine = (await Sequelize.query(queryMedicine))[0];
    return {
      koiProfile,
      listMedicine: listMedicine.map(medicine => ({
        ...medicine,
        // QuantityMorning: medicine.MorningUse,
        // QuantityNoon: medicine.AfternoonUse,
        // QuantityEvening: medicine.EveningUse
      }))
    };
  }));
  console.log(prescriptions[0].listMedicine);
  const vetInfo = await Vet.findOne({
    raw: true,
    where: {
      VetID: appoinmentInfo.VetID
    }
  });
  console.log(prescriptions);
  res.render("client/pages/my-appointment/detail-healthyFish-prescription", {
    pageTitle: "Trang Chi Tiết Đơn Thuốc",
    appoinmentInfo: appoinmentInfo,
    prescriptions: prescriptions,
    vetInfo: vetInfo
  });
  return;
}
  const pondRecordIDs = appointmentPondRecords.map(record => record.PondRecordID);
  const pondRecords = await PondRecord.findAll({
    raw: true,
    where: {
      PondRecordID: pondRecordIDs
    }
  });
  const pondProfiles = await PondProfile.findAll({
    raw: true,
    where: {
      PondRecordID: pondRecordIDs
    }
  });     
  const vetInfo = await Vet.findOne({
    raw: true,
    where: {
      VetID: appoinmentInfo.VetID
    }
  });
  


  const prescriptions = await Promise.all(pondProfiles.map(async (pondProfile) => {
    const queryMedicine = `SELECT m.*, pm.MorningUse, pm.AfternoonUse, pm.EveningUse, pm.Quantity FROM prescription_medicine pm JOIN medicine m ON m.MedicineID = pm.MedicineID WHERE pm.PrescriptID = '${pondProfile.PrescriptID}'`;
    const listMedicine = (await Sequelize.query(queryMedicine))[0];
    return {
      pondProfile,
      listMedicine: listMedicine.map(medicine => ({
        ...medicine,
        QuantityMorning: medicine.QuantityMorning,
        QuantityNoon: medicine.QuantityNoon,
        QuantityEvening: medicine.QuantityEvening
      }))
    };
  }));

  res.render("client/pages/my-appointment/detail-enviroment-prescription", {
    pageTitle: "Trang Chi Tiết Đơn Thuốc",
    appoinmentInfo: appoinmentInfo,
    prescriptions: prescriptions,
    vetInfo: vetInfo
  });

  };



  // [GET] koi/my-appointment/detail/pond/:AppointmentID
module.exports.detailPond = async (req, res) => {
  const appointmentID = req.params.AppointmentID;
  const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , a.Name AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`;
  const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
  console.log(appoinmentInfo);
  if(appoinmentInfo.Name == "Khám Sức Khỏe"){
    const koiRecords = await FishRecord.findAll({
      raw: true,
      where: {
          AppointmentID: appoinmentInfo.AppointmentID
      }
  });
  const koiIDs = koiRecords.map(record => record.KoiID);
  const koiProfiles = await FishProfile.findAll({
    raw: true,
    where: {
      KoiID: koiIDs
    }
  });
    return  res.render("client/pages/my-appointment/detail-healthyFish-fish", {
      pageTitle: "Trang Chi Tiết Cá",
      appoinmentInfo: appoinmentInfo,
      koiProfiles: koiProfiles
    });
  }

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
  });

  const pondProfiles = await PondProfile.findAll({
    raw: true,
    where: {
      PondRecordID: pondRecordIDs
    }
  });

  const pondSettings = await PondSetting.findAll({
      raw: true
  })

  console.log(pondSettings);  
  res.render("client/pages/my-appointment/detail-enviroment-pond", {
    pageTitle: "Trang Thông Số Hồ",
    appoinmentInfo: appoinmentInfo,
    pondProfiles: pondProfiles,
    pondSettings: pondSettings
  });
}

module.exports.detailAdvice = async (req, res) => {
  const appointmentID = req.params.AppointmentID;
  const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , a.Name AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`;
  const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
  
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
  });

  console.log(pondRecords);
  res.render("client/pages/my-appointment/detail-enviroment-advice", {
    pageTitle: "Trang Tình Trạng Hồ",
    appoinmentInfo: appoinmentInfo,
    pondRecords: pondRecords
  });
}




const generateUserId = async (rolePrefix, table, id) => {
  const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const maxId = results[0].maxId || 0;
  const newId = maxId + 1;
  return `${rolePrefix}${String(newId).padStart(4, "0")}`;
};

// [POST] koi/my-appointment/feedback/:AppointmentID

module.exports.feedBack = async (req, res) => {
    const appointmentID = req.params.AppointmentID;
    const star = req.body.starSelect;
    const accountID = req.body.accountID;
    const comment = req.body.comment;
    const existedFeedBack = await Feedback.findOne({
      raw: true,
      where: {
        AppointmentID: appointmentID
      }
    })
    if(existedFeedBack){
      await Feedback.update({
        Content: comment,
        Star: star,
        Time: new Date()
      },{
        where:{
          AppointmentID: appointmentID
        }
      })
      req.flash("success","🩵🩵🩵 Đánh giá của bạn đã được cập nhật 🩵🩵🩵")
      res.redirect("back")
    }else{
      const FeedBackID = await generateUserId("FB","feedback","FeedBackID");
      await Feedback.create({
        FeedBackID: FeedBackID,
        AccountID: accountID,
        AppointmentID: appointmentID,
        Content: comment,
        Star: star,
        Time: new Date()
      })
      req.flash("success","🩵🩵🩵 Cảm ơn bạn đã đánh giá dịch vụ chúng tôi 🩵🩵🩵")
      res.redirect("back")
    }

  
    
}

