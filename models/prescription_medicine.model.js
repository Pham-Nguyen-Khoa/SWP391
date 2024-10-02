const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const PrescriptionMedicine = sequelize.define('PrescriptionMedicine', {
    PrescriptID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      MedicineID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
      },

}, {
    tableName: 'prescription_medicine',
    timestamps: false
});

module.exports = PrescriptionMedicine;