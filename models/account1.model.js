const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const Account1 = sequelize.define('Account1', {
    AccountID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    Email: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    RoleID: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Kích hoạt'
    },
    Deleted: {
        type: Boolean,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'account1',
    timestamps: false
});


module.exports = Account1;
