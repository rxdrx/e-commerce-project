@echo off
echo.
echo ========================================
echo E-Commerce Analytics Dashboard Setup
echo ========================================
echo.

REM Ask for installation mode
echo Choose installation mode:
echo   1. Docker (Recommended - Easy, no local dependencies needed)
echo   2. Manual (Install dependencies locally)
echo.
set /p install_mode="Enter your choice (1 or 2): "

REM Trim spaces
set install_mode=%install_mode: =%

if "%install_mode%"=="2" goto manual_install
if "%install_mode%"=="1" goto docker_install
echo [ERROR] Invalid choice. Please enter 1 or 2.
pause
exit /b 1

:docker_install

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Check if .env file exists
if not exist .env (
    echo [INFO] Creating .env file from .env.docker...
    copy .env.docker .env >nul
    echo [OK] .env file created
    echo.
)

REM Build and start containers
echo [INFO] Building and starting containers...
echo This may take a few minutes on first run...
echo.

docker-compose up -d --build

REM Wait for MySQL to be ready
echo.
echo [INFO] Waiting for MySQL to be ready...
timeout /t 15 /nobreak >nul

REM Check container status
echo.
echo ========================================
echo Container Status:
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Application URLs:
echo   Frontend:    http://localhost:5173
echo   Backend API: http://localhost:3001
echo   API Health:  http://localhost:3001/health
echo.
echo Useful Commands:
echo   View logs:              docker-compose logs -f
echo   Stop containers:        docker-compose down
echo   Remove all data:        docker-compose down -v
echo   Restart:                docker-compose restart
echo.

REM Ask about ETL
set /p run_etl="Do you want to generate sample data (10,000 records) now? (Y/N): "
if /i "%run_etl%"=="Y" (
    echo.
    echo [INFO] Running ETL script...
    docker-compose exec backend python3 etl/etl_ingest.py
)

echo.
echo ========================================
echo All Done! Happy Coding!
echo ========================================
echo.
pause
exit /b 0

:manual_install
echo.
echo ========================================
echo Manual Installation Mode
echo ========================================
echo.

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found: 
node --version

REM Check Python
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install Python 3.8+ first.
    echo Download from: https://www.python.org/
    pause
    exit /b 1
)
echo [OK] Python found:
python --version

REM Check MySQL
where mysql >nul 2>&1
if errorlevel 1 (
    echo [WARNING] MySQL client not found in PATH. Make sure MySQL server is installed.
)
echo.

REM Create .env files if they don't exist
if not exist backend\.env (
    echo [INFO] Creating backend\.env from .env.example...
    copy backend\.env.example backend\.env >nul
    echo [OK] Created backend\.env - Please edit with your MySQL credentials
)

if not exist frontend\.env (
    echo [INFO] Creating frontend\.env from .env.example...
    copy frontend\.env.example frontend\.env >nul
    echo [OK] Created frontend\.env
)

echo.
echo [INFO] Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed

echo.
echo [INFO] Installing Frontend Dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed

echo.
echo [INFO] Installing Python ETL Dependencies...
cd backend\etl
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies
    cd ..\..
    pause
    exit /b 1
)
cd ..\..
echo [OK] Python dependencies installed

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Setup MySQL Database:
echo    mysql -u root -p ^< backend\database\schema.sql
echo.
echo 2. Edit backend\.env with your MySQL credentials
echo.
echo 3. Generate sample data (optional):
echo    cd backend\etl
echo    python etl_ingest.py
echo    cd ..\..
echo.
echo 4. Start Backend (in one terminal):
echo    cd backend
echo    npm run dev
echo.
echo 5. Start Frontend (in another terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 6. Access the application:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3001
echo.
pause
