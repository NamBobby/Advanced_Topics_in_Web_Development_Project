const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Account = require("./user");

const Playlist = sequelize.define(
  "playlists",
  {
    id: {
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
    thumbnailPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    accountId: {
      type: DataTypes.INTEGER,
      references: {
        model: Account,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Account.hasMany(Playlist, { foreignKey: "accountId" });
Playlist.belongsTo(Account, { foreignKey: "accountId" });

module.exports = Playlist;
