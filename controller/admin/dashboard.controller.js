const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Bill = require("../../models/bill.model");


// [Get] /admin/dashboard
module.exports.index = async (req, res) => {

    const queryFinance = `SELECT 
    DATE(appointment.Date) AS date,  
    appointment.ServiceID,                         
    bill.Total
FROM 
    bill
JOIN 
    appointment ON bill.BillID = appointment.BillID  
WHERE
    bill.Status = 'Đã thanh toán'
ORDER BY
    date ASC, appointment.ServiceID;`;



    const listBills = await Sequelize.query(queryFinance);

    const ListServiceDate = (listBills, ServiceID) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
        let totalAmount = new Array(31).fill(0);
        let totalOrders = new Array(31).fill(0);
    
        listBills.forEach(bill => {
            if (bill.ServiceID === ServiceID) {
                const billDate = new Date(bill.date);
                if (billDate.getFullYear() === currentYear && 
                    billDate.getMonth() === currentMonth) {
                    const dayOfMonth = billDate.getDate() - 1;
                    totalAmount[dayOfMonth] += bill.Total;
                    totalOrders[dayOfMonth] += 1;
                }
            }
        });
        totalAmount = totalAmount.slice(0, daysInMonth);
        totalOrders = totalOrders.slice(0, daysInMonth);
        return { totalAmount, totalOrders };
    };
    
    
    const ListServiceMonth = (listBills, ServiceID) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        let totalAmount = new Array(12).fill(0);
        let totalOrders = new Array(12).fill(0);

        listBills.forEach(bill => {
            if (bill.ServiceID === ServiceID) {
                const billDate = new Date(bill.date);
                const billMonth = billDate.getMonth();
                if (billDate.getFullYear() === currentYear && billMonth <= currentMonth) {
                    totalAmount[billMonth] += bill.Total;
                    totalOrders[billMonth] += 1;
                }
            }
        });
        totalAmount = totalAmount.slice(0, currentMonth + 1);
        totalOrders = totalOrders.slice(0, currentMonth + 1);
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
            if (billDate.getFullYear() === currentYear && 
                billDate.getMonth() === currentMonth) {
                const dayOfMonth = billDate.getDate() - 1;
                totalAmount[dayOfMonth] += bill.Total;
                totalOrders[dayOfMonth] += 1;
            }
        });
        totalAmount = totalAmount.slice(0, daysInMonth);
        totalOrders = totalOrders.slice(0, daysInMonth);
        return { totalAmount, totalOrders };
    };
    
    
    const TotalMonth = (listBills) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        let totalAmount = new Array(12).fill(0);
        let totalOrders = new Array(12).fill(0);

        listBills.forEach(bill => {
            const billDate = new Date(bill.date);
            const billMonth = billDate.getMonth();
            if (billDate.getFullYear() === currentYear && billMonth <= currentMonth) {
                totalAmount[billMonth] += bill.Total;
                totalOrders[billMonth] += 1;
            }
        });
        totalAmount = totalAmount.slice(0, currentMonth + 1);
        totalOrders = totalOrders.slice(0, currentMonth + 1);
        return { totalAmount, totalOrders };
    };

    const Total = (listBills) => {
        let totalAmount = 0;
        let totalOrders = 0;

        listBills.forEach(bill => {
            totalAmount += bill.Total;
            totalOrders += 1;
        });

        return { totalAmount, totalOrders };
    };

    const data = {
        servicesByDay: {
            DV0001: {
                totalAmount: ListServiceDate(listBills[0], 'DV0001').totalAmount,
                totalOrders: ListServiceDate(listBills[0], 'DV0001').totalOrders
            },
            DV0002: {
                totalAmount: ListServiceDate(listBills[0], 'DV0002').totalAmount,
                totalOrders: ListServiceDate(listBills[0], 'DV0002').totalOrders
            },
            DV0003: {
                totalAmount: ListServiceDate(listBills[0], 'DV0003').totalAmount,
                totalOrders: ListServiceDate(listBills[0], 'DV0003').totalOrders
            }
        },
        servicesByMonth: {
            DV0001: {
                totalAmount: ListServiceMonth(listBills[0], 'DV0001').totalAmount,
                totalOrders: ListServiceMonth(listBills[0], 'DV0001').totalOrders
            },
            DV0002: {
                totalAmount: ListServiceMonth(listBills[0], 'DV0002').totalAmount,
                totalOrders: ListServiceMonth(listBills[0], 'DV0002').totalOrders
            },
            DV0003: {
                totalAmount: ListServiceMonth(listBills[0], 'DV0003').totalAmount,
                totalOrders: ListServiceMonth(listBills[0], 'DV0003').totalOrders
            }
        },
        totalByDay: {
            totalAmount: TotalDate(listBills[0]).totalAmount,
            totalOrders: TotalDate(listBills[0]).totalOrders
        },
        totalByMonth: {
            totalAmount: TotalMonth(listBills[0]).totalAmount,
            totalOrders: TotalMonth(listBills[0]).totalOrders
        },
        total: {
            totalAmount: Total(listBills[0]).totalAmount,
            totalOrders: Total(listBills[0]).totalOrders
        }
    };


    res.render("admin/pages/dashboard/index",{
        pageTitle: "Trang tổng quan ",
        data: data 
    })
  }
  
