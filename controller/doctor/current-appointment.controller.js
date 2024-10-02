const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Vet = require("../../models/vet.model");
const Medicine = require("../../models/medicine.model");
const Appointment = require("../../models/appointment.model");
const PondProfile = require("../../models/pondProfile.model");
const PondRecord = require("../../models/pondRecord.model");
const Prescription = require("../../models/prescription.model");
const Prescription_Medicine = require("../../models/prescription_medicine.model");
const Appointment_PondRecord = require("../../models/appointment_pondrecord.model");
const Bill = require("../../models/bill.model");


const generateUserId = async (table, id, rolePrefix) => {
  const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const maxId = results[0].maxId || 0; 
  const newId = maxId + 1;
  return `${rolePrefix}${String(newId).padStart(4, "0")}`;
}; 



// [Get] /doctor/current-appointment
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; 
  }
module.exports.index = async(req, res) => {
    const currentAppointment = await Appointment.findOne({
        raw: true,
        where: {
            VetID: res.locals.user.VetID,
            Process: "Process"
        }
    })
    if(currentAppointment){
        currentAppointment.DateFormat  = formatDate(currentAppointment.Date);
    }


    if(res.locals.user.Specialization == 'Cải Thiện Môi Trường'){
        res.render("doctor/pages/current-appointment-moitruong/index",{
            pageTitle: "Trang Lịch Hiện Tại",
            currentAppointment: currentAppointment
        })
    }


    if(res.locals.user.Specialization == 'Tư Vấn Online'){
        res.render("doctor/pages/current-appointment-online/index",{
            pageTitle: "Trang Lịch Hiện Tại",
            currentAppointment: currentAppointment
        })
    }


    
  }
// [Post] /doctor/current-appointment
  module.exports.indexPost = async(req, res) => {
    console.log(req.body)
    try {
      const formData = req.body;
      const MedicineData = JSON.parse(formData.selectedMedications);
      const informationData = JSON.parse(formData.previousPageData);
      const paymentData = req.body.paymentMethod;
      const pondCount = req.body.pondCount;
      const pondRecordIDs = [];
      console.log(informationData.length)
      for(let i = 0 ; i < informationData.length ; i++){
        const pond = informationData[i];
        console.log(pond)
        console.log(pond)
        console.log("-----------------------------------------")
        const pondRecordID = await generateUserId("pondrecord", "PondRecordID", "PR");
        pondRecordIDs.push(pondRecordID);
        await PondRecord.create({
            PondRecordID: pondRecordID,
            Problem: pond.Problem,
            Solution: pond.Solution,
            Description: pond.Description
        })
        const PrescriptionID = await generateUserId("prescription", "PrescriptID", "PRES");
        await Prescription.create({
            PrescriptID: PrescriptionID,
            Time: new Date(),
        })
    
    
  
          const pondProfileID = await generateUserId("pondprofile", "PondProfileID", "PP");
          await PondProfile.create({
            PondProfileID: pondProfileID,
            PondRecordID: pondRecordID,
            Volume: pond.Volume,
            Temperature: pond.Temperature,
            pH: pond.pH,
            Oxygen: pond.Oxygen,
            Salt: pond.Salt,
            CO2: pond.CO2,
            Nitrite: pond.Nitrite,
            Nitrate: pond.Nitrate,  
            PrescriptID: PrescriptionID
          });
  
        // console.log("Selected medications:", MedicineData.selectedMedications);
        // const listMedicine = JSON.parse(MedicineData.selectedMedications);
        // for (const medicineId of listMedicine) {
        //   console.log(medicineId)
        //   try {
        //     await Prescription_Medicine.create({
        //       PrescriptID: PrescriptionID,
        //       MedicineID: medicineId,
        //     });
        //   } catch (error) {
        //       console.log(error)
        //   }
        // }
        const pondMedications = MedicineData.find(med => med.pond === i + 1).medications;
        for (const medicineId of pondMedications) {
          await Prescription_Medicine.create({
            PrescriptID: PrescriptionID,
            MedicineID: medicineId,
          });
        }
      }
  
    
    
      const billID = await generateUserId("bill", "BillID", "BILL");
      const method = paymentData == "cash" ? "Tiền mặt" : "Thanh toán online";
      const totalString = req.body.totalFee;
      const totalDouble = parseFloat(totalString.replace(/\./g, ''));
      await Bill.create({
        BillID: billID,
        Method: method,
        Total: totalDouble,
        Status: "Đã thanh toán"
      })

      const appointment = await Appointment.findOne({
        where: {
            VetID: res.locals.user.VetID,
            Process: "Process"
        }
    });

    for (const pondRecordID of pondRecordIDs) {
      await Appointment_PondRecord.create({
          AppointmentID: appointment.AppointmentID,
          PondRecordID: pondRecordID
      });
  }
  await Appointment.update({
    Process: "Successed",
    StatusPaid: "Đã thanh toán",
    BillID: billID
},{
    where: {
        VetID: res.locals.user.VetID,
        Process: "Process"
    }
});
    //   await Appointment.update({
    //     Process: "Successed",
    //     PondRecordID: pondRecordID,
    //     StatusPaid: "Đã thanh toán",
    //     BillID: billID
    //   },{
    //       where: {
    //           VetID: res.locals.user.VetID,
    //           Process: "Process"
    //       }
    //   })
      req.flash("success", "♥ ♥ ♥ Chúc mừng bạn đã hoàn thành công việc ♥ ♥ ♥");
      res.redirect("/doctor/appointment")
    } catch (error) {
      req.flash("error", "Có lỗi xảy ra khi hoàn thành công việc. Vui lòng thử lại.");
      res.redirect("back")
    }
  }


  




  function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
