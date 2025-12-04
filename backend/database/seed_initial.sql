-- Initial seed data for testing (small dataset)
-- Use the Python ETL script for the full 10,000 records

USE ecommerce_analytics;

-- Insert sample customers
INSERT INTO Customers (name, email, region, signup_date) VALUES
('John Doe', 'john.doe@example.com', 'North America', '2023-01-15'),
('Jane Smith', 'jane.smith@example.com', 'Europe', '2023-02-20'),
('Carlos Rodriguez', 'carlos.rodriguez@example.com', 'Latin America', '2023-03-10'),
('Li Wei', 'li.wei@example.com', 'Asia', '2023-04-05'),
('Emma Johnson', 'emma.johnson@example.com', 'North America', '2023-05-12');

-- Insert sample products
INSERT INTO Products (name, category, cost, price) VALUES
('Laptop Pro 15"', 'Electronics', 800.00, 1299.99),
('Wireless Mouse', 'Electronics', 15.00, 29.99),
('USB-C Cable', 'Accessories', 5.00, 12.99),
('Desk Chair', 'Furniture', 120.00, 249.99),
('Standing Desk', 'Furniture', 250.00, 499.99),
('Monitor 27"', 'Electronics', 200.00, 399.99),
('Keyboard Mechanical', 'Electronics', 50.00, 129.99),
('Webcam HD', 'Electronics', 30.00, 79.99),
('Desk Lamp', 'Furniture', 20.00, 49.99),
('Cable Organizer', 'Accessories', 3.00, 9.99);

-- Insert sample orders
INSERT INTO Orders (customer_id, status, created_at) VALUES
(1, 'Completed', '2024-01-15 10:30:00'),
(2, 'Completed', '2024-02-20 14:45:00'),
(3, 'Pending', '2024-03-10 09:15:00'),
(4, 'Completed', '2024-04-05 16:20:00'),
(5, 'Cancelled', '2024-05-12 11:00:00'),
(1, 'Completed', '2024-06-15 13:30:00'),
(2, 'Completed', '2024-07-20 10:00:00'),
(3, 'Completed', '2024-08-10 15:45:00');

-- Insert sample order items
INSERT INTO OrderItems (order_id, product_id, quantity, unit_price) VALUES
-- Order 1
(1, 1, 1, 1299.99),
(1, 2, 2, 29.99),
-- Order 2
(2, 4, 1, 249.99),
(2, 9, 1, 49.99),
-- Order 3
(3, 3, 5, 12.99),
(3, 10, 3, 9.99),
-- Order 4
(4, 6, 1, 399.99),
(4, 7, 1, 129.99),
-- Order 5 (Cancelled)
(5, 5, 1, 499.99),
-- Order 6
(6, 2, 1, 29.99),
(6, 8, 1, 79.99),
-- Order 7
(7, 1, 1, 1299.99),
(7, 6, 1, 399.99),
-- Order 8
(8, 4, 2, 249.99),
(8, 9, 2, 49.99);
