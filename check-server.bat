@echo off
REM Quick script to check server status

echo ========================================
echo Checking Server Status
echo ========================================
echo.

echo Checking if port 3000 is in use...
netstat -ano | findstr :3000
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ⚠️  Port 3000 is already in use!
    echo.
) else (
    echo ✅ Port 3000 is available
    echo.
)

echo Testing backend connection...
curl -s http://localhost:3000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend server is running and accessible
    curl http://localhost:3000/health
) else (
    echo ❌ Backend server is NOT running
    echo.
    echo To start the server, run:
    echo   cd server
    echo   npm start
)

echo.
echo ========================================
echo Checking Frontend Configuration
echo ========================================
echo.

if exist .env (
    echo ✅ .env file exists
    type .env | findstr VITE_API_URL
) else (
    echo ❌ .env file NOT found
    echo.
    echo Create .env file with:
    echo   VITE_API_URL=http://localhost:3000
)

echo.
pause

