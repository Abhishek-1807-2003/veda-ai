<<<<<<< HEAD
# Production-ready Node.js backend Dockerfile
# Optimized for Railway deployment

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root workspace package files
COPY package*.json ./

# Copy pnpm workspace config if exists
COPY pnpm-lock.yaml* .npmrc* ./

# Copy shared packages (required for workspace resolution)
COPY packages ./packages

# Copy backend source code
COPY apps/backend ./apps/backend

# Install dependencies
RUN npm install --omit=dev

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
=======
# This Dockerfile has been moved to the project root
# The production Docker image is built from /Dockerfile
# See the root Dockerfile for the complete build configuration
#
# To build: docker build -f Dockerfile .
# This ensures proper monorepo workspace resolution with pnpm
>>>>>>> 935cf35adf21e358024ab4624fbfc5bc1302de00
