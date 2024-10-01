const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db/messageModel');
const router = express.Router();

// Fetch all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await db.getMessages(req.user.id);  // Fetch only for the current user
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
});

// Send a message
router.post('/messages', [
  body('recipientId').isInt().withMessage('Recipient ID must be a valid integer.'),
  body('content').notEmpty().withMessage('Message content cannot be empty.')
    .matches(/^[^<>{}]*$/).withMessage('Invalid characters in message content.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { recipientId, content } = req.body;
    const newMessage = await db.createMessage(req.user.id, recipientId, content);
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Server error while sending message' });
  }
});

module.exports = router;
