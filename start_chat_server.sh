#!/bin/bash
# Start KoraQuest server with Daphne for WebSocket support

echo "🚀 Starting KoraQuest with WebSocket support..."
echo ""

# Check if virtual environment exists
if [ ! -d "cedenv" ]; then
    echo "❌ Virtual environment 'cedenv' not found!"
    echo "   Please create it first: python3 -m venv cedenv"
    exit 1
fi

# Activate virtual environment
source cedenv/bin/activate
echo "✅ Virtual environment activated"

# Check if Daphne is installed in venv
if ! ./cedenv/bin/python -c "import daphne" 2>/dev/null; then
    echo "⚠️  Daphne not found. Installing..."
    ./cedenv/bin/python -m pip install daphne==4.1.0
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Daphne"
        exit 1
    fi
    echo "✅ Daphne installed"
fi

# Set Django settings
export DJANGO_SETTINGS_MODULE=InzuLink.settings

# Start server using venv's daphne
echo "🌐 Starting server on http://0.0.0.0:8000"
echo "📡 WebSocket support enabled"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

./cedenv/bin/daphne -b 0.0.0.0 -p 8000 InzuLink.asgi:application

