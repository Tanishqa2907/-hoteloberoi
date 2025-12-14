#!/bin/bash

# Development startup script for Hotel Management System

echo "🚀 Starting Hotel Management System in Development Mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Start backend in watch mode
echo "🔧 Starting backend server (watch mode)..."
cd server
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend dev server
echo "🌐 Starting frontend dev server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "✅ Development servers started!"
echo "📊 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait

