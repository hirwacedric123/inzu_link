# PythonAnywhere Static and Media Files Configuration Guide

## Problem Summary

On PythonAnywhere, static files (CSS, JavaScript, images) and media files (user uploads) were not being displayed. This document explains why and how to fix it.

## Why Files Aren't Displayed

### 1. Media Files Issue

**Root Cause:**
- In `InzuLink/urls.py`, media files are only served when `DEBUG=True`
- On PythonAnywhere, `DEBUG` is typically `False` in production
- PythonAnywhere serves files through nginx, not through Django's URL routing

**Solution:**
- Configure media files in PythonAnywhere's web app dashboard
- Django code has been updated to work correctly

### 2. Static Files Issue

**Root Cause:**
- `STATIC_URL` was set to `'static/'` (missing leading slash)
- PythonAnywhere requires `/static/` (with leading slash)
- Static files must be configured in PythonAnywhere's web app dashboard
- WhiteNoise middleware may conflict with PythonAnywhere's static file serving

**Solution:**
- Fixed `STATIC_URL` to `/static/` in settings.py
- Configure static files mapping in PythonAnywhere dashboard

## Step-by-Step Fix for PythonAnywhere

### Step 1: Collect Static Files (Including Voice Commands)

First, make sure all static files are collected, including the new voice commands JavaScript files:

```bash
cd /home/yourusername/KoraQuest-main  # Replace with your actual path
python3.10 manage.py collectstatic --noinput
```

This will copy all static files to the `staticfiles` directory, including:
- CSS files (`static/css/`)
- JavaScript files (`static/js/`) - **including `voice-commands.js`**
- Images (`static/images/`)
- Admin static files

**Important for Voice Commands:**
- The voice commands feature requires `static/js/voice-commands.js` to be collected
- Verify the file exists after running collectstatic:
  ```bash
  ls -la /home/yourusername/KoraQuest-main/staticfiles/js/voice-commands.js
  ```
- If the file is missing, check that it exists in the source:
  ```bash
  ls -la /home/yourusername/KoraQuest-main/static/js/voice-commands.js
  ```

### Step 2: Configure Static Files in PythonAnywhere Dashboard

1. Log in to PythonAnywhere
2. Go to **Web** tab
3. Click on your web app
4. Scroll down to **Static files** section
5. Add the following mapping:

   **URL:** `/static/`
   
   **Directory:** `/home/yourusername/KoraQuest-main/staticfiles`
   
   (Replace `yourusername` with your actual PythonAnywhere username)

6. Click **Save**

### Step 3: Configure Media Files in PythonAnywhere Dashboard

1. In the same **Web** tab, scroll to **Static files** section
2. Add another mapping for media files:

   **URL:** `/media/`
   
   **Directory:** `/home/yourusername/KoraQuest-main/media`
   
   (Replace `yourusername` with your actual PythonAnywhere username)

3. Click **Save**

### Step 4: Reload Your Web App

1. Click the green **Reload** button at the top of the Web tab
2. Wait for the reload to complete

### Step 5: Verify the Configuration

After reloading, check:

1. **Static files:** Visit `https://yourusername.pythonanywhere.com/static/css/yourfile.css`
   - Should load the CSS file (not 404)

2. **Media files:** Visit `https://yourusername.pythonanywhere.com/media/posts/someimage.jpg`
   - Should load the image (if it exists)

3. **Voice Commands JavaScript:** Visit `https://yourusername.pythonanywhere.com/static/js/voice-commands.js`
   - Should load the JavaScript file (not 404)
   - Check browser console for any JavaScript errors
   - Verify the microphone button appears on pages

## Important Notes

### Static Files Configuration

- **URL:** Must start with `/static/` (with leading slash)
- **Directory:** Must point to the `staticfiles` directory (where `collectstatic` puts files)
- PythonAnywhere serves these files directly via nginx, bypassing Django

### Media Files Configuration

- **URL:** Must start with `/media/` (with leading slash)
- **Directory:** Must point to the `media` directory (where user uploads are stored)
- PythonAnywhere serves these files directly via nginx, bypassing Django

### WhiteNoise Middleware

- WhiteNoise is configured in `settings.py` but may not be needed on PythonAnywhere
- It's kept for compatibility with other deployment platforms (Render, Heroku, etc.)
- PythonAnywhere's nginx handles static file serving, so WhiteNoise is essentially bypassed

## Troubleshooting

