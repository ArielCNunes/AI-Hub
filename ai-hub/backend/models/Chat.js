const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Chat model
const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt timestamps
});

module.exports = Chat;