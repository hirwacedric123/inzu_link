# 🚀 MTN MoMo Setup Steps - Quick Guide

## ✅ What You Have Now
- ✅ Primary Subscription Key: `99ac5454271a4b4ba9105b9217d9efa8`
- ✅ Secondary Subscription Key: `e3cce05bee0845289bfe7ae7c5885cab`
- ✅ Active Collection API Subscription

## 🔑 Step 1: Generate API User and API Key

**These are DIFFERENT from your subscription keys!**

### Option A: Using Sandbox Provisioning API (For Testing)

If you're in sandbox mode, you can programmatically create an API User:

1. The code already has functions for this in `momo_payment.py`:
   - `create_api_user()` - Creates an API User
   - `create_api_key()` - Generates an API Key for that user

2. You can use Django shell to create them:
   ```bash
   python manage.py shell
   ```
   Then run:
   ```python
   from authentication.momo_payment import MTNMoMoPayment
   import uuid
   
   momo = MTNMoMoPayment()
   # Create a unique reference ID (UUID)
   api_user_id = str(uuid.uuid4())
   
   # Create API User (replace with your callback host)
   result = momo.create_api_user(api_user_id, "your-callback-host.com")
   print(result)
   
   # If successful, create API Key
   if result['success']:
       key_result = momo.create_api_key(api_user_id)
       print(key_result)
       print(f"\n✅ API User ID: {api_user_id}")
       print(f"✅ API Key: {key_result.get('api_key')}")
   ```

### Option B: Using Developer Portal (Recommended)

1. **Go to your Developer Portal**: https://momodeveloper.mtn.co.rw/
2. **Navigate to your Collection API subscription**
3. **Look for "API User" or "Credentials" section**
4. **Create a new API User**:
   - Click "Create API User" or similar button
   - You'll get an API User ID (UUID format)
5. **Generate API Key**:
   - Click "Generate API Key" for that user
   - ⚠️ **COPY THE KEY IMMEDIATELY** - you won't see it again!
   - Save both: API User ID and API Key

## ⚙️ Step 2: Configure Your Credentials

### Create/Update `.env` file in project root:

```bash
# MTN MoMo Configuration
MOMO_ENVIRONMENT=sandbox  # Use 'sandbox' for testing, 'production' for live

# Subscription Keys (you already have these)
MOMO_SUBSCRIPTION_KEY_PRIMARY=99ac5454271a4b4ba9105b9217d9efa8
MOMO_SUBSCRIPTION_KEY_SECONDARY=e3cce05bee0845289bfe7ae7c5885cab

# API User and Key (generate from portal or provisioning API)
MOMO_API_USER=your-api-user-id-here  # UUID format
MOMO_API_KEY=your-api-key-here        # Long string

# Optional: Callback URL for automatic payment status updates
MOMO_CALLBACK_URL=https://yourdomain.com/auth/api/momo/callback/
```

### Or add directly to settings.py (for quick testing only):

Edit `InzuLink/settings.py` and update these lines:

```python
MOMO_API_USER = 'your-api-user-id-here'
MOMO_API_KEY = 'your-api-key-here'
```

⚠️ **Never commit API keys to git!**

## 🗄️ Step 3: Run Database Migration

```bash
# Activate virtual environment
source cedenv/bin/activate  # or your venv

# Run migration
python manage.py migrate authentication
```

This will add the MoMo payment fields to your `ListingFee` model.

## 🧪 Step 4: Test the Integration

### Quick Test Flow:

1. **Start your Django server**:
   ```bash
   python manage.py runserver
   ```

2. **Log in as a vendor** (or create vendor account)

3. **Create a test property listing**:
   - Go to vendor dashboard
   - Click "Create Property Listing"
   - Fill in the form and save

4. **Pay the listing fee**:
   - You'll be redirected to payment page
   - Select **"MTN MoMo"** payment method
   - Enter number of days (e.g., 30)
   - Click **"Pay with MoMo"**

5. **Approve payment**:
   - You'll receive a MoMo prompt on your phone
   - Approve the payment
   - The page will auto-refresh to show payment status

6. **Verify listing is active**:
   - Check your vendor dashboard
   - Listing should now be active

## 📋 Checklist

- [ ] API User created (UUID format)
- [ ] API Key generated and saved
- [ ] Credentials added to `.env` or `settings.py`
- [ ] Database migration run
- [ ] Test payment flow completed
- [ ] Payment approved on phone
- [ ] Listing activated successfully

## 🔍 Troubleshooting

### "Failed to authenticate with MoMo API"
- ✅ Check `MOMO_API_USER` and `MOMO_API_KEY` are set correctly
- ✅ Verify API User and Key are active in developer portal
- ✅ Ensure you're using the correct environment (sandbox vs production)

### "Payment request failed"
- ✅ Verify phone number format: `250XXXXXXXXX` (Rwanda format)
- ✅ Ensure phone number is registered with MTN MoMo
- ✅ Check you're using test numbers in sandbox mode

### Can't find API User section in portal
- ✅ Look for "Credentials", "API Access", or "Provisioning" sections
- ✅ Check if you need to use the Provisioning API (sandbox only)
- ✅ Contact MTN support: mmitsupport.RW@mtn.com

## 📞 Need Help?

- **MTN MoMo Support**: mmitsupport.RW@mtn.com
- **Developer Portal**: https://momodeveloper.mtn.co.rw/
- **API Documentation**: Available in the portal (you're already viewing it!)

---

**Next**: Once you have your API User and API Key, configure them and test the payment flow!

