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
        allowNull: true
    },
    BannerHome: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    BannerCommunity: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Email: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    PhoneNumber: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    TimeOpen: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ImageServiceHealthy: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ImageServicePond: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ImageServiceOnline: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    WebsiteName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    CompanyName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Copyright: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Facebook: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Instagram: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Messenger: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    MapEmbed: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    EmailSend: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    AppPassword: {
        type: DataTypes.STRING(50),
        allowNull: true
    },

}, {
    tableName: 'setting',
    timestamps: false
});

module.exports = Setting;