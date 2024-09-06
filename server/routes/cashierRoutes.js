const express = require('express');
const router = express.Router();
const db = require('../db');

// Log activity
const logActivity = (userId, activityType, description) => {
    db.run('INSERT INTO activities (user_id, activity_type, description) VALUES (?, ?, ?)', [userId, activityType, description]);
};

// Process order by cashier
router.post('/orders', (req, res) => {
    const { userId, total, shippingAddress, paymentMethod } = req.body;
    db.run('INSERT INTO orders (user_id, total, shipping_address, payment_method) VALUES (?, ?, ?, ?)', 
        [userId, total, shippingAddress, paymentMethod], 
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error placing order' });
            }
            const orderId = this.lastID;
            // Handle order items (omitted for brevity)
            logActivity(userId, 'order_placed', `Order ${orderId} placed`);
            res.status(201).json({ id: orderId });
        }
    );
});

// Track daily, weekly, and monthly revenue
router.get('/revenue/:period', (req, res) => {
    const period = req.params.period; // 'daily', 'weekly', 'monthly'
    let query;
    switch (period) {
        case 'daily':
            query = 'SELECT SUM(total) AS total_revenue FROM orders WHERE DATE(created_at) = CURRENT_DATE';
            break;
        case 'weekly':
            query = 'SELECT SUM(total) AS total_revenue FROM orders WHERE DATE(created_at) BETWEEN DATE("now", "-7 days") AND CURRENT_DATE';
            break;
        case 'monthly':
            query = 'SELECT SUM(total) AS total_revenue FROM orders WHERE DATE(created_at) BETWEEN DATE("now", "-1 month") AND CURRENT_DATE';
            break;
        default:
            return res.status(400).json({ message: 'Invalid period' });
    }
    db.get(query, (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching revenue data' });
        }
        res.json({ total_revenue: row.total_revenue });
    });
});

module.exports = router;
