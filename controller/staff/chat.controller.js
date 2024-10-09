
// [Get] /staff/chat
module.exports.chat = (req, res) => {
    res.render("staff/pages/chat/index",{
        pageTitle: "Trang chat "
    })
  }
    