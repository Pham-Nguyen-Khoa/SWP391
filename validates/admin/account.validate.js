module.exports.create = (req,res,next) =>{
    if(!req.body.FullName){
        req.flash("error","Vui lòng nhập Họ và tên!");
        res.redirect("back")
        return;
    }
    if(!req.body.Email){
        req.flash("error","Vui lòng nhập email!");
        res.redirect("back")
        return;
    }
    if(!req.body.Password){
        req.flash("error","Vui lòng nhập password!");
        res.redirect("back")
        return;
    }
    if (req.body.Password.length < 6 ) {
        req.flash("error", "Vui lòng nhập password có độ dài > 6 ký tự");
        res.redirect("back");
        return;
    }
    if(!req.body.RoleID){
        req.flash("error","Vui lòng chọn quyền!");
        res.redirect("back")
        return;
    }

    next();
}

