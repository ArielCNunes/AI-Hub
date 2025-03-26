const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, default: 'New Chat' },
    summary: { type: String, default: '' },
    aiModel: { type: String, enum: ['openai', 'claude'], default: 'openai' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversationSchema);