const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');
const claudeRoutes = require('./routes/claudeRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("MongoDB connection failed:", err));

// Test route
app.get('/', (req, res) => {
    res.send('Hello from Express.js API with MongoDB!');
});

// Use chat routes
app.use('/api/chats', chatRoutes);
app.use('/api/claude', claudeRoutes);

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));