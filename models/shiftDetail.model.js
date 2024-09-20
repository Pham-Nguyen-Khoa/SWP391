const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Đường dẫn tới file cấu hình database

const ShiftDetail = sequelize.define('ShiftDetail', {
  ShiftID: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  ScheduleID: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  Shift: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  AppointmentID: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'shiftDetail',
  timestamps: false
});

module.exports = ShiftDetail;