const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");
const Feedback = sequelize.define('Feedback', {
    FeedBackID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    AccountID: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    AppointmentID: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Content: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    Star:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Time:{
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    tableName: 'feedback',
    timestamps: false
});

module.exports = Feedback;