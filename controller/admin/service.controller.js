
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");
const Setting = require("../../models/setting.model");
const { setIframe } = require("../../helpers/setIframe");
const verifyEmailHelper = require("../../helpers/checkMail");
const Service = require("../../models/service.model");

// [Get] /admin/service
module.exports.index = (req, res) => {
    res.render("admin/pages/service/index",{
        pageTitle: "Dịch vụ"
    })
  }


// [Get] /admin/service/service-info
module.exports.serviceInfo = async (req, res) => {
    const listService = await Service.findAll({
        raw: true
    });
    res.render("admin/pages/service/service-info",{
        pageTitle: "Thông tin dịch vụ",
        listService: listService
    })
  }

// [Get] /admin/service/fee-ship
module.exports.feeShip = async (req, res) => {
    const service = await Service.findOne({
        raw: true,
        where: {
            ServiceID: "DV0001"
        }
    })
    res.render("admin/pages/service/fee-ship",{
        pageTitle: "Phí vận chuyển",
        service: service
    })
  }
module.exports.feeShipPost = async (req, res) => {
    const {shippingFee} = req.body;
    await Service.update({
        FeeShip: shippingFee
    }, {
        where: {
            ServiceID: {
                [Op.in]: ["DV0001", "DV0002"]
            }
        }
    })
    req.flash("success", "Cập nhật phí vận chuyển thành công");
    res.redirect("back");
}

// [Get] /admin/service/edit/:id
module.exports.edit = async (req, res) => {
    const serviceID = req.params.id;
    if(serviceID == "DV0001") {
        const service = await Service.findOne({
            where: {
                ServiceID: "DV0001"
            }
        })
        return res.render("admin/pages/service/edit-fish", {
            pageTitle: "Chỉnh sửa dịch vụ cá ",
            service: service
        })
    }else if(serviceID == "DV0003"){
        const service = await Service.findOne({
            where: {
                ServiceID: "DV0003"
            }
        })
        return res.render("admin/pages/service/edit-online", {
            pageTitle: "Chỉnh sửa dịch vụ tư vấn online",
            service: service
        })
    }else if(serviceID == "DV0002"){
        const service = await Service.findOne({
            where: {
                ServiceID: "DV0002"
            }
        })
        return res.render("admin/pages/service/edit-pond", {
            pageTitle: "Chỉnh sửa dịch vụ khám hồ cá",
            service: service
        })
    }
    
}

// [POST] /admin/service/editFish/:id
module.exports.editFishPost = async (req, res) => {
    const serviceID = req.params.id;
    const {Price, Description, AddMore} = req.body;
    if(Price < 0 || AddMore < 0) {
        req.flash("error", "Giá tiền không hợp lệ");
        return res.redirect("back");
    }
    if(!Description){
        req.flash("error", "Mô tả không được để trống");
        return res.redirect("back");
    }
    await Service.update({
        Price: Price,
        Description: Description,
        AddMore: AddMore
    }, {
        where: {
            ServiceID: serviceID
        }
    })
    req.flash("success", "Chỉnh sửa dịch vụ thành công");
    res.redirect("back");
}

// [POST] /admin/service/editOnline/:id
module.exports.editOnlinePost = async (req, res) => {
    const serviceID = req.params.id;
    const {Price, Description} = req.body;
    if(Price < 0 ) {
        req.flash("error", "Giá tiền không hợp lệ");
        return res.redirect("back");
    }
    if(!Description){
        req.flash("error", "Mô tả không được để trống");
        return res.redirect("back");
    }
    await Service.update({
        Price: Price,
        Description: Description,
    }, {
        where: {
            ServiceID: serviceID
        }
    })
    req.flash("success", "Chỉnh sửa dịch vụ thành công");
    res.redirect("back");
}

// [POST] /admin/service/editPond/:id
module.exports.editPondPost = async (req, res) => {
    const serviceID = req.params.id;
    const {Price, Description, AddMore} = req.body;
    if(Price < 0 || AddMore < 0) {
        req.flash("error", "Giá tiền không hợp lệ");
        return res.redirect("back");
    }
    if(!Description){
        req.flash("error", "Mô tả không được để trống");
        return res.redirect("back");
    }
    await Service.update({
        Price: Price,
        Description: Description,
        AddMore: AddMore
    }, {
        where: {
            ServiceID: serviceID
        }
    })
    req.flash("success", "Chỉnh sửa dịch vụ thành công");
    res.redirect("back");
}

// [Get] /admin/service/stop/:id
module.exports.stop = async (req, res) => {
    const serviceID = req.params.id;
    await Service.update({
        Status: "inactive"
    }, {
        where: {
            ServiceID: serviceID
        }
    })
    req.flash("success", "Ngừng dịch vụ thành công");
    res.redirect("back");
}

// [Get] /admin/service/start/:id
module.exports.start = async (req, res) => {
    const serviceID = req.params.id;
    await Service.update({
        Status: "active"
    }, {
        where: {
            ServiceID: serviceID
        }
    })
    req.flash("success", "Bắt đầu dịch vụ thành công");
    res.redirect("back");
}
