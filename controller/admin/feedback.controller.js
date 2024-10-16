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

    res.render("admin/pages/feedback/index",{
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
    

// [Get] /admin/feedback/analyze
module.exports.analyze = async (req, res) => {
    let quertFeedBack =`Select * from feedback fb Join account1 ac on ac.AccountID = fb.AccountID Join customer cs on cs.AccountID = ac.AccountID `
    const [listFeedback] = await db.query(quertFeedBack,{
        raw: true
    })
    let countFeedback = listFeedback.length;
    let sumStar = 0;
    listFeedback.forEach(feedback => {
        sumStar += feedback.Star;
    });
    let star5 = 0;
    let star4 = 0;
    let star3 = 0;
    let star2 = 0;
    let star1 = 0;
    listFeedback.forEach(feedback => {
        if(feedback.Star === 5){
            star5++;
        }
        if(feedback.Star === 4){
            star4++;
        }
        if(feedback.Star === 3){
            star3++;
        }
        if(feedback.Star === 2){
            star2++;
        }
        if(feedback.Star === 1){
            star1++;
        }   
    });
    const avareStar5 = (star5 / countFeedback) * 100;
    const avareStar4 = (star4 / countFeedback) * 100;
    const avareStar3 = (star3 / countFeedback) * 100;
    const avareStar2 = (star2 / countFeedback) * 100;
    const avareStar1 = (star1 / countFeedback) * 100;
    let averageStar = sumStar / countFeedback;
    res.json({averageStar: averageStar.toFixed(2),countFeedback: countFeedback, star5Count: star5,star4Count: star4, star3Count: star3, star2Count: star2, star1Count: star1, star5: avareStar5.toFixed(0), star4: avareStar4.toFixed(0), star3: avareStar3.toFixed(0), star2: avareStar2.toFixed(0), star1: avareStar1.toFixed(0)});
}
  
