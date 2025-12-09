# ✅ Final Solution: Get API User and API Key

## The Problem

The Provisioning API keeps returning **401 errors** because it requires a **separate subscription** to the "Sandbox User Provisioning" product. Your subscription keys are for the **Collection API**, not the Provisioning API.

## ✅ Solution: Use Partner Portal (Recommended)

Since the Provisioning API needs a different subscription, use the **Partner Portal** method instead. This is the standard way and works for both sandbox and production.

## Step-by-Step: Partner Portal Method

### Step 1: Log In to Developer Portal

1. Go to: **https://momodeveloper.mtn.co.rw/**
2. Log in with your account

### Step 2: Navigate to API User Section

1. Go to your **Collection API** subscription
2. Look for one of these sections:
   - **"API User"**
   - **"Credentials"**
   - **"API Access"**
   - **"Partner Portal"** → **"API User"**

### Step 3: Create API User

1. Click **"Create API User"** or **"Add API User"** button
2. You'll be asked for:
   - **Provider Callback Host**: Enter `localhost` (for testing)
   - **Target Environment**: Should be "sandbox" (for testing)
3. Click **"Create"** or **"Submit"**
4. You'll get an **API User ID** (UUID format like: `81660f34-0fda-4873-9fbd-057d8ecf1b98`)
5. **Copy this ID** - you'll need it!

### Step 4: Generate API Key

1. Find the API User you just created in the list
2. Click **"Generate API Key"** or **"Create API Key"** button
3. **⚠️ COPY THE KEY IMMEDIATELY** - you won't see it again!
4. It will look like: `f1db798c98df4bcf83b538175893bbf0` (long string)

### Step 5: Add to Settings

Edit `InzuLink/settings.py` and update lines 346-347:

```python
MOMO_API_USER = 'your-api-user-id-from-portal'  # The UUID you copied
MOMO_API_KEY = 'your-api-key-from-portal'       # The key you copied
```

**Example:**
```python
MOMO_API_USER = '81660f34-0fda-4873-9fbd-057d8ecf1b98'
MOMO_API_KEY = 'f1db798c98df4bcf83b538175893bbf0'
```

### Step 6: Verify Settings

Your `InzuLink/settings.py` should now have:

```python
# Subscription Keys
MOMO_SUBSCRIPTION_KEY_PRIMARY = 'e968a63339b94f1dae91a9419d57d3ec'
MOMO_SUBSCRIPTION_KEY_SECONDARY = '2938e2c4a2c4414ca3917864e4527cbf'

# API User and Key (from Partner Portal)
MOMO_API_USER = 'your-api-user-id'
MOMO_API_KEY = 'your-api-key'
```

## Why This Method Works

- ✅ **No additional subscription needed** - uses your existing Collection API subscription
- ✅ **Works for both sandbox and production**
- ✅ **Standard method** recommended by MTN
- ✅ **More reliable** than Provisioning API
- ✅ **No 401 errors** - uses your existing subscription

## Alternative: Subscribe to Provisioning API

If you want to use the Provisioning API script:

1. Go to Developer Portal
2. Subscribe to **"Sandbox User Provisioning"** product
3. Get the subscription key for that product
4. Update settings with that key
5. Then the script will work

But the **Partner Portal method is easier** and doesn't require additional subscriptions!

## Next Steps After Getting Credentials

1. ✅ Add API User and API Key to `settings.py`
2. ✅ Run migration: `python manage.py migrate authentication`
3. ✅ Test payment flow!

---

**Ready?** Go to the Partner Portal and create your API User and API Key now! 🚀

