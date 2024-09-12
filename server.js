require('dotenv').config(); // Load environment variables from .env file

// External Modules
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // For authentication
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const NodeCache = require('node-cache');

// Import routes
const userRoutes = require('./server/routes/userRoutes');
const productRoutes = require('./server/routes/productRoutes');
const orderRoutes = require('./server/routes/orderRoutes');
const locationRoutes = require('./server/routes/locationRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const cashierRoutes = require('./server/routes/cashierRoutes');
const paymentRoutes = require('./server/routes/paymentRoutes');
const indexRoutes = require('./server/routes/indexRoutes');
const messageRoutes = require('./server/routes/messageRoutes');

// Import models
const User = require('./server/models/userModel');
const Product = require('./server/models/product');
const Order = require('./server/models/order');
const Notification = require('./server/models/notification');
const Message = require('./server/models/message');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cache = new NodeCache();
const PORT = process.env.PORT || 5000;

// Middleware setup for security, performance, and logging
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(morgan('combined')); // Logging
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// File upload setup (using Multer)
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 60 * 1024 * 1024 }, // 2MB limit
});

// Rate limiting (apply for specific routes like login)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Caching middleware
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  if (cachedResponse) {
    res.send(cachedResponse);
  } else {
    res.originalSend = res.send;
    res.send = (body) => {
      cache.set(key, body, 60 * 10); // Cache for 10 minutes
      res.originalSend(body);
    };
    next();
  }
};
app.use(cacheMiddleware);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// SQLite3 Database Setup
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      totalLeft INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL
    )`);
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/locations', locationRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/cashier', cashierRoutes);
app.use('/payment', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/', indexRoutes);

// Serve HTML files
const serveHTML = (route, file) => app.get(route, (req, res) => res.sendFile(path.join(__dirname, 'public', file)));
serveHTML('/', 'public/index.html');
serveHTML('/admin', 'public/dashboard/admin.html');
serveHTML('/cashier', 'public/dashboard/cashier.html');
serveHTML('/user', 'public/dashboard/user.html');
serveHTML('/register', 'public/register.html');
serveHTML('/login', 'public/login.html');
serveHTML('/market', 'public/marketing.html');
serveHTML('/payment', 'public/payment.html');
serveHTML('/receipt', 'public/retrieve.html');
serveHTML('/blogs', 'public/maltina.html');

// Live notifications and messaging
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('send message', (msg) => {
    io.emit('receive message', msg);
  });
  socket.on('send notification', (notification) => {
    io.emit('receive notification', notification);
  });
});

// Handle 400 - Bad Request
app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).sendFile(path.join(__dirname, 'public', '400.html'));
  } else {
    next(err);
  }
});

// Handle 402 - Payment Required
app.use((err, req, res, next) => {
  if (err.status === 402) {
    res.status(402).sendFile(path.join(__dirname, 'public', '402.html'));
  } else {
    next(err);
  }
});

// Handle 500 - Internal Server Error
app.use((err, req, res, next) => {
  if (err.status === 500 || !err.status) {
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
  } else {
    next(err);
  }
});

// Fallback for any other 404 errors
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});
app.get('/trigger-500', (req, res, next) => {
  const error = new Error('Something went wrong');
  error.status = 500;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Error handling for 404
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
