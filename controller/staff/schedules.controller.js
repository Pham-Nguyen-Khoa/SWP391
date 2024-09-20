const Service = require("../../models/service.model");
const Schedule = require("../../models/schedule.model");
const ShiftDetail = require("../../models/shiftDetail.model");
const Doctor = require("../../models/doctor.model");
const Account = require("../../models/account.model");
const Sequelize = require("../../config/database");
const db = require("../../config/database");

// [Get] /staff/schedules
module.exports.index = async (req, res) => {
  const query =
    "SELECT * FROM doctor JOIN account ON doctor.AccountID = account.id;";
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
      (acc) => acc.AccountID === schedule.AccountID
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

  res.render("staff/pages/schedules/index", {
    pageTitle: "Trang Quản Lý Lịch Làm",
    listDoctor: listDoctor,
    schedules: combinedData,
    slots: slots,
    days: days,
    weeks: weeks,
    weekOffset: weekOffset,
  });
};

const generateUserId = async (table, id, rolePrefix) => {
  const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
  const [results] = await db.query(query);
  const maxId = results[0].maxId || 0; 
  const newId = maxId + 1;
  return `${rolePrefix}${String(newId).padStart(4, "0")}`;
};
// [POST] /staff/schedules/add
// module.exports.addPost = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { accountID, date, shifts } = req.body;
//     if (!accountID || !date) {
//       req.flash("error", "Thiếu thông tin accountID hoặc date!");
//       res.redirect("back");
//       return;
//     }
//     const query = `SELECT * FROM schedule where AccountID = '${accountID}' AND Time ='${date}'`;
//     const [existingSchedule] = await Sequelize.query(query);
//     console.log(existingSchedule);
//     if (existingSchedule.length > 0) {
//       console.log("hello");
//       req.flash("error", "Bác sĩ đã có lịch trong ngày này!");
//       res.redirect("back");
//       return;
//     }
//     console.log("hello");
//     // const query = `SELECT * FROM schedule WHERE AccountID = '${accountID}' AND Time = '${date}'`;
//     // const [existingSchedule] = await Sequelize.query(query);
//     // console.log(existingSchedule);

//     // if (existingSchedule.length > 0) {
//     //   // Kiểm tra xem bác sĩ đã có ca nào trong ngày đó chưa
//     //   const existingScheduleId = existingSchedule[0].ScheduleID;
//     //   const queryShift = `SELECT * FROM shiftdetail WHERE ScheduleID = '${existingScheduleId}' AND Shift IN (${shifts.map(shift => `'${shift}'`).join(", ")})`;
//     //   const [existingShifts] = await Sequelize.query(queryShift);

//     //   if (existingShifts.length > 0) {
//     //     req.flash("error", "Bác sĩ đã có lịch trong một hoặc nhiều ca trong ngày này!");
//     //     res.redirect("back");
//     //     return;
//     //   }
//     const scheduleId = await generateUserId("schedule", "ScheduleID", `SC`);

//     const newSchedule = await Schedule.create({
//       ScheduleID: scheduleId,
//       AccountID: accountID,
//       Time: date,
//     });

//     for (let shift of shifts) {
//       await ShiftDetail.create({
//         ShiftID: await generateUserId("shiftdetail", "ShiftID", "SD"),
//         ScheduleID: newSchedule.ScheduleID,
//         Shift: shift,
//       });
//     }

//     req.flash("success", "Thêm lịch thành công!");
//     res.redirect("back");
//   } catch (error) {
//     console.log("lỗi error: " ,error)
//     req.flash("error", "Có lỗi xảy ra khi thêm lịch!");
//     res.redirect("back");
//   }

// };
module.exports.addPost = async (req, res) => {
  try {
    const { accountID, date, shifts } = req.body;

    // Kiểm tra giá trị accountID và date
    if (!accountID || !date) {
      req.flash("error", "Thiếu thông tin accountID hoặc date!");
      res.redirect("back");
      return;
    }

    // Kiểm tra xem bác sĩ đã có lịch chưa
    const query = `SELECT * FROM schedule WHERE AccountID = '${accountID}' AND Time = '${date}'`;
    const [existingSchedule] = await Sequelize.query(query).catch((error) => {
      console.error("Error querying schedule:", error);
      req.flash("error", "Có lỗi xảy ra khi kiểm tra lịch!");
      res.redirect("back");
      return;
    });

    if (!existingSchedule) return; 

    if (existingSchedule.length > 0) {
      // Kiểm tra xem bác sĩ đã có ca nào trong ngày đó chưa
      const existingScheduleId = existingSchedule[0].ScheduleID;
      const queryShift = `SELECT * FROM shiftdetail WHERE ScheduleID = '${existingScheduleId}' AND Shift IN (${shifts
        .map((shift) => `'${shift}'`)
        .join(", ")})`;
      const [existingShifts] = await Sequelize.query(queryShift).catch(
        (error) => {
          console.error("Error querying shift details:", error);
          req.flash("error", "Có lỗi xảy ra khi kiểm tra chi tiết ca!");
          res.redirect("back");
          return;
        }
      );

      if (!existingShifts) return; 

      if (existingShifts.length > 0) {
        req.flash(
          "error",
          "Bác sĩ đã có lịch trong một hoặc nhiều ca trong ngày này!"
        );
        res.redirect("back");
        return;
      }

      // Thêm các ca mới cho lịch hiện tại
      for (let shift of shifts) {
        await ShiftDetail.create({
          ShiftID: await generateUserId("shiftdetail", "ShiftID", "SD"),
          ScheduleID: existingScheduleId,
          Shift: shift,
        }).catch((error) => {
          console.error("Error creating shift detail:", error);
          req.flash("error", "Có lỗi xảy ra khi thêm chi tiết ca!");
          res.redirect("back");
          return;
        });
      }
    } else {
      // Tạo lịch mới cho bác sĩ chưa có lịch trong ngày đó
      let scheduleId = await generateUserId("schedule", "ScheduleID", `SC`);
      console.log(scheduleId);
      const newSchedule = await Schedule.create({
        ScheduleID: scheduleId,
        AccountID: accountID,
        Time: date,
      }).catch((error) => {
        console.error("Error creating schedule:", error);
        req.flash("error", "Có lỗi xảy ra khi tạo lịch!");
        res.redirect("back");
        return;
      });

      if (!newSchedule) return; 

      for (let shift of shifts) {
        await ShiftDetail.create({
          ShiftID: await generateUserId("shiftdetail", "ShiftID", "SD"),
          ScheduleID: newSchedule.ScheduleID,
          Shift: shift,
        }).catch((error) => {
          console.error("Error creating shift detail:", error);
          req.flash("error", "Có lỗi xảy ra khi thêm chi tiết ca!");
          res.redirect("back");
          return;
        });
      }
    }

    req.flash("success", "Thêm lịch thành công!");
    res.redirect("back");
  } catch (error) {
    console.error("Error adding schedule:", error); 
    req.flash("error", "Có lỗi xảy ra khi thêm lịch!");
    res.redirect("back");
  }
};
