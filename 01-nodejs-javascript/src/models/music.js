const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Music = sequelize.define(
  "music",
  {
    musicId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'music_id'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_path',
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnailPath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'thumbnail_path'
    },
    uploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'upload_date'
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'published_year'
    },
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'account_id',
      references: {
        model: "artists",
        key: "accountId",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    albumId: {
      type: DataTypes.INTEGER,
      field: 'album_id',
      references: {
        model: "albums",
        key: "albumId",
      },
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = Music;