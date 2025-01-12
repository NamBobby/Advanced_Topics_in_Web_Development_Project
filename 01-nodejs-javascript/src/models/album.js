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
    accountId: {
      type: DataTypes.INTEGER, 
      primaryKey: true,
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
