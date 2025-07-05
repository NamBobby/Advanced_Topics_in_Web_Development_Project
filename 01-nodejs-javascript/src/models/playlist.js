const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Playlist = sequelize.define(
  "playlists",
  {
    playlistId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'playlist_id'
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
      field: 'thumbnail_path'
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'creation_date'
    },
    accountId: {
      type: DataTypes.INTEGER,
      field: 'account_id',
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