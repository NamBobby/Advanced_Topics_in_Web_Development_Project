const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Music = require('./Music');

const Playlist = sequelize.define('playlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    thumbnailPath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

// Thiết lập quan hệ giữa Playlist và Music
Playlist.belongsToMany(Music, { through: 'PlaylistMusic' });
Music.belongsToMany(Playlist, { through: 'PlaylistMusic' });

module.exports = Playlist;
