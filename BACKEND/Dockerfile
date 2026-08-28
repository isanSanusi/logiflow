FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Run as non-root user (alpine images include 'node' user by default)
USER node

EXPOSE 3000
CMD ["node", "server.js"]