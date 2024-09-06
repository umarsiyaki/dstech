const express = require('express');
const router = express.Router();
const db = require('../db');

// Submit rating and review
router.post('/submit', (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.session.userId;

    const query = 'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(query, [userId, productId, rating, comment], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Review submitted successfully' });
    });
});

// Fetch reviews for a product
router.get('/product/:productId', (req, res) => {
    const { productId } = req.params;

    const query = 'SELECT u.username, r.rating, r.comment FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ?';
    db.query(query, [productId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

module.exports = router;