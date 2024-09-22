const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const Vet = sequelize.define('Vet', {
    VetID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    AccountID: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Specialization: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    FullName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    PhoneNumber: {
        type: DataTypes.STRING(12),
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
    GoogleMeet: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
}, {
    tableName: 'vet',
    timestamps: false
});

module.exports = Vet;