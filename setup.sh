#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up FinSight development environment...${NC}"

# Start Docker containers
echo -e "${YELLOW}Starting Docker containers for PostgreSQL and Redis...${NC}"
docker-compose up -d

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Run Prisma migrations
echo -e "${YELLOW}Running Prisma migrations...${NC}"
npx prisma migrate dev --name init

# Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}Run 'npm run dev' to start the development server.${NC}"
