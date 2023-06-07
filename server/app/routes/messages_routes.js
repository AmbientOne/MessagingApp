const express = require('express');
const router = express.Router();
const Message = require('../models/messaging');

// Get all messages
router.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Get messages for a specific room
router.get('/api/messages/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await Message.find({ room: roomId });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = (app) => {
    app.use('/', router);
};
