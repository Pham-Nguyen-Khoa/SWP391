const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Database


const Service = sequelize.define('Service', {
  ServiceID: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
  },
  Name: {
      type: DataTypes.STRING(100),
      allowNull: false
  },
  Price: {
      type: DataTypes.DOUBLE,
      allowNull: false
  },
  Description: {
      type: DataTypes.STRING(500),
      allowNull: false
  },
  Thumbnail: {
      type: DataTypes.TEXT,
      allowNull: false
  },
  Status: {
      type: DataTypes.STRING(20),
      allowNull: true
  },
  AddMore: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  FeeShip: {
    type: DataTypes.DOUBLE,
    allowNull: true
  }
}, {
  tableName: 'service',
  timestamps: false
});

module.exports = Service;