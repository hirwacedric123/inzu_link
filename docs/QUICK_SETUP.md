# ⚡ Quick Setup Guide - MTN MoMo Integration

## What You Have ✅
- Primary Key: `99ac5454271a4b4ba9105b9217d9efa8`
- Secondary Key: `e3cce05bee0845289bfe7ae7c5885cab`

## What You Need 🔑
- **API User ID** (UUID format)
- **API Key** (long string)

These are **DIFFERENT** from your subscription keys!

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Generate API User & API Key

**Option A: Automatic (Sandbox Only)**
```bash
# Run the helper script
python create_momo_credentials.py
```
This will automatically create and display your credentials.

**Option B: Manual (Portal)**
1. Go to https://momodeveloper.mtn.co.rw/
2. Navigate to your Collection API subscription
3. Find "API User" or "Sandbox User Provisioning" section
4. Create API User → Generate API Key
5. Copy both values

### Step 2: Configure Credentials

**Add to `.env` file** (recommended):
```bash
MOMO_API_USER=your-api-user-id-here
MOMO_API_KEY=your-api-key-here
MOMO_ENVIRONMENT=sandbox
```

**OR add to `InzuLink/settings.py`** (for quick testing):
```python
MOMO_API_USER = 'your-api-user-id-here'
MOMO_API_KEY = 'your-api-key-here'
```

### Step 3: Run Migration & Test

```bash
# Run migration
python manage.py migrate authentication

# Start server
python manage.py runserver

# Test: Create property → Pay listing fee → Select MoMo → Approve on phone
```

---

## ✅ That's It!

Once you have the API User and API Key configured, the payment integration will work automatically.

**Need help?** Check `SETUP_STEPS.md` for detailed instructions.

