
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const asyncHandler = require('express-async-handler');
const { getAllProducts, getProductById, createProduct, searchProducts } = require('../controllers/productController');
const db = require('../../db/db'); // Assume a db.js file handles database connection and queries

// Initialize cache with a default TTL (time-to-live) of 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

// Get all products with caching and pagination
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const cacheKey = `products_page_${page}_limit_${limit}`;
  const cachedProducts = cache.get(cacheKey);

  if (cachedProducts) {
    return res.json(cachedProducts);
  }

  const products = await getAllProducts({ page, limit });
  cache.set(cacheKey, products);
  res.json(products);
}));

// Fetch product details by ID
router.get('/:productId', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';
  db.query(query, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching product' });
    }
    res.json(results[0]);
  });
}));

// Fetch all products for a category
router.get('/category/:categoryName', asyncHandler(async (req, res) => {
  const { categoryName } = req.params;
  const query = 'SELECT * FROM products WHERE category = ?';
  db.query(query, [categoryName], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.json(results);
  });
}));

// Search products
router.get('/search', asyncHandler(async (req, res) => {
  const query = req.query.q || '';
  const products = await searchProducts(query);
  res.json(products);
}));

// Create a new product with validation and sanitization
router.post('/',
  [
    body('name').isString().trim().notEmpty().withMessage('Product name is required'),
    body('sku').isString().trim().notEmpty().withMessage('SKU is required'),
    body('category').isString().trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, sku, category, price, quantity } = req.body;
    const newProduct = await createProduct({ name, sku, category, price, quantity });
    res.status(201).json(newProduct);
  })
);

module.exports = router;