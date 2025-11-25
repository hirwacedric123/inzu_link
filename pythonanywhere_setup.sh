#!/bin/bash

# ============================================
# PythonAnywhere Setup Script for KoraQuest
# ============================================
# 
# This script automates the initial setup process
# Run this after uploading your project to PythonAnywhere
#
# Usage:
#   1. Upload this script to your PythonAnywhere account
#   2. Make it executable: chmod +x pythonanywhere_setup.sh
#   3. Run it: ./pythonanywhere_setup.sh
#

echo "=========================================="
echo "KoraQuest - PythonAnywhere Setup Script"
echo "=========================================="
echo ""

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found!"
    echo "Please run this script from the KoraQuest project directory"
    exit 1
fi

echo "✓ Found manage.py - we're in the right directory"
echo ""

# Check if virtual environment exists
if [ ! -d "$HOME/.virtualenvs/koraquest" ]; then
    echo "Creating virtual environment..."
    mkvirtualenv koraquest --python=/usr/bin/python3.10
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

echo ""
echo "Activating virtual environment..."
source "$HOME/.virtualenvs/koraquest/bin/activate"

# Install dependencies
echo ""
echo "Installing dependencies from requirements.txt..."
echo "This may take a few minutes..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "⚠ Some packages failed to install"
    echo "Trying to install core packages..."
    pip install Django==5.1.4 djangorestframework pillow qrcode whitenoise django-cors-headers django-filter reportlab PyJWT requests python-decouple
fi

echo "✓ Dependencies installed"

# Run migrations
echo ""
echo "Running database migrations..."
python manage.py migrate

if [ $? -ne 0 ]; then
    echo "❌ Migrations failed!"
    exit 1
fi

echo "✓ Migrations completed"

# Collect static files
echo ""
echo "Collecting static files..."
python manage.py collectstatic --noinput

if [ $? -ne 0 ]; then
    echo "⚠ Static files collection had issues"
else
    echo "✓ Static files collected"
fi

# Create media directories
echo ""
echo "Creating media directories..."
mkdir -p media/posts
mkdir -p media/profile_pics
mkdir -p media/qr_codes
mkdir -p media/product_gallery
mkdir -p media/cvs
echo "✓ Media directories created"

# Set permissions
echo ""
echo "Setting permissions..."
chmod 755 media
chmod 755 staticfiles
echo "✓ Permissions set"

# Check if superuser exists
echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Create a superuser account:"
echo "   python manage.py createsuperuser"
echo ""
echo "2. Go to the PythonAnywhere Web tab"
echo ""
echo "3. Configure your WSGI file using: pythonanywhere_wsgi.py"
echo "   - Click on WSGI configuration file"
echo "   - Replace contents with pythonanywhere_wsgi.py"
echo "   - Update YOUR_USERNAME with your actual username"
echo ""
echo "4. Set the Virtualenv path:"
echo "   $HOME/.virtualenvs/koraquest"
echo ""
echo "5. Add static file mappings:"
echo "   URL: /static/"
echo "   Directory: $SCRIPT_DIR/staticfiles/"
echo ""
echo "   URL: /media/"
echo "   Directory: $SCRIPT_DIR/media/"
echo ""
echo "6. Reload your web app from the Web tab"
echo ""
echo "7. Visit your site at:"
echo "   https://YOUR_USERNAME.pythonanywhere.com"
echo ""
echo "=========================================="
echo ""

# Prompt for superuser creation
echo "Would you like to create a superuser now? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

echo ""
echo "Setup script completed! 🚀"
echo ""

