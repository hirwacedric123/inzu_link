# 📝 Manual API Credentials Setup (Partner Portal)

Since the Provisioning API requires a separate subscription, use the **Partner Portal** method instead.

## Step-by-Step Guide

### Step 1: Log In to Developer Portal

1. Go to: **https://momodeveloper.mtn.co.rw/**
2. Log in with your account credentials

### Step 2: Navigate to API User Section

1. Go to your **Collection API** subscription
2. Look for **"API User"**, **"Credentials"**, or **"API Access"** section
3. This might be under:
   - Your subscription details
   - Partner Portal area
   - API Management section

### Step 3: Create API User

1. Click **"Create API User"** or similar button
2. You'll be asked for:
   - **Provider Callback Host**: Enter `localhost` (for testing) or your domain
   - **Payment Server URL**: Usually not required for Collection API
3. Click **"Create"** or **"Submit"**
4. You'll get an **API User ID** (UUID format)
5. **Copy this ID** - you'll need it!

### Step 4: Generate API Key

1. Find the API User you just created
2. Click **"Generate API Key"** or **"Create API Key"**
3. **⚠️ COPY THE KEY IMMEDIATELY** - you won't see it again!
4. Save both:
   - API User ID
   - API Key

### Step 5: Add to Settings

Edit `InzuLink/settings.py` and update lines 346-347:

```python
MOMO_API_USER = 'paste-your-api-user-id-here'
MOMO_API_KEY = 'paste-your-api-key-here'
```

Or add to `.env` file:
```bash
MOMO_API_USER=your-api-user-id
MOMO_API_KEY=your-api-key
```

### Step 6: Verify

Restart your Django server and test the payment flow!

## What You'll See in Portal

The portal interface might look like:
- **API User Management** section
- List of existing API Users (if any)
- **"Create New"** or **"Add API User"** button
- For each user: **"Generate Key"** or **"Create API Key"** button

## Troubleshooting

### Can't Find API User Section

**Try:**
1. Check different tabs/sections in the portal
2. Look for "API Access", "Credentials", "Authentication"
3. Check if you need to enable it in subscription settings
4. Contact MTN support: mmitsupport.RW@mtn.com

### API Key Not Showing

**Important**: API Keys are only shown **once** when generated. If you miss it:
- You'll need to **revoke** the old key
- **Generate a new one**
- Copy it immediately

### Still Having Issues?

1. **Check your subscription**: Make sure Collection API is active
2. **Contact MTN Support**: mmitsupport.RW@mtn.com
3. **Check documentation**: Available in the Developer Portal

---

**This method is more reliable than Provisioning API and doesn't require additional subscriptions!**

