@echo off
REM Development startup script for Hotel Management System (Windows)

echo 🚀 Starting Hotel Management System in Development Mode...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

REM Start backend in watch mode
echo 🔧 Starting backend server (watch mode)...
cd server
start "Backend Server" cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend dev server
echo 🌐 Starting frontend dev server...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo ✅ Development servers started!
echo 📊 Backend: http://localhost:3000
echo 🌐 Frontend: http://localhost:8080
echo.
echo Press any key to exit...
pause >nul

