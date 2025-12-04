# Docker

Docker setup for quick deployment. Everything runs in containers!

## Quick Start (Production)

```powershell
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

## Development Mode with Hot Reload

```powershell
# Start with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop
docker-compose -f docker-compose.dev.yml down
```

## Services

- **MySQL**: Port 3306
- **Backend API**: Port 3001
- **Frontend**: Port 5173 (dev) or 80 (prod)

## Generate Sample Data

```powershell
# Install Python dependencies in backend container
docker-compose exec backend sh -c "cd etl && pip install -r requirements.txt"

# Run ETL script
docker-compose exec backend python etl/etl_ingest.py
```

## Useful Commands

```powershell
# View container status
docker-compose ps

# Execute commands in backend
docker-compose exec backend sh

# Execute commands in MySQL
docker-compose exec mysql mysql -u root -p

# View backend logs
docker-compose logs -f backend

# Rebuild containers
docker-compose up -d --build

# Remove volumes (deletes database data)
docker-compose down -v
```
