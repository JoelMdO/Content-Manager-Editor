#!/bin/bash
# CMS E2E Test Execution Script
# This script sets up and runs the Cypress E2E tests for the CMS application

echo "🚀 CMS E2E Test Execution Script"
echo "================================"

# Check if Cypress is installed
if ! command -v cypress &> /dev/null; then
    echo "📦 Installing Cypress..."
    npm install cypress --save-dev
fi

# Check if development server is running
echo "🔍 Checking if development server is running on port 8000..."
if ! curl -s http://localhost:8000 > /dev/null; then
    echo "⚠️  Development server not running. Starting server..."
    echo "💡 Run 'npm run dev' in another terminal before running this script"
    echo "   or run this script with the 'start-server' argument"
    
    if [ "$1" = "start-server" ]; then
        echo "🏁 Starting development server..."
        npm run dev &
        DEV_SERVER_PID=$!
        sleep 10  # Wait for server to start
    else
        exit 1
    fi
fi

# Set up environment variables
export CYPRESS_baseUrl=http://localhost:8000

# Run Cypress tests
echo "🧪 Running Cypress E2E tests..."
echo ""

if [ "$1" = "headless" ] || [ "$2" = "headless" ]; then
    echo "🤖 Running tests in headless mode..."
    npx cypress run
else
    echo "🖥️  Opening Cypress Test Runner..."
    npx cypress open
fi

# Cleanup
if [ ! -z "$DEV_SERVER_PID" ]; then
    echo "🧹 Cleaning up development server..."
    kill $DEV_SERVER_PID
fi

echo ""
echo "✅ Test execution completed!"
echo "📊 Check the test results above or in the Cypress dashboard"