// config/dbConfig.js

require('dotenv').config();  // Load environment variables from .env file

module.exports = {
    logging: false,
    storage: './db.sqlite',
    dialect: 'sqlite',
  };