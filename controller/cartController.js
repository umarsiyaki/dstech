const db = require('../db/db');

const getCartItems = (req, res) => {
    db.all('SELECT * FROM cart', [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Database error' });
            return;
        }
        res.json(rows);
    });
};

const addToCart = (req, res) => {
    const { product_id, quantity } = req.body;
    db.run('INSERT INTO cart (product_id, quantity) VALUES (?, ?)', [product_id, quantity], function (err) {
        if (err) {
            res.status(500).json({ message: 'Database error' });
            return;
        }
        res.status(201).json({ id: this.lastID, product_id, quantity });
    });
};

const updateCartItem = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id], function (err) {
        if (err) {
            res.status(500).json({ message: 'Database error' });
            return;
        }
        res.json({ id, quantity });
    });
};

const removeFromCart = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM cart WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ message: 'Database error' });
            return;
        }
        res.status(204).send();
    });
};

module.exports = { getCartItems, addToCart, updateCartItem, removeFromCart };
