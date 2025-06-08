ARG NODE_VERSION=23.5.0
FROM node:${NODE_VERSION}-alpine


# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy full source
COPY . .

# Set environment variable to inform Next.js (optional, for custom tools)
ENV NEXT_APP_DIR=src/app

EXPOSE 3000
CMD ["npm", "run", "dev"]
