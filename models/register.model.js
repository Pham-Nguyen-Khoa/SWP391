const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database

const Forgot_Password = sequelize.define(
  "Forgot_Password",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "forgot_password",
    timestamps: false,
  }
);

module.exports = Forgot_Password;
