
const Sequelize = require("../../config/database");
const db = require("../../config/database");
const Bill = require("../../models/bill.model");



// [Get] /admin/dashboard
module.exports.index = async (req, res) => {
    const query = 'Select * from bill'
    // const listBills = await Sequelize.query(query);
    // console.log(listBills[0]);
    const listBills = await Bill.findAll({
        raw: true
    });
    console.log("================");
    console.log(listBills);
    console.log("================");

    



    res.render("admin/pages/dashboard/index",{
        pageTitle: "Trang tổng quan ",
        listBills: listBills
    })
  }
  