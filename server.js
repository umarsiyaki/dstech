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

const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());



db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Endpoint to handle checkout
app.post('/api/cart/checkout', (req, res) => {
    const { specialInstructions, cartData } = req.body;

    // Insert into database or perform checkout logic
    // Example: Insert order into orders table
    const order = { special_instructions: specialInstructions, created_at: new Date() };
    db.query('INSERT INTO orders SET ?', order, (error, results) => {
        if (error) return res.status(500).json({ message: 'Checkout failed' });

        const orderId = results.insertId;
        const orderItems = cartData.map(item => ({
            order_id: orderId,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        // Use a batch insert for order items
        const orderItemQuery = 'INSERT INTO order_items (order_id, name, quantity, price) VALUES ?';
        const values = orderItems.map(item => [item.order_id, item.name, item.quantity, item.price]);
        
        db.query(orderItemQuery, [values], (err) => {
            if (err) return res.status(500).json({ message: 'Checkout failed' });

            res.status(200).json({ message: 'Order placed successfully!' });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoute');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Serve HTML pages for routes not handled by API
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));
app.get('/products/contact-us', (req, res) => res.sendFile(path.join(__dirname, 'public/products/contact-us.html')));
app.get('/products/check-out', (req, res) => res.sendFile(path.join(__dirname, 'public/products/check-out.html')));
app.get('/products/climax', (req, res) => res.sendFile(path.join(__dirname, 'public/products/climax.html')));
app.get('/products/collection-page', (req, res) => res.sendFile(path.join(__dirname, 'public/products/collection-page.html')));
app.get('/products/holandia', (req, res) => res.sendFile(path.join(__dirname, 'public/products/holandia.html')));
app.get('/products/locozade', (req, res) => res.sendFile(path.join(__dirname, 'public/products/locozade.html')));
app.get('/products/vendor', (req, res) => res.sendFile(path.join(__dirname, 'public/products/vendor.html')));
app.get('/products/maltina', (req, res) => res.sendFile(path.join(__dirname, 'public/products/maltina.html')));
app.get('/products/marketing', (req, res) => res.sendFile(path.join(__dirname, 'public/products/marketing.html')));
app.get('/products/message', (req, res) => res.sendFile(path.join(__dirname, 'public/register.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public/register.html')));
app.get('/products/cart', (req, res) => res.sendFile(path.join(__dirname, 'public/products/cart.html')));
app.get('/products/faqs', (req, res) => res.sendFile(path.join(__dirname, 'public/products/faqs.html')));
app.get('/products/bigi', (req, res) => res.sendFile(path.join(__dirname, 'public/products/bigi.html')));
app.get('/products/big', (req, res) => res.sendFile(path.join(__dirname, 'public/products/big.html')));
app.get('/products/vijju', (req, res) => res.sendFile(path.join(__dirname, 'public/products/vijju.html')));
app.get('/products/404', (req, res) => res.sendFile(path.join(__dirname, 'public/products/404.html')));
app.get('/products/about-us', (req, res) => res.sendFile(path.join(__dirname, 'public/products/about-us.html')));
// Add additional routes as needed

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});
app.use((req, res, next) => {
  res.status(400).sendFile(path.join(__dirname, 'public/400.html'));
});
app.use((req, res, next) => {
  res.status(402).sendFile(path.join(__dirname, 'public/402.html'));
});
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/reviewsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Define a review schema and model
const reviewSchema = new mongoose.Schema({
  name: String,
  comment: String,
  rating: Number
});

// Handle review submission
app.post('/api/reviews', async (req, res) => {
  const { name, comment, rating } = req.body;
  
  try {
    const review = new Review({ name, comment, rating });
    await review.save();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Fetch reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  }
   catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a review schema and model

const Review = mongoose.model('Review', reviewSchema);

// Handle review submission
app.post('/api/reviews', async (req, res) => {
  const { name, comment, rating } = req.body;
  
  try {
    const review = new Review({ name, comment, rating });
    await review.save();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Fetch reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
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
// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // Verify token and proceed
  next();
}

// Protect review submission route
app.post('/api/reviews', isAuthenticated, async (req, res) => {
  // Review submission logic
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
