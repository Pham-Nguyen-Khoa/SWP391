
const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Bill = require("../../models/bill.model");


// [Get] /admin/dashboard
module.exports.index = async (req, res) => {
//     const query = `SELECT 
//     DATE_FORMAT(appointment.Date, '%Y-%m') AS month,  
//     appointment.ServiceID,                         
//     SUM(bill.Total) AS total_amount                  
// FROM 
//     bill
// JOIN 
//     appointment ON bill.BillID = appointment.BillID  
// GROUP BY 
//     month, appointment.ServiceID;`;

//     const listBills = await Sequelize.query(query);


// const ListService = (listBills,ServiceID) => {
//     const currentMonth = new Date().getMonth() + 1;
//     const result = new Array(12).fill(0);
    
//     listBills.forEach(bill => {
//         if (bill.ServiceID == ServiceID) {
//             const billMonth = new Date(bill.month).getMonth();
//             console.log('month' + billMonth);

//             if (billMonth <= currentMonth) {
//                 result[billMonth] = bill.total_amount;
//             }
//         }
//     });
//     return result.slice(0, currentMonth);
// }
    
//     const listService1 = ListService(listBills[0],'DV0001');
//     const listService2 = ListService(listBills[0],'DV0002');
//     const listService3 = ListService(listBills[0],'DV0003');
    
    res.render("admin/pages/dashboard/index",{
        pageTitle: "Trang tổng quan ",
    })
  }
  
  // [get ] /admin/dashboard/testAPI
  module.exports.testAPI = async (req, res) =>  {
    const queryMonth = `SELECT 
    DATE_FORMAT(appointment.Date, '%Y-%m') AS month,  
    appointment.ServiceID,                         
    SUM(bill.Total) AS total_amount                  
FROM 
    bill
JOIN 
    appointment ON bill.BillID = appointment.BillID  
GROUP BY 
    month, appointment.ServiceID;`;

//     const queryDate = `SELECT 
//     DATE(appointment.Date) AS date,  
//     appointment.ServiceID,                         
//     SUM(bill.Total) AS total_amount                  
// FROM 
//     bill
// JOIN 
//     appointment ON bill.BillID = appointment.BillID  
// WHERE
//     YEAR(appointment.Date) = YEAR(CURDATE()) AND
//     MONTH(appointment.Date) = MONTH(CURDATE())
// GROUP BY 
//     date, appointment.ServiceID
// ORDER BY
//     date ASC, appointment.ServiceID`;


    const billsMonth = await Sequelize.query(queryMonth);
    // const billsDate = await Sequelize.query(queryDate);

const ListServiceMonth = (listBills,ServiceID) => {
    const currentMonth = new Date().getMonth() + 1;
    const result = new Array(12).fill(0);
    
    listBills.forEach(bill => {
        if (bill.ServiceID == ServiceID) {
            const billMonth = new Date(bill.month).getMonth();
            console.log('month' + billMonth);

            if (billMonth <= currentMonth) {
                result[billMonth] = bill.total_amount;
            }
        }
    });
    return result.slice(0, currentMonth);
}
const ListServiceDate = (listBills, ServiceID) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const result = new Array(daysInMonth).fill(0);
    
    listBills.forEach(bill => {
        if (bill.ServiceID == ServiceID) {
            const billDate = new Date(bill.date);
            
            // Check if the bill is from the current month and year
            if (billDate.getFullYear() === currentYear && billDate.getMonth() === currentMonth) {
                const dayOfMonth = billDate.getDate() - 1; 
                result[dayOfMonth] = bill.total_amount;
            }
        }
    });
    
    return result;
}
    
    const month1 = ListServiceMonth(billsMonth[0],'DV0001');
    const month2 = ListServiceMonth(billsMonth[0],'DV0002');
    const month3 = ListServiceMonth(billsMonth[0],'DV0003');
    return res.json({month1, month2, month3});
  }