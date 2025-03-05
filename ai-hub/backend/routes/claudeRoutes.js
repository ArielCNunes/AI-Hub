const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// API credentials
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

router.post('/', async (req, res) => {
    const { prompt } = req.body;

    try {
        // Call Claude API
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
        // Send response from Claude API to the client
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Error communicating with Claude API',
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;