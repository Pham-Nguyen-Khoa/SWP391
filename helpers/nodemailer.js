const nodemailer = require('nodemailer');

module.exports.sendMail = (email,title,html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
            user: 'pnkvlog1508@gmail.com',
            pass: 'vpkl kqao sztj evdi'
        }
    })
    const mailOptions = {
        from: 'pnkvlog1508@gmail.com',
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
