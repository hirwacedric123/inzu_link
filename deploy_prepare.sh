#!/bin/bash

# InzuLink Deployment Preparation Script
# This script prepares your project for deployment to Render

echo "🚀 InzuLink Deployment Preparation Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print success messages
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warning messages
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print error messages
error() {
    echo -e "${RED}✗ $1${NC}"
}

echo "Step 1: Checking Python version..."
python_version=$(python --version 2>&1 | awk '{print $2}')
if [ $? -eq 0 ]; then
    success "Python $python_version is installed"
else
    error "Python is not installed"
    exit 1
fi

echo ""
echo "Step 2: Checking if virtual environment is active..."
if [ -z "$VIRTUAL_ENV" ]; then
    warning "Virtual environment is not active"
    echo "   Tip: Activate it with: source cedenv/bin/activate"
else
    success "Virtual environment is active: $VIRTUAL_ENV"
fi

echo ""
echo "Step 3: Installing/Updating production dependencies..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    success "Dependencies installed successfully"
else
    error "Failed to install dependencies"
    exit 1
fi

echo ""
echo "Step 4: Making build.sh executable..."
chmod +x build.sh
if [ $? -eq 0 ]; then
    success "build.sh is now executable"
else
    warning "Could not make build.sh executable"
fi

echo ""
echo "Step 5: Collecting static files (test)..."
python manage.py collectstatic --no-input --clear > /dev/null 2>&1
if [ $? -eq 0 ]; then
    success "Static files collected successfully"
else
    warning "Static files collection had issues (this is okay for now)"
fi

echo ""
echo "Step 6: Running migrations (test)..."
python manage.py migrate --no-input > /dev/null 2>&1
if [ $? -eq 0 ]; then
    success "Migrations completed successfully"
else
    warning "Migrations had issues (ensure database is accessible)"
fi

echo ""
echo "Step 7: Checking for required files..."
required_files=(
    "build.sh"
    "requirements.txt"
    "runtime.txt"
    "render.yaml"
    "manage.py"
    "InzuLink/wsgi.py"
    "DEPLOYMENT_GUIDE.md"
    "QUICK_DEPLOY.md"
    ".gitignore"
)

all_files_present=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "Found: $file"
    else
        error "Missing: $file"
        all_files_present=false
    fi
done

echo ""
echo "Step 8: Checking Git repository..."
if [ -d ".git" ]; then
    success "Git repository initialized"
    
    # Check if there are uncommitted changes
    if git diff --quiet && git diff --cached --quiet; then
        success "Working directory is clean"
    else
        warning "You have uncommitted changes"
    fi
    
    # Check if remote is set
    if git remote get-url origin > /dev/null 2>&1; then
        remote_url=$(git remote get-url origin)
        success "Git remote configured: $remote_url"
    else
        warning "No Git remote configured"
        echo "   Tip: Add remote with: git remote add origin YOUR_GITHUB_URL"
    fi
else
    warning "Git repository not initialized"
    echo "   Tip: Initialize with: git init"
fi

echo ""
echo "=========================================="
echo "📋 Deployment Checklist:"
echo "=========================================="
echo ""

# Create checklist
checklist_items=(
    "[ ] All required files present"
    "[ ] Dependencies installed"
    "[ ] Git repository initialized"
    "[ ] Git remote configured"
    "[ ] Code committed to Git"
    "[ ] Code pushed to GitHub"
    "[ ] Render account created"
    "[ ] Ready to deploy!"
)

for item in "${checklist_items[@]}"; do
    echo "$item"
done

echo ""
echo "=========================================="
echo "📚 Next Steps:"
echo "=========================================="
echo ""
echo "1. Review QUICK_DEPLOY.md for deployment steps"
echo "2. Commit your changes:"
echo "   git add ."
echo "   git commit -m \"Ready for deployment\""
echo ""
echo "3. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "4. Deploy on Render:"
echo "   - Visit: https://dashboard.render.com"
echo "   - Follow steps in QUICK_DEPLOY.md"
echo ""
echo "=========================================="
echo "✨ Preparation Complete!"
echo "=========================================="
echo ""
echo "For detailed instructions, see:"
echo "  - QUICK_DEPLOY.md (quick reference)"
echo "  - DEPLOYMENT_GUIDE.md (detailed guide)"
echo ""

