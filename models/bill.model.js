const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const Bill = sequelize.define('Bill', {
    BillID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    Method: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Total: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Status: {
        type: DataTypes.STRING(20),
        allowNull: false
    },

}, {
    tableName: 'bill',
    timestamps: false
});

module.exports = Bill;