const express = require('express');
const Chat = require('../models/Chat');

const router = express.Router();

// POST endpoint to store a chat
router.post('/', async (req, res) => {
    const { userId, message, response } = req.body;

    if (!userId || !message || !response) {
        return res.status(400).json({ error: 'All fields (userId, message, response) are required.' });
    }

    try {
        const newChat = new Chat({ userId, message, response });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET endpoint to fetch chats for a user
router.get('/', async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;