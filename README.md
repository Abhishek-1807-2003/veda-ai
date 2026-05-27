# Veda AI

An intelligent academic platform that combines AI-powered paper analysis, real-time collaboration, and smart assignment management — built for educators and students who demand more from their tools.

**Design Reference:** [Figma Design](https://www.figma.com/design/IenSXzL3jq4lZExAATvh67/Pixel-Perfect-Screen-Replication)

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Build & Deploy](#build--deploy)
- [Features](#features)
- [Contributing](#contributing)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- pnpm (or npm)
- Docker (optional, for Redis/Database)

### Installation & Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open in browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

---

## 📖 Project Overview

Veda AI is a comprehensive academic management platform designed for educators and students. Powered by AI and built for scale, it provides:

- Intelligent paper analysis and question extraction
- Real-time collaboration via WebSocket
- AI-powered parsing, categorization, and answer suggestions
- Redis caching for high-performance delivery
- RESTful API backend
- Responsive, mobile-first UI

---

## 📁 Project Structure

```
├── apps/
│   └── backend/                 # Express.js backend server
│       ├── src/
│       │   ├── config/          # Database, Redis, environment config
│       │   ├── middleware/      # Express middleware
│       │   ├── models/          # Data models
│       │   ├── routes/          # API routes
│       │   ├── services/        # Business logic & AI services
│       │   ├── queues/          # Job queues & workers
│       │   └── websocket/       # WebSocket server
│       └── package.json
│
├── packages/
│   └── shared-types/            # Shared TypeScript types
│       ├── src/
│       │   ├── index.ts         # Type definitions
│       │   └── index.js         # CommonJS build
│       └── package.json
│
├── src/                         # React frontend
│   ├── main.tsx                 # Entry point
│   ├── app/
│   │   ├── App.tsx              # Root component
│   │   ├── components/          # Reusable UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities & API clients
│   │   ├── screens/             # Page-level components
│   │   └── store/               # State management
│   └── styles/                  # Global styles & theme
│
├── docker-compose.yml           # Docker services (Redis, DB)
├── package.json                 # Workspace root configuration
├── pnpm-workspace.yaml          # pnpm monorepo config
└── vite.config.ts               # Vite bundler configuration
```

---

## 🛠 Tech Stack

### Frontend
- **React 18** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **shadcn/ui** — Component library
- **Zustand** — State management
- **WebSocket** — Real-time communication

### Backend
- **Node.js** — Runtime
- **Express.js** — Web framework
- **TypeScript** — Type safety
- **PostgreSQL** — Database
- **Redis** — Caching & sessions
- **Bull** — Job queue
- **WebSocket** — Real-time updates

---

## 📦 Prerequisites

- **Node.js** v16 or higher
- **pnpm** v7 or higher (or npm)
- **Docker & Docker Compose** (optional)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 🔧 Installation

### 1. Clone & Install Dependencies

```bash
# Install all dependencies
pnpm install
```

### 2. Environment Configuration

Create `.env` files for the backend:

```bash
# apps/backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/veda_ai
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000
```

### 3. Setup Database (Optional)

```bash
docker-compose up -d
# or use your own PostgreSQL instance
```

---

## 💻 Development

### Start Development Servers

```bash
# Run both frontend and backend
pnpm run dev

# Or run individually:
cd apps/backend && pnpm run dev    # Backend only
cd src && pnpm run dev              # Frontend only
```

### Available Commands

```bash
# Development
pnpm run dev              # Start dev servers
pnpm run build            # Build for production
pnpm run preview          # Preview production build

# Backend specific
cd apps/backend
pnpm run dev              # Start backend server
pnpm run build            # Build backend
pnpm run start            # Run built backend

# Frontend specific
pnpm run dev              # Start Vite dev server
pnpm run build            # Build React app
pnpm run preview          # Preview built app
```

---

## 📦 Build & Deploy

### Production Build

```bash
# Build all packages
pnpm run build

# Built files:
# - Frontend: dist/
# - Backend: apps/backend/dist/
```

### Docker Deployment

```bash
# Run with Docker Compose
docker-compose up

# Services started:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - Redis: localhost:6379
# - PostgreSQL: localhost:5432
```

---

## ✨ Features

### Paper Management
- Upload academic papers (PDF support)
- Automatic question extraction
- Difficulty classification
- Paper preview & navigation

### AI-Powered Analysis
- Intelligent paper parsing
- Question categorization
- Answer suggestion system
- Real-time analysis

### Real-Time Collaboration
- WebSocket-powered live updates
- Multi-user assignment sharing
- Live notification system
- Session management

### Performance
- Redis caching layer
- Optimized image loading
- Lazy loading components
- Job queue system

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop experience
- Dark/Light theme support

---

## 📚 Additional Resources

- See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for credits and licenses
- Check [Guidelines.md](guidelines/Guidelines.md) for development guidelines
- View design on [Figma](https://www.figma.com/design/IenSXzL3jq4lZExAATvh67/Pixel-Perfect-Screen-Replication)

---

## 🤝 Contributing

Contributions are welcome! Please follow the guidelines in [Guidelines.md](guidelines/Guidelines.md).

---

