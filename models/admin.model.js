const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const Admin = sequelize.define('Admin', {
    AdminID: {
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
    tableName: 'admin',
    timestamps: false
});

module.exports = Admin;