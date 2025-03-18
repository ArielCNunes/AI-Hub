const express = require('express');
const Chat = require('../models/Chat');

const router = express.Router();

// POST endpoint to store a chat
router.post('/', async (req, res) => {
    const { userId, conversationId, message, response } = req.body;

    if (!userId || !conversationId || !message || !response) {
        return res.status(400).json({ error: 'All fields (userId, conversationId, message, response) are required.' });
    }

    try {
        const newChat = new Chat({ userId, conversationId, message, response });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET endpoint to fetch chats for a conversation
router.get('/', async (req, res) => {
    const { userId, conversationId } = req.query;

    if (!userId || !conversationId) {
        return res.status(400).json({ error: 'User ID and Conversation ID are required.' });
    }

    try {
        const chats = await Chat.find({ userId, conversationId }).sort({ createdAt: 1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;