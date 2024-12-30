const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Account = require("./user");

const Music = sequelize.define("music", {
  id: {
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
    references: {
      model: Account,
      key: "id",
    },
    allowNull: false,
  },
  albumId: {
    type: DataTypes.INTEGER,
    references: {
      model: "albums",
      key: "id",
    },
    allowNull: true,
  },
}, {
  timestamps: false,
});

Account.hasMany(Music, { foreignKey: "accountId" });
Music.belongsTo(Account, { foreignKey: "accountId" });

module.exports = Music;
