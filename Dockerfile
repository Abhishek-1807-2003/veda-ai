# Build stage
FROM node:20-alpine AS builder

# Install pnpm
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

# Install all dependencies (including workspace packages)
RUN pnpm install --frozen-lockfile || pnpm install

# Build shared-types package first (dependency of backend)
RUN pnpm --filter @vedaai/shared-types build

# Build the backend
RUN pnpm --filter @vedaai/backend build

# Runtime stage
FROM node:20-alpine

# Install pnpm and dumb-init for proper signal handling
RUN npm install -g pnpm && \
    apk add --no-cache dumb-init

WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml .npmrc* package.json ./

# Copy lock file if it exists
COPY pnpm-lock.yaml* ./

# Copy packages directory (required for workspace)
COPY packages ./packages

# Copy backend application
COPY apps/backend ./apps/backend

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Build shared-types package for production
RUN pnpm --filter @vedaai/shared-types build

# Copy built files from builder stage
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Set working directory to backend for startup
WORKDIR /app/apps/backend

# Expose ports
EXPOSE 4000 4001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]
