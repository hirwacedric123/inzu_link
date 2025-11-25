# PythonAnywhere Quick Start Guide 🚀

## 5-Minute Deployment Checklist

### 1. Upload Your Code
```bash
# In PythonAnywhere Bash Console
git clone <your-repo-url> KoraQuest
cd KoraQuest
```

### 2. Run Setup Script
```bash
chmod +x pythonanywhere_setup.sh
./pythonanywhere_setup.sh
```

### 3. Create Superuser
```bash
python manage.py createsuperuser
```

### 4. Configure Web App

Go to **Web** tab:

**a) Create Web App:**
- Click "Add a new web app"
- Choose "Manual configuration"
- Select Python 3.10

**b) WSGI Configuration:**
- Click on WSGI file link
- Copy contents from `pythonanywhere_wsgi.py`
- Replace `YOUR_USERNAME` with your username
- Save

**c) Virtual Environment:**
```
/home/YOUR_USERNAME/.virtualenvs/koraquest
```

**d) Static Files Mapping:**
| URL | Directory |
|-----|-----------|
| `/static/` | `/home/YOUR_USERNAME/KoraQuest/staticfiles/` |
| `/media/` | `/home/YOUR_USERNAME/KoraQuest/media/` |

### 5. Reload Web App
- Click the big green "Reload" button

### 6. Test Your Site
Visit: `https://YOUR_USERNAME.pythonanywhere.com`

---

## Manual Setup (If Script Fails)

```bash
# 1. Create virtual environment
mkvirtualenv koraquest --python=/usr/bin/python3.10

# 2. Install packages
workon koraquest
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Collect static files
python manage.py collectstatic --noinput

# 5. Create superuser
python manage.py createsuperuser
```

---

## Common Commands

```bash
# Activate environment
workon koraquest

# Update code
cd ~/KoraQuest
git pull

# Run migrations
python manage.py migrate

# Collect static
python manage.py collectstatic --noinput

# Access Django shell
python manage.py shell
```

**Important:** Always reload web app after changes!

---

## Troubleshooting

### DisallowedHost Error
Check WSGI file: `ALLOWED_HOSTS` should have your domain

### Static Files Not Loading
1. Run: `python manage.py collectstatic --noinput`
2. Check static file mappings in Web tab
3. Reload web app

### Import Errors
Check virtual environment path in Web tab

### CSRF Errors
Add to WSGI file:
```python
os.environ['CSRF_TRUSTED_ORIGINS'] = 'https://YOUR_USERNAME.pythonanywhere.com'
```

---

## Quick Links

- Web Tab: Configure your web app
- Files Tab: Browse and edit files
- Consoles Tab: Open Bash or Python console
- Databases Tab: Manage databases (paid accounts)
- Error Log: In Web tab, check for errors
- Server Log: In Web tab, check for access logs

---

## Need Help?

1. Check error log in Web tab
2. Read: [Full Deployment Guide](PYTHONANYWHERE_DEPLOYMENT.md)
3. PythonAnywhere Help: https://help.pythonanywhere.com/
4. Forums: https://www.pythonanywhere.com/forums/

---

**Remember:** 
- Free accounts get `username.pythonanywhere.com` domain
- SQLite database is recommended for free tier
- Always set `DEBUG=False` in production
- Reload web app after any code changes

Good luck! 🎉

