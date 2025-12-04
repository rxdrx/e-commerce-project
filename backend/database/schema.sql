-- E-commerce Analytics Database Schema
-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS ecommerce_analytics;
CREATE DATABASE ecommerce_analytics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_analytics;

-- Table: Customers
-- Stores customer information
CREATE TABLE Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(100) NOT NULL,
    signup_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_region (region),
    INDEX idx_signup_date (signup_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Products
-- Stores product catalog with cost and price information
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_name (name),
    CHECK (price >= cost),
    CHECK (cost >= 0),
    CHECK (price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: Orders
-- Stores order header information
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_customer_status (customer_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: OrderItems
-- Stores individual items within an order
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_order_product (order_id, product_id),
    CHECK (quantity > 0),
    CHECK (unit_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create a view for order totals (useful for analytics)
CREATE VIEW OrderTotals AS
SELECT 
    o.id AS order_id,
    o.customer_id,
    o.status,
    o.created_at,
    SUM(oi.quantity * oi.unit_price) AS total_amount,
    COUNT(oi.id) AS total_items
FROM Orders o
LEFT JOIN OrderItems oi ON o.id = oi.order_id
GROUP BY o.id, o.customer_id, o.status, o.created_at;

-- Create a view for product profit margins
CREATE VIEW ProductMargins AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.cost,
    p.price,
    (p.price - p.cost) AS profit_margin,
    ((p.price - p.cost) / p.cost * 100) AS profit_margin_percentage
FROM Products p;

-- Create indexes for common analytics queries
CREATE INDEX idx_orders_created_year_month ON Orders(YEAR(created_at), MONTH(created_at));
CREATE INDEX idx_orderitems_composite ON OrderItems(order_id, product_id, quantity, unit_price);
