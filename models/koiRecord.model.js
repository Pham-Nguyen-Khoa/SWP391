const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const KoiRecord = sequelize.define('KoiRecord', {
    AppointmentID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      KoiID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
      },

}, {
    tableName: 'koirecord',
    timestamps: false
});

module.exports = KoiRecord;