@echo off
REM Setup script for Windows users

echo ============================================
echo   Pixel-Perfect Backend Setup
echo ============================================
echo.

echo [1/4] Installing Node.js dependencies...
echo.
echo Please ensure you have Node.js and pnpm installed:
echo - Node.js: https://nodejs.org/ (v18+)
echo - pnpm: npm install -g pnpm
echo.
echo Waiting for your input...
pause

echo.
echo [2/4] Installing dependencies with pnpm...
call pnpm install
if errorlevel 1 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Building backend...
call pnpm --filter @vedaai/backend build
if errorlevel 1 (
    echo Failed to build backend
    pause
    exit /b 1
)

echo.
echo [4/4] Setup complete!
echo.
echo To start development:
echo   cd apps/backend
echo   npm run dev
echo.
echo To run tests:
echo   pnpm --filter @vedaai/backend test
echo.
pause
