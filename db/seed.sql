-- Seed SQL to populate the products table
INSERT INTO products (name, price, size, category, stock, rating, image, description)
VALUES
('Bigi Apple', 1.50, '45cl', 'Drinks', 50, 4.2, 'images/bigi_apple.jpg', 'Refreshing Bigi Apple drink.'),
('Pepsi', 1.20, '45cl', 'Drinks', 40, 4.5, 'images/pepsi.jpg', 'Classic Pepsi cola with a refreshing taste.'),
('Coca Cola', 1.00, '45cl', 'Drinks', 60, 4.6, 'images/coca_cola.jpg', 'Famous Coca Cola with a unique taste.'),
('Slim Orange', 1.70, '50cl', 'Drinks', 55, 4.0, 'images/slim_orange.jpg', 'Delicious Slim Orange drink.'),
('Lucozade', 2.00, '500ml', 'Energy Drinks', 30, 4.3, 'images/lucozade.jpg', 'Energy drink for a quick boost.'),
('Maltina', 1.80, '500ml', 'Drinks', 45, 4.4, 'images/maltina.jpg', 'Tasty Maltina with a rich flavor.'),
('Climax', 2.50, '500ml', 'Energy Drinks', 25, 4.7, 'images/climax.jpg', 'Strong Climax energy drink.'),
('Holandia', 1.60, '500ml', 'Drinks', 35, 4.1, 'images/holandia.jpg', 'Smooth Holandia drink.'),
('Smoove', 2.10, '50cl', 'Drinks', 40, 4.2, 'images/smoove.jpg', 'Refreshing Smoove drink.'),
('Viju', 1.90, '500ml', 'Drinks', 50, 4.3, 'images/viju.jpg', 'Tasty Viju drink.'),
('Bigi Cola', 1.30, '45cl', 'Drinks', 65, 4.2, 'images/bigi_cola.jpg', 'Classic Bigi Cola.'),
('Super Komando', 3.00, '500ml', 'Energy Drinks', 20, 4.8, 'images/super_komando.jpg', 'Powerful Super Komando energy drink.');

-- Seed SQL to populate the users table
INSERT INTO users (username, password, email, role, last_login, status, profile_picture)
VALUES
('admin', 'adminpass', 'admin@example.com', 'admin', NULL, 'active', 'images/admin.jpg'),
('cashier1', 'cashierpass', 'cashier1@example.com', 'cashier', NULL, 'active', 'images/cashier1.jpg'),
('user1', 'userpass', 'user1@example.com', 'user', NULL, 'active', 'images/user1.jpg'),
('user2', 'userpass', 'user2@example.com', 'user', NULL, 'active', 'images/user2.jpg');

-- Seed SQL to populate the activities table
INSERT INTO activities (user_id, activity_type, description, timestamp)
VALUES
((SELECT id FROM users WHERE username = 'admin'), 'login', 'Admin logged in.', CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE username = 'cashier1'), 'login', 'Cashier1 logged in.', CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE username = 'user1'), 'profile_update', 'User1 updated profile.', CURRENT_TIMESTAMP);

-- Seed SQL to populate the orders table
INSERT INTO orders (user_id, total, status, shipping_address, payment_method, payment_status, created_at)
VALUES
((SELECT id FROM users WHERE username = 'user1'), 10.00, 'pending', '123 Main St', 'credit_card', 'pending', CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE username = 'user2'), 25.00, 'confirmed', '456 Elm St', 'paypal', 'paid', CURRENT_TIMESTAMP);

-- Seed SQL to populate the order_items table
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
((SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE username = 'user1')), (SELECT id FROM products WHERE name = 'Pepsi'), 2, 1.20),
((SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE username = 'user2')), (SELECT id FROM products WHERE name = 'Coca Cola'), 5, 1.00);

-- Seed SQL to populate the receipts table
INSERT INTO receipts (order_id, receipt_text, created_at)
VALUES
((SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE username = 'user1')), 'Receipt for order 1', CURRENT_TIMESTAMP),
((SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE username = 'user2')), 'Receipt for order 2', CURRENT_TIMESTAMP);

-- Seed SQL to populate the cashier_performance table
INSERT INTO cashier_performance (cashier_id, total_sales, total_orders, date)
VALUES
((SELECT id FROM users WHERE username = 'cashier1'), 100.00, 10, CURRENT_DATE);

-- Seed SQL to populate the revenue table
INSERT INTO revenue (total_revenue, date)
VALUES
(150.00, CURRENT_DATE);

-- Seed SQL to populate the notifications table
INSERT INTO notifications (user_id, message, type, read, created_at)
VALUES
((SELECT id FROM users WHERE username = 'user1'), 'Your profile has been updated.', 'info', FALSE, CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE username = 'cashier1'), 'New orders are available.', 'info', FALSE, CURRENT_TIMESTAMP);

-- Seed SQL to populate the password_resets table
INSERT INTO password_resets (email, token, created_at)
VALUES
('user1@example.com', 'reset_token_1', CURRENT_TIMESTAMP),
('cashier1@example.com', 'reset_token_2', CURRENT_TIMESTAMP);
