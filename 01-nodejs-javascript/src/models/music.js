const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Music = sequelize.define(
  "music",
  {
    musicId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    },
    uploadDate: {
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
    albumId: {
      type: DataTypes.INTEGER,
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
