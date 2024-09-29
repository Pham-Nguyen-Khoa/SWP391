const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
const Appointment = sequelize.define('Appointment', {
  AppointmentID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
    },
    CustomerID: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    ServiceID: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    PhoneNumber: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    Address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Shift: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    Process: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Pending',
    },
    HealthKoi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    StatusPaid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    VetID: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    BillID: {
        type: DataTypes.STRING(10),
        allowNull: true,
    }
}, {
    tableName: 'appointment',
    timestamps: false
});

module.exports = Appointment;