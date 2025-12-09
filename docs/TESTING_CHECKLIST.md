# 🧪 MTN MoMo Payment Integration - Testing Checklist

## ✅ What's Already Done

- ✅ **Code Implementation**: Complete
  - MoMo payment integration code
  - Payment views and templates
  - Database models updated
  - URL routes configured

- ✅ **Subscription Keys**: Configured
  - Primary: `99ac5454271a4b4ba9105b9217d9efa8`
  - Secondary: `e3cce05bee0845289bfe7ae7c5885cab`

- ✅ **Documentation**: Complete
  - Authentication guide
  - Setup instructions
  - API documentation

## ⚠️ What You Need Before Testing

### 1. Generate API User and API Key

**For Sandbox Testing (Recommended First):**

```bash
# Option A: Use the helper script
python create_momo_credentials.py
```

**OR manually via Provisioning API:**
```python
# In Django shell
python manage.py shell
from authentication.momo_payment import MTNMoMoPayment
import uuid

momo = MTNMoMoPayment()
api_user_id = str(uuid.uuid4())
result = momo.create_api_user(api_user_id, "localhost")
if result['success']:
    key_result = momo.create_api_key(api_user_id)
    print(f"API User: {api_user_id}")
    print(f"API Key: {key_result['api_key']}")
```

**Then add to settings or environment:**
```bash
# In .env file or environment variables
MOMO_API_USER=your-generated-api-user-id
MOMO_API_KEY=your-generated-api-key
```

### 2. Run Database Migration

```bash
# Activate virtual environment first
source cedenv/bin/activate  # or your venv

# Run migration
python manage.py migrate authentication
```

This will add the MoMo payment fields to your `ListingFee` model.

### 3. Verify Settings

Check `InzuLink/settings.py` or your environment variables:

```python
MOMO_ENVIRONMENT = 'sandbox'  # for testing
MOMO_SUBSCRIPTION_KEY_PRIMARY = '99ac5454271a4b4ba9105b9217d9efa8'
MOMO_SUBSCRIPTION_KEY_SECONDARY = 'e3cce05bee0845289bfe7ae7c5885cab'
MOMO_API_USER = 'your-api-user-id'  # ⚠️ Need to set this
MOMO_API_KEY = 'your-api-key'       # ⚠️ Need to set this
```

### 4. Ensure Vendor Has Phone Number

For MoMo payment to work, the vendor must have a phone number in their profile:
- Format: `250XXXXXXXXX` (Rwanda format)
- Can be set in user profile/settings

## 🧪 Testing Steps

### Step 1: Start Server

```bash
python manage.py runserver
```

### Step 2: Create Test Property Listing

1. Log in as a vendor
2. Go to vendor dashboard
3. Click "Create Property Listing"
4. Fill in the form:
   - Title, description, price
   - Property type, category
   - Upload image
   - Set location
5. Save the listing

### Step 3: Pay Listing Fee

1. After creating listing, you'll be redirected to payment page
2. **Select "MTN MoMo"** payment method
3. Enter number of days (e.g., 30)
4. Click **"Pay with MoMo"**

### Step 4: Approve Payment

1. You'll receive a MoMo prompt on your phone
2. Approve the payment
3. The page will auto-refresh to show payment status

### Step 5: Verify

1. Check payment status page shows "SUCCESSFUL"
2. Go to vendor dashboard
3. Verify listing is now active
4. Check listing fee record in database

## 🔍 Troubleshooting

### "Failed to authenticate with MoMo API"

**Check:**
- ✅ API User and API Key are set (not empty)
- ✅ Credentials are correct
- ✅ Environment is set to 'sandbox' for testing
- ✅ Subscription key is correct

**Solution:**
```bash
# Verify in Django shell
python manage.py shell
from django.conf import settings
print(f"API User: {settings.MOMO_API_USER}")
print(f"API Key: {'*' * len(settings.MOMO_API_KEY) if settings.MOMO_API_KEY else 'NOT SET'}")
```

### "Phone number is required"

**Check:**
- Vendor profile has phone number
- Phone number format: `250XXXXXXXXX`

**Solution:**
- Update vendor profile with phone number
- Ensure format is correct (Rwanda: 250XXXXXXXXX)

### "Payment request failed"

**Check:**
- Phone number is registered with MTN MoMo
- Using test numbers in sandbox mode
- Network connectivity

### Migration Not Applied

**Check:**
```bash
python manage.py showmigrations authentication
```

**Apply:**
```bash
python manage.py migrate authentication
```

## ✅ Ready to Test Checklist

Before starting testing, verify:

- [ ] API User generated (UUID format)
- [ ] API Key generated (long string)
- [ ] Credentials added to settings or environment
- [ ] Database migration run successfully
- [ ] Server can start without errors
- [ ] Vendor account has phone number
- [ ] Environment set to 'sandbox' for testing

## 🚀 Quick Start Command

```bash
# 1. Generate credentials
python create_momo_credentials.py

# 2. Add to .env or settings.py
# MOMO_API_USER=...
# MOMO_API_KEY=...

# 3. Run migration
python manage.py migrate authentication

# 4. Start server
python manage.py runserver

# 5. Test payment flow
# Create listing → Pay fee → Select MoMo → Approve on phone
```

## 📝 Testing Notes

- **Sandbox Mode**: Use test phone numbers provided by MTN
- **Real Payments**: Only test with small amounts
- **Phone Number**: Must be registered with MTN MoMo
- **Environment**: Start with 'sandbox', switch to 'production' when ready

---

**Status**: ⚠️ **Almost Ready** - Just need to generate API User and API Key, then run migration!

