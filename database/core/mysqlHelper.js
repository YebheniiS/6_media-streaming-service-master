require('dotenv').config()
const mysql = require("mysql2");

const connectInteractr = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_INTERACTR
});

const connectAnalytics = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_ANALYTICS
});

module.exports = {
  connectInteractr, connectAnalytics
};