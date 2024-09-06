const express = require('express');
const router = express.Router();
const db = require('../db');

// Log activity
const logActivity = (userId, activityType, description) => {
    db.run('INSERT INTO activities (user_id, activity_type, description) VALUES (?, ?, ?)', [userId, activityType, description]);
};

// Add cashier
router.post('/cashiers', (req, res) => {
    const { username, password, email } = req.body;
    db.run('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, password, email, 'cashier'], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error adding cashier' });
        }
        logActivity(this.lastID, 'cashier_add', `Cashier ${username} added`);
        res.status(201).json({ id: this.lastID });
    });
});

// Add/update product
router.post('/products', (req, res) => {
    const { name, price, size, category, stock, rating, image, description, brand, discount } = req.body;
    db.run('INSERT INTO products (name, price, size, category, stock, rating, image, description, brand, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [name, price, size, category, stock, rating, image, description, brand, discount], 
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error adding product' });
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

// Update product
router.put('/products/:id', (req, res) => {
    const { name, price, size, category, stock, rating, image, description, brand, discount } = req.body;
    const productId = req.params.id;
    db.run('UPDATE products SET name = ?, price = ?, size = ?, category = ?, stock = ?, rating = ?, image = ?, description = ?, brand = ?, discount = ? WHERE id = ?', 
        [name, price, size, category, stock, rating, image, description, brand, discount, productId], 
        (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating product' });
            }
            logActivity(req.session.userId, 'product_update', `Product ${name} updated`);
            res.json({ message: 'Product updated successfully' });
        }
    );
});

// Track revenue
router.get('/revenue', (req, res) => {
    db.all('SELECT * FROM revenue', (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching revenue data' });
        }
        res.json(rows);
    });
});

// Track cashier performance
router.get('/cashiers/performance', (req, res) => {
    db.all('SELECT * FROM cashier_performance', (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching cashier performance data' });
        }
        res.json(rows);
    });
});

// Track orders
router.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders', (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching orders' });
        }
        res.json(rows);
    });
});

// Confirm payment
router.post('/orders/:id/confirm-payment', (req, res) => {
    const orderId = req.params.id;
    db.run('UPDATE orders SET payment_status = ? WHERE id = ?', ['paid', orderId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error confirming payment' });
        }
        logActivity(req.session.userId, 'payment_confirm', `Payment confirmed for order ${orderId}`);
        res.json({ message: 'Payment confirmed' });
    });
});

// Cancel order
router.post('/orders/:id/cancel', (req, res) => {
    const orderId = req.params.id;
    db.run('UPDATE orders SET status = ? WHERE id = ?', ['canceled', orderId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error canceling order' });
        }
        logActivity(req.session.userId, 'order_cancel', `Order ${orderId} canceled`);
        res.json({ message: 'Order canceled' });
    });
});

// Print receipt
router.get('/receipts/:id/print', (req, res) => {
    const receiptId = req.params.id;
    db.get('SELECT * FROM receipts WHERE id = ?', [receiptId], (err, receipt) => {
        if (err || !receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        // Printing logic here (omitted for brevity)
        res.json({ message: 'Receipt printed' });
    });
});

// Delete receipt
router.delete('/receipts/:id', (req, res) => {
    const receiptId = req.params.id;
    db.run('DELETE FROM receipts WHERE id = ?', [receiptId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting receipt' });
        }
        logActivity(req.session.userId, 'receipt_delete', `Receipt ${receiptId} deleted`);
        res.json({ message: 'Receipt deleted' });
    });
});

module.exports = router;
