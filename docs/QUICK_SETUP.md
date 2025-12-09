# ⚡ Quick Setup Guide - MTN MoMo Integration

## What You Have ✅
- **Subscription Keys** (for API access):
  - Primary Key: `99ac5454271a4b4ba9105b9217d9efa8`
  - Secondary Key: `e3cce05bee0845289bfe7ae7c5885cab`

## What You Need 🔑
- **API User ID** (UUID format) - for OAuth 2.0
- **API Key** (long string) - for OAuth 2.0

**Important**: API User and API Key are **completely different** from subscription keys!
- **Subscription Keys** → Used in `Ocp-Apim-Subscription-Key` header
- **API User/Key** → Used for OAuth 2.0 authentication (Basic Auth)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Generate API User & API Key

**For Sandbox (Testing):**
```bash
# Use Provisioning API (automatic)
python create_momo_credentials.py
```
This uses the Provisioning API to automatically create credentials.

**For Production (Live):**
1. Go to MTN MoMo Partner Portal: https://momodeveloper.mtn.co.rw/
2. Navigate to your Collection API subscription
3. Go to "API User" section in Partner Portal
4. Create API User → Generate API Key
5. **Copy both immediately** - API Key cannot be retrieved again!

**Note**: Provisioning API is only available in Sandbox. Production requires Partner Portal.

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

