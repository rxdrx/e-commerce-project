# E-Commerce Analytics Dashboard

A full-stack analytics dashboard for e-commerce data visualization and analysis. Built with modern technologies to demonstrate proficiency in database design, data processing, API development, and frontend development.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **MySQL2** for database connectivity
- **Raw SQL queries** for optimal performance

### Data Processing
- **Python 3.x**
- **Faker** for generating test data
- **mysql-connector-python** for database operations
- **SQLAlchemy** for ORM capabilities

### Database
- **MySQL 8.0+**
- Relational schema with foreign keys and indexes

### Code Quality
- **ESLint** + **Prettier** for code formatting
- **Jest** (Backend) and **Vitest** (Frontend) for testing
- **SonarQube** integration for code quality analysis

## 📁 Project Structure

```
e-commerce-project/
├── backend/
│   ├── database/
│   │   ├── schema.sql           # Database schema with tables and indexes
│   │   └── seed_initial.sql     # Initial seed data for testing
│   ├── etl/
│   │   ├── etl_ingest.py       # Python script to generate 10K records
│   │   └── requirements.txt     # Python dependencies
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts      # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── analyticsController.ts
│   │   │   ├── ordersController.ts
│   │   │   └── productsController.ts
│   │   ├── routes/
│   │   │   ├── analytics.ts
│   │   │   ├── orders.ts
│   │   │   └── products.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts             # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   └── OrdersTable.tsx
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🗄️ Database Schema

The project uses a normalized relational database with the following tables:

### Tables

1. **Customers**
   - `id` (PK, AUTO_INCREMENT)
   - `name`, `email` (UNIQUE), `region`, `signup_date`
   - Indexes on: email, region, signup_date

2. **Products**
   - `id` (PK, AUTO_INCREMENT)
   - `name`, `category`, `cost`, `price`
   - Indexes on: category, name
   - Constraints: price >= cost

3. **Orders**
   - `id` (PK, AUTO_INCREMENT)
   - `customer_id` (FK → Customers), `status`, `created_at`
   - Indexes on: customer_id, status, created_at
   - Status: ENUM('Pending', 'Completed', 'Cancelled')

4. **OrderItems**
   - `id` (PK, AUTO_INCREMENT)
   - `order_id` (FK → Orders), `product_id` (FK → Products), `quantity`, `unit_price`
   - Indexes on: order_id, product_id
   - Constraints: quantity > 0

### Views
- **OrderTotals**: Aggregates order totals with customer info
- **ProductMargins**: Calculates profit margins for products

## 🔧 Installation & Setup

### Prerequisites

**Option A: Docker (Recommended - Easy Setup)**
- Docker Desktop installed and running
- That's it! 🎉

**Option B: Manual Installation**
- **Node.js** 18+ and npm
- **Python** 3.8+
- **MySQL** 8.0+
- Git

---

## 🐳 Quick Start with Docker (Recommended)

### Automated Setup

Simply run the setup script and choose option 1 (Docker):

**Windows:**
```powershell
.\setup.bat
# Select option 1 for Docker mode
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
# Select option 1 for Docker mode
```

The script will:
- ✅ Check if Docker is running
- ✅ Create `.env` file if needed
- ✅ Build and start all containers (MySQL, Backend, Frontend)
- ✅ Initialize the database with tables
- ✅ Optionally run the ETL script to generate 10,000 records

**Or manually:**

```powershell
# Copy environment file
Copy-Item .env.docker .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Optional: Generate sample data
docker-compose exec backend python etl/etl_ingest.py
```

### Access the Application

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

### Useful Docker Commands

```powershell
# View container status
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Remove everything including data
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

### Development Mode with Hot Reload

For development with automatic code reloading:

```powershell
docker-compose -f docker-compose.dev.yml up -d
```

---

## 📦 Manual Installation (Without Docker)

### Automated Setup

Simply run the setup script and choose option 2 (Manual):

**Windows:**
```powershell
.\setup.bat
# Select option 2 for Manual mode
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
# Select option 2 for Manual mode
```

The script will:
- ✅ Check if Node.js, Python, and MySQL are installed
- ✅ Create `.env` files from examples
- ✅ Install all npm dependencies (backend & frontend)
- ✅ Install Python dependencies for ETL
- ✅ Provide next steps for database setup

### Manual Step-by-Step

If you prefer to do everything manually:

### 1. Clone the Repository

```powershell
git clone https://github.com/rxdrx/e-commerce-project.git
cd e-commerce-project
```

### 2. Database Setup (Manual Only)

```powershell
# Create the database and tables
mysql -u root -p < backend/database/schema.sql

# Optional: Insert initial seed data
mysql -u root -p ecommerce_analytics < backend/database/seed_initial.sql
```

**Note**: If using Docker, the database is automatically initialized.

### 3. Backend Setup

```powershell
cd backend

# Install Node.js dependencies
npm install

# Configure environment variables
Copy-Item .env.example .env
# Edit .env with your MySQL credentials

# Run database migrations (schema is already created)
# The tables are created via schema.sql

# Optional: Install Python dependencies for ETL
cd etl
python -m pip install -r requirements.txt
cd ..
```

### 4. Generate Data with Python ETL

```powershell
cd backend/etl

# Make sure .env is configured with your DB credentials in backend/.env
python etl_ingest.py

# This will:
# - Generate 2,000 customers
# - Generate 100 products
# - Generate 10,000 orders with items
# - Insert all data into MySQL
# - Create CSV backups
```

