#!/bin/bash
# Script to compile Django translation files
# Usage: ./compile_translations.sh

echo "🌍 Compiling Django translations..."

# Check if gettext is installed
if ! command -v msgfmt &> /dev/null; then
    echo "⚠️  gettext is not installed."
    echo "📦 Installing gettext..."
    
    # Try to install based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Linux detected. Install with: sudo apt-get install gettext"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS detected. Install with: brew install gettext"
    else
        echo "Please install gettext manually for your OS"
    fi
    
    echo ""
    echo "💡 Alternative: Django can compile at runtime, but it's slower."
    echo "   You can still use the translations, they'll just compile on first use."
    exit 1
fi

# Activate virtual environment if it exists
if [ -d "cedenv" ]; then
    echo "📦 Activating virtual environment..."
    source cedenv/bin/activate
elif [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

# Compile messages
echo "🔨 Compiling translation files..."
python3 manage.py compilemessages

if [ $? -eq 0 ]; then
    echo "✅ Translations compiled successfully!"
    echo ""
    echo "📊 Translation files compiled:"
    echo "   - locale/en/LC_MESSAGES/django.mo"
    echo "   - locale/rw/LC_MESSAGES/django.mo"
    echo "   - locale/fr/LC_MESSAGES/django.mo"
else
    echo "❌ Error compiling translations"
    echo "💡 Make sure Django is installed and you're in the project root"
    exit 1
fi

