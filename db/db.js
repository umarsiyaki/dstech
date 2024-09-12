require('dotenv').config();
const mongoose = require('mongoose');
const mysql = require('mysql');
const sqlite3 = require('sqlite3').verbose();


const { Pool } = require('pg'); // Assuming you're using PostgreSQL

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;
// MongoDB Connection and Schemas
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// Define MongoDB schemas
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Create MongoDB models
const Product = mongoose.model('Product', productSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Product, BlogPost, User };

// SQLite Database Setup
const sqliteDb = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        sqliteDb.serialize(() => {
            sqliteDb.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                size TEXT,
                category TEXT,
                stock INTEGER,
                rating DECIMAL(3, 2),
                image TEXT,
                description TEXT
            )`);

            sqliteDb.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                role TEXT CHECK(role IN ('admin', 'cashier', 'user')) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            sqliteDb.run(`CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                status TEXT CHECK(status IN ('pending', 'confirmed', 'canceled')) DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )`);

            sqliteDb.run(`CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY(order_id) REFERENCES orders(id),
                FOREIGN KEY(product_id) REFERENCES products(id)
            )`);

            sqliteDb.run(`CREATE TABLE IF NOT EXISTS receipts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                receipt_text TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(order_id) REFERENCES orders(id)
            )`);

            sqliteDb.run(`CREATE TABLE IF NOT EXISTS cashier_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cashier_id INTEGER NOT NULL,
                total_sales DECIMAL(10, 2) DEFAULT 0,
                total_orders INTEGER DEFAULT 0,
                date DATE DEFAULT CURRENT_DATE,
                FOREIGN KEY(cashier_id) REFERENCES users(id)
            )`);

            sqliteDb.run(`CREATE TABLE IF NOT EXISTS revenue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                total_revenue DECIMAL(10, 2) DEFAULT 0,
                date DATE DEFAULT CURRENT_DATE
            )`);
        });
    }
});

const getAllProducts = (callback) => {
    const query = 'SELECT * FROM products';
    sqliteDb.all(query, (err, results) => {
        if (err) throw err;
        callback(results);
    });
};

const getProductById = (productId, callback) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    sqliteDb.get(query, [productId], (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

const getUserById = (userId, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    sqliteDb.get(query, [userId], (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

module.exports.sqliteDb = sqliteDb;
module.exports.getAllProducts = getAllProducts;
module.exports.getProductById = getProductById;
module.exports.getUserById = getUserById;

// MySQL Database Setup
const mysqlDb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourPassword',
    database: 'yourDatabase'
});

mysqlDb.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

mysqlDb.serialize(() => {
    mysqlDb.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT,
        quantity INTEGER,
        image TEXT
    )`);

    mysqlDb.run(`CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )`);
});

module.exports.mysqlDb = mysqlDb;
