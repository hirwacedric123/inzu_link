# 🔧 Provisioning API Troubleshooting

## Error: "Access denied due to invalid subscription key"

If you get a **401 error** when trying to create API User/Key, it means the Provisioning API requires a **separate subscription**.

### The Issue

The **Provisioning API** is a different product from the **Collection API**. Your subscription keys are for the Collection API, but the Provisioning API needs its own subscription.

### Solution Options

#### Option 1: Subscribe to Provisioning API (Recommended for Sandbox)

1. **Log in** to MTN MoMo Developer Portal: https://momodeveloper.mtn.co.rw/
2. **Go to Products** section
3. **Subscribe to "Sandbox User Provisioning"** product
4. **Get the subscription key** for this product
5. **Update your settings** with the Provisioning API subscription key

You can add a separate setting for Provisioning API subscription key:

```python
# In settings.py
MOMO_PROVISIONING_SUBSCRIPTION_KEY = os.environ.get('MOMO_PROVISIONING_SUBSCRIPTION_KEY', '')
```

#### Option 2: Use Partner Portal (Alternative)

If you can't subscribe to Provisioning API, use the **Partner Portal** method instead:

1. **Log in** to MTN MoMo Developer Portal: https://momodeveloper.mtn.co.rw/
2. **Navigate** to your Collection API subscription
3. **Look for "API User"** or **"Credentials"** section
4. **Create API User** manually
5. **Generate API Key** manually
6. **Copy both** and add to settings

#### Option 3: Check Sandbox URL

The sandbox URL might be different. Try checking:
- https://sandbox.momodeveloper.mtn.com (current)
- https://sandbox.momodeveloper.mtn.co.rw (Rwanda-specific)

### Quick Fix: Update Code to Use Different Key

If you get a Provisioning API subscription key, you can update the code:

```python
# In authentication/momo_payment.py, update create_api_user method
# Add this to settings:
MOMO_PROVISIONING_SUBSCRIPTION_KEY = 'your-provisioning-api-key'

# Then in create_api_user:
provisioning_key = getattr(settings, 'MOMO_PROVISIONING_SUBSCRIPTION_KEY', None)
subscription_key = provisioning_key or self.subscription_key_primary
```

### Verify Your Subscriptions

Check what products you're subscribed to:
1. Go to Developer Portal
2. Check "Products" or "Subscriptions" section
3. Look for:
   - ✅ Collection API (you have this)
   - ❓ Sandbox User Provisioning (you might need this)

### Alternative: Manual Creation via Portal

Since Provisioning API might not be available, the **easiest solution** is to create credentials manually:

1. **Log in** to https://momodeveloper.mtn.co.rw/
2. **Go to your Collection API subscription**
3. **Find "API User" section** (might be in Partner Portal area)
4. **Create API User** → **Generate API Key**
5. **Copy both** and add to `settings.py`:

```python
MOMO_API_USER = 'your-api-user-id-from-portal'
MOMO_API_KEY = 'your-api-key-from-portal'
```

### Next Steps

1. **Try Partner Portal method** (easiest if Provisioning API doesn't work)
2. **Or subscribe to Sandbox User Provisioning** product
3. **Then retry** the credential generation script

---

**Recommendation**: Use the **Partner Portal method** - it's more reliable and doesn't require additional subscriptions!

