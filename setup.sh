#!/bin/bash
# Setup script for Unix-like systems (macOS, Linux)

set -e

echo "============================================"
echo "  Pixel-Perfect Backend Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/ (v18+)"
    exit 1
fi

# Check if pnpm is installed, if not install it
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ Node.js v$(node --version)"
echo "✅ pnpm v$(pnpm --version)"
echo ""

echo "[1/4] Installing dependencies with pnpm..."
pnpm install

echo ""
echo "[2/4] Building backend..."
pnpm --filter @vedaai/backend build

echo ""
echo "[3/4] Building shared types..."
pnpm --filter @vedaai/shared-types build

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  cd apps/backend"
echo "  npm run dev"
echo ""
echo "To run production build:"
echo "  pnpm --filter @vedaai/backend start"
echo ""
