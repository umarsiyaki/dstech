// routes/authRoutes.js
const express = require('express');
const {
    register,
    login,
    getProfile,
    updateProfile,
    logout,
    requestPasswordReset,
    resetPassword,
    changePassword,
    activateAccount,
    refreshToken
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route (invalidate session or token)
router.post('/logout', authMiddleware, logout);

// Get user profile
router.get('/profile', authMiddleware, getProfile);

// Update user profile
router.put('/profile', authMiddleware, updateProfile);

// Request password reset (email)
router.post('/password-reset/request', requestPasswordReset);

// Reset password with token
router.post('/password-reset/:token', resetPassword);

// Change password (user logged in)
router.put('/password-change', authMiddleware, changePassword);

// Activate account (email verification)
router.get('/activate/:token', activateAccount);

// Refresh token
router.post('/refresh-token', refreshToken);
// routes/authRoutes.js
const { register, login, activateAccount, requestPasswordReset, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/activate/:token', activateAccount);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/profile', authMiddleware(), (req, res) => {
    res.json({ message: 'This is a protected route.', user: req.user });
});


module.exports = router;
