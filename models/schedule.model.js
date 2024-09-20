const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const Schedule = sequelize.define('Schedule', {
  ScheduleID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  AccountID: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  Time: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'schedule',
  timestamps: false
});

module.exports = Schedule;