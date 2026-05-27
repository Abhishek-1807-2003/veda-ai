# Build stage
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-workspace.yaml .npmrc* package.json ./
COPY pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/backend ./apps/backend

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @vedaai/shared-types build
RUN pnpm --filter @vedaai/backend build

# Runtime stage
FROM node:20-alpine

RUN npm install -g pnpm && \
    apk add --no-cache dumb-init

WORKDIR /app
COPY pnpm-workspace.yaml .npmrc* package.json ./
COPY pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/backend ./apps/backend

RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

EXPOSE 4000 4001

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/index.js"]