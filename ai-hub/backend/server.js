// Import required packages and route handlers
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');
const claudeRoutes = require('./routes/claudeRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

// Load environment variables from .env file
require('dotenv').config();

// Create an Express application
const app = express();

// Apply middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("MongoDB connection failed:", err));

// Simple test route to verify the server is running
app.get('/', (req, res) => {
    res.send('Hello from Express.js API with MongoDB!');
});

// Mount route handlers for chat, Claude AI, and conversation endpoints
app.use('/api/chats', chatRoutes);
app.use('/api/claude', claudeRoutes);
app.use('/api/conversations', conversationRoutes);

// Start the Express server on the specified port
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));