const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PlaylistMusic = sequelize.define("playlistmusics", {
  playlistId: {
    type: DataTypes.INTEGER,
    references: {
      model: "playlists",
      key: "id",
    },
    allowNull: false,
  },
  musicId: {
    type: DataTypes.INTEGER,
    references: {
      model: "musics",
      key: "id",
    },
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = PlaylistMusic;
