const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
app.use(cors());
app.use(express.json());

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

// Use chat routes
app.use('/api/chats', chatRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));