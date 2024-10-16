const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const Chat = sequelize.define('Chat', {
    ChatID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    User_ID: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Images: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'chat',
    timestamps: false
});

module.exports = Chat;