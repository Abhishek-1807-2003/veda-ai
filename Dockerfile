# Production-ready Dockerfile for Node.js + Express backend
# Works with Railway deployment

FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy root package files for workspace setup
COPY package.json package-lock.json* ./
COPY .npmrc* ./

# Copy shared packages (required for workspace resolution)
COPY packages ./packages

# Copy backend application
COPY apps/backend ./apps/backend

# Install ALL dependencies (including workspace packages)
RUN npm install

# Build backend TypeScript code
RUN npm --prefix apps/backend run build

# Set working directory to backend for runtime
WORKDIR /app/apps/backend

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start the backend server
CMD ["npm", "start"]
