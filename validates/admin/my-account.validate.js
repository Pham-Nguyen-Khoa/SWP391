module.exports.edit = (req, res, next) => {
  if (!req.body.FullName) {
    req.flash("error", "Vui lòng nhập Họ và tên!");
    res.redirect("back");
    return;
  }
  if (req.body.Password) {
    if (req.body.Password.length < 6) {
      req.flash("error", "Vui lòng nhập password có độ dài > 6 ký tự");
      res.redirect("back");
      return;
    }
  }

  next();
};
