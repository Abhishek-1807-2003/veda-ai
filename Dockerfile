# Build stage
FROM node:20-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm@latest

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json ./
COPY .npmrc* ./

# Copy pnpm lock file
COPY pnpm-lock.yaml* ./

# Copy all packages (shared libraries)
COPY packages ./packages

# Copy backend application
COPY apps/backend ./apps/backend

# Install all dependencies
RUN pnpm install --frozen-lockfile 2>&1 || pnpm install

# Build backend TypeScript
RUN pnpm --filter @vedaai/backend build

# Production stage
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Install pnpm for production
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json ./
COPY .npmrc* ./

# Copy pnpm lock file
COPY pnpm-lock.yaml* ./

# Copy shared packages
COPY packages ./packages

# Copy backend application
COPY apps/backend ./apps/backend

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile 2>&1 || pnpm install --prod

# Copy compiled backend from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Set working directory to backend
WORKDIR /app/apps/backend

# Expose ports (HTTP and WebSocket)
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Use dumb-init as PID 1 for proper signal handling
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Start the backend application
CMD ["node", "dist/index.js"]
