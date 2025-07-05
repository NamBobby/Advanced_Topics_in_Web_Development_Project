const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Album = sequelize.define(
  "albums",
  {
    albumId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'album_id'
    },
    name: {
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
    thumbnailPath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'thumbnail_path'
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_date'
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
  },
  {
    timestamps: false,
  }
);

module.exports = Album;