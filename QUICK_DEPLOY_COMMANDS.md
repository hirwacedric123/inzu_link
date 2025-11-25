# Quick Deploy Commands - InzuLink on PythonAnywhere

## 🚀 One-Command Deployment

Copy and paste these commands in your PythonAnywhere Bash Console:

### Step 1: Clone and Setup (Automated)
```bash
git clone https://github.com/hirwacedric123/inzu_link.git KoraQuest && cd KoraQuest && chmod +x pythonanywhere_setup.sh && ./pythonanywhere_setup.sh
```

**OR** do it step by step:

### Step 1: Clone Repository
```bash
git clone https://github.com/hirwacedric123/inzu_link.git KoraQuest
cd KoraQuest
```

### Step 2: Create Virtual Environment
```bash
mkvirtualenv koraquest --python=/usr/bin/python3.10
workon koraquest
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Setup Database
```bash
python manage.py migrate
python manage.py createsuperuser
```

### Step 5: Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### Step 6: Create Media Directories
```bash
mkdir -p media/{posts,profile_pics,qr_codes,product_gallery,cvs}
chmod 755 media staticfiles
```

---

## 🌐 Your Repository Information

- **GitHub Repository**: https://github.com/hirwacedric123/inzu_link.git
- **Repository Owner**: hirwacedric123
- **Project Name**: inzu_link
- **Django Project Name**: InzuLink
- **Main App**: authentication

---

## 🔧 Web App Configuration

### WSGI File Configuration

Replace `YOUR_USERNAME` with your PythonAnywhere username in these settings:

```python
# CONFIGURATION - UPDATE THESE VALUES
PYTHONANYWHERE_USERNAME = 'YOUR_USERNAME'  # ← Change this!
PROJECT_DIR_NAME = 'KoraQuest'

# Your site will be at:
# https://YOUR_USERNAME.pythonanywhere.com
```

### Virtual Environment Path
```
/home/YOUR_USERNAME/.virtualenvs/koraquest
```

### Static Files Mapping

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/YOUR_USERNAME/KoraQuest/staticfiles/` |
| `/media/` | `/home/YOUR_USERNAME/KoraQuest/media/` |

---

## 📝 Update Commands (After Initial Deployment)

Run these commands when you update your code:

```bash
# Pull latest changes from GitHub
cd ~/KoraQuest
git pull origin main

# Activate virtual environment
workon koraquest

# Install any new dependencies
pip install -r requirements.txt

# Run migrations (if models changed)
python manage.py migrate

# Collect static files (if CSS/JS changed)
python manage.py collectstatic --noinput

# Then reload your web app from the Web tab
```

---

## 🔑 Generate Secret Key

If you need a new SECRET_KEY for production:

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

Copy the output and add it to your WSGI file or .env file.

---

## 📧 Email Setup (For OTP Feature)

### Gmail App Password Setup:

1. Go to your Google Account: https://myaccount.google.com/
2. Enable 2-Factor Authentication
3. Go to: https://myaccount.google.com/apppasswords
4. Generate app password for "Mail"
5. Copy the 16-character password

### Add to .env file:
```bash
cd ~/KoraQuest
nano .env
```

Add these lines:
```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
```

Save: `Ctrl+X`, `Y`, `Enter`

---

## 🐛 Troubleshooting Commands

### Check if virtual environment is active:
```bash
which python
# Should show: /home/YOUR_USERNAME/.virtualenvs/koraquest/bin/python
```

### Check installed packages:
```bash
pip list
```

### Run Django check:
```bash
python manage.py check
python manage.py check --deploy
```

### View migrations status:
```bash
python manage.py showmigrations
```

### Test database connection:
```bash
python manage.py dbshell
# Type .quit to exit
```

### Django shell (for testing):
```bash
python manage.py shell
```

### Clear cache and restart:
```bash
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

---

## 📊 Useful PythonAnywhere Paths

```
Project Directory:     /home/YOUR_USERNAME/KoraQuest
Virtual Environment:   /home/YOUR_USERNAME/.virtualenvs/koraquest
Static Files:         /home/YOUR_USERNAME/KoraQuest/staticfiles
Media Files:          /home/YOUR_USERNAME/KoraQuest/media
Database:             /home/YOUR_USERNAME/KoraQuest/db.sqlite3
Error Log:            Check Web tab → Error log link
Server Log:           Check Web tab → Server log link
```

---

## 🔄 Backup Commands

### Backup Database:
```bash
cd ~/KoraQuest
python manage.py dumpdata > backup_$(date +%Y%m%d_%H%M%S).json
```

### Restore Database:
```bash
cd ~/KoraQuest
python manage.py loaddata backup_YYYYMMDD_HHMMSS.json
```

### Download Backup to Local Machine:
1. Go to Files tab
2. Navigate to `/home/YOUR_USERNAME/KoraQuest/`
3. Find your backup file
4. Click download button

---

## 📱 Your Live URLs (After Deployment)

- **Main Site**: `https://YOUR_USERNAME.pythonanywhere.com`
- **Admin Panel**: `https://YOUR_USERNAME.pythonanywhere.com/admin/`
- **API Docs**: `https://YOUR_USERNAME.pythonanywhere.com/api/`

Replace `YOUR_USERNAME` with your actual PythonAnywhere username!

---

## ✅ Post-Deployment Checklist

After deployment, test these:

- [ ] Homepage loads
- [ ] Static files (CSS/JS) load correctly
- [ ] Login page works
- [ ] Registration works
- [ ] Admin panel is accessible
- [ ] Can login to admin
- [ ] Can create a post
- [ ] Image uploads work
- [ ] QR code generation works
- [ ] Email OTP works (if configured)

---

## 🆘 Getting Help

1. **Check Error Log**: Web tab → Click "error log" link
2. **Check Server Log**: Web tab → Click "server log" link
3. **Read Full Guide**: See `PYTHONANYWHERE_DEPLOYMENT.md`
4. **PythonAnywhere Forums**: https://www.pythonanywhere.com/forums/
5. **Django Documentation**: https://docs.djangoproject.com/

---

## 🎯 Remember

1. **Always activate virtual environment** before running Python commands:
   ```bash
   workon koraquest
   ```

2. **Always reload web app** after code changes:
   - Go to Web tab
   - Click green "Reload" button

3. **Always backup** before major changes:
   ```bash
   python manage.py dumpdata > backup.json
   ```

---

**Happy Deploying! 🚀**

Your InzuLink project is ready to go live on PythonAnywhere!

For detailed instructions, see:
- `PYTHONANYWHERE_QUICK_START.md` - Quick 5-minute guide
- `PYTHONANYWHERE_DEPLOYMENT.md` - Detailed step-by-step guide
- `DEPLOYMENT_CHECKLIST_PYTHONANYWHERE.md` - Interactive checklist

