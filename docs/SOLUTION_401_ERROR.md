# 🔧 Solution for 401 Error: Provisioning API Access

## The Problem

You keep getting **401 errors** because:
- Your subscription keys are for **Collection API** product
- The **Provisioning API** is a **separate product** that needs its own subscription
- Your Collection API subscription doesn't include Provisioning API access

## ✅ Solutions (Choose One)

### Solution 1: Subscribe to Provisioning API (Recommended)

1. **Go to**: https://momodeveloper.mtn.com/ (or your Rwanda portal)
2. **Navigate to Products** page
3. **Look for**: "Sandbox User Provisioning" or "Provisioning API" product
4. **Subscribe** to that product
5. **Get the subscription key** for Provisioning API (different from Collection API)
6. **Update the script** to use that key, OR
7. **Use Postman** with the Provisioning API subscription key

### Solution 2: Contact MTN Support (Fastest)

**Email**: mmitsupport.RW@mtn.com

**Subject**: "Need API User and API Key for Collection Widget API"

**Message Template**:
```
Hello,

I have an active subscription to "Collection Widget" API but I cannot create 
API User and API Key through the portal. The Provisioning API returns 401 errors.

Could you please:
1. Create an API User for my Collection Widget subscription, OR
2. Provide access to Provisioning API, OR
3. Guide me on how to create API User and API Key

My subscription details:
- Product: Collection Widget
- Subscription: inzulink
- Primary Key: e968a63339b94f1dae91a9419d57d3ec

Thank you!
```

They can either:
- Create the API User/Key for you directly
- Grant you access to Provisioning API
- Guide you to the correct portal section

### Solution 3: Use Postman with Different Subscription

1. **Check if you have other subscriptions** in your portal
2. **Look for** any subscription that might include Provisioning API
3. **Use that subscription key** in Postman
4. **Try the Provisioning API** with that key

### Solution 4: Test with Manual Credentials (Temporary)

For testing purposes, you can manually add test credentials to see if the payment flow works (once you get real credentials from support):

```python
# In InzuLink/settings.py (temporary for testing UI)
MOMO_API_USER = 'test-user-id'  # Replace when you get real one
MOMO_API_KEY = 'test-api-key'   # Replace when you get real one
```

**Note**: This won't work for actual payments, but you can test the UI flow.

## What to Do Now

### Immediate Action

1. **Contact MTN Support**: mmitsupport.RW@mtn.com
   - This is the fastest way to get your API User and API Key
   - They can create it for you or guide you

2. **Check Your Portal**:
   - Look for "Sandbox User Provisioning" product
   - Subscribe if available
   - Get the subscription key for that product

3. **While Waiting**:
   - You can test the payment UI flow
   - Set up the rest of your integration
   - Prepare your callback URLs

## Once You Get Credentials

1. **Add to settings.py**:
   ```python
   MOMO_API_USER = 'api-user-from-support'
   MOMO_API_KEY = 'api-key-from-support'
   ```

2. **Run migration**:
   ```bash
   python manage.py migrate authentication
   ```

3. **Test payment flow**:
   - Create property listing
   - Pay listing fee
   - Select MoMo payment
   - Complete payment

## Summary

| Method | Speed | Reliability | Status |
|--------|-------|-------------|--------|
| Contact Support | ⚡ Fast | ✅ High | **Recommended** |
| Subscribe to Provisioning API | 🐌 Slow | ✅ High | If available |
| Postman | ⚡ Fast | ⚠️ May need different key | Try if you have other subscriptions |

---

**Best Action**: **Contact MTN Support** - they can create the credentials for you quickly! 📧

