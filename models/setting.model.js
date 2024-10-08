const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const Setting = sequelize.define('Setting', {
   SettingID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Logo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    BannerHome: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    BannerCommunity: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    PhoneNumber: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    TimeOpen: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ImageServiceHealthy: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ImageServicePond: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ImageServiceOnline: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    WebsiteName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    CompanyName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Copyright: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    

}, {
    tableName: 'setting',
    timestamps: false
});

module.exports = Setting;