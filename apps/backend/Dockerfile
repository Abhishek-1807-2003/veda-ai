# Production-ready Node.js backend Dockerfile
# Optimized for Railway deployment with pnpm workspace

FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root workspace package files
COPY pnpm-workspace.yaml .npmrc* package.json ./

# Copy lock file
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy shared packages
COPY packages ./packages

# Copy backend source code
COPY apps/backend ./apps/backend

# Build shared types first
RUN pnpm --filter @vedaai/shared-types build

# Build backend
RUN pnpm --filter @vedaai/backend build

# Production stage
FROM node:20-alpine

# Install pnpm in production image
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root workspace config
COPY pnpm-workspace.yaml .npmrc* package.json ./

# Copy pnpm lock
COPY pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy built files from builder
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/

# Set working directory to backend for runtime
WORKDIR /app/apps/backend

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start the backend server
CMD ["node", "dist/index.js"]
