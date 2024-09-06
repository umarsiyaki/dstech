
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Register user
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, email], (err, results) => {
        if (err) throw err;
        res.json({ message: 'User registered successfully' });
    });
});

const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { getAllUsers, deleteUser } = require('../controllers/userController');

// Get all users (only Admin)
router.get('/users', protect, restrictTo('Admin'), getAllUsers);

// Delete a user (only Admin)
router.delete('/users/:id', protect, restrictTo('Admin'), deleteUser);

// Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.userId = user.id;
                res.json({ message: 'Login successful' });
            } else {
                res.json({ message: 'Invalid credentials' });
            }
        } else {
            res.json({ message: 'User not found' });
        }
    });
});


const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', 
            [username, hashedPassword, email, role], 
            function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Error registering user' });
                }
                res.status(201).json({ id: this.lastID });
            }
        );
    } catch {
        res.status(500).json({ message: 'Error hashing password' });
    }
});

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                req.session.userId = user.id;
                res.json({ message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch {
            res.status(500).json({ message: 'Error checking password' });
        }
    });
});

// Password reset request
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });
    db.run('INSERT INTO password_resets (email, token) VALUES (?, ?)', [email, token], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating reset request' });
        }
        // Send reset link (omitted for brevity)
        res.json({ message: 'Password reset link sent' });
    });
});

// Password reset
router.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;
    jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, decoded.email], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating password' });
            }
            res.json({ message: 'Password updated successfully' });
        });
    });
});

// Update profile
router.put('/profile', (req, res) => {
    const { username, email } = req.body;
    const userId = req.session.userId;
    db.run('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating profile' });
        }
        res.json({ message: 'Profile updated successfully' });
    });
});
module.exports = router;