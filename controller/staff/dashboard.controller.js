
// [Get] /staff/dashboard
module.exports.index = (req, res) => {
    res.render("staff/pages/dashboard/index",{
        pageTitle: "Trang tổng quan "
    })
  }
  