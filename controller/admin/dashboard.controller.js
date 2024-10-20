
const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Bill = require("../../models/bill.model");


// [Get] /admin/dashboard
module.exports.index = async (req, res) => {

    
    res.render("admin/pages/dashboard/index",{
        pageTitle: "Trang tổng quan ",
    })
  }
  
  // [get ] /admin/dashboard/testAPI
  module.exports.testAPI = async (req, res) =>  {
    const queryMonth = `SELECT 
    DATE_FORMAT(appointment.Date, '%Y-%m') AS month,  
    appointment.ServiceID,                         
    SUM(bill.Total) AS total_amount, 
    COUNT(bill.BillID) AS total_orders 
FROM 
    bill
JOIN 
    appointment ON bill.BillID = appointment.BillID  
GROUP BY 
    month, appointment.ServiceID;`;

const queryDate = `SELECT 
    DATE(appointment.Date) AS date,  
    appointment.ServiceID,                         
    SUM(bill.Total) AS total_amount, 
    COUNT(bill.BillID) AS total_orders
FROM 
    bill
JOIN 
    appointment ON bill.BillID = appointment.BillID  
WHERE
    YEAR(appointment.Date) = YEAR(CURDATE()) AND
    MONTH(appointment.Date) = MONTH(CURDATE())
GROUP BY 
    date, appointment.ServiceID
ORDER BY
    date ASC, appointment.ServiceID`;



    const billsMonth = await Sequelize.query(queryMonth);
    const billsDate = await Sequelize.query(queryDate);

    const ListServiceDate = (listBills, ServiceID) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
        let totalAmount = new Array(daysInMonth).fill(0); // Tổng doanh thu mỗi ngày
        let totalOrders = new Array(daysInMonth).fill(0); // Tổng đơn hàng mỗi ngày
    
        listBills.forEach(bill => {
            if (bill.ServiceID === ServiceID) {
                const billDate = new Date(bill.date);
                if (billDate.getFullYear() === currentYear && billDate.getMonth() === currentMonth) {
                    const dayOfMonth = billDate.getDate() - 1;
                    totalAmount[dayOfMonth] += bill.total_amount;
                    totalOrders[dayOfMonth] += 1; // Đếm số đơn hàng
                }
            }
        });
        totalAmount = totalAmount.slice(0, new Date().getDate());
        totalOrders = totalOrders.slice(0, new Date().getDate());
        return { totalAmount, totalOrders };
    };
    
    
    const ListServiceMonth = (listBills, ServiceID) => {
        const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại
        let totalAmount = new Array(12).fill(0); // Tổng doanh thu mỗi tháng
        let totalOrders = new Array(12).fill(0); // Tổng đơn hàng mỗi tháng
    
        listBills.forEach(bill => {
            if (bill.ServiceID === ServiceID) {
                const billMonth = new Date(bill.month).getMonth();
                if (billMonth <= currentMonth) {
                    totalAmount[billMonth] += bill.total_amount;
                    totalOrders[billMonth] += 1; // Đếm số đơn hàng
                }
            }
        });
        totalAmount = totalAmount.slice(0,currentMonth);
        totalOrders = totalOrders.slice(0,currentMonth);

        return { totalAmount, totalOrders };
    };
    

    
    const TotalDate = (listBills) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
        let totalAmount = new Array(daysInMonth).fill(0);
        let totalOrders = new Array(daysInMonth).fill(0);
    
        listBills.forEach(bill => {
            const billDate = new Date(bill.date);
            if (billDate.getFullYear() === currentYear && billDate.getMonth() === currentMonth) {
                const dayOfMonth = billDate.getDate() - 1;
                totalAmount[dayOfMonth] += bill.total_amount;
                totalOrders[dayOfMonth] += 1;
            }
        });
        totalAmount = totalAmount.slice(0, new Date().getDate());
        totalOrders = totalOrders.slice(0, new Date().getDate());
        return { totalAmount, totalOrders };
    };
    
    
    const TotalMonth = (listBills) => {
        const currentMonth = new Date().getMonth() + 1;
        let totalAmount = new Array(12).fill(0);
        let totalOrders = new Array(12).fill(0);
    
        listBills.forEach(bill => {
            const billMonth = new Date(bill.month).getMonth();
            if (billMonth <= currentMonth) {
                totalAmount[billMonth] += bill.total_amount;
                totalOrders[billMonth] += 1;
            }
        });
        totalAmount = totalAmount.slice(0,currentMonth);
        totalOrders = totalOrders.slice(0,currentMonth);
        return { totalAmount, totalOrders };
    };
    
    
    res.json({
        servicesByDay: {
            DV0001: {
                totalAmount: ListServiceDate(billsDate[0], 'DV0001').totalAmount,
                totalOrders: ListServiceDate(billsDate[0], 'DV0001').totalOrders
            },
            DV0002: {
                totalAmount: ListServiceDate(billsDate[0], 'DV0002').totalAmount,
                totalOrders: ListServiceDate(billsDate[0], 'DV0002').totalOrders
            },
            DV0003: {
                totalAmount: ListServiceDate(billsDate[0], 'DV0003').totalAmount,
                totalOrders: ListServiceDate(billsDate[0], 'DV0003').totalOrders
            }
        },
        servicesByMonth: {
            DV0001: {
                totalAmount: ListServiceMonth(billsMonth[0], 'DV0001').totalAmount,
                totalOrders: ListServiceMonth(billsMonth[0], 'DV0001').totalOrders
            },
            DV0002: {
                totalAmount: ListServiceMonth(billsMonth[0], 'DV0002').totalAmount,
                totalOrders: ListServiceMonth(billsMonth[0], 'DV0002').totalOrders
            },
            DV0003: {
                totalAmount: ListServiceMonth(billsMonth[0], 'DV0003').totalAmount,
                totalOrders: ListServiceMonth(billsMonth[0], 'DV0003').totalOrders
            }
        },
        
        totalByDay: {
            totalAmount: TotalDate(billsDate[0]).totalAmount, 
            totalOrders: TotalDate(billsDate[0]).totalOrders

        }, 
        totalByMonth: {
            totalAmount: TotalMonth(billsDate[0]).totalAmount, 
            totalOrders: TotalMonth(billsDate[0]).totalOrders

        }
    });
    
    
    
  }