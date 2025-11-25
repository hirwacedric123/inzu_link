# Your Personal Deployment Information

## 👤 Your PythonAnywhere Account

- **Username**: `inzulink`
- **Your Site URL**: https://inzulink.pythonanywhere.com
- **Admin URL**: https://inzulink.pythonanywhere.com/admin/

---

## 🚀 Quick Deploy Commands (Personalized)

### Step 1: Clone Repository in PythonAnywhere Bash Console

```bash
git clone https://github.com/hirwacedric123/inzu_link.git KoraQuest
cd KoraQuest
```

### Step 2: Run Automated Setup

```bash
chmod +x pythonanywhere_setup.sh
./pythonanywhere_setup.sh
```

### Step 3: Create Superuser

```bash
workon koraquest
python manage.py createsuperuser
```

---

## 🔧 Your Web App Configuration

### Virtual Environment Path

```
/home/inzulink/.virtualenvs/koraquest
```

### Static Files Mapping

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/inzulink/KoraQuest/staticfiles/` |
| `/media/` | `/home/inzulink/KoraQuest/media/` |

---

## 📝 Your WSGI Configuration

**Use the file: `pythonanywhere_wsgi_READY.py`**

This file is already configured with your username! Just:
1. Open it
2. Copy all contents
3. Paste into your WSGI file on PythonAnywhere
4. Save

Or copy this directly:

```python
import os
import sys

# Add your project directory to the sys.path
project_path = '/home/inzulink/KoraQuest'
if project_path not in sys.path:
    sys.path.insert(0, project_path)

# Set environment variable for Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'InzuLink.settings'

# Set DEBUG to False for production
os.environ['DEBUG'] = 'False'

# Set your PythonAnywhere domain
os.environ['ALLOWED_HOSTS'] = 'inzulink.pythonanywhere.com'

# Set CSRF trusted origins
os.environ['CSRF_TRUSTED_ORIGINS'] = 'https://inzulink.pythonanywhere.com'

# Optional: Set SECRET_KEY (recommended)
# Generate with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
# os.environ['SECRET_KEY'] = 'your-secret-key-here'

# Initialize Django application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

---

## 📂 Your Important Paths

```
Project Directory:     /home/inzulink/KoraQuest
Virtual Environment:   /home/inzulink/.virtualenvs/koraquest
Static Files:         /home/inzulink/KoraQuest/staticfiles
Media Files:          /home/inzulink/KoraQuest/media
Database:             /home/inzulink/KoraQuest/db.sqlite3
WSGI File:            /var/www/inzulink_pythonanywhere_com_wsgi.py
```

---

## 🔄 Update Commands (After Initial Deployment)

```bash
# Pull latest code
cd /home/inzulink/KoraQuest
git pull origin main

# Activate environment
workon koraquest

# Install dependencies (if changed)
pip install -r requirements.txt

# Run migrations (if models changed)
python manage.py migrate

# Collect static files (if CSS/JS changed)
python manage.py collectstatic --noinput

# Then reload web app from Web tab
```

---

## 🔑 Generate SECRET_KEY

Run this in your PythonAnywhere Bash console:

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

Copy the output and add to your WSGI file:

```python
os.environ['SECRET_KEY'] = 'your-generated-key-here'
```

---

## 📧 Email Setup (For OTP)

### Gmail App Password Setup

1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other (Custom name)"
4. Copy the 16-character password

### Add to WSGI file:

```python
os.environ['EMAIL_HOST_USER'] = 'your-email@gmail.com'
os.environ['EMAIL_HOST_PASSWORD'] = 'your-16-char-app-password'
```

---

## ✅ Deployment Checklist

- [ ] Clone repository to PythonAnywhere
- [ ] Run setup script: `./pythonanywhere_setup.sh`
- [ ] Create superuser
- [ ] Create web app (Manual config, Python 3.10)
- [ ] Configure WSGI file (use `pythonanywhere_wsgi_READY.py`)
- [ ] Set virtualenv path: `/home/inzulink/.virtualenvs/koraquest`
- [ ] Add static files mapping: `/static/` → `/home/inzulink/KoraQuest/staticfiles/`
- [ ] Add media files mapping: `/media/` → `/home/inzulink/KoraQuest/media/`
- [ ] Generate and set SECRET_KEY
- [ ] Configure email (if using OTP)
- [ ] Reload web app
- [ ] Test site: https://inzulink.pythonanywhere.com
- [ ] Test admin: https://inzulink.pythonanywhere.com/admin/

---

## 🧪 Testing Your Deployment

After deployment, test these URLs:

- [ ] **Homepage**: https://inzulink.pythonanywhere.com
- [ ] **Login**: https://inzulink.pythonanywhere.com/login/
- [ ] **Register**: https://inzulink.pythonanywhere.com/register/
- [ ] **Admin**: https://inzulink.pythonanywhere.com/admin/
- [ ] **API**: https://inzulink.pythonanywhere.com/api/

---

## 🐛 Troubleshooting

### If site doesn't load:

1. **Check error log**: Web tab → "error log" link
2. **Check server log**: Web tab → "server log" link
3. **Verify WSGI file**: Make sure paths are correct
4. **Check virtualenv**: Should be `/home/inzulink/.virtualenvs/koraquest`
5. **Run checks**:
   ```bash
   cd /home/inzulink/KoraQuest
   workon koraquest
   python manage.py check
   ```

### Common Issues:

**DisallowedHost Error**
- Check WSGI file: `ALLOWED_HOSTS` should be `inzulink.pythonanywhere.com`

**CSRF Error**
- Check WSGI file: `CSRF_TRUSTED_ORIGINS` should be `https://inzulink.pythonanywhere.com`

**Static Files Not Loading**
- Run: `python manage.py collectstatic --noinput`
- Check static file mapping in Web tab
- Reload web app

**Import Error**
- Check virtualenv path: `/home/inzulink/.virtualenvs/koraquest`
- Check WSGI file path: `/home/inzulink/KoraQuest`

---

## 💾 Backup Commands

### Backup Database:

```bash
cd /home/inzulink/KoraQuest
workon koraquest
python manage.py dumpdata > backup_$(date +%Y%m%d_%H%M%S).json
```

### Restore Database:

```bash
cd /home/inzulink/KoraQuest
workon koraquest
python manage.py loaddata backup_YYYYMMDD_HHMMSS.json
```

---

## 📊 Your Live Site

Once deployed, your InzuLink marketplace will be available at:

🌐 **https://inzulink.pythonanywhere.com**

👨‍💼 **Admin Panel**: https://inzulink.pythonanywhere.com/admin/

📱 **Features**:
- User Authentication
- Buyer & Vendor Accounts
- Product Listings
- QR Code Generation
- Image Uploads
- Sales Statistics
- REST API

---

## 🎉 You're Ready!

Everything is configured with your username: **inzulink**

**Next Steps**:
1. Open PythonAnywhere Bash console
2. Run the clone command above
3. Run the setup script
4. Configure Web app settings
5. Your site will be LIVE! 🚀

---

## 📚 Full Documentation

- **Quick Start**: `PYTHONANYWHERE_QUICK_START.md`
- **Detailed Guide**: `PYTHONANYWHERE_DEPLOYMENT.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST_PYTHONANYWHERE.md`
- **All Commands**: `QUICK_DEPLOY_COMMANDS.md`

---

**Good luck with your deployment!** 🌟

Your InzuLink marketplace will be live soon at https://inzulink.pythonanywhere.com! 🎊

