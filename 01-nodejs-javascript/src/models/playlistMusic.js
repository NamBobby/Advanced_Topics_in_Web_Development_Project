const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PlaylistMusic = sequelize.define(
  "playlistmusics",
  {
    playlistId: {
      type: DataTypes.INTEGER,
      references: {
        model: "playlists",
        key: "playlistId",
      },
      allowNull: false,
    },
    musicId: {
      type: DataTypes.INTEGER,
      references: {
        model: "music",
        key: "musicId",
      },
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = PlaylistMusic;
