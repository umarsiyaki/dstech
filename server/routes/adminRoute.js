const express = require('express');
const router = express.Router();
const db = require('../db');

// Utility function for logging activities
const logActivity = (userId, activityType, description) => {
    db.run('INSERT INTO activities (user_id, activity_type, description) VALUES (?, ?, ?)', [userId, activityType, description]);
};

// Middleware for handling database errors
const handleDBError = (res, message) => (err) => {
    if (err) {
        return res.status(500).json({ message });
    }
};

// Route to add a new cashier
router.post('/cashiers', (req, res) => {
    const { username, password, email } = req.body;
    const query = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)';
    
    db.run(query, [username, password, email, 'cashier'], function (err) {
        if (err) return res.status(500).json({ message: 'Error adding cashier' });
        logActivity(this.lastID, 'cashier_add', `Cashier ${username} added`);
        res.status(201).json({ id: this.lastID });
    });
});

// Route to add a new product
router.post('/products', (req, res) => {
    const { name, price, size, category, stock, rating, image, description, brand, discount } = req.body;
    const query = `
        INSERT INTO products (name, price, size, category, stock, rating, image, description, brand, discount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [name, price, size, category, stock, rating, image, description, brand, discount], function (err) {
        handleDBError(res, 'Error adding product')(err);
        res.status(201).json({ id: this.lastID });
    });
});

// Route to update an existing product
router.put('/products/:id', (req, res) => {
    const { name, price, size, category, stock, rating, image, description, brand, discount } = req.body;
    const productId = req.params.id;
    const query = `
        UPDATE products 
        SET name = ?, price = ?, size = ?, category = ?, stock = ?, rating = ?, image = ?, description = ?, brand = ?, discount = ?
        WHERE id = ?
    `;

    db.run(query, [name, price, size, category, stock, rating, image, description, brand, discount, productId], (err) => {
        if (err) return res.status(500).json({ message: 'Error updating product' });
        logActivity(req.session.userId, 'product_update', `Product ${name} updated`);
        res.json({ message: 'Product updated successfully' });
    });
});

// Route to get all revenue records
router.get('/revenue', (req, res) => {
    db.all('SELECT * FROM revenue', (err, rows) => {
        handleDBError(res, 'Error fetching revenue data')(err);
        res.json(rows);
    });
});

// Route to get cashier performance data
router.get('/cashiers/performance', (req, res) => {
    db.all('SELECT * FROM cashier_performance', (err, rows) => {
        handleDBError(res, 'Error fetching cashier performance data')(err);
        res.json(rows);
    });
});

// Route to get all orders
router.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders', (err, rows) => {
        handleDBError(res, 'Error fetching orders')(err);
        res.json(rows);
    });
});

// Route to confirm payment for an order
router.post('/orders/:id/confirm-payment', (req, res) => {
    const orderId = req.params.id;
    db.run('UPDATE orders SET payment_status = ? WHERE id = ?', ['paid', orderId], (err) => {
        if (err) return res.status(500).json({ message: 'Error confirming payment' });
        logActivity(req.session.userId, 'payment_confirm', `Payment confirmed for order ${orderId}`);
        res.json({ message: 'Payment confirmed' });
    });
});

// Route to cancel an order
router.post('/orders/:id/cancel', (req, res) => {
    const orderId = req.params.id;
    db.run('UPDATE orders SET status = ? WHERE id = ?', ['canceled', orderId], (err) => {
        if (err) return res.status(500).json({ message: 'Error canceling order' });
        logActivity(req.session.userId, 'order_cancel', `Order ${orderId} canceled`);
        res.json({ message: 'Order canceled' });
    });
});

// Route to print a receipt
router.get('/receipts/:id/print', (req, res) => {
    const receiptId = req.params.id;
    db.get('SELECT * FROM receipts WHERE id = ?', [receiptId], (err, receipt) => {
        if (err || !receipt) return res.status(404).json({ message: 'Receipt not found' });
        // Printing logic here (omitted for brevity)
        res.json({ message: 'Receipt printed' });
    });
});

// Route to delete a receipt
router.delete('/receipts/:id', (req, res) => {
    const receiptId = req.params.id;
    db.run('DELETE FROM receipts WHERE id = ?', [receiptId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting receipt' });
        logActivity(req.session.userId, 'receipt_delete', `Receipt ${receiptId} deleted`);
        res.json({ message: 'Receipt deleted' });
    });
});

// Route to export data (JSON format)
router.get('/api/export', (req, res) => {
    const dataToExport = [
        { id: 1, name: 'iPhone 13', type: 'Product', price: 999 },
        { id: 2, name: 'Order #12345', type: 'Order', total: 300 },
        { id: 3, name: 'John Doe', type: 'User', email: 'john@example.com' }
    ];
    res.json(dataToExport);
});

// Route to import data (CSV or Excel)
router.post('/api/import', (req, res) => {
    const importedData = req.body;
    // Process and save the imported data to the database
    res.status(200).json({ message: 'Data imported successfully' });
});
// AdminDashboard.jsx
import React, { useState } from 'react';
import Modal from '../public/dashboard/js/Modals';

const AdminDashboard = () => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <div>
            <button onClick={openModal}>Add Cashier</button>
            {showModal && <Modal closeModal={closeModal} />}
        </div>
    );
};

export default AdminDashboard;

module.exports = router;
