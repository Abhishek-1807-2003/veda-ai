Render Deployment Guide
========================

This document explains how to deploy the backend service to Render using the repository's root `Dockerfile` and the provided `render.yaml` manifest.

Prerequisites
-------------
- A Render account (https://render.com)
- Upstash Redis (or another managed Redis) and MongoDB Atlas instances
- Project-level environment variables created in Render (see below)

Files of interest
-----------------
- `Dockerfile` (root): multi-stage Dockerfile that builds the monorepo and produces a minimal production image for the backend service.
- `render.yaml`: Render service manifest (web service, docker runtime) that references the root `Dockerfile`.

Required environment variables (set these in your Render service or project settings)
-----------------------------------------------------------------------------------
- `NODE_ENV=production`
- `PORT=4000`
- `MONGO_URI` (MongoDB Atlas connection string)
- `REDIS_URL` (Upstash connection string, must be `rediss://` for TLS)
- `JWT_SECRET` (secure random string)
- `OPENAI_API_KEY` (if using OpenAI)
- `FRONTEND_URL` (frontend origin for CORS)

Notes about `REDIS_URL` (Upstash)
---------------------------------
- Upstash connection string format: `rediss://default:TOKEN@HOST.upstash.io:6379`
- Ensure you copy the `rediss://` URL (TLS) and paste it as the value for `REDIS_URL` in Render.

How to deploy using Render dashboard
-----------------------------------
1. Create a new Web Service in Render.
   - Choose "Docker" as the runtime.
   - For the Dockerfile path, use `./Dockerfile` (root of the repo).
   - Set the Build command to empty (the Dockerfile handles building).
   - Set the Start command to empty (the Dockerfile's `CMD` runs the server).
   - Set the port to `4000` and health check path to `/health`.
2. Add environment variables listed above in the service or project settings.
3. Deploy the service and monitor build logs in Render's dashboard.

How to deploy using `render.yaml` (Infrastructure-as-code)
---------------------------------------------------------
1. In Render's dashboard, create a new service using the `render.yaml` manifest, or run `renderctl` if you use Render's CLI tools.
2. Ensure project-level secrets are set in Render's UI or via the CLI, matching the keys above.

Post-deploy verification
------------------------
- Visit the service's URL and call the health endpoint:

```bash
curl https://<your-service>.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-05-27T...",
  "redis": "connected"
}
```

Troubleshooting
---------------
- Build fails at `pnpm install` or `pnpm --filter @vedaai/backend build`:
  - Ensure Render's builder can access the network and the registry.
  - Render supports Docker builds; check that the Dockerfile references correct files and includes `pnpm install`.
- `redis` shows `disconnected` in health check:
  - Verify `REDIS_URL` is set and properly formatted (must start with `rediss://` for Upstash).
- `MONGO_URI` connection issues:
  - Verify Atlas IP access list and credentials.

Notes
-----
- We removed `railway.json` and the `apps/backend/Dockerfile` to avoid conflicting Dockerfile definitions. Render uses the root `Dockerfile` in this repo.
- If you prefer building only the backend image in isolation, we can create a dedicated `Dockerfile.backend` at the repo root and update `render.yaml` accordingly.

If you'd like, I can also:
- Add a GitHub Actions workflow to build and push the Docker image to a registry (e.g., Docker Hub or GitHub Container Registry) and then deploy to Render via `renderctl`.
- Create a minimal `Dockerfile.backend` that only builds the backend and uses cache-friendly layers.
