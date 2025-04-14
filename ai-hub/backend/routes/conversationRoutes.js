// Import required modules and models
const express = require('express');
// Create a new router instance for handling conversation routes
const router = express.Router();
const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');

// Create a new conversation for the specified user and AI model
router.post('/', async (req, res) => {
    const { userId, aiModel } = req.body;

    // Validate required fields in the request body
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        // Create a new conversation instance
        const conversation = new Conversation({ userId, aiModel });
        await conversation.save();
        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all conversations for a specific user
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

// Update title, summary, or model for a conversation by ID
router.patch('/:id', async (req, res) => {
    // Extracting route parameters and request body
    const { id } = req.params;
    const { title, summary, aiModel } = req.body;

    // Build the update object with only the fields provided
    try {
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (summary !== undefined) updateFields.summary = summary;
        if (aiModel !== undefined) updateFields.aiModel = aiModel;

        // Executing the update and handling not-found or error cases
        const updated = await Conversation.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updated) return res.status(404).json({ error: 'Conversation not found.' });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single conversation by its ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const conversation = await Conversation.findById(id);
        if (!conversation) return res.status(404).json({ error: 'Conversation not found.' });

        res.json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a conversation and all associated chat messages
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Chat.deleteMany({ conversationId: id });
        const deleted = await Conversation.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ error: 'Conversation not found.' });

        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export the router for use in the main server file
module.exports = router;