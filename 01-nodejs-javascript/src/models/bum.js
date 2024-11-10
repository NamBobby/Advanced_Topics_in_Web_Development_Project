const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Account = require("./count"); 

const Album = sequelize.define("albums", {
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
    references: {
      model: Account,
      key: "id",
    },
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Album;
