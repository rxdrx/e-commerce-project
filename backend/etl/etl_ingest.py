"""
ETL Script for E-commerce Analytics
Generates 10,000+ records of sales data using Faker
Cleans and inserts data into MySQL database
"""

import csv
import os
from datetime import datetime, timedelta
from decimal import Decimal
import random
from typing import List, Dict, Any
import mysql.connector
from mysql.connector import Error
from faker import Faker
from dotenv import load_dotenv

# Load environment variables
load_dotenv('../.env')

# Initialize Faker
fake = Faker()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'ecommerce_analytics'),
}

# Data generation parameters
NUM_CUSTOMERS = 2000
NUM_PRODUCTS = 100
NUM_ORDERS = 10000
MIN_ITEMS_PER_ORDER = 1
MAX_ITEMS_PER_ORDER = 5

# Product categories
CATEGORIES = ['Electronics', 'Furniture', 'Accessories', 'Clothing', 'Books', 'Home & Garden']

# Regions
REGIONS = ['North America', 'Europe', 'Asia', 'Latin America', 'Africa', 'Oceania']

# Order statuses
STATUSES = ['Completed', 'Pending', 'Cancelled']
STATUS_WEIGHTS = [0.80, 0.15, 0.05]  # 80% completed, 15% pending, 5% cancelled


