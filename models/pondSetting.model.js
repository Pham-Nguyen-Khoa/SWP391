const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const PondSetting = sequelize.define('PondSetting', {
    PondSettingID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
    },
    Volume: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    Temperature: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    PH: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true
    },
    Oxygen: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    Salt: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    Co2: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    Nitrite: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    Nitrate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    }
}, {
    tableName: 'pondsetting',
    timestamps: false
});

module.exports = PondSetting;