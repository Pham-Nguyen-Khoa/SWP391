// const Account = require("../../models/account.model");
const Account = require("../../models/account1.model");
const Customer = require("../../models/customer.model");
const { formatDate } = require('../../services/format');
const Notification = require("../../models/notification.model");
const timeHelpers = require("../../helpers/sosanhTime");
const reverseFormatDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};


module.exports.userInfo = async (req, res, next) => {
  console.log("hello")
  const token = req.cookies.token;
  // const token = req.session.token;
  // const user = await User.findOne({tokenUser: tokenUser});
  if(token){
    const user = await Account.findOne({
        where: {
          Token: token,
        },
      });
      if (user) {
        const customer = await Customer.findOne({
          where: {
            AccountID: user.AccountID,
          },
        });
        let listNotifcation;
        let totalNotificationNoRead = 0;
        if(customer){
           listNotifcation = await Notification.findAll({
            raw: true,
            where: {
                CustomerID: customer.CustomerID
            },
            order: [['createdAt', 'DESC']], 
            
        })
       
        listNotifcation.forEach((item) => {
          item.SoSanhTime = timeHelpers.addSosanhTime(item.createdAt);
          if(item.isRead === 0){
            totalNotificationNoRead++;
          }
          if(item.Message.includes("hoàn tất")){
            item.FinishAppointment = true;
          }
        })
        }
       
     

        if (customer) {
          const customerData = { ...customer.dataValues };
          customerData.BirthdayOriginal = customerData.Birthday;
        customerData.Birthday = formatDate(customerData.Birthday);
          res.locals.userInfo = {
            ...user.dataValues,
            ...customerData,
            listNotifcation,
            totalNotificationNoRead
          };
        } else {
          res.locals.userInfo = { ...user.dataValues };
        }
        console.log(res.locals.userInfo)
      }
    }
  next();
};