class ETLPipeline:
    """ETL Pipeline for generating and inserting e-commerce data"""
    
    def __init__(self):
        self.connection = None
        self.customers = []
        self.products = []
        self.orders = []
        self.order_items = []
    
    def connect_db(self) -> bool:
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(**DB_CONFIG)
            if self.connection.is_connected():
                print(f"✓ Connected to MySQL database: {DB_CONFIG['database']}")
                return True
        except Error as e:
            print(f"✗ Error connecting to MySQL: {e}")
            return False
    
    def close_connection(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("✓ Database connection closed")
    
    def generate_customers(self, num_customers: int = NUM_CUSTOMERS) -> List[Dict[str, Any]]:
        """Generate fake customer data"""
        print(f"\n📊 Generating {num_customers} customers...")
        customers = []
        emails = set()
        
        for i in range(num_customers):
            # Ensure unique emails
            email = fake.unique.email()
            while email in emails:
                email = fake.unique.email()
            emails.add(email)
            
            customer = {
                'name': fake.name(),
                'email': email,
                'region': random.choice(REGIONS),
                'signup_date': fake.date_between(start_date='-2y', end_date='today')
            }
            customers.append(customer)
        
        self.customers = customers
        print(f"✓ Generated {len(customers)} customers")
        return customers
    
    def generate_products(self, num_products: int = NUM_PRODUCTS) -> List[Dict[str, Any]]:
        """Generate fake product data"""
        print(f"\n📦 Generating {num_products} products...")
        products = []
        
        for i in range(num_products):
            cost = round(random.uniform(5.0, 500.0), 2)
            markup = random.uniform(1.2, 3.0)  # 20% to 200% markup
            price = round(cost * markup, 2)
            
            product = {
                'name': f"{fake.word().capitalize()} {fake.word().capitalize()} {random.choice(['Pro', 'Plus', 'Max', 'Lite', 'Premium', 'Standard'])}",
                'category': random.choice(CATEGORIES),
                'cost': cost,
                'price': price
            }
            products.append(product)
        
        self.products = products
        print(f"✓ Generated {len(products)} products")
        return products
    
    def generate_orders(self, num_orders: int = NUM_ORDERS) -> tuple:
        """Generate fake orders and order items"""
        print(f"\n🛒 Generating {num_orders} orders...")
        orders = []
        order_items = []
        order_id = 1
        
        for i in range(num_orders):
            customer_id = random.randint(1, len(self.customers))
            status = random.choices(STATUSES, weights=STATUS_WEIGHTS)[0]
            created_at = fake.date_time_between(start_date='-1y', end_date='now')
            
            order = {
                'id': order_id,
                'customer_id': customer_id,
                'status': status,
                'created_at': created_at
            }
            orders.append(order)
            
            # Generate order items
            num_items = random.randint(MIN_ITEMS_PER_ORDER, MAX_ITEMS_PER_ORDER)
            selected_products = random.sample(range(1, len(self.products) + 1), num_items)
            
            for product_id in selected_products:
                product = self.products[product_id - 1]
                quantity = random.randint(1, 5)
                unit_price = product['price']
                
                order_item = {
                    'order_id': order_id,
                    'product_id': product_id,
                    'quantity': quantity,
                    'unit_price': unit_price
                }
                order_items.append(order_item)
            
            order_id += 1
        
        self.orders = orders
        self.order_items = order_items
        print(f"✓ Generated {len(orders)} orders with {len(order_items)} order items")
        return orders, order_items
    
    def save_to_csv(self):
        """Save generated data to CSV files for backup"""
        print("\n💾 Saving data to CSV files...")
        
        # Save customers
        with open('customers.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['name', 'email', 'region', 'signup_date'])
            writer.writeheader()
            writer.writerows(self.customers)
        
        # Save products
        with open('products.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['name', 'category', 'cost', 'price'])
            writer.writeheader()
            writer.writerows(self.products)
        
        # Save orders
        with open('orders.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['id', 'customer_id', 'status', 'created_at'])
            writer.writeheader()
            writer.writerows(self.orders)
        
        # Save order items
        with open('order_items.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['order_id', 'product_id', 'quantity', 'unit_price'])
            writer.writeheader()
            writer.writerows(self.order_items)
        
        print("✓ Data saved to CSV files")
    
    def clean_data(self):
        """Clean and validate data"""
        print("\n🧹 Cleaning data...")
        
        # Remove any invalid emails
        self.customers = [c for c in self.customers if '@' in c['email'] and '.' in c['email']]
        
        # Ensure all prices and costs are positive
        self.products = [p for p in self.products if p['cost'] > 0 and p['price'] > 0 and p['price'] >= p['cost']]
        
        # Ensure all quantities are positive
        self.order_items = [oi for oi in self.order_items if oi['quantity'] > 0 and oi['unit_price'] >= 0]
        
        print(f"✓ Data cleaned - {len(self.customers)} customers, {len(self.products)} products, {len(self.orders)} orders, {len(self.order_items)} order items")
    
    def insert_customers(self):
        """Insert customers into database"""
        print("\n👥 Inserting customers...")
        cursor = self.connection.cursor()
        
        sql = """
            INSERT INTO Customers (name, email, region, signup_date)
            VALUES (%s, %s, %s, %s)
        """
        
        data = [(c['name'], c['email'], c['region'], c['signup_date']) for c in self.customers]
        
        try:
            cursor.executemany(sql, data)
            self.connection.commit()
            print(f"✓ Inserted {cursor.rowcount} customers")
        except Error as e:
            print(f"✗ Error inserting customers: {e}")
            self.connection.rollback()
        finally:
            cursor.close()
    
    def insert_products(self):
        """Insert products into database"""
        print("\n📦 Inserting products...")
        cursor = self.connection.cursor()
        
        sql = """
            INSERT INTO Products (name, category, cost, price)
            VALUES (%s, %s, %s, %s)
        """
        
        data = [(p['name'], p['category'], p['cost'], p['price']) for p in self.products]
        
        try:
            cursor.executemany(sql, data)
            self.connection.commit()
            print(f"✓ Inserted {cursor.rowcount} products")
        except Error as e:
            print(f"✗ Error inserting products: {e}")
            self.connection.rollback()
        finally:
            cursor.close()
    
    def insert_orders(self):
        """Insert orders into database"""
        print("\n🛒 Inserting orders...")
        cursor = self.connection.cursor()
        
        sql = """
            INSERT INTO Orders (customer_id, status, created_at)
            VALUES (%s, %s, %s)
        """
        
        data = [(o['customer_id'], o['status'], o['created_at']) for o in self.orders]
        
        try:
            cursor.executemany(sql, data)
            self.connection.commit()
            print(f"✓ Inserted {cursor.rowcount} orders")
        except Error as e:
            print(f"✗ Error inserting orders: {e}")
            self.connection.rollback()
        finally:
            cursor.close()
    
    def insert_order_items(self):
        """Insert order items into database in batches"""
        print("\n📋 Inserting order items...")
        cursor = self.connection.cursor()
        
        sql = """
            INSERT INTO OrderItems (order_id, product_id, quantity, unit_price)
            VALUES (%s, %s, %s, %s)
        """
        
        data = [(oi['order_id'], oi['product_id'], oi['quantity'], oi['unit_price']) 
                for oi in self.order_items]
        
        # Insert in batches of 1000
        batch_size = 1000
        total_inserted = 0
        
        try:
            for i in range(0, len(data), batch_size):
                batch = data[i:i + batch_size]
                cursor.executemany(sql, batch)
                self.connection.commit()
                total_inserted += len(batch)
                print(f"  → Inserted {total_inserted}/{len(data)} order items...")
            
            print(f"✓ Inserted {total_inserted} order items")
        except Error as e:
            print(f"✗ Error inserting order items: {e}")
            self.connection.rollback()
        finally:
            cursor.close()
    
    def run(self):
        """Run the complete ETL pipeline"""
        print("=" * 70)
        print("🚀 E-commerce Analytics ETL Pipeline")
        print("=" * 70)
        
        start_time = datetime.now()
        
        # Generate data
        self.generate_customers()
        self.generate_products()
        self.generate_orders()
        
        # Clean data
        self.clean_data()
        
        # Save to CSV
        self.save_to_csv()
        
        # Connect to database
        if not self.connect_db():
            return
        
        try:
            # Insert data
            self.insert_customers()
            self.insert_products()
            self.insert_orders()
            self.insert_order_items()
            
            # Print summary
            print("\n" + "=" * 70)
            print("✅ ETL Pipeline Completed Successfully!")
            print("=" * 70)
            
            cursor = self.connection.cursor()
            
            # Get counts
            cursor.execute("SELECT COUNT(*) FROM Customers")
            customer_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM Products")
            product_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM Orders")
            order_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM OrderItems")
            order_item_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT SUM(oi.quantity * oi.unit_price) FROM OrderItems oi JOIN Orders o ON oi.order_id = o.id WHERE o.status = 'Completed'")
            total_revenue = cursor.fetchone()[0] or 0
            
            cursor.close()
            
            print(f"\n📊 Database Summary:")
            print(f"  • Customers: {customer_count:,}")
            print(f"  • Products: {product_count:,}")
            print(f"  • Orders: {order_count:,}")
            print(f"  • Order Items: {order_item_count:,}")
            print(f"  • Total Revenue (Completed): ${total_revenue:,.2f}")
            
            elapsed_time = datetime.now() - start_time
            print(f"\n⏱️  Time elapsed: {elapsed_time.total_seconds():.2f} seconds")
            
        except Exception as e:
            print(f"\n✗ Error during ETL process: {e}")
        finally:
            self.close_connection()


if __name__ == "__main__":
    pipeline = ETLPipeline()
    pipeline.run()
