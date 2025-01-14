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
    tableName: "accounts",
    timestamps: false,
  }
);

class User extends Account {}
User.init({
  accountId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Account,
      key: "accountId",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, { sequelize, modelName: "User", tableName: "users", timestamps: false });
User.addHook("beforeCreate", (user) => {
  user.role = "User";
});

class Artist extends Account {}
Artist.init({
  accountId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Account,
      key: "accountId",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, { sequelize, modelName: "Artist", tableName: "artists", timestamps: false });
Artist.addHook("beforeCreate", (artist) => {
  artist.role = "Artist";
});

class Administrator extends Account {}
Administrator.init({
  accountId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Account,
      key: "accountId",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, { sequelize, modelName: "Administrator", tableName: "administrators", timestamps: false });
Administrator.addHook("beforeCreate", (admin) => {
  admin.role = "Administrator";
});

module.exports = { Account, User, Artist, Administrator };
