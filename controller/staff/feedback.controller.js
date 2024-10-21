const Chat = require("../../models/chat.model");
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");
const Account = require("../../models/account1.model");
const Customer = require("../../models/customer.model");
const Feedback = require("../../models/feedback.model");



function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}
// [Get] /staff/feedback
module.exports.index = async (req, res) => {
    const page = req.query.page || 1;
    const limit = 5;
    if(page < 1){
        req.flash("error", "Trang không tồn tại");
        res.redirect("/staff/feedback");
        return;
    }
    let skip = (page-1)*limit;
    let quertFeedBack =`Select * from feedback fb Join account1 ac on ac.AccountID = fb.AccountID Join customer cs on cs.AccountID = ac.AccountID `
    let queryTotalFeedback = `
        SELECT COUNT(*) as total
        FROM feedback fb
        join account1 ac on ac.AccountID = fb.AccountID
        join customer cs on cs.AccountID = ac.AccountID
    `;
    let conditions = [];

    if (req.query.dateFilter) {
        conditions.push(`fb.Time = '${req.query.dateFilter}'`);
    }

    if (req.query.starFilter) {
        conditions.push(`fb.Star = ${req.query.starFilter}`);
    }
    if(req.query.searchFilter){
        conditions.push(`cs.FullName LIKE '%${req.query.searchFilter}%'`);
    }

    if (conditions.length > 0) {
        const whereString = conditions.join(' AND ');
        quertFeedBack += ` WHERE ${whereString}`;
        queryTotalFeedback += ` WHERE ${whereString}`;
    }

        quertFeedBack += ` LIMIT ? OFFSET ?`;


    const [listFeedback] = await db.query(quertFeedBack,{
        replacements: [limit, skip ],
        raw: true
    })
    const [totalCountFeedback] = await db.query(queryTotalFeedback,{
        raw: true
    })
    const totalFeedback = totalCountFeedback[0].total;
    const totalPages = Math.ceil(totalFeedback / limit);
   
    if(skip >= totalFeedback){
        skip = totalFeedback - limit;
    }

    listFeedback.forEach(feedback => {
        feedback.Time = formatDate(feedback.Time);
    });


    let filterType = '';
    let dateFormat = '';
    let searchName = '';
    let starFilter = '';

    if (req.query.dateFilter) {
        dateFormat = formatDate(req.query.dateFilter);
        filterType += 'date_';
    }

    if (req.query.searchFilter) {
        searchName = req.query.searchFilter;
        filterType += 'search_';
    }

    if (req.query.starFilter) {
        starFilter = req.query.starFilter;
        filterType += 'star';
    }

    filterType = filterType.replace(/_$/, '');

    if (filterType === '') {
        filterType = 'none';
    }

    res.render("staff/pages/feedback/index",{
        pageTitle: "Trang đánh giá ",
        listFeedback: listFeedback,
        totalPages: totalPages,
        currentPage: page,
        dateFilter: req.query.dateFilter,
        starFilter: req.query.starFilter,
        searchFilter: req.query.searchFilter,
        filterType: filterType,
        dateFormat: dateFormat,
        searchName: searchName,
        limit:limit
    })
  }
    