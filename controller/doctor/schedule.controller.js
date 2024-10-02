const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Sequelize = require("../../config/database");
const db = require("../../config/database");


// [Get] /doctor/schedule
module.exports.index = async (req, res) => {
    const query =
      "Select * From account1 JOIN  vet on vet.AccountID = account1.AccountID where account1.Deleted = 0";
    const [listDoctor] = await Sequelize.query(query);
    const querySchedule = `SELECT * FROM schedule `;
    const [schedules] = await Sequelize.query(querySchedule);
    const queryShiftDetails = `SELECT * FROM shiftdetail`;
    const [shiftDetails] = await Sequelize.query(queryShiftDetails);
  
  
    
    const weekOffset = parseInt(req.query.weekOffset) || 0;
  
  
    const getDaysOfWeek = (offset) => {
      const startOfWeek = new Date();
      startOfWeek.setDate(
        startOfWeek.getDate() - startOfWeek.getDay() + 1 + offset * 7
      ); 
  
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push({
          name: date.toLocaleDateString("en-US", { weekday: "short" }), 
          date: date.toISOString().split("T")[0], 
        });
      }
      return days;
    };
  
    const days = getDaysOfWeek(weekOffset);
    const weeks = [
      { value: 0, label: "Tuần Này" },
      { value: 1, label: "Tuần Sau" },
      { value: -1, label: "Tuần Trước" },
    ];
  
    const combinedData = schedules.map((schedule) => {
      const account = listDoctor.find(
        (acc) => acc.VetID === schedule.VetID
      );
  
      const shifts = shiftDetails.filter(
        (shift) => shift.ScheduleID === schedule.ScheduleID
      );
  
      return {
        ...schedule,
        account,
        shifts,
      };
    });
  
   
  
    const slots = ["7h-9h", "9h-11h", "13h-15h", "15h-17h"]; 
  
    const  listServices = await Service.findAll({
      raw: true
    })
  
  
    res.render("doctor/pages/schedule/index", {
      pageTitle: "Trang Lịch Làm Việc",
      listDoctor: listDoctor,
      schedules: combinedData,
      slots: slots,
      days: days,
      weeks: weeks,
      weekOffset: weekOffset,
      listServices: listServices
    });
  };