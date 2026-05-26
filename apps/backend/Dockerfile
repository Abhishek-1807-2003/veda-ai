# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml .npmrc* ./
COPY package.json ./

# Copy lock file if it exists
COPY pnpm-lock.yaml* ./

# Copy packages
COPY packages ./packages

# Copy backend app
COPY apps/backend ./apps/backend

# Install dependencies with or without lock file
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

# Build backend
RUN pnpm --filter @vedaai/backend build

# Runtime stage
FROM node:20-alpine

# Install pnpm and dumb-init for proper signal handling
RUN npm install -g pnpm && \
    apk add --no-cache dumb-init

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml .npmrc* ./
COPY package.json ./

# Copy lock file if it exists
COPY pnpm-lock.yaml* ./

# Copy packages
COPY packages ./packages

# Copy backend app source (for production dependencies)
COPY apps/backend ./apps/backend

# Install production dependencies only
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --prod --frozen-lockfile; \
    else \
      pnpm install --prod; \
    fi

# Copy built files from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Set working directory to backend
WORKDIR /app/apps/backend

# Expose ports
EXPOSE 4000 4001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]
