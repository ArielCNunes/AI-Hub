const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Chat = require('./models/Chat');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/chats', chatRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv://admin:admin@ai-hub.kbvd9.mongodb.net/?retryWrites=true&w=majority&appName=AI-Hub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("MongoDB connection failed:", err));

// Test route
app.get('/', (req, res) => {
    res.send('Hello from Express.js API with MongoDB!');
});

// Route to save a new chat message
app.post('/api/chat', async (req, res) => {
    const { userId, message, response } = req.body;

    try {
        const chat = new Chat({ userId, message, response });
        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ error: "Error saving chat" });
    }
});

// Route to get all chat messages for a user
app.get('/api/chat/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const chats = await Chat.find({ userId });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving chat history" });
    }
});

// Route to delete all chat messages for a user
app.delete('/api/chat/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await Chat.deleteMany({ userId });
        res.status(200).json({ message: "Chat history deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting chat history" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));