# PythonAnywhere Deployment Guide for KoraQuest

This guide will walk you through deploying your Django KoraQuest project on PythonAnywhere.

## Prerequisites

1. A PythonAnywhere account (Free or Paid)
   - Free account: `https://www.pythonanywhere.com/registration/register/beginner/`
   - Paid accounts allow custom domains and more resources

## Step 1: Create PythonAnywhere Account

1. Go to https://www.pythonanywhere.com/
2. Sign up for an account (free tier available)
3. Verify your email address
4. Log in to your dashboard

## Step 2: Upload Your Code to PythonAnywhere

### Option A: Using Git (Recommended)

1. Open a **Bash Console** from your PythonAnywhere Dashboard
2. Clone your repository:
   ```bash
   git clone <your-repository-url> KoraQuest
   cd KoraQuest
   ```

### Option B: Upload Files Directly

1. Go to the **Files** tab
2. Create a new directory: `KoraQuest`
3. Upload your project files (excluding `cedenv/`, `db.sqlite3`, `__pycache__/`)

## Step 3: Set Up Virtual Environment

In the Bash Console:

```bash
# Navigate to your project directory
cd ~/KoraQuest

# Create a virtual environment (use Python 3.10 or 3.11)
mkvirtualenv koraquest --python=/usr/bin/python3.10

# Activate the virtual environment
workon koraquest

# Install dependencies
pip install -r requirements.txt
```

**Note:** If you get errors with `psycopg2-binary`, you can skip it for now if using SQLite:
```bash
pip install -r requirements.txt --no-deps
pip install Django==5.1.4 djangorestframework pillow qrcode whitenoise django-cors-headers django-filter reportlab PyJWT requests python-decouple
```

## Step 4: Configure Database

### For SQLite (Free Tier - Recommended for small projects):

Your project is already configured to use SQLite by default. Run migrations:

```bash
cd ~/KoraQuest
workon koraquest
python manage.py migrate
python manage.py createsuperuser
```

### For MySQL (Paid Accounts):

1. Go to **Databases** tab in PythonAnywhere
2. Create a MySQL database
3. Update your `settings.py` or use environment variables
4. Install MySQL client: `pip install mysqlclient`

## Step 5: Collect Static Files

```bash
cd ~/KoraQuest
workon koraquest
python manage.py collectstatic --noinput
```

## Step 6: Set Up Web App

1. Go to the **Web** tab in your PythonAnywhere dashboard
2. Click **Add a new web app**
3. Choose **Manual configuration** (not Django wizard)
4. Select **Python 3.10** or **Python 3.11**
5. Click **Next**

## Step 7: Configure WSGI File

1. In the **Web** tab, find the **Code** section
2. Click on the WSGI configuration file link (e.g., `/var/www/yourusername_pythonanywhere_com_wsgi.py`)
3. Delete all contents and replace with:

```python
import os
import sys

# Add your project directory to the sys.path
path = '/home/YOUR_USERNAME/KoraQuest'
if path not in sys.path:
    sys.path.insert(0, path)

# Set environment variable for Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'InzuLink.settings'

# Set DEBUG to False for production
os.environ['DEBUG'] = 'False'

# Set your PythonAnywhere domain
os.environ['ALLOWED_HOSTS'] = 'YOUR_USERNAME.pythonanywhere.com'

# Set CSRF trusted origins
os.environ['CSRF_TRUSTED_ORIGINS'] = 'https://YOUR_USERNAME.pythonanywhere.com'

# Optional: Set SECRET_KEY (recommended)
# os.environ['SECRET_KEY'] = 'your-secret-key-here'

# Initialize Django application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

**Important:** Replace `YOUR_USERNAME` with your actual PythonAnywhere username!

4. Click **Save** (top right)

## Step 8: Configure Virtual Environment Path

1. Still in the **Web** tab, find the **Virtualenv** section
2. Enter: `/home/YOUR_USERNAME/.virtualenvs/koraquest`
3. Click the checkmark to save

## Step 9: Configure Static Files

In the **Web** tab, scroll to **Static files** section:

Add these mappings:

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/YOUR_USERNAME/KoraQuest/staticfiles/` |
| `/media/` | `/home/YOUR_USERNAME/KoraQuest/media/` |

Click the checkmark after each entry to save.

## Step 10: Set Environment Variables (Optional but Recommended)

### Create a .env file:

```bash
cd ~/KoraQuest
nano .env
```

Add these variables:

```env
SECRET_KEY=your-new-secret-key-here
DEBUG=False
ALLOWED_HOSTS=YOUR_USERNAME.pythonanywhere.com
CSRF_TRUSTED_ORIGINS=https://YOUR_USERNAME.pythonanywhere.com
```

Save and exit (Ctrl+X, then Y, then Enter)

### Update settings.py to load .env:

Your project already has `python-decouple` in requirements. Update `settings.py`:

```python
from decouple import config

SECRET_KEY = config('SECRET_KEY', default='django-insecure-yg!+2gbi#185v4j8r!qg&@+%mrl*qti5&1c!7y-sx0d)n(yj&@')
DEBUG = config('DEBUG', default=False, cast=bool)
```

