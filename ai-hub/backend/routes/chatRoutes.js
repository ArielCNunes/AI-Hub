const express = require('express');
const Chat = require('../models/Chat');

const router = express.Router();

// POST endpoint to save a chat to mongoDB
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

// GET endpoint to fetch all chats
router.get('/', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ createdAt: -1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;