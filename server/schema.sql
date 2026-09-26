-- MySQL Schema for ENVIAAR E-Commerce & Admin Dashboard

CREATE DATABASE IF NOT EXISTS enviaar_db;
USE enviaar_db;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    category_id INT,
    description TEXT,
    regular_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    sell_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    status ENUM('Published', 'Inactive', 'out Stock', 'Draft', 'Archived') DEFAULT 'Published',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    payment_status ENUM('Paid', 'Unpaid', 'Refunded') DEFAULT 'Unpaid',
    payment_method VARCHAR(50) DEFAULT 'Card',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Seed Real ENVIAAR Categories
INSERT IGNORE INTO categories (id, name, slug) VALUES 
(1, 'Earrings', 'earrings'),
(2, 'Necklaces', 'necklaces'),
(3, 'Bracelets', 'bracelets'),
(4, 'Rings', 'rings'),
(5, 'Kada & Bangles', 'kada'),
(6, 'Mangalsutra', 'mangalsutra'),
(7, 'Men’s Jewellery', 'mens');

-- Seed Real ENVIAAR Products
INSERT IGNORE INTO products (id, sku, name, category_id, regular_price, sell_price, stock_quantity, status, image_url, created_at) VALUES 
(1, '#ENV-EAR001', 'Aurelia Drop Earrings', 1, 3990.00, 3490.00, 48, 'Published', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80', '2024-01-01 10:00:00'),
(2, '#ENV-EAR002', 'Mira Pearl Studs', 1, 2200.00, 1890.00, 65, 'Published', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80', '2024-01-01 11:00:00'),
(3, '#ENV-NCK001', 'Elara Necklace Set', 2, 8490.00, 7490.00, 18, 'Published', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&q=80', '2024-01-01 12:00:00'),
(4, '#ENV-NCK002', 'Noor Pendant Chain', 2, 3490.00, 2990.00, 32, 'Published', 'https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80', '2024-01-01 13:00:00'),
(5, '#ENV-BRC001', 'Solène Tennis Bracelet', 3, 4990.00, 4290.00, 24, 'Published', 'https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80', '2024-01-01 14:00:00'),
(6, '#ENV-RNG001', 'Amaara Cocktail Ring', 4, 3290.00, 2790.00, 15, 'Published', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80', '2024-01-01 15:00:00'),
(7, '#ENV-KAD001', 'Tara Sculpted Kada', 5, 4490.00, 3890.00, 0, 'out Stock', 'https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80', '2024-01-01 16:00:00'),
(8, '#ENV-MNG001', 'Avni Everyday Mangalsutra', 6, 5200.00, 4590.00, 20, 'Published', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&q=80', '2024-01-02 10:00:00'),
(9, '#ENV-MEN001', 'Veer Minimal Cuff', 7, 2990.00, 2490.00, 30, 'Draft', 'https://images.unsplash.com/photo-1611591475874-b8e45fd430e3?w=300&q=80', '2024-01-02 11:00:00'),
(10, '#ENV-MEN002', 'Arjun Signet Ring', 7, 3800.00, 3290.00, 0, 'Inactive', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=80', '2024-01-02 12:00:00');

-- Seed Real ENVIAAR Customers
INSERT IGNORE INTO customers (id, name, email, total_orders, total_spent) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@example.com', 4, 18450.00),
(2, 'Priya Kapoor', 'priya.k@example.com', 2, 9280.00),
(3, 'Rohan Verma', 'rohan.v@example.com', 5, 24900.00);
