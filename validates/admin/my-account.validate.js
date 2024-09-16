module.exports.edit = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập Họ và tên!");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect("back");
    return;
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      req.flash("error", "Vui lòng nhập password có độ dài > 6 ký tự");
      res.redirect("back");
      return;
    }
  }

  next();
};
