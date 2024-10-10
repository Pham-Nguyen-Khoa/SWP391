const nodemailer = require('nodemailer');
const Setting = require('../models/setting.model');
module.exports.sendMail = async (email,title,html) => {
    const settingData = await Setting.findOne({
        raw: true,
        where: {
            SettingID: 1
        }
    });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // auth: { 
        //     user: 'pnkvlog1508@gmail.com',
        //     pass: 'vpkl kqao sztj evdi'
        // }
        auth: {
            user: settingData.EmailSend,
            pass: settingData.AppPassword
        }
    })
    const mailOptions = {
        from: settingData.EmailSend,
        to: email,
        subject: title,
        html: html
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }else{
            console.log('Email sent successfully');
        }
    })
};