### 5. Frontend Setup

```powershell
cd ../../frontend

# Install dependencies
npm install

# Configure environment variables
Copy-Item .env.example .env
# Default API URL is http://localhost:3001/api
```

## 🚀 Running the Application

### Using Docker (Recommended)

See the [Docker Quick Start](#-quick-start-with-docker-recommended) section above.

### Manual Start

#### Start Backend Server

```powershell
cd backend

# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

Backend will run on: **http://localhost:3001**

#### Start Frontend Development Server

```powershell
cd frontend

# Development mode
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 📊 API Endpoints

### Analytics

- **GET** `/api/analytics/kpis`
  - Returns: Total Revenue, ARPU, Retention Rate, Total Orders, New Customers, Net Profit
  - Uses complex SQL with CTEs and window functions

- **GET** `/api/analytics/sales-over-time`
  - Returns: Monthly sales data for the last 12 months
  - Uses GROUP BY with date functions

### Products

- **GET** `/api/products`
  - Query params: `category` (optional)
  - Returns: List of products

- **GET** `/api/products/categories`
  - Returns: Product categories with counts

- **GET** `/api/products/top-performers`
  - Returns: Top 5 products by revenue with profit margins
  - Uses JOINs, GROUP BY, and calculated fields

### Orders

- **GET** `/api/orders`
  - Query params: `status` (optional), `limit` (default: 50)
  - Returns: List of orders with customer details

- **GET** `/api/orders/:id`
  - Returns: Order details with items

## 🧪 Testing

### Backend Tests

```powershell
cd backend

# Run tests
npm test

# Run tests with coverage
npm run test

# Run linting
npm run lint
```

### Frontend Tests

```powershell
cd frontend

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📈 Code Quality

### Run ESLint

```powershell
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

### Run SonarQube Analysis

Make sure you have SonarQube server running, then:

```powershell
# Backend
cd backend
npm run sonar

# Frontend
cd frontend
npm run sonar
```

## 🎨 Dashboard Features

### KPI Cards
- **Total Revenue**: Sum of all completed orders
- **Total Orders**: Count of all orders
- **New Customers**: Customers signed up in last 30 days
- **Net Profit**: Revenue minus costs

### Sales Chart
- Line chart showing sales trend over the last 12 months
- Interactive tooltips with formatted currency
- Responsive design

### Orders Table
- Displays recent orders with customer information
- Filter by status: All, Completed, Pending, Cancelled
- Shows order amount, items count, and date
- Color-coded status badges

## 🔐 Environment Variables

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_analytics
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

## 🐛 Troubleshooting

### MySQL Connection Issues

1. Verify MySQL is running:
   ```powershell
   mysql -u root -p
   ```

2. Check credentials in `backend/.env`

3. Ensure database exists:
   ```sql
   SHOW DATABASES;
   ```

### Port Already in Use

If ports 3001 or 5173 are in use:

```powershell
# Backend: Change PORT in backend/.env
# Frontend: Vite will automatically use next available port
```

### ETL Script Errors

1. Ensure Python dependencies are installed:
   ```powershell
   cd backend/etl
   python -m pip install -r requirements.txt
   ```

2. Check database connection in backend/.env

3. Verify tables exist before running ETL

## 📝 SQL Query Examples

The project demonstrates advanced SQL techniques:

### Complex KPI Query
```sql
WITH OrderMetrics AS (
  SELECT 
    o.id AS order_id,
    SUM(oi.quantity * oi.unit_price) AS order_total,
    SUM(oi.quantity * p.cost) AS order_cost
  FROM Orders o
  INNER JOIN OrderItems oi ON o.id = oi.order_id
  INNER JOIN Products p ON oi.product_id = p.id
  GROUP BY o.id
)
SELECT 
  SUM(order_total) AS total_revenue,
  SUM(order_total - order_cost) AS net_profit
FROM OrderMetrics;
```

### Top Performers with Profit Margins
```sql
SELECT 
  p.name,
  SUM(oi.quantity) AS total_sold,
  SUM(oi.quantity * oi.unit_price) AS total_revenue,
  (p.price - p.cost) AS profit_margin
FROM Products p
INNER JOIN OrderItems oi ON p.id = oi.product_id
INNER JOIN Orders o ON oi.order_id = o.id
WHERE o.status = 'Completed'
GROUP BY p.id
ORDER BY total_revenue DESC
LIMIT 5;
```

## 🎯 Key Features Demonstrated

✅ **Database Design**: Normalized schema with proper relationships  
✅ **Raw SQL**: Complex queries with JOINs, CTEs, and aggregations  
✅ **ETL Pipeline**: Python script for data generation and insertion  
✅ **REST API**: Express endpoints with TypeScript  
✅ **React Best Practices**: Hooks, component composition, TypeScript  
✅ **Responsive UI**: Tailwind CSS with modern design  
✅ **Data Visualization**: Recharts for interactive charts  
✅ **Code Quality**: ESLint, Prettier, and SonarQube ready  
✅ **Testing Setup**: Jest and Vitest configured  
✅ **Docker**: Complete containerization with Docker Compose  
✅ **DevOps**: Production and development environments  

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**rxdrx**
- GitHub: [@rxdrx](https://github.com/rxdrx)

---

**Built with ❤️ for portfolio demonstration**
Full Stack E-commerce Dashboard.Stack: React, Node.js, Python, MySQL. Includes custom ETL scripts and interactive data visualization
