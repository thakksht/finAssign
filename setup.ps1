# Setup script for FinSight development environment

Write-Host "Setting up FinSight development environment..." -ForegroundColor Yellow

# Start Docker containers
Write-Host "Starting Docker containers for PostgreSQL and Redis..." -ForegroundColor Yellow
docker-compose up -d

# Wait for PostgreSQL to be ready
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Run Prisma migrations
Write-Host "Running Prisma migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server." -ForegroundColor Green
