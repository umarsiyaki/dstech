-- Categories
INSERT INTO categories (name) VALUES 
('Drinks'), 
('Energy Drinks');

-- Vendors
INSERT INTO vendors (name) VALUES 
('Coca-Cola'), 
('PepsiCo'), 
('Hollandia'), 
('Bigi'), 
('Lucozade'), 
('Maltina');

-- Users
INSERT INTO users (buyer_id, name, email, password, address, city) VALUES
('BID001', 'John Doe', 'john@example.com', 'hashedpassword1', '123 Elm St', 'Metropolis'),
('BID002', 'Jane Smith', 'jane@example.com', 'hashedpassword2', '456 Maple Ave', 'Gotham');

-- Products
INSERT INTO products (product_number, name, description, size, price, category_id, vendor_id, stock, rating, image) VALUES 
('coc001', 'Coca-Cola', 'Famous Coca Cola with a unique taste.', '45cl', 1.00, 1, 1, 60, 4.6, 'images/coca_cola.jpg'),
('pepsi001', 'Pepsi', 'Classic Pepsi cola with a refreshing taste.', '45cl', 1.20, 1, 2, 40, 4.5, 'images/pepsi.jpg'),
('bigi001', 'Bigi Apple', 'Refreshing Bigi Apple drink.', '45cl', 1.50, 1, 4, 50, 4.2, 'images/bigi_apple.jpg'),
('slim001', 'Slim Orange', 'Delicious Slim Orange drink.', '50cl', 1.70, 1, 4, 55, 4.0, 'images/slim_orange.jpg'),
('bigi002', 'Bigi Cola', 'Classic Bigi Cola.', '45cl', 1.30, 1, 4, 65, 4.2, 'images/bigi_cola.jpg'),
('hol001', 'Hollandia', 'Smooth Hollandia drink.', '500ml', 1.60, 1, 3, 35, 4.1, 'images/holandia.jpg'),
('viju001', 'Viju', 'Tasty Viju drink.', '500ml', 1.90, 1, 4, 50, 4.3, 'images/viju.jpg'),
('luco001', 'Lucozade', 'Energy drink for a quick boost.', '500ml', 2.00, 2, 5, 30, 4.3, 'images/lucozade.jpg'),
('climax001', 'Climax', 'Strong Climax energy drink.', '500ml', 2.50, 2, 4, 25, 4.7, 'images/climax.jpg'),
('kom001', 'Super Komando', 'Powerful Super Komando energy drink.', '500ml', 3.00, 2, 4, 20, 4.8, 'images/super_komando.jpg'),
('malt001', 'Maltina', 'Tasty Maltina with a rich flavor.', '500ml', 1.80, 1, 6, 45, 4.4, 'images/maltina.jpg'),
('smoove001', 'Smoove', 'Refreshing Smoove drink.', '50cl', 2.10, 1, 4, 40, 4.2, 'images/smoove.jpg');

-- Wishlist
INSERT INTO wishlists (buyer_id, product_number) VALUES 
('BID001', 'coc001'),
('BID002', 'hol001');

-- Comparisons
INSERT INTO comparisons (buyer_id, product_number_1, product_number_2) VALUES 
('BID001', 'coc001', 'bigi002');

-- Purchases
INSERT INTO purchases (buyer_id, product_number, quantity, total_price, purchase_date) VALUES 
('BID001', 'coc001', 2, 2.00, '2024-09-30'),
('BID002', 'hol001', 1, 1.60, '2024-09-30');

-- Shipments
INSERT INTO shipments (purchase_id, shipping_address, city, shipment_date) VALUES 
(1, '123 Elm St', 'Metropolis', '2024-10-01'),
(2, '456 Maple Ave', 'Gotham', '2024-10-01');

-- Notifications
INSERT INTO notifications (buyer_id, message, is_read) VALUES 
('BID001', 'Your order has been shipped!', false),
('BID002', 'Your order has been shipped!', false);

-- Email Notifications
INSERT INTO emails (buyer_id, subject, body, sent_date) VALUES 
('BID001', 'Order Confirmation', 'Your Coca-Cola has been shipped.', '2024-09-30'),
('BID002', 'Order Confirmation', 'Your Hollandia has been shipped.', '2024-09-30');

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


--message

-- Seed data for users
INSERT INTO users (username, password, email) VALUES
('alice', 'hashed_password_1', 'alice@example.com'),
('bob', 'hashed_password_2', 'bob@example.com'),
('charlie', 'hashed_password_3', 'charlie@example.com');

-- Seed data for presence statuses
INSERT INTO presence (userId, status) VALUES
(1, 'active'),
(2, 'away'),
(3, 'offline');

-- Seed data for messages (sample messages)
INSERT INTO messages (senderId, recipientId, content, mediaUrl, status) VALUES
(1, 2, 'Hello Bob!', NULL, 'sent'),
(2, 1, 'Hi Alice, how are you?', NULL, 'delivered'),
(1, 3, 'Hey Charlie!', 'path/to/image.jpg', 'sent');

-- Seed data for spam (sample spam messages)
INSERT INTO spam (userId, messageId) VALUES
(2, 1); -- Assuming Bob marked Alice's message as spam


