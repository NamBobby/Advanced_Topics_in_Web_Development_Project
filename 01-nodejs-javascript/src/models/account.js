const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");

class Account extends Model {}

Account.init(
  {
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'account_id' 
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
      field: 'avatar_path'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_of_birth',
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
    field: 'account_id',
    references: {
      model: Account,
      key: "accountId",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
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
    field: 'account_id',
    references: {
      model: Account,
      key: "accountId",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
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
    field: 'account_id',
    references: {
      model: Account,
      key: "accountId",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  },
}, { sequelize, modelName: "Administrator", tableName: "administrators", timestamps: false });
Administrator.addHook("beforeCreate", (admin) => {
  admin.role = "Administrator";
});

module.exports = { Account, User, Artist, Administrator };