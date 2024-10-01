const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, uploadMedia } = require('../components/message');

// Route to get messages (Inbox, Unread, etc.)
router.get('/messages', getMessages);

// Route to send a new message
router.post('/messages/send', sendMessage);

// Route to upload media in a message
router.post('/messages/upload', uploadMedia);

// Update a message
router.put('/messages/:id', (req, res) => {
    const id = req.params.id;
    const { message } = req.body;
    db.run('UPDATE messages SET message = ? WHERE id = ?', [message, id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error updating message' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json({ message: 'Message updated' });
    });
});

// Mark a message as read/unread
router.patch('/messages/:id/read', (req, res) => {
    const id = req.params.id;
    const { isRead } = req.body;
    db.run('UPDATE messages SET is_read = ? WHERE id = ?', [isRead, id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error updating message status' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json({ message: 'Message status updated' });
    });
});


// Get paginated messages for a user
router.get('/messages/:userId', (req, res) => {
    const userId = req.params.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    db.all('SELECT * FROM messages WHERE receiver_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', [userId, limit, offset], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching messages' });
        }
        res.json(rows);
    });
});

// Search messages
router.get('/messages/search', (req, res) => {
    const { q } = req.query;
    db.all('SELECT * FROM messages WHERE message LIKE ?', [`%${q}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error searching messages' });
        }
        res.json(rows);
    });
});