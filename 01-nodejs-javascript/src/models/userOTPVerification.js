const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserOTPVerification = sequelize.define('otps', {
  otpId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'otp_id'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true 
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  },
  accountId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'account_id',
    references: {
      model: "accounts",
      key: 'accountId'
    },
    onDelete: "CASCADE",
  }
});

module.exports = UserOTPVerification;