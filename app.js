// Importing required libraries
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useParams } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import ProductCard from './ProductCard';
import ProductList from './ProductList';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Dashboard from './Dashboard';
import UserProfile from './UserProfile';
import ProductDetail from './ProductDetail';
import ShoppingCart from './ShoppingCart';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import ErrorPage from './ErrorPage';
import { useAuth } from './auth';
import fetch from 'node-fetch'; // Importing node-fetch for server-side fetch

// SQL ORM setup using Sequelize
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Create Express app
const app = express();

const order = require('./order');

app.use(express.json());

app.post('/submit-order', (req, res) => {
  try {
    const orderData = req.body;
    order.submitOrder(orderData);
    res.send('Order submitted successfully!');
  } catch (err) {
    console.error('error submitting order:', err);
    res.status(500).send('Error submitting order');
  }
});

app.get('/order-history', (req, res) => {
  try {
    order.getOrderHistory().then((results) => {
      res.json(results);
    });
  } catch (err) {
    console.error('error getting order history:', err);
    res.status(500).send('Error getting order history');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Create Sequelize instance for SQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
});

// Define SQL models (tables)
const Product = sequelize.define('Product', {
  name: { type: Sequelize.STRING, allowNull: false },
  category: { type: Sequelize.STRING },
  price: { type: Sequelize.FLOAT, allowNull: false },
  quantity: { type: Sequelize.INTEGER, allowNull: false },
  totalLeft: { type: Sequelize.INTEGER, allowNull: false },
  image: { type: Sequelize.STRING },
});

const Cashier = sequelize.define('Cashier', {
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  phone: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  role: { type: Sequelize.STRING },
  status: { type: Sequelize.STRING },
});

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
    const product = await Product.create({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      totalLeft: req.body.totalLeft,
      image: req.file ? req.file.filename : null,
    });
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/cashiers', async (req, res) => {
  try {
    const cashier = await Cashier.create(req.body);
    res.status(201).send(cashier);
  } catch (error) {
    res.status(500).send(error);
  }
});



app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Replace this with your actual authentication logic
    if (username === 'admin' && password === 'adminpassword') {
        // Success: Respond with a success message and user data
        res.json({ success: true, message: 'Login successful' });
    } else {
        // Failure: Respond with an error message
        res.json({ success: false, message: 'Invalid username or password' });
    }
});
// Additional routes for orders, users, etc.
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

// Sync Sequelize models with the database and start the server
sequelize.sync({ force: false }).then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// React Frontend App Component
function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    // Fetch products from API
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => setError(error));
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleRegister = (newUser) => {/* Register logic */};
  const handleAddToCart = (product) => setCart([...cart, product]);
  const handleRemoveFromCart = (productId) => setCart(cart.filter(item => item.id !== productId));
  const handleCheckout = () => {/* Checkout logic */};

  return (
    <Router>
      <Header />
      <Navigation />
      <Switch>
        <Route path="/" exact>
          {user ? <Redirect to="/dashboard" /> : <LoginForm onLogin={handleLogin} />}
        </Route>
        <Route path="/dashboard">
          {user ? (
            <Dashboard>
              <ProductList products={products} onAddToCart={handleAddToCart} />
              <ShoppingCart cart={cart} onRemoveFromCart={handleRemoveFromCart} />
              <CheckoutForm onCheckout={handleCheckout} />
            </Dashboard>
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/products/:id">
          <ProductDetail />
        </Route>
        <Route path="/register">
          <RegisterForm onRegister={handleRegister} />
        </Route>
        <Route path="/profile">
          {user ? <UserProfile /> : <Redirect to="/" />}
        </Route>
        <Route path="/order-summary">
          {user ? <OrderSummary /> : <Redirect to="/" />}
        </Route>
        <Route path="/static/:filename">
          <StaticFile />
        </Route>
        <Route path="*">
          <ErrorPage error="Page not found" />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

const StaticFile = () => {
  const { filename } = useParams();
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch(`/static/${filename}`)
      .then(response => response.blob())
      .then(blob => setFile(blob));
  }, [filename]);

  return file ? (
    <div>
      <h1>Static File: {filename}</h1>
      <object data={URL.createObjectURL(file)} type="application/pdf" />
    </div>
  ) : (
    <div>Loading...</div>
  );
};
// Vendor IDs mapping for each page
const vendorMapping = {
  'index.html': {
    'bigi': 'bigi-products',
    'maltinal': 'maltinal-products',
    // add more vendors as needed
  },
  'bigi.html': { 'bigi': 'products' },
  'maltina.html': { 'maltinal': 'products' },
  // map other pages and vendors
};

// Example product data (can be retrieved from a server/database)
const products = [
  { id: 1, vendor: 'bigi', name: 'Bigi Cola', price: '$1', img: 'bigi-cola.jpg', size: '50cl' },
  { id: 2, vendor: 'maltinal', name: 'Maltina (can)', price: '$1.5', img: 'maltina-can.jpg', size: '50cl' },
  // Add more products
];

// Save product to localStorage and Database
function saveProductData(product) {
  let storedProducts = JSON.parse(localStorage.getItem('products')) || [];
  storedProducts.push(product);
  localStorage.setItem('products', JSON.stringify(storedProducts));

  // Save to database
  fetch('https://api.oladayoent.com.ng/save-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  .then(response => response.json())
  .then(data => console.log('Product saved to database:', data))
  .catch(error => console.error('Error saving product:', error));
}

// Dynamically load and render products by vendor
function renderProductsByVendor(vendorID) {
  const productsContainer = document.getElementById(vendorID);
  if (!productsContainer) return;

  // Retrieve products from localStorage or fallback to default
  const storedProducts = JSON.parse(localStorage.getItem('products')) || products;

  storedProducts
    .filter(product => product.vendor === vendorID)
    .forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Size: ${product.size}</p>
        <p>Price: ${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      productsContainer.appendChild(productCard);
    });

  // Add event listeners for "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      const selectedProduct = storedProducts.find(product => product.id == productId);
      saveProductData(selectedProduct);
    });
  });
}

// Get current page and load corresponding vendor products
const currentPage = window.location.pathname.split('/').pop();
const vendors = vendorMapping[currentPage];
if (vendors) {
  Object.values(vendors).forEach(vendorID => renderProductsByVendor(vendorID));
}

export default App;
