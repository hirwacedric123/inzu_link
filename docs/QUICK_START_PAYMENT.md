# Quick Start: Making MoMo Payments Work

## 🎯 Goal: Successfully Process a Payment

This guide will help you get MoMo payments working on your payment page.

---

## Step 1: Set Up MoMo API Credentials (Sandbox)

### Option A: Quick Setup (Recommended for Testing)

1. **Get Subscription Key from MTN MoMo Developer Portal**
   - Go to: https://momodeveloper.mtn.com
   - Sign up/Login
   - Navigate to your profile
   - Copy your **Subscription Key**

2. **Update Settings** (`InzuLink/settings.py` or `.env` file):

```python
# In settings.py or .env
MOMO_ENVIRONMENT = 'sandbox'
MOMO_SUBSCRIPTION_KEY_PRIMARY = 'your-subscription-key-here'
MOMO_SUBSCRIPTION_KEY_SECONDARY = 'your-secondary-key-here'
```

3. **Create API User and Key** (Run in Django shell):

```bash
# Activate virtual environment
source cedenv/bin/activate

# Start Django shell
python manage.py shell
```

Then run:
```python
import uuid
from authentication.momo_payment import MTNMoMoPayment

# Initialize
momo = MTNMoMoPayment()

# Generate unique ID
reference_id = str(uuid.uuid4())
print(f"Reference ID: {reference_id}")

# Create API User
result = momo.create_api_user(
    reference_id=reference_id,
    callback_host="localhost"  # or your domain
)

if result.get('success'):
    print(f"✅ API User: {reference_id}")
    
    # Create API Key
    key_result = momo.create_api_key(reference_id)
    if key_result.get('success'):
        api_key = key_result.get('api_key')
        print(f"✅ API Key: {api_key}")
        print(f"\n⚠️  IMPORTANT: Save these values!")
        print(f"MOMO_API_USER = '{reference_id}'")
        print(f"MOMO_API_KEY = '{api_key}'")
    else:
        print(f"❌ Failed to create key: {key_result.get('message')}")
else:
    print(f"❌ Failed: {result.get('message')}")
```

4. **Add API User and Key to Settings**:

```python
# In settings.py or .env
MOMO_API_USER = 'your-api-user-id-from-step-3'
MOMO_API_KEY = 'your-api-key-from-step-3'
```

---

## Step 2: Verify User Has Phone Number

The payment requires the user's phone number. Check:

1. **User Profile**: Ensure the user has a phone number set
2. **Phone Format**: Should be in format `250788123456` (Rwanda)

If user doesn't have phone number:
- They need to update their profile first
- Or you can set it in Django admin

---

## Step 3: Test the Payment Flow

### Test Payment Process:

1. **Start Your Server**:
```bash
source cedenv/bin/activate
python manage.py runserver
# Or use Daphne for WebSocket support:
./start_chat_server.sh
```

2. **Access Payment Page**:
   - Log in as a vendor
   - Go to a property listing
   - Click "Pay Listing Fee"

3. **Fill Payment Form**:
   - Select "MTN MoMo" (should be selected by default)
   - Enter number of days (e.g., 30)
   - Click "Pay with MoMo"

4. **What Should Happen**:
   - ✅ Form submits successfully
   - ✅ You see message: "Payment request sent! Please approve on your phone."
   - ✅ You're redirected to payment status page
   - ✅ You receive USSD prompt on your phone (sandbox test number)

5. **Approve Payment**:
   - Check your test phone
   - Approve the payment prompt
   - Payment status should update to "SUCCESSFUL"
   - Listing should be activated automatically

---

## Step 4: Verify Payment Success

After approving payment, check:

1. **Payment Status Page**:
   - Should show "Payment Successful!"
   - Should display transaction details
   - Should have "Go to Dashboard" button

2. **Vendor Dashboard**:
   - Listing should be active
   - Payment should show as "paid"

