module.exports.registerPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect("back");
    return;
  }
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập Họ và Tên!");
    res.redirect("back");
    return;
  }
  if (!req.body.phone) {
    req.flash("error", "Vui lòng nhập Số Điện Thoại!");
    res.redirect("back");
    return;
  }
  if (req.body.phone.length < 10 || req.body.phone.length > 11) {
    req.flash("error", "Số Điện Thoại phải có độ dài từ 10 đến 11 chữ số!");
    res.redirect("back");
    return;
  }
  if (!req.body.address) {
    req.flash("error", "Vui lòng nhập Địa Chỉ!");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập Mật khẩu!");
    res.redirect("back");
    return;
  }
  if (!req.body.confirm_password) {
    req.flash("error", "Vui lòng xác nhận Mật khẩu!");
    res.redirect("back");
    return;
  }
  if (req.body.password !== req.body.confirm_password) {
    req.flash("error", "Mật khẩu và Xác nhận Mật khẩu không khớp!");
    res.redirect("back");
    return;
  }
  if (req.body.password.length < 6 || req.body.password.length > 8) {
    req.flash("error", "Mật khẩu phải có độ dài từ 6 đến 8 ký tự!");
    res.redirect("back");
    return;
  }

  next();
};

module.exports.resetPassword = (req, res, next) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password != confirmPassword) {
    req.flash("error", "Mật khẩu không giống nhau! ");
    res.redirect("back");
    return;
  }
  if (password.length <= 6) {
    req.flash("error", "Mật khẩu phải có độ dài lớn hơn 6 ký tự!");
    res.redirect("back");
    return;
  }
  next();
};
