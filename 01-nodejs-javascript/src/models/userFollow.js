const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserFollow = sequelize.define(
  "userfollows",
  {
    userfollowId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'user_follow_id'
    },
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'account_id',
      references: {
        model: "accounts",
        key: "accountId",
      },
      onDelete: "CASCADE",
    },
    followType: {
      type: DataTypes.ENUM("Album", "Artist"),
      allowNull: false,
      field: 'follow_type'
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'artist_id',
      references: {
        model: "artists", 
        key: "accountId",
      },
      onDelete: "CASCADE",
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'album_id',
      references: {
        model: "albums",
        key: "albumId",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: false,
    tableName: 'user_follows',
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