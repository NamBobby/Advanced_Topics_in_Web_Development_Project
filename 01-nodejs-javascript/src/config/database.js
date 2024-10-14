require('dotenv').config();
const { Sequelize } = require('sequelize');
const fakeDatabase = require('../config/fakebase');

const sequelize = new Sequelize(process.env.DB_DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        ssl: process.env.DB_SSL === 'true'
    }
});

const dbState = [{
    value: 0,
    label: "Disconnected"
},
{
    value: 1,
    label: "Connected"
},
{
    value: 2,
    label: "Connecting"
},
{
    value: 3,
    label: "Disconnecting"
}];

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Connected to database at ${sequelize.options.host}:${sequelize.options.port}`); // connected to db
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return fakeDatabase;
    }
}

module.exports = { sequelize, connectToDatabase };