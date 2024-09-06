
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all notifications for a user
router.get('/notifications/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching notifications' });
        }
        res.json(rows);
    });
});

// Get a specific notification
router.get('/notifications/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM notifications WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching notification' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        // Mark as read
        db.run('UPDATE notifications SET is_read = ? WHERE id = ?', [true, id], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating notification' });
            }
            res.json(row);
        });
    });
});

// Delete a notification
router.delete('/notifications/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM notifications WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting notification' });
        }
        res.json({ message: 'Notification deleted' });
    });
});

module.exports = router;