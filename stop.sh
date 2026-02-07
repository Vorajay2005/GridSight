#!/bin/bash

# SolarScope Stop Script
# Stops all running SolarScope processes

echo "Stopping SolarScope servers..."

# Kill Flask backend (port 5000)
lsof -ti:5000 | xargs kill -9 2>/dev/null

# Kill Vite frontend (port 3000)
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "✅ All SolarScope servers stopped"
