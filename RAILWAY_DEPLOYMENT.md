#!/bin/bash
# Railway Deployment Guide

## Prerequisites
- pnpm installed globally: `npm install -g pnpm`
- Docker installed (for local testing)

## Local Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build the backend:
   ```bash
   pnpm --filter @vedaai/backend build
   ```

3. Test locally:
   ```bash
   cd apps/backend
   npm start
   ```

## Railway Deployment

### Method 1: Using Railway CLI
```bash
railway init
railway up
```

### Method 2: Connect GitHub Repository
1. Go to railway.app
2. Create new project
3. Connect your GitHub repo
4. Railway will auto-detect the Dockerfile in apps/backend/

### Environment Variables to Set in Railway Dashboard
- `PORT` (auto-set by Railway, optional)
- `NODE_ENV=production`
- `MONGO_URI=<your-mongodb-url>`
- `REDIS_URL=<your-redis-url>`
- `JWT_SECRET=<strong-secret-key>`
- `AI_PROVIDER=openai` (or your preferred provider)
- `AI_MODEL=gpt-4o-mini` (or your preferred model)
- `OPENAI_API_KEY=<your-api-key>` (if using OpenAI)
- `WS_PORT` (optional, auto-managed by Railway)

### Health Checks
The railway.json includes health check configuration. Ensure your app responds to:
- POST /api/v1/* endpoints
- WebSocket connections on WS_PORT

### Build & Deploy
Railway will:
1. Detect the Dockerfile in apps/backend/
2. Build the Docker image
3. Pull all monorepo dependencies via pnpm
4. Compile TypeScript
5. Start the application with `node dist/index.js`

### Troubleshooting

**Error: `pnpm: not found`**
- ✅ Fixed: Dockerfile now installs pnpm globally
- The updated Dockerfile installs pnpm before running build commands

**Error: `Cannot find module`**
- Ensure pnpm-lock.yaml exists locally
- Run `pnpm install` locally to generate it

**Error: Database connection refused**
- Verify MONGO_URI is correct in Railway env vars
- Ensure MongoDB service is running and accessible

**WebSocket connection issues**
- Ensure WS_PORT is exposed in Dockerfile ✅
- Configure CORS to allow your frontend domain

## Monitoring

Railway Dashboard shows:
- Logs in real-time
- Memory/CPU usage
- Restart history
- Deploy history

View logs:
```bash
railway logs
```
