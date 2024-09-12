
// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
};

exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(400).send('Invalid credentials');
    }
};


// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

// Register User
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, email, password, role });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/userModel');
const { sendEmail } = require('../utils/mailer');
const { generateToken } = require('../utils/utils');

// Registration logic
const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            activationToken: crypto.randomBytes(20).toString('hex'),
        });

        // Send activation email
        const activationUrl = `${req.protocol}://${req.get('host')}/auth/activate/${user.activationToken}`;
        await sendEmail(email, 'Account Activation', `Activate your account: ${activationUrl}`);

        res.status(201).json({ message: 'Registration successful. Check your email to activate your account.' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Login logic
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isActivated) {
            return res.status(401).json({ message: 'Account not activated. Check your email.' });
        }

        // Generate JWT
        const token = generateToken(user);
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
};

// Activate account
const activateAccount = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ where: { activationToken: token } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired activation token' });
        }

        user.isActivated = true;
        user.activationToken = null;
        await user.save();

        res.json({ message: 'Account activated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error activating account', error: err.message });
    }
};

// Forgot Password
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send password reset email
        const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;
        await sendEmail(email, 'Password Reset', `Reset your password: ${resetUrl}`);

        res.json({ message: 'Password reset token sent to email.' });
    } catch (err) {
        res.status(500).json({ message: 'Error requesting password reset', error: err.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Password reset successful.' });
    } catch (err) {
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
};

module.exports = {
    register,
    login,
    activateAccount,
    requestPasswordReset,
    resetPassword,
};
