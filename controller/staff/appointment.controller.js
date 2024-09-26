const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const  Vet = require("../../models/vet.model");
const Appointment = require("../../models/appointment.model");
const Customer = require("../../models/customer.model");
// [Get] /staff/appointment
module.exports.index =  async (req, res) => {
    let queryListAppointment ;
    if(req.query.process == "pending"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.Process = 'Pending'`
    }
    if(req.query.process == "cancelled"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.Process = 'Cancelled'`
    }
    if(req.query.process == "accepted"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.Process = 'Accepted'`
    }
    if(req.query.process == "confirmed"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.Process = 'Confirmed'`
    }
    if(req.query.process == "successed"){
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID where a.Process = 'Successed'`
    }
    if(!req.query.process){
        // queryListAppointment = `SELECT * FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID`
        queryListAppointment = `SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID`
    }
    const [listAppointment] = await Sequelize.query(queryListAppointment);
    const [listAppointmentOrigin] = await Sequelize.query(`SELECT a.*, s.*, c.*, a.Name As NameCustomer FROM appointment a join service s on s.ServiceID = a.ServiceID join customer c on c.CustomerID = a.CustomerID`);
    console.log(listAppointment)
    


    res.render("staff/pages/appointment/index",{
        pageTitle: "Trang Lịch Hẹn ",
        listAppointment: listAppointment,
        listAppointmentOrigin: listAppointmentOrigin
    })
  }
    


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
// [Get] /staff/appointment/detail/:AppointmentID
module.exports.detail =  async (req, res) => {
    const appointmentID = req.params.AppointmentID;
        const queryAppointmentInfo = `SELECT a.*,v.*,s.*,c.* , c.FullName AS CustomerFullName, v.FullName AS VetFullName ,v.Avatar As VetAvatar, a.Address AS AddressAppointment FROM appointment a JOIN service s ON s.ServiceID = a.ServiceID JOIN customer c ON c.CustomerID = a.CustomerID JOIN vet v ON v.VetID = a.VetID WHERE a.AppointmentID = '${appointmentID}'`
    const appoinmentInfo = (await Sequelize.query(queryAppointmentInfo))[0][0];
    appoinmentInfo.Date = formatDate(appoinmentInfo.Date);
    appoinmentInfo.PriceFormat = formatPrice(appoinmentInfo.Price)
    appoinmentInfo.PriceTotalFormat = formatPrice(appoinmentInfo.Price +  (appoinmentInfo.Price * 10/100 ))
    res.render("staff/pages/appointment/detail",{
        pageTitle: "Trang Chi Tiết Lịch Hẹn ",
        appoinmentInfo: appoinmentInfo
    })
  }



// [GET] /staff/appointment/change-process/:AppointmentID?process=?
module.exports.changeProcess =  async (req, res) => {
        const appointmentID = req.params.AppointmentID ; 
        const process = req.query.process;
        if(process){
            if(process == "pending"){
                await Appointment.update({
                    Process: "Confirmed"
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
