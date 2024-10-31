FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create data directory for persistence
RUN mkdir -p /app/data && chown -R node:node /app/data

# Use non-root user for security
USER node

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]