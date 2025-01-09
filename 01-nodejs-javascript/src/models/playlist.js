const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Playlist = sequelize.define(
  "playlists",
  {
    playlistId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    thumbnailPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    accountId: {
      type: DataTypes.INTEGER,
      references: {
        model: "accounts",
        key: "accountId",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Playlist;
