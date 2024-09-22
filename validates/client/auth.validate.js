module.exports.registerPost = (req, res, next) => {
  if (!req.body.Email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect("back");
    return;
  }
  if (!req.body.FullName) {
    req.flash("error", "Vui lòng nhập Họ và Tên!");
    res.redirect("back");
    return;
  }
  if (!req.body.PhoneNumber) {
    req.flash("error", "Vui lòng nhập Số Điện Thoại!");
    res.redirect("back");
    return;
  }
  if (req.body.PhoneNumber.length < 10 || req.body.PhoneNumber.length > 11) {
    req.flash("error", "Số Điện Thoại phải có độ dài từ 10 đến 11 chữ số!");
    res.redirect("back");
    return;
  }
  if (!req.body.Address) {
    req.flash("error", "Vui lòng nhập Địa Chỉ!");
    res.redirect("back");
    return;
  }
  if (!req.body.Password) {
    req.flash("error", "Vui lòng nhập Mật khẩu!");
    res.redirect("back");
    return;
  }
  if (!req.body.confirm_password) {
    req.flash("error", "Vui lòng xác nhận Mật khẩu!");
    res.redirect("back");
    return;
  }
  if (req.body.Password !== req.body.confirm_password) {
    req.flash("error", "Mật khẩu và Xác nhận Mật khẩu không khớp!");
    res.redirect("back");
    return;
  }
  if (req.body.Password.length < 6 || req.body.Password.length > 8) {
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



module.exports.loginPost = (req, res, next) => {

  if(!req.body.Email){
    req.flash("error","Vui lòng nhập Email! ");
    res.redirect("back");
    return;
  }

  if(!req.body.Password){
    req.flash("error","Vui lòng nhập mật khẩu! ");
    res.redirect("back");
    return;
  }
  next();
};



