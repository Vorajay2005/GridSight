#!/bin/bash

# SolarScope Quick Start Script
# This script starts both frontend and backend servers

echo "╔═══════════════════════════════════════╗"
echo "║         Starting SolarScope           ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "⚠️  Virtual environment not found. Creating..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
else
    echo "✅ Virtual environment found"
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env not found. Creating from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your GEMINI_API_KEY"
    echo "   Get your key at: https://ai.google.dev"
    read -p "Press enter after you've added your API key..."
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Node modules not found. Installing..."
    cd frontend
    npm install
    cd ..
else
    echo "✅ Node modules found"
fi

echo ""
echo "🚀 Starting servers..."
echo ""

# Start backend in background
echo "📡 Starting backend on http://localhost:5000"
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on http://localhost:3000"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║     SolarScope is now running!        ║"
echo "╠═══════════════════════════════════════╣"
echo "║  Frontend: http://localhost:3000      ║"
echo "║  Backend:  http://localhost:5000      ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