### Static Files Still Not Loading

1. **Check the path:** Make sure the directory path in PythonAnywhere dashboard is correct
   ```bash
   # Verify the path exists
   ls -la /home/yourusername/KoraQuest-main/staticfiles
   ```

2. **Re-run collectstatic:**
   ```bash
   python3.10 manage.py collectstatic --noinput
   ```

3. **Check STATIC_ROOT in settings.py:**
   - Should be: `os.path.join(BASE_DIR, 'staticfiles')`
   - Verify this matches your PythonAnywhere directory path

4. **Check file permissions:**
   ```bash
   chmod -R 755 /home/yourusername/KoraQuest-main/staticfiles
   ```

### Voice Commands Not Working

If voice commands are not working after deployment:

1. **Verify JavaScript file is collected:**
   ```bash
   # Check if voice-commands.js exists in staticfiles
   ls -la /home/yourusername/KoraQuest-main/staticfiles/js/voice-commands.js
   
   # Check file size (should be substantial, not empty)
   du -h /home/yourusername/KoraQuest-main/staticfiles/js/voice-commands.js
   ```

2. **Check browser console for errors:**
   - Open browser Developer Tools (F12)
   - Check Console tab for JavaScript errors
   - Look for 404 errors related to `voice-commands.js`

3. **Verify static files URL mapping:**
   - In PythonAnywhere dashboard, ensure `/static/` maps to `/home/yourusername/KoraQuest-main/staticfiles`
   - The voice commands file should be accessible at: `https://yourusername.pythonanywhere.com/static/js/voice-commands.js`

4. **Check HTTPS requirement:**
   - Voice commands require HTTPS for microphone access
   - PythonAnywhere provides HTTPS by default
   - If using custom domain, ensure SSL certificate is configured

5. **Test microphone permissions:**
   - Browser will prompt for microphone permission on first use
   - Check browser settings if permission was denied
   - Voice commands require microphone access to work

6. **Re-collect static files after code updates:**
   ```bash
   # After pulling latest code with voice commands updates
   cd /home/yourusername/KoraQuest-main
   python3.10 manage.py collectstatic --noinput
   # Then reload web app in PythonAnywhere dashboard
   ```

7. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear browser cache to ensure latest JavaScript is loaded

### Media Files Still Not Loading

1. **Check the path:** Make sure the directory path in PythonAnywhere dashboard is correct
   ```bash
   # Verify the path exists
   ls -la /home/yourusername/KoraQuest-main/media
   ```

2. **Check file permissions:**
   ```bash
   chmod -R 755 /home/yourusername/KoraQuest-main/media
   ```

3. **Verify MEDIA_ROOT in settings.py:**
   - Should be: `os.path.join(BASE_DIR, 'media')`
   - Verify this matches your PythonAnywhere directory path

### Files Load in Development But Not Production

- This is normal! In development (`DEBUG=True`), Django serves files through URL routing
- In production (`DEBUG=False`), PythonAnywhere's nginx serves files directly
- Make sure you've configured the static/media mappings in the PythonAnywhere dashboard

## Code Changes Made

### 1. Fixed STATIC_URL in settings.py

**Before:**
```python
STATIC_URL = 'static/'
```

**After:**
```python
STATIC_URL = '/static/'  # Added leading slash
```

### 2. Updated urls.py

Added static file serving for development (though PythonAnywhere uses nginx in production):

```python
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

## Summary

The main issue was that PythonAnywhere serves static and media files through nginx (configured in the web app dashboard), not through Django's URL routing. The fixes include:

1. ✅ Fixed `STATIC_URL` to have leading slash
2. ✅ Updated code comments for clarity
3. ✅ Created this guide for PythonAnywhere configuration
4. ✅ Added voice commands deployment instructions

## Voice Commands Deployment Checklist

When deploying voice commands feature:

- [ ] Pull latest code with voice commands updates
- [ ] Run `python3.10 manage.py collectstatic --noinput`
- [ ] Verify `staticfiles/js/voice-commands.js` exists and has content
- [ ] Ensure `/static/` URL mapping is configured in PythonAnywhere dashboard
- [ ] Reload web app in PythonAnywhere dashboard
- [ ] Test voice commands on live site (check for microphone button)
- [ ] Verify microphone permission prompt appears
- [ ] Test a voice command (e.g., "go to home")

**Remember:** After making changes, always reload your web app in the PythonAnywhere dashboard!

