
// [Get] /doctor/dashboard
module.exports.index = (req, res) => {
    res.render("doctor/pages/dashboard/index",{
        pageTitle: "Trang tổng quan "
    })
  }
  