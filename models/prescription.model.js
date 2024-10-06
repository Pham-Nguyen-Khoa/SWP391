const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const Prescription = sequelize.define('Prescription', {
    PrescriptID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      Time: {
        type: DataTypes.DATE,
        allowNull: false
      },

}, {
    tableName: 'prescription',
    timestamps: false
});

module.exports = Prescription;