// [Get] /doctor/current-appointment/prescribe-medication
  module.exports.prescribeMedication = async(req, res) => {
    const listMedicine = await Medicine.findAll({
        raw: true,
        where:{
            Type: "Cải thiện môi trường"
        }
    });
    console.log(listMedicine)
    res.render("doctor/pages/current-appointment-moitruong/prescribe-medication",{
        pageTitle: "Trang Kê Đơn Thuốc",
        listMedicine: listMedicine
    })
  }
  
// [Get] /doctor/current-appointment/payment
  module.exports.payment = async(req, res) => {

    const currentAppointment = await Appointment.findOne({
        raw: true,
        where: {
            VetID: res.locals.user.VetID,
            Process: "Process"
        }
    })
    const service = await Service.findOne({
        raw: true,
        where: {
            ServiceID: currentAppointment.ServiceID
        }
    })
    if(service.ServiceID == "DV0002"){
      const paymentData = req.session.paymentData;
      if(!paymentData){
        req.flash('error', 'Không có dữ liệu thanh toán. Vui lòng thử lại.');
        console.log("hello")
      }
      console.log(paymentData)
      const totalFee = paymentData.totalServiceFee;
      const serviceDetails = paymentData.serviceDetails.map(detail => ({
        description: detail.description,
        amount: formatCurrency(detail.amount)
      }));
      console.log(serviceDetails)
      const objectPayment = {
        totalFee: formatCurrency(totalFee),
        serviceDetails: serviceDetails
      }
      return res.render("doctor/pages/current-appointment-moitruong/payment",{
        pageTitle: "Trang Thanh Toán",
        objectPayment: objectPayment
      })
    }
    else{
      const priceService = service.Price;
      const priceShip = 100000;
    const totalFee = priceService + priceShip;
    const objectPayment = {
        priceService: formatCurrency(priceService),
        priceShip: formatCurrency(priceShip),
        totalFee: formatCurrency(totalFee)
    }
    res.render("doctor/pages/current-appointment-moitruong/payment",{
        pageTitle: "Trang Thanh Toán",
        objectPayment: objectPayment
      })
    }
  }
  

// [Post] /doctor/current-appointment/payment
module.exports.paymentPost = async(req, res) => {
  console.log(req.body)
  const informationData = JSON.parse(req.body.previousPageData);
  let totalServiceFee = 1000000;
  let serviceDetails =[
    {description: "Dịch vụ cải thiện môi trường", amount: 1000000}
  ]
  informationData.forEach((pond, index) => {
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
    req.session.paymentData = {
      totalServiceFee,
      serviceDetails,
    };
   
  });
  // console.log(req.body)
  // res.render("doctor/pages/current-appointment-moitruong/payment",{
  //     pageTitle: "Trang Thanh Toán",
  //     objectPayment: objectPayment
  // })
  res.redirect('/doctor/current-appointment/payment');
}
