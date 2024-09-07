// Importing required libraries
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard';
import CashierForm from './components/CashierForm';
import Login from './components/Login';

// Express server setup
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Create express app
const app = express();
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Event triggers for new notifications
io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for admin-side events (e.g., new order, low stock)
  socket.on('newOrder', (orderData) => {
    io.emit('receiveNotification', {
      message: `New Order #${orderData.orderId} received.`,
      timestamp: new Date(),
    });
  });

  // Event: Low stock alert
  socket.on('lowStockAlert', (productData) => {
    io.emit('receiveNotification', {
      message: `Low stock alert for product: ${productData.name}`,
      timestamp: new Date(),
    });
  });

  // Event: User message
  socket.on('newMessage', (messageData) => {
    io.emit('receiveNotification', {
      message: `New message from ${messageData.senderName}`,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/db/database.sql', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB Schemas and Models
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

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set up multer for image uploads
const upload = multer({ dest: 'uploads/' });

// Define routes for products and cashiers
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      totalLeft: req.body.totalLeft,
      image: req.file ? req.file.filename : null,
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

// Additional example routes for other entities (orders, users, etc.)
app.get('/api/orders', async (req, res) => {
  // Logic to fetch orders
  res.send('Orders route');
});

app.get('/api/inventory', async (req, res) => {
  // Logic to fetch inventory
  res.send('Inventory route');
});

app.get('/api/users', async (req, res) => {
  // Logic to fetch users
  res.send('Users route');
});

// React Frontend App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={ProductList} /> {/* Default route */}
          <Route path="/login" component={Login} />
          <Route path="/products" component={ProductList} />
          <Route path="/add-product" component={ProductForm} />
          <Route path="/cart" component={Cart} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/add-cashier" component={CashierForm} />
        </Switch>
      </div>
    </Router>
  );
}

// Set up default 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// WebSocket and Socket.io setup
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Event triggers for new notifications
io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for admin-side events (e.g., new order, low stock)
  socket.on('newOrder', (orderData) => {
    io.emit('receiveNotification', {
      message: `New Order #${orderData.orderId} received.`,
      timestamp: new Date(),
    });
  });

  // Event: Low stock alert
  socket.on('lowStockAlert', (productData) => {
    io.emit('receiveNotification', {
      message: `Low stock alert for product: ${productData.name}`,
      timestamp: new Date(),
    });
  });

  // Event: User message
  socket.on('newMessage', (messageData) => {
    io.emit('receiveNotification', {
      message: `New message from ${messageData.senderName}`,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Real-time notifications with Socket.io
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendNotification', (notification) => {
    io.emit('receiveNotification', notification);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Fetch product list from an external API
fetch('https://api.oladayo.com.ng/products')
  .then(response => response.json())
  .then(data => {
    console.log('Product List:', data);
  })
  .catch(error => console.error('Error fetching data:', error));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default App;
