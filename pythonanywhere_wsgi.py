"""
WSGI Configuration for PythonAnywhere Deployment

Instructions:
1. Go to your PythonAnywhere Web tab
2. Click on your WSGI configuration file
3. Replace ALL contents with this file
4. Replace YOUR_USERNAME with your actual PythonAnywhere username
5. Update environment variables as needed
6. Save and reload your web app
"""

import os
import sys

# ========================================
# CONFIGURATION - UPDATE THESE VALUES
# ========================================

# Replace with your PythonAnywhere username
PYTHONANYWHERE_USERNAME = 'YOUR_USERNAME'

# Your project directory name (should be 'KoraQuest')
PROJECT_DIR_NAME = 'KoraQuest'

# ========================================
# AUTOMATIC PATH CONFIGURATION
# ========================================

# Build the full path to your project
project_path = f'/home/{PYTHONANYWHERE_USERNAME}/{PROJECT_DIR_NAME}'

# Add your project directory to the sys.path
if project_path not in sys.path:
    sys.path.insert(0, project_path)

# ========================================
# ENVIRONMENT VARIABLES
# ========================================

# Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'InzuLink.settings'

# Security Settings
os.environ['DEBUG'] = 'False'

# Allowed hosts (add your custom domain if you have one)
os.environ['ALLOWED_HOSTS'] = f'{PYTHONANYWHERE_USERNAME}.pythonanywhere.com'

# CSRF Trusted Origins (important for forms to work)
os.environ['CSRF_TRUSTED_ORIGINS'] = f'https://{PYTHONANYWHERE_USERNAME}.pythonanywhere.com'

# Optional: Set a custom SECRET_KEY (recommended for production)
# Generate a new key using: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
# os.environ['SECRET_KEY'] = 'paste-your-generated-secret-key-here'

# Optional: Database URL (if using PostgreSQL or MySQL)
# os.environ['DATABASE_URL'] = 'postgresql://user:password@host:port/dbname'

# Optional: Email Configuration
# os.environ['EMAIL_HOST_USER'] = 'your-email@gmail.com'
# os.environ['EMAIL_HOST_PASSWORD'] = 'your-app-specific-password'

# ========================================
# LOAD DJANGO APPLICATION
# ========================================

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

