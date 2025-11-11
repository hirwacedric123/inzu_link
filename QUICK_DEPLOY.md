# 🚀 Quick Deployment Guide - InzuLink on Render

## ⚡ Prerequisites
- GitHub account
- Render account (free at https://render.com)

## 📝 Quick Steps

### 1️⃣ Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2️⃣ Deploy on Render

**Option A: Using Dashboard (Recommended)**
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Fill in:
   - **Name**: `inzulink`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn InzuLink.wsgi:application`
5. Add Environment Variables:
   - `PYTHON_VERSION` = `3.12.0`
   - `DEBUG` = `False`
   - `SECRET_KEY` = [Click "Generate"]
   - `ALLOWED_HOSTS` = `.onrender.com`
6. Click "Create Web Service"

**Option B: Using render.yaml (Automatic)**
1. Ensure `render.yaml` is in your repo
2. Go to https://dashboard.render.com
3. Click "New +" → "Blueprint"
4. Connect your GitHub repo
5. Render will automatically:
   - Create web service
   - Create PostgreSQL database
   - Set up environment variables
6. Click "Apply"

### 3️⃣ Create Superuser (After Deployment)
1. Go to your service dashboard
2. Click "Shell" tab
3. Run:
```bash
python manage.py createsuperuser
```

### 4️⃣ Access Your App
Your app will be live at:
```
https://inzulink.onrender.com
```

## 🔧 Troubleshooting

**Build fails?**
- Check logs in Render dashboard
- Verify `build.sh` is executable: `chmod +x build.sh`

**Static files not loading?**
- Verify `DISABLE_COLLECTSTATIC=0` in environment
- Check build logs for collectstatic output

**Database errors?**
- Ensure DATABASE_URL is set correctly
- Use Internal Database URL (not External)

## 📞 Need detailed instructions?
See `DEPLOYMENT_GUIDE.md` for step-by-step instructions.

---
✨ **That's it! Your InzuLink app is now live on Render!** ✨

