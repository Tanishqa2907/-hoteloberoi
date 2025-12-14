@echo off
REM Production startup script for Hotel Management System (Windows)

echo 🚀 Starting Hotel Management System in Production Mode...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

REM Build frontend
echo 📦 Building frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend build failed!
    exit /b 1
)

REM Start backend
echo 🔧 Starting backend server...
cd server
start "Backend Server" cmd /k "set NODE_ENV=production && npm start"

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend preview server
echo 🌐 Starting frontend server...
cd ..
start "Frontend Server" cmd /k "npm run start"

echo ✅ Application started!
echo 📊 Backend: http://localhost:3000
echo 🌐 Frontend: http://localhost:8080
echo.
echo Press any key to exit...
pause >nul

