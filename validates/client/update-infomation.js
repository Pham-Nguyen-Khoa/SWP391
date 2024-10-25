module.exports.editProfilePost = (req, res, next) => {
    if(!req.body.FullName) {
        req.flash("error", "Vui lòng nhập Họ tên! ");
        res.redirect("back");
        return;
    }
  if (!req.body.Email) {
    req.flash("error", "Vui lòng nhập Email! ");
    res.redirect("back");
    return;
  }
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validDomains = ["com", "net", "org", "edu", "vn", "com.vn", "edu.vn"];

  // Kiểm tra format email
  if (!emailRegex.test(req.body.Email)) {
    req.flash(
      "error",
      "Email không hợp lệ! Vui lòng nhập đúng định dạng (vd: example@gmail.com)"
    );
    res.redirect("back");
    return;
  }

  // Kiểm tra độ dài email
  if (req.body.Email.length > 50) {
    req.flash("error", "Email không được dài quá 50 ký tự!");
    res.redirect("back");
    return;
  }

  // Kiểm tra domain hợp lệ
  const emailParts = req.body.Email.split("@");
  const domain = emailParts[1].toLowerCase();
  const topLevelDomain = domain.split(".").slice(1).join(".");

  if (!validDomains.includes(topLevelDomain)) {
    req.flash("error", "Domain email không hợp lệ!");
    res.redirect("back");
    return;
  }

  // Kiểm tra username email
  const username = emailParts[0];
  if (username.length < 3) {
    req.flash("error", "Tên email quá ngắn!");
    res.redirect("back");
    return;
  }

  // Kiểm tra ký tự đặc biệt không hợp lệ
  const invalidChars = /[()<>,;:\\"\[\] ]/;
  if (invalidChars.test(req.body.Email)) {
    req.flash("error", "Email chứa ký tự không hợp lệ!");
    res.redirect("back");
    return;
  }

  if (!req.body.PhoneNumber) {
    req.flash("error", "Vui lòng nhập Số điện thoại! ");
    res.redirect("back");
    return;
  }
  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(req.body.PhoneNumber)) {
    req.flash("error", "Số điện thoại không hợp lệ! ");
    res.redirect("back");
    return;
  }
  if (!req.body.Address) {
    req.flash("error", "Vui lòng nhập Địa chỉ!");
    res.redirect("back");
    return;
  }

  // Kiểm tra độ dài địa chỉ
  if (req.body.Address.length < 10 || req.body.Address.length > 200) {
    req.flash("error", "Địa chỉ phải từ 10 đến 200 ký tự!");
    res.redirect("back");
    return;
  }

  // Kiểm tra format địa chỉ (phải có đường/phường/thành phố)
//   const addressParts = req.body.Address.split(',').map(part => part.trim());
//   if (addressParts.length < 3) {
//     req.flash("error", "Vui lòng nhập đầy đủ: Số nhà & Tên đường, Phường/Xã, Quận/Tỉnh/Thành phố!");
//     res.redirect("back");
//     return;
//   }

  // Kiểm tra ký tự đặc biệt không hợp lệ (chỉ cho phép / và -)
  const invalidCharsAddress = /[<>^?=}{'"|*\\]/;
  if (invalidCharsAddress.test(req.body.Address)) {
    req.flash("error", "Địa chỉ chứa ký tự không hợp lệ!");
    res.redirect("back");
    return;
  }
  if (!req.body.Birthday) {
    req.flash("error", "Vui lòng nhập Ngày sinh!");
    res.redirect("back");
    return;
  }

  // Chuyển đổi chuỗi ngày sinh thành đối tượng Date
  const birthday = new Date(req.body.Birthday);
  const today = new Date();

  // Kiểm tra ngày sinh có hợp lệ không
  if (isNaN(birthday.getTime())) {
    req.flash("error", "Ngày sinh không hợp lệ!");
    res.redirect("back");
    return;
  }

  // Kiểm tra tuổi tối thiểu (ví dụ: 16 tuổi)
  const minAge = 16;
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - minAge);
  
  if (birthday > today) {
    req.flash("error", "Ngày sinh không thể là ngày trong tương lai!");
    res.redirect("back");
    return;
  }

  if (birthday > minDate) {
    req.flash("error", `Bạn phải đủ ${minAge} tuổi trở lên!`);
    res.redirect("back");
    return;
  }

  // Kiểm tra tuổi tối đa (ví dụ: 100 tuổi)
  const maxAge = 100;
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - maxAge);

  if (birthday < maxDate) {
    req.flash("error", `Tuổi không thể vượt quá ${maxAge}!`);
    res.redirect("back");
    return;
  }
  if (!req.body.Gender) {
    req.flash("error", "Vui lòng chọn Giới tính! ");
    res.redirect("back");
    return;
  }

  next();
};
