const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Vet = require("../../models/vet.model");
const Appointment = require("../../models/appointment.model");
const Customer = require("../../models/customer.model");
const Feedback = require("../../models/feedback.model");


function shiftToNumber(shift) {
    switch(shift) {
      case '7h-9h': return 1;
      case '9h-11h': return 2;
      case '13h-15h': return 3;
      case '15h-17h': return 4;
      default: return 5; // Để xử lý các trường hợp không mong muốn
    }
  }

// [Get] /doctor/dashboard
module.exports.index = async (req, res) => {
    // const queryFeedback = `SELECT * FROM feedback where VetID = ${res.locals.user.VetID}`;
    // const [feedbacks] = await Sequelize.query(queryFeedback);
    // console.log(feedbacks);

    const queryAppointmentTotal = `SELECT * FROM appointment where VetID = '${res.locals.user.VetID}'`;
    const [appointmentsTotal] = await Sequelize.query(queryAppointmentTotal);

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const queryAppointmentToday = `SELECT * FROM appointment join customer c on appointment.CustomerID = c.CustomerID join account1 a on c.AccountID = a.AccountID where VetID = '${res.locals.user.VetID}'  AND Date = '${formattedDate}' And Process != 'Pending'`;
    const [appointmentsToday] = await Sequelize.query(queryAppointmentToday);

   
    let limit = 2;
    appointmentsToday.sort((a, b) => {
        return shiftToNumber(a.Shift) - shiftToNumber(b.Shift);
      }); 
      let queryFeedBack = `
      SELECT *
      FROM appointment a 
      JOIN feedback f ON a.AppointmentID = f.AppointmentID 
      JOIN customer c ON a.CustomerID = c.CustomerID
      WHERE a.VetID = '${res.locals.user.VetID}'
      ORDER BY a.Date DESC, f.FeedbackID DESCLIMIT ${limit}
    `;
    const [feedbacksNew] = await Sequelize.query(queryFeedBack);
    feedbacks.forEach(feedback => {
      const date = new Date(feedback.Date);
      feedback.FormattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  });


    res.render("doctor/pages/dashboard/index",{
        pageTitle: "Trang tổng quan ",
        appointmentsTotal: appointmentsTotal.length,
        appointmentsToday: appointmentsToday,
        listFeedback: feedbacksNew,
        allFeedback: feedbacks,
        star: star,
        limit: limit,
        appointmentData: appointmentsTotal,
        appointmentDataMonthCount: appointmentDataMonthCount,
        appointmentsToday: appointmentsToday
    })
  }