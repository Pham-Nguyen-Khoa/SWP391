const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const PondRecord = sequelize.define('PondRecord', {
    PondRecordID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      Problem: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      Solution: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },

}, {
    tableName: 'pondrecord',
    timestamps: false
});

module.exports = PondRecord;