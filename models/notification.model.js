const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
const generate = require("../helpers/generate");
// const { UPDATE } = require("sequelize/lib/query-types");
const Notification = sequelize.define('Notification', {
    notificationID: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      CustomerID: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      AppointmentID: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      Message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    
}, {
    tableName: 'notification',
    timestamps: false
});


module.exports = Notification;
