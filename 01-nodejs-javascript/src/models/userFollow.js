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
      allowNull: false,
      references: {
        model: "accounts",
        key: "accountId",
      },
    },
    followType: {
      type: DataTypes.ENUM("Album", "Artist"),
      allowNull: false,
    },
    followId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = UserFollow;
