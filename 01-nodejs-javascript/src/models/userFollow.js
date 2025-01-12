const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserFollow = sequelize.define(
  "userfollows",
  {
    userfollowId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "accounts",
        key: "accountId",
      },
      onDelete: "CASCADE",
    },
    followType: {
      type: DataTypes.ENUM("Album", "Artist"),
      allowNull: false,
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "artists", 
        key: "accountId",
      },
      onDelete: "CASCADE",
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "albums",
        key: "albumId",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: false,
    validate: {
      onlyOneFollowId() {
        if (!this.artistId && !this.albumId) {
          throw new Error("Either artistId or albumId must be provided");
        }
        if (this.artistId && this.albumId) {
          throw new Error("Only one of artistId or albumId should be provided");
        }
      },
    },
  }
);

module.exports = UserFollow;
