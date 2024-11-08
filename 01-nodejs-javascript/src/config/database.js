require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    query: {
      raw: true,
    },
    timezone: "+07:00",
    dialectOptions: {
      ssl: process.env.DB_SSL === "true",
    },
  }
);

// connected to db
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Connected to database at ${sequelize.options.host}:${sequelize.options.port}`
    ); 
  } catch (error) {
    return console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectToDatabase };
