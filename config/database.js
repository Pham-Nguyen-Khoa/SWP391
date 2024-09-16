const Sequelize = require("sequelize");
require('dotenv').config(); 
const sequelize = new Sequelize('koi_swp391', "root", "", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection success");
  })
  .catch((error) => {
    console.error("Connection error ");
  });

module.exports = sequelize;
