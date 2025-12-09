# MoMo API Testing Guide

## Overview
This guide will help you test the MTN MoMo payment integration in sandbox and production environments.

## Prerequisites

1. **MTN MoMo Developer Account**
   - Sign up at: https://momodeveloper.mtn.com
   - Access the API Manager Portal
   - Get your Subscription Key

2. **Environment Setup**
   - Django project running
   - Virtual environment activated
   - All dependencies installed (`pip install -r requirements.txt`)

3. **Required Settings**
   - `MOMO_ENVIRONMENT` - Set to 'sandbox' for testing
   - `MOMO_SUBSCRIPTION_KEY_PRIMARY` - From API Manager Portal
   - `MOMO_SUBSCRIPTION_KEY_SECONDARY` - From API Manager Portal
   - `MOMO_API_USER` - Created via Provisioning API (sandbox) or Partner Portal (production)
   - `MOMO_API_KEY` - Generated via Provisioning API (sandbox) or Partner Portal (production)
   - `MOMO_CALLBACK_URL` - Your server's callback endpoint (optional but recommended)

---

## Part 1: Sandbox Setup

### Step 1: Get Subscription Key

1. Log in to [MTN MoMo Developer Portal](https://momodeveloper.mtn.com)
2. Navigate to your profile
3. Copy your **Subscription Key** (Primary and Secondary)
4. Add to your `.env` file or `settings.py`:
   ```python
   MOMO_SUBSCRIPTION_KEY_PRIMARY = 'your-primary-key'
   MOMO_SUBSCRIPTION_KEY_SECONDARY = 'your-secondary-key'
   MOMO_ENVIRONMENT = 'sandbox'
   ```

### Step 2: Create API User (Sandbox)

In sandbox, you can create API User programmatically. Create a Django management command or use Python shell:

**Option A: Using Django Shell**
```python
# Activate virtual environment
source cedenv/bin/activate

# Start Django shell
python manage.py shell

# Run the following:
import uuid
from authentication.momo_payment import MTNMoMoPayment

# Initialize MoMo client
momo = MTNMoMoPayment()

# Generate a unique reference ID (UUID)
reference_id = str(uuid.uuid4())
print(f"Reference ID: {reference_id}")

# Create API User
result = momo.create_api_user(
    reference_id=reference_id,
    callback_host="yourdomain.com"  # Your domain (e.g., "example.com")
)

if result.get('success'):
    print(f"✅ API User created: {result.get('api_user_id')}")
    api_user_id = result.get('api_user_id')
else:
    print(f"❌ Failed: {result.get('message')}")
```

**Option B: Using Management Command** (Create this if needed)
```python
# authentication/management/commands/create_momo_user.py
from django.core.management.base import BaseCommand
import uuid
from authentication.momo_payment import MTNMoMoPayment

class Command(BaseCommand):
    help = 'Create MoMo API User in sandbox'

    def handle(self, *args, **options):
        momo = MTNMoMoPayment()
        reference_id = str(uuid.uuid4())
        
        result = momo.create_api_user(
            reference_id=reference_id,
            callback_host="yourdomain.com"
        )
        
        if result.get('success'):
            self.stdout.write(
                self.style.SUCCESS(f'API User created: {reference_id}')
            )
            return reference_id
        else:
            self.stdout.write(
                self.style.ERROR(f'Failed: {result.get("message")}')
            )
```

### Step 3: Create API Key

After creating the API User, generate an API Key:

```python
# In Django shell or management command
result = momo.create_api_key(api_user_id=reference_id)

if result.get('success'):
    api_key = result.get('api_key')
    print(f"✅ API Key created: {api_key}")
    print(f"⚠️  SAVE THIS KEY - It cannot be retrieved again!")
else:
    print(f"❌ Failed: {result.get('message')}")
```

### Step 4: Update Settings

Add the API User and Key to your settings:

```python
# In settings.py or .env
MOMO_API_USER = 'your-api-user-id'  # The reference_id from Step 2
MOMO_API_KEY = 'your-api-key'       # The key from Step 3
```

---

## Part 2: Testing Payment Flow

### Test 1: OAuth Token Request

First, verify you can get an access token:

```python
# In Django shell
from authentication.momo_payment import MTNMoMoPayment

momo = MTNMoMoPayment()
token = momo._get_access_token()

if token:
    print(f"✅ Token obtained: {token[:20]}...")
else:
    print("❌ Failed to get token")
    # Check logs for error details
```

**Expected Result**: Access token string (starts with a long alphanumeric string)

**Common Issues**:
- Invalid API User or Key → Check credentials
- Wrong Subscription Key → Verify in API Manager Portal
- Network issues → Check internet connection

### Test 2: Request Payment

Test initiating a payment request:

```python
# In Django shell
from authentication.momo_payment import MTNMoMoPayment
from decimal import Decimal

momo = MTNMoMoPayment()

# Test payment request
result = momo.request_payment(
    amount=Decimal('1000'),  # 1000 RWF
    payer_phone='250788123456',  # Test phone number (sandbox)
    payment_reason='Test Payment'
)

print(result)
```

**Expected Response**:
```python
{
    'success': True,
    'transaction_id': 'uuid-here',
    'status': 'PENDING',
    'message': 'Payment request sent successfully...',
    'reference_id': 'uuid-here'
}
```

**What Happens**:
1. Payment request is sent to MoMo
2. User receives USSD prompt on their phone
3. User approves/declines payment
4. Status changes to SUCCESSFUL or FAILED

### Test 3: Check Payment Status

After initiating a payment, check its status:

```python
# Use the transaction_id from Test 2
transaction_id = 'your-transaction-id'

result = momo.check_payment_status(transaction_id)
print(result)
```

**Expected Response**:
```python
{
    'success': True,
    'status': 'PENDING',  # or 'SUCCESSFUL' or 'FAILED'
    'message': 'Payment status: PENDING',
    'data': {...}  # Full response from MoMo API
}
```

**Status Values**:
- `PENDING` - Payment request sent, waiting for user approval
- `SUCCESSFUL` - Payment approved and completed
- `FAILED` - Payment declined or failed

---

## Part 3: Testing Callbacks

### Step 1: Set Up Callback URL

1. **For Local Development** (using ngrok or similar):
   ```bash
   # Install ngrok
   # Start ngrok tunnel
   ngrok http 8000
   
   # Use the ngrok URL
   MOMO_CALLBACK_URL = 'https://your-ngrok-url.ngrok.io/api/momo/callback/'
   ```

2. **For Production**:
   ```python
   MOMO_CALLBACK_URL = 'https://yourdomain.com/api/momo/callback/'
   ```

### Step 2: Test Callback Endpoint

Verify your callback endpoint is accessible:

```bash
# Test with curl
curl -X POST http://localhost:8000/api/momo/callback/ \
  -H "Content-Type: application/json" \
  -d '{
    "externalId": "test-transaction-id",
    "status": "SUCCESSFUL"
  }'
```

**Expected Response**: `{"success": true, "message": "Callback processed"}`

### Step 3: Monitor Callbacks

When a payment status changes, MoMo will send a PUT request to your callback URL. Check your Django logs:

```python
# In settings.py, ensure logging is configured
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'authentication.views': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}
```

Watch for log messages like:
```
INFO: MoMo callback received for transaction xxx: status=SUCCESSFUL
INFO: Payment successful for transaction xxx, listing activated
```

---

## Part 4: End-to-End Testing

### Complete Payment Flow Test

1. **Start Server**:
   ```bash
   source cedenv/bin/activate
   python manage.py runserver
   # Or use Daphne for WebSocket support:
   ./start_chat_server.sh
   ```

2. **Access Payment Page**:
   - Log in as a vendor
   - Navigate to a listing
   - Click "Pay Listing Fee"
   - Select MoMo payment method
   - Enter payment details

3. **Initiate Payment**:
   - Submit payment form
   - System sends request to MoMo
   - You should see: "Payment request sent! Please approve on your phone."

4. **Approve Payment** (Sandbox):
   - Check your test phone
   - Approve the USSD prompt
   - Payment status should update

5. **Verify Status**:
   - Check payment status page
   - Should show "SUCCESSFUL" after approval
   - Listing should be activated

### Test Scenarios

#### Scenario 1: Successful Payment
- ✅ Payment request sent
- ✅ User approves on phone
- ✅ Status updates to SUCCESSFUL
- ✅ Listing activated
- ✅ Callback received

#### Scenario 2: Failed Payment
- ✅ Payment request sent
- ✅ User declines on phone
- ✅ Status updates to FAILED
- ✅ Listing remains inactive
- ✅ Callback received

#### Scenario 3: Timeout
- ✅ Payment request sent
- ✅ User doesn't respond
- ✅ Status remains PENDING
- ✅ Manual status check works

---

## Part 5: Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Failed to authenticate with MoMo API"
**Possible Causes**:
- Invalid API User or API Key
- Wrong Subscription Key
- Network connectivity issues

**Solutions**:
1. Verify credentials in settings
2. Check API User exists: `momo.get_api_user_details(api_user_id)`
3. Regenerate API Key if needed
4. Check internet connection

#### Issue 2: "Payment request failed"
**Possible Causes**:
- Invalid phone number format
- Amount too small/large
- API rate limiting
- Invalid currency

**Solutions**:
1. Ensure phone number format: `250788123456` (Rwanda)
2. Check amount is valid (minimum usually 100 RWF)
3. Wait and retry if rate limited
4. Verify currency is "RWF"

#### Issue 3: Callback not received
**Possible Causes**:
- Callback URL not accessible
- Firewall blocking requests
- Invalid callback URL format

**Solutions**:
1. Test callback URL accessibility:
   ```bash
   curl -X PUT https://your-callback-url.com/api/momo/callback/
   ```
2. Check server logs for incoming requests
3. Verify callback URL is HTTPS in production
4. Use ngrok for local testing

#### Issue 4: Token expired
**Symptoms**: Authentication fails after some time

**Solution**: Token is automatically refreshed on each request. If issues persist:
1. Check system time is correct
2. Verify API credentials haven't changed
3. Check MoMo API status

### Debug Mode

Enable detailed logging:

```python
# In settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'authentication.momo_payment': {
            'handlers': ['console'],
            'level': 'DEBUG',  # Change to DEBUG for detailed logs
        },
        'authentication.views': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

---

## Part 6: Production Checklist

Before going live:

- [ ] Switch `MOMO_ENVIRONMENT` to 'production'
- [ ] Update base URL to production endpoint
- [ ] Create API User via Partner Portal (not Provisioning API)
- [ ] Generate API Key via Partner Portal
- [ ] Set up HTTPS for callback URL
- [ ] Test callback URL is publicly accessible
- [ ] Verify all credentials are correct
- [ ] Test complete payment flow
- [ ] Set up monitoring/alerts for failed payments
- [ ] Document production credentials securely
- [ ] Test with real phone numbers
- [ ] Verify listing activation works
- [ ] Test error handling

---

## Part 7: API Reference

### Available Methods

#### `MTNMoMoPayment()`
Initialize the MoMo payment client.

#### `_get_access_token()`
Get OAuth 2.0 access token for API authentication.

#### `request_payment(amount, payer_phone, external_id=None, payment_reason="")`
Request payment from a customer.

**Parameters**:
- `amount`: Decimal or float - Payment amount in RWF
- `payer_phone`: str - Phone number (format: 250788123456)
- `external_id`: str (optional) - Unique transaction ID
- `payment_reason`: str - Description of payment

**Returns**: Dict with success status, transaction_id, status, message

#### `check_payment_status(transaction_id)`
Check the status of a payment transaction.

**Parameters**:
- `transaction_id`: str - The external ID used for payment request

**Returns**: Dict with success status, status, message, data

#### `create_api_user(reference_id, callback_host)` (Sandbox only)
Create API User in sandbox environment.

#### `create_api_key(api_user_id)` (Sandbox only)
Generate API Key for an API User.

#### `get_api_user_details(api_user_id)`
Get API User details (callback host, target environment).

---

## Part 8: Testing Scripts

### Quick Test Script

Create `test_momo.py`:

```python
#!/usr/bin/env python
"""Quick MoMo API test script"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InzuLink.settings')
django.setup()

from authentication.momo_payment import MTNMoMoPayment
from decimal import Decimal

def test_momo():
    print("🧪 Testing MoMo API Integration\n")
    
    momo = MTNMoMoPayment()
    
    # Test 1: Get Token
    print("1. Testing token authentication...")
    token = momo._get_access_token()
    if token:
        print(f"   ✅ Token obtained: {token[:30]}...\n")
    else:
        print("   ❌ Failed to get token\n")
        return
    
    # Test 2: Request Payment
    print("2. Testing payment request...")
    result = momo.request_payment(
        amount=Decimal('1000'),
        payer_phone='250788123456',
        payment_reason='Test Payment'
    )
    
    if result.get('success'):
        print(f"   ✅ Payment request sent")
        print(f"   Transaction ID: {result.get('transaction_id')}\n")
        transaction_id = result.get('transaction_id')
        
        # Test 3: Check Status
        print("3. Testing status check...")
        import time
        time.sleep(2)  # Wait a bit
        
        status_result = momo.check_payment_status(transaction_id)
        if status_result.get('success'):
            print(f"   ✅ Status: {status_result.get('status')}\n")
        else:
            print(f"   ❌ Failed to check status\n")
    else:
        print(f"   ❌ Payment request failed: {result.get('message')}\n")

if __name__ == '__main__':
    test_momo()
```

Run it:
```bash
source cedenv/bin/activate
python test_momo.py
```

---

## Support Resources

- **MTN MoMo Developer Portal**: https://momodeveloper.mtn.com
- **API Documentation**: Check portal for latest docs
- **Support**: Contact MTN MoMo developer support
- **Status Page**: Check for API outages

---

## Notes

- Sandbox environment is for testing only
- Production requires Partner Portal setup
- Callbacks are sent only once (no retry)
- Always test in sandbox before production
- Keep API credentials secure
- Monitor payment status regularly

---

**Last Updated**: Based on MoMo API documentation review
**Version**: 1.0

