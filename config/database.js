const Sequelize = require("sequelize");
require('dotenv').config(); 
const sequelize = new Sequelize('koi_swp391', "root", "", {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
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
