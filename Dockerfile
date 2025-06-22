# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve@14.2.4

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port that Railway will set
EXPOSE $PORT

# Serve the built files with SPA routing support using Railway's PORT
CMD sh -c "serve -s dist -l ${PORT:-3000}"