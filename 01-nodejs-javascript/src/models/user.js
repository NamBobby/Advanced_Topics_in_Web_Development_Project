const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('users', {
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
    }
}, {
    timestamps: false // Disable timestamps if not needed
});

module.exports = User;