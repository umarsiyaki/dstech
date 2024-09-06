-- Initialize database.sql

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT,
    quantity INTEGER,
    rating DECIMAL(3, 2),
    image TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('admin', 'cashier', 'user')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
    profile_picture TEXT
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT CHECK(status IN ('pending', 'confirmed', 'canceled')) DEFAULT 'pending',
    shipping_address TEXT,
    payment_method TEXT CHECK(payment_method IN ('credit_card', 'paypal', 'bank_transfer')),
    payment_status TEXT CHECK(payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

-- Receipts Table
CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    receipt_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);

-- Cashier Performance Table
CREATE TABLE IF NOT EXISTS cashier_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cashier_id INTEGER NOT NULL,
    total_sales DECIMAL(10, 2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY(cashier_id) REFERENCES users(id)
);

-- Revenue Tracking Table
CREATE TABLE IF NOT EXISTS revenue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK(type IN ('info', 'warning', 'error')) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_type TEXT CHECK(activity_type IN ('login', 'logout', 'order', 'profile_update')) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Password Resets Table
CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);
-- Sample Updates

-- 1. Update user email domain
-- This query updates all user emails from an old domain to a new domain.
UPDATE users
SET email = REPLACE(email, '@old-domain.com', '@new-domain.com');

-- 2. Deactivate inactive users
-- This query sets the status of users who haven't logged in for over a year to 'inactive'.
UPDATE users
SET status = 'inactive'
WHERE last_login < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- 3. Clear old notifications
-- This query deletes notifications that are older than 6 months.
DELETE FROM notifications
WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- 4. Archive old orders
-- This query moves orders older than 1 year to an archive table (assuming you have an archive table).
INSERT INTO orders_archive (id, user_id, total_price, created_at)
SELECT id, user_id, total_price, created_at
FROM orders
WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Delete orders from the main table after archiving.
DELETE FROM orders
WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- 5. Update product prices based on discount
-- This query applies a discount to all products in a certain category.
UPDATE products
SET price = price * (1 - discount / 100)
WHERE category = 'Drinks';

-- 6. Reset user passwords (example of bulk operations, use with caution)
-- This query sets a default password for all users (assuming the password column uses hashing in practice).
UPDATE users
SET password = 'default_password_hash';  -- Replace with an appropriate hashed password.

-- 7. Remove expired promotions
-- This query deletes promotions that have expired (assuming a promotions table with an expiration date).
DELETE FROM promotions
WHERE expiration_date < NOW();

-- 8. Clean up orphaned cart items
-- This query deletes cart items where the referenced product no longer exists.
DELETE FROM cart
WHERE product_id NOT IN (SELECT id FROM products);

-- 9. Log user activities
-- Insert a log entry for a user activity (example for logging activity).
INSERT INTO activities (user_id, activity_type, description, timestamp)
VALUES (1, 'login', 'User logged in successfully.', NOW());

-- 10. Update product stock
-- This query increases the stock of all products in a certain category.
UPDATE products
SET quantity = quantity + 10
WHERE category = 'Energy Drinks';
