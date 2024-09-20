const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đảm bảo rằng bạn đã cấu hình kết nối cơ sở dữ liệu

const Doctor = sequelize.define('Doctor', {
    DoctorID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    AccountID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Specialization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'doctor',
    timestamps: false
});

module.exports = Doctor;