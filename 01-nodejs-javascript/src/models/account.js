const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");

class Account extends Model {}

Account.init(
  {
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      type: DataTypes.ENUM("Man", "Woman", "Something else", "Prefer not to say"),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("User", "Artist", "Administrator"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Account",
    timestamps: false,
  }
);

// Tự động gán role cho lớp con
class User extends Account {}
User.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { sequelize, modelName: "User", tableName: "users" });
User.addHook("beforeCreate", (user) => {
  user.role = "User";
});

class Artist extends Account {}
Artist.init({
  artistId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { sequelize, modelName: "Artist", tableName: "artists" });
Artist.addHook("beforeCreate", (artist) => {
  artist.role = "Artist";
});

class Administrator extends Account {}
Administrator.init({
  adminId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { sequelize, modelName: "Administrator", tableName: "administrators" });
Administrator.addHook("beforeCreate", (admin) => {
  admin.role = "Administrator";
});

module.exports = { Account, User, Artist, Administrator };
