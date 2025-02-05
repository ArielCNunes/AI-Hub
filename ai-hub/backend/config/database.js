const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,  // Database name
    process.env.DB_USER,  // Username
    process.env.DB_PASS,  // Password
    {
        host: process.env.DB_HOST,  // Corrected Hostname
        port: process.env.DB_PORT,  // Add this line for port
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Accept self-signed certificates
            }
        }
    }
);

module.exports = sequelize;