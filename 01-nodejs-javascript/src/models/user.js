const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatarPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true, 
      },
    },
    gender: {
      type: DataTypes.ENUM(
        "Man",
        "Woman",
        "Something else",
        "Prefer not to say"
      ),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Administrator", "User", "Artist"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
