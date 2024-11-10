const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Account = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('Man', 'Woman', 'Non-binary', 'Somthing else', 'Prefer not to say'),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Administrator', 'User', 'Artist'),
        allowNull: false
    }
}, {
    timestamps: false 
});

module.exports = Account;