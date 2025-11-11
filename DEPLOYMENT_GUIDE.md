# 🚀 InzuLink Deployment Guide for Render

This guide will walk you through deploying your InzuLink Django application to Render.

## 📋 Prerequisites

Before you begin, make sure you have:
- A GitHub account
- A Render account (sign up at https://render.com)
- Your project pushed to a GitHub repository

## 🔧 Step 1: Prepare Your Project

### 1.1 Update requirements.txt
Make sure your `requirements.txt` includes all production dependencies:

```bash
# Run this to update requirements.txt with all current packages
pip freeze > requirements.txt
```

### 1.2 Update Settings for Production

The project already includes production-ready settings. Key configurations:
- ✅ Environment variables for SECRET_KEY
- ✅ DEBUG mode controlled by environment
- ✅ Database configuration with PostgreSQL support
- ✅ Static files configuration
- ✅ ALLOWED_HOSTS setup

### 1.3 Make build script executable

```bash
chmod +x build.sh
```

## 📤 Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare InzuLink for Render deployment"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/inzulink.git

# Push to GitHub
git push -u origin main
```

## 🌐 Step 3: Deploy to Render

### 3.1 Create a New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** button
3. Select **"Web Service"**
4. Connect your GitHub repository:
   - Click **"Connect GitHub"**
   - Authorize Render to access your repositories
   - Select your **InzuLink repository**

### 3.2 Configure Web Service

Fill in the following details:

**Basic Settings:**
- **Name**: `inzulink` (or your preferred name)
- **Region**: Choose closest to your users (e.g., Oregon (US West))
- **Branch**: `main` (or your default branch)
- **Runtime**: `Python 3`

**Build & Deploy Settings:**
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn InzuLink.wsgi:application`

**Instance Type:**
- Select **"Free"** (or paid plan for better performance)

### 3.3 Set Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `PYTHON_VERSION` | `3.12.0` | Python version |
| `DEBUG` | `False` | Production mode |
| `SECRET_KEY` | `[Generate Random]` | Click "Generate" button |
| `ALLOWED_HOSTS` | `.onrender.com,inzulink.onrender.com` | Your domain |
| `DISABLE_COLLECTSTATIC` | `0` | Enable static files |

**Optional but Recommended:**
| Key | Value | Notes |
|-----|-------|-------|
| `CSRF_COOKIE_SECURE` | `True` | For HTTPS |
| `SESSION_COOKIE_SECURE` | `True` | For HTTPS |

### 3.4 Create PostgreSQL Database (Recommended)

1. From your Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `inzulink-db`
   - **Database**: `inzulink`
   - **User**: `inzulink`
   - **Region**: Same as your web service
   - **Plan**: Free

4. After creation, go back to your **Web Service**
5. In **Environment Variables**, add:
   - **Key**: `DATABASE_URL`
   - **Value**: Copy the **Internal Database URL** from your PostgreSQL service

## 🎯 Step 4: Deploy!

1. Click **"Create Web Service"**
2. Render will start building and deploying your app
3. Wait for the build to complete (usually 5-10 minutes)
4. Once deployed, you'll see a green **"Live"** status

## 🔗 Step 5: Access Your Application

Your application will be available at:
```
https://inzulink.onrender.com
```
(Replace `inzulink` with your chosen service name)

## 🔒 Step 6: Post-Deployment Setup

### 6.1 Create Superuser

Access your application's shell:

1. From your Web Service dashboard, click **"Shell"** tab
2. Run:
```bash
python manage.py createsuperuser
```

### 6.2 Update ALLOWED_HOSTS

If using a custom domain, update the `ALLOWED_HOSTS` environment variable to include your domain:
```
.onrender.com,yourdomain.com,www.yourdomain.com
```

### 6.3 Configure CSRF_TRUSTED_ORIGINS

Add to environment variables:
```
CSRF_TRUSTED_ORIGINS=https://inzulink.onrender.com,https://yourdomain.com
```

## 📊 Step 7: Monitor Your Application

### View Logs
- Go to your Web Service dashboard
- Click **"Logs"** tab
- View real-time application logs

### Check Metrics
- Monitor CPU and Memory usage
- Track deployment history
- Set up alerts for downtime

## 🔄 Step 8: Continuous Deployment

Render automatically deploys when you push to your connected GitHub branch:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
```

Render will automatically:
1. Detect the push
2. Run build.sh
3. Deploy the new version

## 🛠️ Troubleshooting

### Build Fails

**Check build logs:**
- Look for missing dependencies
- Verify Python version compatibility
- Ensure all required files are committed

**Common fixes:**
```bash
# Update requirements.txt
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update dependencies"
git push
```

### Static Files Not Loading

**Solution 1:** Verify DISABLE_COLLECTSTATIC is set to `0`

**Solution 2:** Check `build.sh` includes:
```bash
python manage.py collectstatic --no-input
```

### Database Connection Issues

**Check:**
1. DATABASE_URL is set correctly
2. PostgreSQL service is running
3. Internal Database URL (not external) is used

### 500 Internal Server Error

**Enable DEBUG temporarily:**
1. Set `DEBUG=True` in environment variables
2. Check logs for detailed error messages
3. Fix the issue
4. Set `DEBUG=False` again

## 🎨 Custom Domain Setup (Optional)

1. Go to your Web Service **Settings**
2. Scroll to **Custom Domains**
3. Click **"Add Custom Domain"**
4. Follow DNS configuration instructions
5. Update `ALLOWED_HOSTS` environment variable

## 🔐 Security Checklist

Before going live, ensure:
- ✅ `DEBUG = False`
- ✅ Strong `SECRET_KEY` (auto-generated by Render)
- ✅ `CSRF_COOKIE_SECURE = True`
- ✅ `SESSION_COOKIE_SECURE = True`
- ✅ Database credentials secured
- ✅ HTTPS enabled (automatic on Render)
- ✅ Regular security updates

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/5.0/howto/deployment/
- **Community**: https://community.render.com

## 🎉 Congratulations!

Your InzuLink application is now live on Render! 🚀

---

**Quick Commands Reference:**

```bash
# Update and deploy
git add .
git commit -m "Your message"
git push origin main

# View logs (from Render dashboard)
# Shell -> View Logs

# Run management commands (from Render Shell)
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
```

---

**Pro Tips:**
- Use environment variables for all sensitive data
- Enable auto-deploy for seamless updates
- Set up health checks for monitoring
- Use PostgreSQL for production (not SQLite)
- Regular database backups
- Monitor application performance

**Support:** For issues specific to InzuLink, contact your development team.