## Step 11: Reload Your Web App

1. Go back to the **Web** tab
2. Click the big green **Reload** button at the top
3. Wait for the reload to complete

## Step 12: Test Your Application

Visit: `https://YOUR_USERNAME.pythonanywhere.com`

## Step 13: Create Admin User (if not done already)

```bash
cd ~/KoraQuest
workon koraquest
python manage.py createsuperuser
```

Access admin at: `https://YOUR_USERNAME.pythonanywhere.com/admin/`

---

## Common Issues and Solutions

### Issue 1: "DisallowedHost" Error

**Solution:** Check your WSGI file and ensure `ALLOWED_HOSTS` is set correctly:
```python
os.environ['ALLOWED_HOSTS'] = 'YOUR_USERNAME.pythonanywhere.com'
```

### Issue 2: Static Files Not Loading

**Solution:**
1. Run `python manage.py collectstatic --noinput` again
2. Check static file mappings in Web tab
3. Ensure paths are correct: `/home/YOUR_USERNAME/KoraQuest/staticfiles/`
4. Reload web app

### Issue 3: "No module named 'InzuLink'" Error

**Solution:** Check WSGI file path:
```python
path = '/home/YOUR_USERNAME/KoraQuest'
```

### Issue 4: Media Files Not Accessible

**Solution:**
1. Check media file mapping: `/media/` → `/home/YOUR_USERNAME/KoraQuest/media/`
2. Ensure directory exists: `mkdir -p ~/KoraQuest/media`
3. Check permissions: `chmod 755 ~/KoraQuest/media`

### Issue 5: Database Errors

**Solution:**
1. Run migrations: `python manage.py migrate`
2. Check database file permissions: `ls -la ~/KoraQuest/db.sqlite3`
3. If needed, create new database: `rm db.sqlite3 && python manage.py migrate`

### Issue 6: CSRF Verification Failed

**Solution:** Add your domain to CSRF_TRUSTED_ORIGINS in WSGI file:
```python
os.environ['CSRF_TRUSTED_ORIGINS'] = 'https://YOUR_USERNAME.pythonanywhere.com'
```

### Issue 7: Email OTP Not Working

**Solution:** Update email settings in `settings.py`:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-specific-password'
```

For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in EMAIL_HOST_PASSWORD

---

## Important Notes

### Free Account Limitations:

1. **Custom Domain:** Free accounts use `username.pythonanywhere.com`
2. **HTTPS:** Automatically provided for your subdomain
3. **Database:** SQLite is recommended for free tier
4. **Disk Space:** 512 MB limit
5. **Daily CPU:** Limited CPU seconds per day
6. **Scheduled Tasks:** No scheduled tasks on free tier

### Security Recommendations:

1. **Change SECRET_KEY:** Generate a new secret key for production
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

2. **Set DEBUG=False:** Never run with DEBUG=True in production

3. **Use Environment Variables:** Store sensitive data in .env file

4. **Regular Backups:** Download your database regularly:
   ```bash
   cd ~/KoraQuest
   python manage.py dumpdata > backup.json
   ```

5. **Monitor Error Logs:** Check error log in Web tab for issues

---

## Maintenance Commands

### Update Code from Git:
```bash
cd ~/KoraQuest
workon koraquest
git pull origin main
python manage.py migrate
python manage.py collectstatic --noinput
# Then reload web app from Web tab
```

### View Error Logs:
Go to Web tab → Click on error log link

### Check Server Logs:
Go to Web tab → Click on server log link

### Database Backup:
```bash
cd ~/KoraQuest
workon koraquest
python manage.py dumpdata > backup_$(date +%Y%m%d).json
```

### Database Restore:
```bash
cd ~/KoraQuest
workon koraquest
python manage.py loaddata backup_YYYYMMDD.json
```

---

## Upgrading to Paid Account Benefits

Consider upgrading if you need:
- Custom domain support
- More disk space and CPU time
- MySQL/PostgreSQL database
- Always-on tasks
- Scheduled tasks
- SSH access
- More web workers

Pricing: https://www.pythonanywhere.com/pricing/

---

## Additional Resources

- PythonAnywhere Help: https://help.pythonanywhere.com/
- Django Deployment: https://help.pythonanywhere.com/pages/DeployExistingDjangoProject/
- Forum: https://www.pythonanywhere.com/forums/
- Django Documentation: https://docs.djangoproject.com/

---

## Quick Reference - Essential Commands

```bash
# Activate virtual environment
workon koraquest

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser

# Start Django shell
python manage.py shell

# Check for errors
python manage.py check

# Update from git
cd ~/KoraQuest && git pull
```

**Remember:** After any code changes, always reload your web app from the Web tab!

---

## Support

If you encounter issues:
1. Check the error log in the Web tab
2. Check the server log in the Web tab
3. Visit PythonAnywhere forums: https://www.pythonanywhere.com/forums/
4. Check Django settings in `InzuLink/settings.py`

Good luck with your deployment! 🚀

