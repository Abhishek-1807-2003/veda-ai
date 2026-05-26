# Railway Deployment - Complete Setup Guide

## What Changed

### 1. ✅ Docker Configuration
**File:** `apps/backend/Dockerfile`
- Multi-stage build for optimized image size
- Automatic `pnpm` installation (fixes the `pnpm: not found` error)
- Handles both cases: with and without `pnpm-lock.yaml`
- Uses `dumb-init` for proper signal handling
- Production dependencies only in runtime image

### 2. ✅ Railway Configuration
**Files:** `railway.json`, `.github/workflows/railway-deploy.yml`
- Railway CLI configuration with health checks
- GitHub Actions workflow for automated deployments
- Triggers on push to main/develop or manual dispatch

### 3. ✅ CORS Fix
**File:** `apps/backend/src/index.ts`
- Dynamic CORS origin based on environment
- Production mode allows frontend URL from `FRONTEND_URL` env var
- Development mode allows localhost origins

### 4. ✅ Environment Configuration
**Files:** `.npmrc`, `apps/backend/Procfile`
- pnpm configuration for better monorepo support
- Procfile for Railway process management

### 5. ✅ Setup Scripts
**Files:** `setup.bat` (Windows), `setup.sh` (Unix)
- Local development setup automation
- Guides through installation

## Quick Start: Railway Deployment

### Option 1: Using Railway Dashboard (Easiest)

1. **Push code to GitHub** (with all changes above)
2. **Go to railway.app** and sign in
3. **Create new project** → Select GitHub repository
4. **Railway auto-detects:**
   - Dockerfile in `apps/backend/`
   - Node.js environment
   - Port configuration

5. **Set Environment Variables** in Railway Dashboard:
   ```
   PORT=4000
   NODE_ENV=production
   MONGO_URI=<your-mongodb-connection-string>
   REDIS_URL=<your-redis-connection-string>
   JWT_SECRET=<strong-random-string>
   AI_PROVIDER=openai
   AI_MODEL=gpt-4o-mini
   OPENAI_API_KEY=<your-api-key>
   FRONTEND_URL=https://yourdomain.com  # Your frontend URL
   ```

6. **Deploy** - Railway will:
   - Build Docker image
   - Install dependencies with pnpm
   - Compile TypeScript
   - Start the server

### Option 2: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Option 3: GitHub Actions (Automated)

1. **Get Railway API token:**
   - Go to railway.app → Account → API Tokens
   - Create new token

2. **Add GitHub Secret:**
   - Go to your GitHub repo → Settings → Secrets
   - Add secret: `RAILWAY_TOKEN=<your-token>`

3. **Workflow automatically deploys on:**
   - Push to `main` or `develop`
   - Manual workflow dispatch

## Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `PORT` | No | 4000 | Auto-set by Railway |
| `NODE_ENV` | Yes | production | Set in Railway |
| `MONGO_URI` | Yes | mongodb+srv://... | MongoDB connection string |
| `REDIS_URL` | Yes | rediss://... | Redis connection URL |
| `JWT_SECRET` | Yes | abc123xyz... | Use strong random value |
| `AI_PROVIDER` | No | openai | or 'anthropic', 'together' |
| `AI_MODEL` | No | gpt-4o-mini | Check provider docs |
| `OPENAI_API_KEY` | Conditional | sk-... | Required if using OpenAI |
| `ANTHROPIC_API_KEY` | Conditional | sk-ant-... | Required if using Anthropic |
| `TOGETHER_API_KEY` | Conditional | ... | Required if using Together |
| `FRONTEND_URL` | No | https://app.com | For CORS in production |
| `WS_PORT` | No | 4001 | Auto-managed by Railway |

## Troubleshooting

### ❌ Error: `pnpm: not found`
**Status:** ✅ FIXED
- Updated Dockerfile installs pnpm globally
- If still failing, check Railway build logs

### ❌ Error: `Cannot find module @vedaai/shared-types`
**Solution:**
1. Ensure `pnpm-lock.yaml` is committed to git
2. If missing, run locally:
   ```bash
   # Install Node.js 18+ and pnpm
   npm install -g pnpm
   cd <project-root>
   pnpm install
   ```
3. Commit the lock file: `git add pnpm-lock.yaml && git commit -m "Add lock file"`

### ❌ Error: `Cannot connect to MongoDB`
**Solution:**
- Verify `MONGO_URI` is correct in Railway env vars
- Ensure MongoDB cluster allows Railway IP (allow all: 0.0.0.0/0)
- Test connection string locally

### ❌ Error: `Cannot connect to Redis`
**Solution:**
- Verify `REDIS_URL` is correct (check Upstash dashboard)
- Use rediss:// (with double 's') for TLS
- Ensure TLS certificates are correct

### ❌ WebSocket connections failing
**Solution:**
- Check WebSocket port (4001) is exposed
- Verify CORS allows frontend domain
- Update `FRONTEND_URL` env var

### ⚠️ Build takes too long
**Solutions:**
- Check Railway build logs for bottlenecks
- Ensure pnpm cache is working
- Consider splitting backend into separate service

## Monitoring & Logs

### View Logs
```bash
railway logs -s backend
```

### Monitor Performance
- Railway Dashboard shows CPU/Memory usage
- Check deployment history for errors
- Review build logs for compilation issues

## Local Development

### Setup
```bash
# Windows
./setup.bat

# macOS/Linux
chmod +x setup.sh
./setup.sh
```

### Run Backend
```bash
cd apps/backend
npm run dev
```

### Build for Testing
```bash
pnpm --filter @vedaai/backend build
npm start  # (from apps/backend)
```

## Next Steps

1. ✅ Push all changes to GitHub
2. ✅ Set environment variables in Railway
3. ✅ Trigger deployment
4. ✅ Monitor build in Railway Dashboard
5. ✅ Test API endpoints
6. ✅ Test WebSocket connection

## Files Modified/Created

```
✅ Created: apps/backend/Dockerfile
✅ Created: apps/backend/.dockerignore
✅ Created: apps/backend/Procfile
✅ Updated: apps/backend/src/index.ts (CORS)
✅ Created: .npmrc
✅ Created: .dockerignore
✅ Created: railway.json
✅ Created: .github/workflows/railway-deploy.yml
✅ Created: setup.bat (Windows)
✅ Created: setup.sh (Unix)
✅ Created: RAILWAY_DEPLOYMENT.md (this file)
```

## Support

For Railway support: https://docs.railway.app/
For pnpm help: https://pnpm.io/
For Docker help: https://docs.docker.com/
