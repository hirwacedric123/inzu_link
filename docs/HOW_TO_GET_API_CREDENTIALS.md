# 🔑 How to Get API User and API Key

## Quick Answer

You need to **generate** these credentials - they don't exist yet! Here are your options:

## Method 1: Automatic (Sandbox - Easiest) ⭐ Recommended

### Step 1: Run the Helper Script

```bash
# Make sure you're in the project directory
cd /mnt/data/PROJECTS/Cedric_Personal/KoraQuest-main

# Activate virtual environment (if you have one)
source cedenv/bin/activate  # or your venv

# Run the script
python create_momo_credentials.py
```

### Step 2: What Happens

The script will:
1. Connect to MTN MoMo Sandbox Provisioning API
2. Create a new API User (UUID)
3. Generate an API Key for that user
4. Display both credentials

### Step 3: Copy the Credentials

You'll see output like:
```
✅ CREDENTIALS GENERATED
============================================================

Add these to your .env file or settings.py:

MOMO_API_USER=12345678-1234-1234-1234-123456789abc
MOMO_API_KEY=abcdef1234567890abcdef1234567890abcdef12
```

### Step 4: Add to Your Settings

**Option A: Add to `.env` file** (Recommended)
```bash
# Create or edit .env file in project root
MOMO_API_USER=12345678-1234-1234-1234-123456789abc
MOMO_API_KEY=abcdef1234567890abcdef1234567890abcdef12
MOMO_ENVIRONMENT=sandbox
```

**Option B: Add directly to `InzuLink/settings.py`**
```python
MOMO_API_USER = '12345678-1234-1234-1234-123456789abc'
MOMO_API_KEY = 'abcdef1234567890abcdef1234567890abcdef12'
```

## Method 2: Manual via Provisioning API (Sandbox)

If the script doesn't work, you can do it manually:

### Step 1: Open Django Shell

```bash
python manage.py shell
```

### Step 2: Run These Commands

```python
from authentication.momo_payment import MTNMoMoPayment
import uuid

# Initialize MoMo payment handler
momo = MTNMoMoPayment()

# Generate a unique API User ID (UUID)
api_user_id = str(uuid.uuid4())
print(f"Generated API User ID: {api_user_id}")

# Create API User (replace 'localhost' with your callback host)
result = momo.create_api_user(api_user_id, "localhost")

if result['success']:
    print("✅ API User created!")
    
    # Generate API Key
    key_result = momo.create_api_key(api_user_id)
    
    if key_result['success']:
        print(f"\n✅ SUCCESS!")
        print(f"API User: {api_user_id}")
        print(f"API Key: {key_result['api_key']}")
        print("\n⚠️  Save these immediately - you won't see the key again!")
    else:
        print(f"❌ Failed to create API Key: {key_result['message']}")
else:
    print(f"❌ Failed to create API User: {result['message']}")
```

### Step 3: Copy and Save

Copy both the API User ID and API Key, then add them to your settings.

## Method 3: Via Partner Portal (Production)

For production environment, you must use the Partner Portal:

### Step 1: Log In

1. Go to: https://momodeveloper.mtn.co.rw/
2. Log in with your account

### Step 2: Navigate to API User Section

1. Go to your **Collection API** subscription
2. Look for **"API User"** or **"Credentials"** section
3. This might be under "Sandbox User Provisioning" or "API Access"

### Step 3: Create API User

1. Click **"Create API User"** or similar button
2. You'll get an API User ID (UUID format)
3. Copy this ID

### Step 4: Generate API Key

1. Find the API User you just created
2. Click **"Generate API Key"** or similar
3. **⚠️ COPY THE KEY IMMEDIATELY** - you won't see it again!
4. Save both credentials securely

### Step 5: Add to Settings

Add both to your `.env` or `settings.py` as shown in Method 1.

## Troubleshooting

### "ModuleNotFoundError: No module named 'django'"

**Solution:**
```bash
# Activate your virtual environment first
source cedenv/bin/activate  # or your venv path

# Then run the script
python create_momo_credentials.py
```

### "API User provisioning is only available in sandbox"

**Solution:**
- Make sure `MOMO_ENVIRONMENT=sandbox` in your settings
- Or use Partner Portal for production

### "Failed to create API User"

**Possible causes:**
- Subscription key is incorrect
- Network connectivity issues
- Sandbox API is down

**Solution:**
- Verify subscription keys in settings
- Check internet connection
- Try again later
- Use Partner Portal as alternative

### Script Not Found

**Solution:**
```bash
# Make sure you're in the project root
cd /mnt/data/PROJECTS/Cedric_Personal/KoraQuest-main

# Check if file exists
ls -la create_momo_credentials.py

# If it doesn't exist, it should be in the repo - check git
git status
```

## Quick Reference

| Method | Environment | Difficulty | Speed |
|--------|-------------|------------|-------|
| Helper Script | Sandbox | ⭐ Easy | ⚡ Fast |
| Manual API | Sandbox | ⭐⭐ Medium | ⚡⚡ Medium |
| Partner Portal | Production | ⭐⭐⭐ Harder | 🐌 Slower |

## What You'll Get

After generating, you'll have:
- **API User**: A UUID like `12345678-1234-1234-1234-123456789abc`
- **API Key**: A long string like `abcdef1234567890abcdef1234567890abcdef12`

Both are needed for OAuth 2.0 authentication with MTN MoMo API.

## Next Steps

Once you have the credentials:

1. ✅ Add them to `.env` or `settings.py`
2. ✅ Run migration: `python manage.py migrate authentication`
3. ✅ Start testing!

---

**Recommended**: Start with Method 1 (Helper Script) - it's the easiest! 🚀

