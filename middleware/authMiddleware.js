// Import dependencies
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Store token verification attempts
let tokenAttempts = {};

// Middleware to protect routes and check role-based access
const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];

        // Check if token is provided
        if (!token) {
            logUnauthorizedAttempt(req); // Log unauthorized access attempt
            return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
        }

        const tokenValue = token.split(" ")[1];

        // Check if the token has exceeded the number of allowed attempts (5)
        if (tokenAttempts[tokenValue] && tokenAttempts[tokenValue] >= 5) {
            logUnauthorizedAttempt(req); // Log unauthorized access attempt
            return res.status(403).json({ message: 'Access Denied: Too many invalid attempts!' });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

            // Attach user info to request object
            req.user = decoded;

            // Check if user role is allowed
            if (roles.length && !roles.includes(req.user.role)) {
                logUnauthorizedAttempt(req); // Log unauthorized access attempt
                return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
            }

            // Reset token attempts on successful verification
            delete tokenAttempts[tokenValue];

            // Proceed to the next middleware
            next();
        } catch (err) {
            // Increment the token attempt count on failed verification
            tokenAttempts[tokenValue] = (tokenAttempts[tokenValue] || 0) + 1;
            logUnauthorizedAttempt(req); // Log unauthorized access attempt
            return res.status(401).json({ message: 'Invalid Token' });
        }
    };
};

// Function to log unauthorized attempts
const logUnauthorizedAttempt = (req) => {
    console.log(`Unauthorized access attempt detected from IP: ${req.ip}, Time: ${new Date().toISOString()}`);
};

// Serve static HTML files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes for serving login and register pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Example protected route for 'admin' users only
app.get('/admin', authMiddleware(['admin']), (req, res) => {
    res.send('Welcome, admin!');
});

// Example protected route for any authenticated user
app.get('/dashboard', authMiddleware(), (req, res) => {
    res.send('Welcome to your dashboard, user!');
});

// Set the server to listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
