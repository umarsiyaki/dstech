require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Initialize Express app

// Middleware for security, performance, and logging
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(morgan('combined')); // Logging
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting to prevent DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// SQLite3 Database Setup
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    // Initialize tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      data TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    )`);
  }
});

// Routes
app.post('/submit-form', (req, res) => {
  const { name, data } = req.body;
  db.run(`INSERT INTO forms (name, data, timestamp) VALUES (?, ?, ?)`, 
  [name, JSON.stringify(data), Date.now()], 
  (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error submitting form' });
    } else {
      res.send({ message: 'Form submitted successfully' });
    }
  });
});

app.get('/get-form-data', (req, res) => {
  db.all(`SELECT * FROM forms`, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error fetching form data' });
    } else {
      res.send(rows);
    }
  });
});

app.post('/log-activity', (req, res) => {
  const { type, data } = req.body;
  db.run(`INSERT INTO activity (type, data, timestamp) VALUES (?, ?, ?)`, 
  [type, JSON.stringify(data), Date.now()], 
  (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error logging activity' });
    } else {
      res.send({ message: 'Activity logged successfully' });
    }
  });
});

// MongoDB Setup and Routes
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send({ message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Server error' });
});

// Start the server

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/products', productRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/cart', cartRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const productRoutes = require('./server/routes/productRoutes');
const cartRoutes = require('./server/routes/cartRoutes');
const roleRoutes = require('./server/routes/roleRoutes');
const activityRoutes = require('./server/routes/activityRoutes');
const cashierRoutes = require('./server/routes/cashierRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const userRoutes = require('./server/routes/userRoutes');
const orderRoutes = require('./server/routes/orderRoutes');
const paymentRoutes = require('./server/routes/paymentRoutes');
const receiptRoutes = require('./server/routes/receiptRoutes');
const registerRoutes = require('./server/routes/registerRoutes');

const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/cashier', cashierRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/role', roleRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map(product => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Products;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();


// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/yourdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    quantity: Number,
    totalLeft: Number,
    image: String
}));

const Cashier = mongoose.model('Cashier', new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    username: String,
    password: String,
    role: String,
    status: String
}));

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
const upload = multer({ dest: 'uploads/' });

// Routes
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const product = new Product({
            name: req.body.productName,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            totalLeft: req.body.totalLeft,
            image: req.file ? req.file.filename : null
        });
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/cashiers', async (req, res) => {
    try {
        const cashier = new Cashier(req.body);
        await cashier.save();
        res.status(201).send(cashier);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Additional routes for orders, inventory, users
app.get('/api/orders', async (req, res) => {
    // Fetch and return orders data
});

app.get('/api/inventory', async (req, res) => {
    // Fetch and return inventory data
});

app.get('/api/users', async (req, res) => {
    // Fetch and return users data
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server/server.js

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const revenueRoutes = require('./routes/revenueRoutes'); // Ensure this file exists
const cashierRoutes = require('./routes/cashierRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes'); // Ensure this file exists
const orderRoutes = require('./routes/orderRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes'); // Ensure this file exists
const roleRoutes = require('./routes/roleRoutes');


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schemas and Models




// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
    }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/cashier', cashierRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/role', roleRoutes);

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));