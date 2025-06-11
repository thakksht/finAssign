FROM node:18

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies (prisma will fail here, but it's fine)
RUN npm install || true

# Copy rest of the app
COPY . .

# Generate Prisma client AFTER full context is available
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
