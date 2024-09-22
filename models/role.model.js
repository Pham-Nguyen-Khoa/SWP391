const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database
// const { UPDATE } = require("sequelize/lib/query-types");

const Role = sequelize.define(
  "Role",
  {
    RoleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    RoleName: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "role",
    timestamps: false,
  }
);

module.exports = Role;
