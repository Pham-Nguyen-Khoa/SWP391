const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const Staff = sequelize.define('Staff', {
    StaffID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    FullName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    PhoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    Address: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    Gender: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Birthday: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Avatar: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    AccountID: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    tableName: 'staff',
    timestamps: false
});

module.exports = Staff;