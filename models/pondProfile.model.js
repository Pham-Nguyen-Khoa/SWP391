const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const PondProfile = sequelize.define('PondProfile', {
    PondProfileID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      PondRecordID: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      PrescriptID: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      Volume: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      Temperature: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      pH: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      Oxygen: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      Salt: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      CO2: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      Nitrite: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      Nitrate: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      }
}, {
    tableName: 'pondprofile',
    timestamps: false
});

module.exports = PondProfile;