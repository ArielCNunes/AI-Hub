// Import required modules and configure environment variables
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Claude API credentials and endpoint
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// POST endpoint to send a user prompt to Claude and return the response
router.post('/', async (req, res) => {
    const { prompt } = req.body;

    try {
        // Send a request to the Claude API with the user prompt and model settings
        const response = await axios.post(
            CLAUDE_API_URL,
            {
                // Request body
                model: 'claude-3-7-sonnet-20250219',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': CLAUDE_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        );
        // Return the Claude API response to the frontend
        res.json(response.data);
    } catch (error) {
        // Return an error response if the Claude API call fails
        res.status(500).json({
            error: 'Error communicating with Claude API',
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;