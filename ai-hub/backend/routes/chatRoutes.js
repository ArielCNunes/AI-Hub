const express = require('express');
// Import required modules and models
const Chat = require('../models/Chat');
const Conversation = require('../models/Conversation');

// Create a new Express router instance
const router = express.Router();

// POST endpoint to save a new chat message and update conversation tokens
router.post('/', async (req, res) => {
    const { userId, conversationId, message, response, tokens } = req.body;
    console.log('Received tokens from frontend:', tokens);

    // Validate required fields in the request body
    if (!userId || !conversationId || !message || !response) {
        return res.status(400).json({ error: 'All fields (userId, conversationId, message, response) are required.' });
    }

    try {
        // Create and save the chat message
        const newChat = new Chat({ userId, conversationId, message, response });
        await newChat.save();

        // Update the token count in the related conversation
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            const currentTotal = conversation.tokens || 0;
            const newTotal = currentTotal + (tokens || 0);
            conversation.tokens = newTotal;
            await conversation.save();
        }

        res.status(201).json(newChat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET endpoint to fetch all chat messages for a specific conversation
router.get('/', async (req, res) => {
    const { userId, conversationId } = req.query;

    // Validate query parameters
    if (!userId || !conversationId) {
        return res.status(400).json({ error: 'User ID and Conversation ID are required.' });
    }

    try {
        // Fetch and return sorted chat messages
        const chats = await Chat.find({ userId, conversationId }).sort({ createdAt: 1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;