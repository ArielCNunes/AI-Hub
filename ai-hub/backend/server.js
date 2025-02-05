const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database'); // Import database
const Chat = require('./models/Chat'); // Import Chat model

const app = express();
app.use(cors());
app.use(express.json());

// Sync the database (Creates tables if they don't exist)
sequelize.sync()
    .then(() => console.log("✅ Database synced!"))
    .catch(err => console.error("❌ Database sync failed:", err));

app.get('/', (req, res) => {
    res.send('Hello from Express.js API!');
});

// Route to save a new chat message
app.post('/api/chat', async (req, res) => {
    const { userId, message, response } = req.body;
    
    try {
        const chat = await Chat.create({ userId, message, response });
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ error: "Error saving chat" });
    }
});

// Route to get all chat messages for a user
app.get('/api/chat/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const chats = await Chat.findAll({ where: { userId } });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving chat history" });
    }
});

// Route to delete all chat messages for a user
app.delete('/api/chat/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        await Chat.destroy({ where: { userId } });
        res.status(200).json({ message: "Chat history deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting chat history" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));