3. **Database**:
   - `ListingFee.payment_status` = 'paid'
   - `ListingFee.momo_status` = 'SUCCESSFUL'
   - `Post.is_active` = True

---

## 🔧 Troubleshooting

### Issue 1: "Failed to authenticate with MoMo API"

**Cause**: Missing or incorrect API credentials

**Solution**:
1. Check `MOMO_API_USER` and `MOMO_API_KEY` are set
2. Verify Subscription Key is correct
3. Re-create API User and Key if needed

### Issue 2: "Phone number is required for MoMo payment"

**Cause**: User doesn't have phone number in profile

**Solution**:
1. Update user profile with phone number
2. Format: `250788123456` (Rwanda format)

### Issue 3: "Payment request failed"

**Possible Causes**:
- Invalid phone number format
- Amount too small
- Network issues
- API rate limiting

**Solution**:
1. Verify phone number format: `250788123456`
2. Check amount is valid (minimum usually 100 RWF)
3. Wait and retry if rate limited
4. Check server logs for detailed error

### Issue 4: Payment Status Stays "PENDING"

**Possible Causes**:
- User hasn't approved payment on phone
- Callback not received
- Status check failed

**Solution**:
1. Check phone for payment prompt
2. Approve payment on phone
3. Click "Check Status" button manually
4. Wait for auto-refresh (every 10 seconds)

---

## 📋 Quick Checklist

Before testing payment:

- [ ] Subscription Key configured
- [ ] API User created (sandbox)
- [ ] API Key generated and saved
- [ ] `MOMO_API_USER` set in settings
- [ ] `MOMO_API_KEY` set in settings
- [ ] `MOMO_ENVIRONMENT` set to 'sandbox'
- [ ] User has phone number in profile
- [ ] Server is running
- [ ] Test phone number is available

---

## 🧪 Test Script

Quick test to verify setup:

```python
# Run in Django shell
from authentication.momo_payment import MTNMoMoPayment

momo = MTNMoMoPayment()

# Test 1: Check credentials
print("Testing credentials...")
if not momo.api_user or not momo.api_key:
    print("❌ API User or Key not set!")
else:
    print(f"✅ API User: {momo.api_user[:20]}...")

# Test 2: Get access token
print("\nTesting token...")
token = momo._get_access_token()
if token:
    print(f"✅ Token obtained: {token[:30]}...")
else:
    print("❌ Failed to get token - check credentials")

# Test 3: Test payment request (small amount)
print("\nTesting payment request...")
from decimal import Decimal
result = momo.request_payment(
    amount=Decimal('100'),  # 100 RWF
    payer_phone='250788123456',  # Test number
    payment_reason='Test Payment'
)

if result.get('success'):
    print(f"✅ Payment request sent!")
    print(f"Transaction ID: {result.get('transaction_id')}")
else:
    print(f"❌ Failed: {result.get('message')}")
```

---

## 🎯 Success Indicators

You'll know payment is working when:

1. ✅ Form submits without errors
2. ✅ You see "Payment request sent" message
3. ✅ You're redirected to payment status page
4. ✅ You receive payment prompt on phone
5. ✅ Payment status updates to "SUCCESSFUL"
6. ✅ Listing becomes active automatically
7. ✅ You can see payment in vendor dashboard

---

## 📞 Next Steps

Once sandbox testing works:

1. **Test with real scenarios**
2. **Set up production credentials** (via Partner Portal)
3. **Configure callback URL** for production
4. **Test end-to-end flow**
5. **Go live!**

---

## 💡 Tips

- **Start with small amounts** for testing
- **Use sandbox** until everything works
- **Check server logs** for detailed errors
- **Test callback URL** is accessible
- **Monitor payment status** regularly

---

**Need Help?** Check:
- `MOMO_API_TESTING_GUIDE.md` - Detailed testing guide
- `MOMO_INTEGRATION_SUMMARY.md` - Integration details
- Server logs for error messages



