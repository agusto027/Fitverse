# FitVerse Production Deployment Guide 🚀

FitVerse is a **3-tier full-stack application** consisting of:
1. **Frontend**: React + Vite Single Page Application (`src/`)
2. **Backend Auth & Profile Server**: Node.js + Express + Mongoose (`backend/`)
3. **AI Engine**: Python + FastAPI + MediaPipe + Scikit-Learn (`ai-engine/`)

---

## Option 1: Easiest Free Cloud Deployment (Recommended) 🌐

Deploying to managed cloud platforms requires zero server maintenance. We recommend combining **Vercel/Netlify** (Frontend) + **Render/Railway** (Backend & AI Engine) + **MongoDB Atlas** (Database).

### Step 1: Database Setup (MongoDB Atlas - Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free M0 cluster.
2. Under **Database Access**, create a database user and save your password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
4. Click **Connect → Drivers** and copy your `MONGODB_URI` connection string:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fitverse?retryWrites=true&w=majority`

### Step 2: Deploy Backend & AI Engine (Render.com - 1-Click Blueprint)
We have prepared a ready-to-use `render.yaml` blueprint in this repository.

1. Push your repository changes to GitHub.
2. Sign in to [Render.com](https://render.com) and click **New → Blueprint**.
3. Connect your `Fitverse` GitHub repository. Render will automatically detect `render.yaml` and create **two web services**:
   - `fitverse-backend` (Node.js API)
   - `fitverse-ai-engine` (Python FastAPI Engine)
4. In the Render environment variable prompt for `fitverse-backend`, paste your `MONGODB_URI` from Step 1.
5. Once deployed, note down the live URLs of your backend and AI engine (e.g., `https://fitverse-backend.onrender.com` and `https://fitverse-ai-engine.onrender.com`).

### Step 3: Deploy Frontend (Vercel or Netlify)
1. Go to [Vercel](https://vercel.com) (or [Netlify](https://netlify.com)) and click **Add New → Project**.
2. Import your `Fitverse` GitHub repository.
3. Configure **Environment Variables**:
   ```env
   VITE_BACKEND_URL=https://your-backend.onrender.com
   VITE_AI_ENGINE_URL=https://your-ai-engine.onrender.com
   ```
4. Click **Deploy**! Your app is now live with real-time MediaPipe pose tracking, AI coaching, and user authentication!

---

## Option 2: 1-Command Docker Compose Deployment (For VPS / Local Server) 🐳

If you own a VPS (DigitalOcean, AWS EC2, Hetzner, Oracle Cloud) or want to run the full production environment on your computer, use Docker Compose.

We have created all necessary files:
- `docker-compose.yml`
- `backend/Dockerfile`
- `ai-engine/Dockerfile`
- `Dockerfile.frontend` (multi-stage build served with Nginx)

### Prerequisites
Make sure [Docker](https://docs.docker.com/get-docker/) and `docker-compose` are installed on your machine or VPS.

### Run in Production Mode:
```bash
# Start all 4 containers (MongoDB, Node Backend, Python AI Engine, and Nginx Frontend) in the background
docker compose up -d --build
```

### Check Container Status & Logs:
```bash
# Check running containers
docker ps

# View backend logs
docker logs -f fitverse-backend

# View AI engine logs
docker logs -f fitverse-ai-engine
```

Your app is immediately available at `http://localhost` (or your server's public IP address)!

---

## Summary of Deployment Fixes Made to Your Codebase ✓

To guarantee frictionless cloud & Docker deployments without runtime bugs, we performed the following critical updates:
1. **Added `pandas>=2.0.0` requirement**: Fixed `ai-engine/requirements.txt` so `diet_recommender.py` imports without throwing `ModuleNotFoundError` on cloud instances.
2. **Persistent MongoDB connection**: Updated `backend/server.js` to prioritize checking `process.env.MONGODB_URI` before falling back to `MongoMemoryServer`.
3. **Node.js Start Script**: Added `"start": "node server.js"` to `backend/package.json` so platforms like Render/Railway launch the server correctly without custom configuration.
4. **Container & Cloud Blueprints**: Added `render.yaml`, `Dockerfile.frontend`, `backend/Dockerfile`, `ai-engine/Dockerfile`, and `docker-compose.yml`.
