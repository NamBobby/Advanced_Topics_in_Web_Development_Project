const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Album = sequelize.define(
  "albums",
  {
    albumId: {
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
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    artistId: {
      type: DataTypes.INTEGER,
      references: {
        model: "artists",
        key: "artistId",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Album;
