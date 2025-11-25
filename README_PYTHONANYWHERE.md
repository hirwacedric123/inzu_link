# KoraQuest - PythonAnywhere Deployment Resources

This directory contains everything you need to deploy KoraQuest on PythonAnywhere.

## 📚 Available Resources

### 1. **PYTHONANYWHERE_QUICK_START.md** 
   - ⚡ 5-minute quick start guide
   - Essential commands and steps
   - Perfect for experienced users
   - **Start here if you want to deploy fast**

### 2. **PYTHONANYWHERE_DEPLOYMENT.md**
   - 📖 Complete detailed guide
   - Step-by-step instructions with explanations
   - Troubleshooting section
   - Best practices and security tips
   - **Start here if you want full details**

### 3. **DEPLOYMENT_CHECKLIST_PYTHONANYWHERE.md**
   - ✅ Interactive checklist
   - Covers all deployment steps
   - Helps ensure nothing is missed
   - Includes notes section
   - **Use this alongside other guides**

### 4. **pythonanywhere_wsgi.py**
   - 🔧 Ready-to-use WSGI configuration
   - Copy-paste into PythonAnywhere WSGI file
   - Pre-configured with sensible defaults
   - Just update YOUR_USERNAME
   - **Essential for deployment**

### 5. **pythonanywhere_setup.sh**
   - 🤖 Automated setup script
   - Handles virtual environment, dependencies, migrations
   - Creates directories and sets permissions
   - Run this in PythonAnywhere Bash console
   - **Automates manual steps**

### 6. **env.example**
   - 🔐 Environment variables template
   - Copy to .env and customize
   - Includes instructions
   - **Recommended for production**

---

## 🚀 Quick Start

### Option 1: Automated (Recommended)
```bash
# In PythonAnywhere Bash Console
git clone <your-repo-url> KoraQuest
cd KoraQuest
chmod +x pythonanywhere_setup.sh
./pythonanywhere_setup.sh
```
Then follow the Web tab configuration steps in the Quick Start guide.

### Option 2: Manual
Follow the **PYTHONANYWHERE_QUICK_START.md** guide.

### Option 3: Step-by-Step
Follow the **PYTHONANYWHERE_DEPLOYMENT.md** guide with the **DEPLOYMENT_CHECKLIST_PYTHONANYWHERE.md**.

---

## 📋 Deployment Overview

```
1. Upload Code → 2. Setup Environment → 3. Database → 4. Web Config → 5. Go Live!
```

### Prerequisites
- PythonAnywhere account (free or paid)
- Git repository (optional but recommended)
- 15-30 minutes

### What You'll Get
- Live website at `https://yourusername.pythonanywhere.com`
- Automatic HTTPS
- Admin interface
- All your Django features working

---

## 🎯 Choose Your Path

### I want speed! ⚡
→ Use **PYTHONANYWHERE_QUICK_START.md** + **pythonanywhere_setup.sh**

### I want to understand everything 📚
→ Use **PYTHONANYWHERE_DEPLOYMENT.md** + **DEPLOYMENT_CHECKLIST_PYTHONANYWHERE.md**

### I want automation 🤖
→ Run **pythonanywhere_setup.sh** then configure Web tab

### I'm stuck! 🆘
→ Check Troubleshooting in **PYTHONANYWHERE_DEPLOYMENT.md**

---

## 📦 Project Structure

Your KoraQuest project includes:

```
KoraQuest/
├── InzuLink/                 # Django project settings
│   ├── settings.py          # Already configured for deployment
│   └── wsgi.py              # WSGI entry point
├── authentication/          # Your main app
├── static/                  # Static files (CSS, JS, images)
├── media/                   # User uploads
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
├── db.sqlite3             # Database (will be created)
└── Deployment Guides/      # You are here!
```

---

## ⚙️ Configuration Files

### Already Configured ✅
- ✅ `settings.py` - Production-ready with environment variable support
- ✅ `requirements.txt` - All dependencies listed
- ✅ `wsgi.py` - Standard Django WSGI

### You Need to Configure 📝
- 📝 WSGI file on PythonAnywhere (use `pythonanywhere_wsgi.py`)
- 📝 Web app settings (virtual environment, static files)
- 📝 Environment variables (optional but recommended)

---

## 🔐 Security Checklist

Before going live, ensure:
- [ ] `DEBUG=False` in production
- [ ] Custom `SECRET_KEY` generated and set
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] `CSRF_TRUSTED_ORIGINS` includes your domain (with https://)
- [ ] Email credentials secured (use app password, not main password)
- [ ] Database backed up regularly
- [ ] `.env` file not committed to git (use `env.example` template)

---

## 🆓 Free Tier Limitations

PythonAnywhere free tier includes:
- ✅ One web app at `username.pythonanywhere.com`
- ✅ Automatic HTTPS
- ✅ 512 MB disk space
- ✅ SQLite database
- ✅ Limited daily CPU quota
- ❌ No custom domain
- ❌ No always-on scheduled tasks
- ❌ No SSH access

For custom domains and more resources, upgrade to paid tier.

---

## 📞 Getting Help

### Documentation
1. **These guides** - Start here!
2. **PythonAnywhere Help**: https://help.pythonanywhere.com/
3. **Django Docs**: https://docs.djangoproject.com/

### Support
1. **Error logs** - Check Web tab in PythonAnywhere
2. **Forums**: https://www.pythonanywhere.com/forums/
3. **Support email**: support@pythonanywhere.com (paid accounts)

### Common Issues
→ See Troubleshooting section in **PYTHONANYWHERE_DEPLOYMENT.md**

---

## 🔄 Updating Your Deployed App

```bash
# 1. Pull latest code
cd ~/KoraQuest
git pull

# 2. Activate environment
workon koraquest

# 3. Update dependencies (if requirements.txt changed)
pip install -r requirements.txt

# 4. Run migrations (if models changed)
python manage.py migrate

# 5. Collect static files (if static files changed)
python manage.py collectstatic --noinput

# 6. Reload web app (in Web tab)
# Click the green "Reload" button
```

---

## 💡 Pro Tips

1. **Always reload** your web app after making changes
2. **Check error logs** if something doesn't work
3. **Backup database** before major updates: `python manage.py dumpdata > backup.json`
4. **Use environment variables** for sensitive data
5. **Test locally** before deploying changes
6. **Monitor CPU usage** on free tier (Account tab)
7. **Use static file versioning** to prevent caching issues
8. **Keep dependencies updated** but test first

---

## 🎓 Learning Resources

### PythonAnywhere
- Help Pages: https://help.pythonanywhere.com/
- Blog: https://blog.pythonanywhere.com/
- Forums: https://www.pythonanywhere.com/forums/

### Django
- Official Tutorial: https://docs.djangoproject.com/en/stable/intro/tutorial01/
- Deployment Checklist: https://docs.djangoproject.com/en/stable/howto/deployment/checklist/
- Django REST Framework: https://www.django-rest-framework.org/

---

## 📊 Project Information

- **Framework**: Django 5.1.4
- **Python Version**: 3.10+ recommended
- **Database**: SQLite (default) / PostgreSQL (production option)
- **Web Server**: PythonAnywhere's built-in server
- **Static Files**: WhiteNoise
- **API**: Django REST Framework

---

## 🎉 Success Checklist

Your deployment is complete when:

- ✅ Website loads at your PythonAnywhere URL
- ✅ Static files (CSS, JS, images) display correctly
- ✅ Admin panel is accessible
- ✅ Login/logout works
- ✅ Database operations work
- ✅ File uploads work (if applicable)
- ✅ No errors in error log

---

## 📝 Next Steps After Deployment

1. **Test all features** thoroughly
2. **Create initial content** (posts, users, etc.)
3. **Set up regular backups**
4. **Monitor error logs** for first few days
5. **Share your site** with users
6. **Gather feedback** and iterate
7. **Plan for scaling** if needed

---

## 🚀 Ready to Deploy?

1. **Choose your guide** from the list above
2. **Follow the steps** carefully
3. **Use the checklist** to stay organized
4. **Ask for help** if you get stuck
5. **Celebrate** when it's live! 🎉

---

## 📄 License & Credits

- **KoraQuest**: Your Django project
- **Django**: BSD License
- **PythonAnywhere**: Commercial hosting service
- **Deployment Guides**: Created for KoraQuest deployment

---

**Good luck with your deployment!** 

If you have questions, check the guides or visit the PythonAnywhere forums.

Happy coding! 🚀✨

