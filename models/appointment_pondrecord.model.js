const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const Appointment_PondRecord = sequelize.define('Appointment_PondRecord', {
    AppointmentID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      PondRecordID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
      },

}, {
    tableName: 'appointment_pondrecord',
    timestamps: false
});

module.exports = Appointment_PondRecord;