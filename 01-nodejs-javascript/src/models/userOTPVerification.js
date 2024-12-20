const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');

const UserOTPVerification = sequelize.define('userotpverification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(UserOTPVerification, { foreignKey: 'userId' });
UserOTPVerification.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserOTPVerification;