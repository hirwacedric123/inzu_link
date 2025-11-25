# PythonAnywhere Deployment Checklist ✅

Use this checklist to ensure you don't miss any critical steps during deployment.

## Pre-Deployment Checklist

- [ ] Create PythonAnywhere account (https://www.pythonanywhere.com)
- [ ] Verify email address
- [ ] Choose appropriate account tier (Free or Paid)
- [ ] Prepare your repository URL (if using Git)
- [ ] Generate a new SECRET_KEY for production
- [ ] Prepare email credentials (if using OTP feature)

---

## Step 1: Upload Code to PythonAnywhere

- [ ] Open Bash Console from PythonAnywhere Dashboard
- [ ] Clone repository: `git clone https://github.com/hirwacedric123/inzu_link.git KoraQuest`
- [ ] OR upload files manually via Files tab
- [ ] Verify all files uploaded: `cd KoraQuest && ls -la`

---

## Step 2: Virtual Environment Setup

- [ ] Create virtual environment: `mkvirtualenv koraquest --python=/usr/bin/python3.10`
- [ ] Activate environment: `workon koraquest`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Verify installations: `pip list`
- [ ] Note any failed packages (psycopg2-binary can be skipped if using SQLite)

---

## Step 3: Database Configuration

- [ ] Run migrations: `python manage.py migrate`
- [ ] Verify migrations completed successfully
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Note down superuser credentials (securely!)
- [ ] Test database: `python manage.py dbshell` (then type `.quit` to exit)

---

## Step 4: Static Files

- [ ] Collect static files: `python manage.py collectstatic --noinput`
- [ ] Verify staticfiles directory created: `ls -la staticfiles/`
- [ ] Check static files collected: `ls staticfiles/admin/`

---

## Step 5: Media Files Setup

- [ ] Create media directories: `mkdir -p media/{posts,profile_pics,qr_codes,product_gallery,cvs}`
- [ ] Set permissions: `chmod 755 media`
- [ ] Verify directories: `ls -la media/`

---

## Step 6: Web App Configuration

- [ ] Go to Web tab in PythonAnywhere Dashboard
- [ ] Click "Add a new web app"
- [ ] Choose "Manual configuration" (NOT Django wizard)
- [ ] Select Python version: Python 3.10 or 3.11
- [ ] Click "Next" and confirm

---

## Step 7: WSGI Configuration

- [ ] In Web tab, find "Code" section
- [ ] Click on WSGI configuration file link
- [ ] Open `pythonanywhere_wsgi.py` from your project
- [ ] Copy ALL contents from `pythonanywhere_wsgi.py`
- [ ] Paste into WSGI file in browser
- [ ] Replace `YOUR_USERNAME` with actual PythonAnywhere username (3 places)
- [ ] Verify `PROJECT_DIR_NAME = 'KoraQuest'` is correct
- [ ] Optionally add custom SECRET_KEY
- [ ] Save file (Ctrl+S or click Save button)

---

## Step 8: Virtual Environment Path

- [ ] In Web tab, find "Virtualenv" section
- [ ] Enter path: `/home/YOUR_USERNAME/.virtualenvs/koraquest`
- [ ] Replace YOUR_USERNAME with actual username
- [ ] Click checkmark to save
- [ ] Verify it shows as green/active

---

## Step 9: Static Files Mapping

- [ ] In Web tab, find "Static files" section
- [ ] Click "Add a new static file mapping"

### First Mapping (Static Files):
- [ ] URL: `/static/`
- [ ] Directory: `/home/YOUR_USERNAME/KoraQuest/staticfiles/`
- [ ] Replace YOUR_USERNAME
- [ ] Click checkmark to save

### Second Mapping (Media Files):
- [ ] URL: `/media/`
- [ ] Directory: `/home/YOUR_USERNAME/KoraQuest/media/`
- [ ] Replace YOUR_USERNAME
- [ ] Click checkmark to save

- [ ] Verify both mappings appear in list

---

## Step 10: Environment Variables (Optional)

If using .env file:

- [ ] Create .env file: `cd ~/KoraQuest && nano .env`
- [ ] Copy contents from `env.example`
- [ ] Update all placeholder values
- [ ] Generate new SECRET_KEY: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`
- [ ] Add SECRET_KEY to .env
- [ ] Set DEBUG=False
- [ ] Add your domain to ALLOWED_HOSTS
- [ ] Add your domain to CSRF_TRUSTED_ORIGINS (with https://)
- [ ] Save file (Ctrl+X, Y, Enter)

---

## Step 11: Email Configuration (If Using OTP)

- [ ] Enable 2FA on Gmail account
- [ ] Generate App Password: https://myaccount.google.com/apppasswords
- [ ] Update EMAIL_HOST_USER in settings or .env
- [ ] Update EMAIL_HOST_PASSWORD with App Password
- [ ] Test email: `python manage.py shell` then:
  ```python
  from django.core.mail import send_mail
  send_mail('Test', 'Message', 'from@example.com', ['to@example.com'])
  ```

---

## Step 12: Security Configuration

- [ ] Verify DEBUG=False (check WSGI file or .env)
- [ ] Verify SECRET_KEY is different from default
- [ ] Check ALLOWED_HOSTS includes your domain
- [ ] Check CSRF_TRUSTED_ORIGINS includes your domain with https://
- [ ] Verify SECURE_SSL_REDIRECT is enabled (in settings.py when DEBUG=False)

---

## Step 13: First Deployment

- [ ] Double-check all configurations
- [ ] In Web tab, click green "Reload" button
- [ ] Wait for reload to complete (10-30 seconds)
- [ ] Check for any red error messages

---

## Step 14: Testing

- [ ] Visit site: `https://YOUR_USERNAME.pythonanywhere.com`
- [ ] Check homepage loads
- [ ] Check static files load (CSS/JS)
- [ ] Test login page
- [ ] Test registration (if applicable)
- [ ] Login with superuser credentials
- [ ] Access admin: `https://YOUR_USERNAME.pythonanywhere.com/admin/`
- [ ] Test admin interface
- [ ] Check admin static files load correctly
- [ ] Test image upload (if applicable)
- [ ] Test QR code generation (if applicable)

---

## Step 15: Troubleshooting

If site doesn't load:

- [ ] Check error log (link in Web tab)
- [ ] Check server log (link in Web tab)
- [ ] Verify WSGI file has correct username
- [ ] Verify virtualenv path is correct
- [ ] Verify static file paths are correct
- [ ] Try running: `python manage.py check --deploy`
- [ ] Check if migrations ran: `python manage.py showmigrations`

Common Issues:

- [ ] DisallowedHost → Check ALLOWED_HOSTS in WSGI or .env
- [ ] CSRF verification failed → Check CSRF_TRUSTED_ORIGINS
- [ ] Static files not loading → Run collectstatic again
- [ ] ImportError → Check virtualenv path and pip list
- [ ] Database errors → Check migrations and database file permissions

---

## Step 16: Post-Deployment Tasks

- [ ] Create test posts/content
- [ ] Test all major features
- [ ] Set up database backup schedule
- [ ] Document any custom configuration
- [ ] Save database backup: `python manage.py dumpdata > backup.json`
- [ ] Note any limitations of free tier
- [ ] Monitor error logs for first 24 hours

---

## Step 17: Ongoing Maintenance

- [ ] Set reminder to check error logs weekly
- [ ] Set reminder to backup database monthly
- [ ] Monitor disk space usage (Files tab)
- [ ] Monitor daily CPU usage (Account tab)
- [ ] Keep Django and dependencies updated
- [ ] Test functionality after updates

---

## Important URLs

- **Your Site:** `https://YOUR_USERNAME.pythonanywhere.com`
- **Admin:** `https://YOUR_USERNAME.pythonanywhere.com/admin/`
- **Dashboard:** https://www.pythonanywhere.com/user/YOUR_USERNAME/
- **Help:** https://help.pythonanywhere.com/
- **Forums:** https://www.pythonanywhere.com/forums/

---

## Emergency Contacts & Resources

- **PythonAnywhere Support:** support@pythonanywhere.com
- **Forums:** https://www.pythonanywhere.com/forums/
- **Help Pages:** https://help.pythonanywhere.com/
- **Django Docs:** https://docs.djangoproject.com/
- **Your Backups:** `~/KoraQuest/backups/` (create this folder)

---

## Notes Section

Use this space to note any custom configurations or issues:

```
Date: _______________
Username: _______________
Domain: _______________

Custom Configurations:
- 
- 

Issues Encountered:
- 
- 

Solutions:
- 
- 
```

---

## Success Criteria

Your deployment is successful when:

✅ Site loads at your PythonAnywhere URL
✅ Static files (CSS/JS) load correctly  
✅ Admin interface is accessible and functional  
✅ You can login with superuser credentials  
✅ Database operations work (create, read, update, delete)  
✅ File uploads work (if applicable)  
✅ No errors in error log  
✅ All major features tested and working  

---

**Congratulations on your deployment! 🎉**

Remember to:
- Keep this checklist for future reference
- Document any customizations
- Backup regularly
- Monitor logs
- Keep dependencies updated

Good luck with your KoraQuest project!

