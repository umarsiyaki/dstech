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

export default App;
