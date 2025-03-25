const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// Create a new conversation
router.post('/', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const conversation = new Conversation({ userId });
        await conversation.save();
        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all conversations for a user
router.get('/', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const conversations = await Conversation.find({ userId }).sort({ createdAt: -1 });
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a conversation
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;

        const updated = await Conversation.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updated) return res.status(404).json({ error: 'Conversation not found.' });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;