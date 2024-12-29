const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");
const Album = require("./album");

const UserFollow = sequelize.define("userfollows", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
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
}, {
  timestamps: false,
});

module.exports = UserFollow;
