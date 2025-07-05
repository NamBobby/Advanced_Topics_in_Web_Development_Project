const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PlaylistMusic = sequelize.define(
  "playlistmusics",
  {
    playlistId: {
      type: DataTypes.INTEGER,
      field: 'playlist_id',
      references: {
        model: "playlists",
        key: "playlistId",
      },
      allowNull: false,
    },
    musicId: {
      type: DataTypes.INTEGER,
      field: 'music_id',
      references: {
        model: "music",
        key: "musicId",
      },
      allowNull: false,
    },
  },
  { 
    timestamps: false,
    tableName: 'playlist_music'
  }
);

module.exports = PlaylistMusic;