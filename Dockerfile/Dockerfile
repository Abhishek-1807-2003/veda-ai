# Compatibility shim Dockerfile
# This file mirrors the root Dockerfile for Render services configured with
# Root Directory = "Dockerfile". Long-term, set Root Directory to the repo root
# and use the root `./Dockerfile` instead.

# Production Docker build for Node.js backend
# Multi-stage build optimized for efficient deployment
# Builds the @vedaai/backend service with shared workspace dependencies

FROM node:20-alpine AS builder

# Install pnpm for workspace management
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml .npmrc* package.json ./

# Copy lock file if it exists
COPY pnpm-lock.yaml* ./

# Copy packages directory (required for workspace)
COPY packages ./packages

# Copy backend application
COPY apps/backend ./apps/backend

# Install all dependencies (including workspace packages and dev dependencies)
RUN pnpm install --frozen-lockfile || pnpm install

# Build shared-types package first (dependency of backend)
RUN pnpm --filter @vedaai/shared-types build

# Build the backend
RUN pnpm --filter @vedaai/backend build

# Production stage - minimal image
FROM node:20-alpine

# Install pnpm for production dependencies
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml .npmrc* package.json ./

# Copy lock file
COPY pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy built backend from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json

# Copy shared packages (needed at runtime)
COPY --from=builder /app/packages ./packages

# Set working directory to backend
WORKDIR /app/apps/backend

# Expose port
EXPOSE 4000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start the backend server
CMD ["node", "dist/index.js"]
