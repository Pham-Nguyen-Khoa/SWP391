const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const Medicine = sequelize.define('Medicine', {
    MedicineID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      toUse: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Image: {
        type: DataTypes.TEXT('long'),
        allowNull: false
      }

}, {
    tableName: 'medicine',
    timestamps: false
});

module.exports = Medicine;