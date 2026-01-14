# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --no-audit --prefer-offline

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (vite preview needs devDependencies)
RUN npm ci --no-audit --prefer-offline

# Copy vite config
COPY vite.config.ts ./

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 9005

# Run preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "9005"]