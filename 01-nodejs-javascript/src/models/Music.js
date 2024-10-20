const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Music = sequelize.define('music', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    album: {
        type: DataTypes.STRING,
        allowNull: true
    },
    filePath: {
        type: DataTypes.STRING, // This could be a URL or local path
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    uploadDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
    publishedYear: {
        type: DataTypes.INTEGER,
        allowNull: false 
    }    
}, {
    timestamps: false 
});

module.exports = Music;
