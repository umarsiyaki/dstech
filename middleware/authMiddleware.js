
// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to protect routes
exports.protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
};

// Role-based Access Control
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next();
    };
};
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Check if the user has a valid token
const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
        }

        try {
            const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
            req.user = decoded;

            // Check if the user has the required role
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
    };
};

module.exports = authMiddleware;
