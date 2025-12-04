#!/bin/bash

echo "🚀 Starting E-Commerce Analytics Dashboard Setup..."
echo ""

# Ask for installation mode
echo "Choose installation mode:"
echo "  1. Docker (Recommended - Easy, no local dependencies needed)"
echo "  2. Manual (Install dependencies locally)"
echo ""
read -p "Enter your choice (1 or 2): " install_mode

if [ "$install_mode" = "2" ]; then
    manual_install
    exit 0
elif [ "$install_mode" != "1" ]; then
    echo "❌ Invalid choice. Please run the script again."
    exit 1
fi

echo ""
echo "📦 Docker mode selected"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✓ Docker is running"
echo ""

# Check if .env file exists, if not copy from .env.docker
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.docker..."
    cp .env.docker .env
    echo "✓ .env file created"
    echo ""
fi

# Build and start containers
echo "🏗️  Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose up -d --build

# Wait for MySQL to be ready
echo ""
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Check container status
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3001"
echo "   API Health: http://localhost:3001/health"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"
echo ""
echo "🗑️  To remove everything (including data):"
echo "   docker-compose down -v"
echo ""

# Optional: Run ETL script
read -p "Do you want to generate sample data (10,000 records) now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🐍 Running ETL script..."
    docker-compose exec backend sh -c "cd /app && python3 -m pip install --user -r etl/requirements.txt && python3 etl/etl_ingest.py"
fi

echo ""
echo "🎉 All done! Happy coding!"
exit 0

manual_install() {
    echo ""
    echo "=========================================="
    echo "Manual Installation Mode"
    echo "=========================================="
    echo ""

    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        echo "Download from: https://nodejs.org/"
        exit 1
    fi
    echo "✓ Node.js found: $(node --version)"

    # Check npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed."
        exit 1
    fi
    echo "✓ npm found: $(npm --version)"

    # Check Python
    if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
        echo "❌ Python is not installed. Please install Python 3.8+ first."
        echo "Download from: https://www.python.org/"
        exit 1
    fi
    
    if command -v python3 &> /dev/null; then
        echo "✓ Python found: $(python3 --version)"
        PYTHON_CMD="python3"
    else
        echo "✓ Python found: $(python --version)"
        PYTHON_CMD="python"
    fi

    # Check MySQL
    if ! command -v mysql &> /dev/null; then
        echo "⚠️  MySQL client not found in PATH. Make sure MySQL server is installed."
    fi
    echo ""

    # Create .env files if they don't exist
    if [ ! -f backend/.env ]; then
        echo "📝 Creating backend/.env from .env.example..."
        cp backend/.env.example backend/.env
        echo "✓ Created backend/.env - Please edit with your MySQL credentials"
    fi

    if [ ! -f frontend/.env ]; then
        echo "📝 Creating frontend/.env from .env.example..."
        cp frontend/.env.example frontend/.env
        echo "✓ Created frontend/.env"
    fi

    echo ""
    echo "📦 Installing Backend Dependencies..."
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
    cd ..
    echo "✓ Backend dependencies installed"

    echo ""
    echo "📦 Installing Frontend Dependencies..."
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
    echo "✓ Frontend dependencies installed"

    echo ""
    echo "🐍 Installing Python ETL Dependencies..."
    cd backend/etl
    $PYTHON_CMD -m pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Python dependencies"
        exit 1
    fi
    cd ../..
    echo "✓ Python dependencies installed"

    echo ""
    echo "=========================================="
    echo "Installation Complete!"
    echo "=========================================="
    echo ""
    echo "Next Steps:"
    echo ""
    echo "1. Setup MySQL Database:"
    echo "   mysql -u root -p < backend/database/schema.sql"
    echo ""
    echo "2. Edit backend/.env with your MySQL credentials"
    echo ""
    echo "3. Generate sample data (optional):"
    echo "   cd backend/etl"
    echo "   $PYTHON_CMD etl_ingest.py"
    echo "   cd ../.."
    echo ""
    echo "4. Start Backend (in one terminal):"
    echo "   cd backend"
    echo "   npm run dev"
    echo ""
    echo "5. Start Frontend (in another terminal):"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
    echo "6. Access the application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:3001"
    echo ""
}

