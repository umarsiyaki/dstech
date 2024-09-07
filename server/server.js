require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const jwt = require('jsonwebtoken'); // For authentication

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup for security, performance, and logging
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(morgan('tiny')); // Logging
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// SQLite3 Database Setup
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    // Initialize tables if they don't exist
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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// MongoDB Schemas and Models
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  totalLeft: Number,
  image: String,
}));

const Cashier = mongoose.model('Cashier', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  username: String,
  password: String,
  role: String,
  status: String,
}));

// File upload setup (using Multer)
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Rate limiting (apply for specific routes like login)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

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

// Admin analytics route (Protected)
app.get('/api/admin/analytics', authenticateToken, (req, res) => {
  // Mock analytics data
  res.json({
    totalUsers: 1000,
    totalOrders: 500,
    totalRevenue: 15000,
  });
});

// Static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes for SQLite (Product and User management)
app.get('/api/products', (req, res) => {
  db.all(`SELECT * FROM products`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching products' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, category, price, quantity, totalLeft } = req.body;
  const image = req.file ? req.file.filename : null;
  const product = new Product({ name, category, price, quantity, totalLeft, image });
  
  product.save().then(() => {
    res.status(201).json({ message: 'Product created successfully' });
  }).catch((err) => res.status(500).json({ error: 'Error creating product' }));
});

// User authentication and login routes (JWT)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Mock user authentication
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, [username, password, email], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error registering user' });
    }
    res.json({ message: 'User registered successfully' });
  });
});

// Product review system (MongoDB)
app.post('/api/products/:productId/review', authenticateToken, (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  Product.findById(productId)
    .then(product => {
      if (!product) return res.status(404).json({ error: 'Product not found' });

      product.reviews.push({ user: req.user.username, rating, comment });
      product.save().then(() => res.status(201).json({ message: 'Review added' }));
    })
    .catch(err => res.status(500).json({ error: 'Error adding review' }));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
