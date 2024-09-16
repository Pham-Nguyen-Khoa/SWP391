module.exports.create = (req,res,next) =>{
    if(!req.body.title){
        req.flash("error","Vui lòng nhập tiêu đề dịch vụ");
        res.redirect("back")
        return;
    }
    next();
}



// Để mẫu