const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const KoiProfile = sequelize.define('KoiProfile', {
    KoiID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
    },
    PrescriptID: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    Avatar: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Problem: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    Solution: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    Description: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    Type: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Weight: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Height: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    HealthStatus: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    tableName: 'koiprofile',
    timestamps: false
});

module.exports = KoiProfile;