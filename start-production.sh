#!/bin/bash

# Production startup script for Hotel Management System

echo "🚀 Starting Hotel Management System in Production Mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

# Start backend
echo "🔧 Starting backend server..."
cd server
NODE_ENV=production npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend preview server
echo "🌐 Starting frontend server..."
cd ..
npm run start &
FRONTEND_PID=$!

echo "✅ Application started!"
echo "📊 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait

