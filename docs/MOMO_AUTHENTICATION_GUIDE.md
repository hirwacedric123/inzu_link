# MTN MoMo Authentication Guide

## Overview

MTN MoMo Open API uses **two separate credential systems** for authentication:

1. **Subscription Key** - For API access
2. **API User and API Key** - For OAuth 2.0 wallet access

## 1. Subscription Key

### What It Is
- Assigned when you subscribe to products in the API Manager Portal
- Found under your user profile in the API Manager Portal
- Used to grant access to APIs

### How to Use
- Set in the `Ocp-Apim-Subscription-Key` header parameter
- You have two keys: Primary and Secondary (for redundancy)

### Your Subscription Keys
- **Primary**: `99ac5454271a4b4ba9105b9217d9efa8`
- **Secondary**: `e3cce05bee0845289bfe7ae7c5885cab`

✅ **Status**: Already configured in your settings

## 2. API User and API Key (OAuth 2.0)

### What They Are
- Used to grant access to the wallet system in a specific country (Rwanda)
- Managed by you through the Partner Portal
- Used for OAuth 2.0 Client Credentials Grant authentication
- Required for all Collection API requests

### How They Work
- **API User**: A unique identifier (UUID format)
- **API Key**: A secret key associated with the API User
- Used together in Basic Authentication format: `base64(api_user:api_key)`
- Sent in `Authorization: Basic <encoded>` header

### Provisioning Methods

#### Sandbox Environment (Testing)

**Method: Provisioning API**

The Provisioning API is **only available in Sandbox** for testing purposes.

**Automatic Method (Recommended):**
```bash
python create_momo_credentials.py
```

This script will:
1. Generate a unique API User ID (UUID)
2. Create the API User via Provisioning API
3. Generate an API Key for that user
4. Display both credentials for you to save

**Manual Method (Programmatic):**
```python
from authentication.momo_payment import MTNMoMoPayment
import uuid

momo = MTNMoMoPayment()
api_user_id = str(uuid.uuid4())

# Create API User
result = momo.create_api_user(api_user_id, "your-callback-host.com")

# Generate API Key
if result['success']:
    key_result = momo.create_api_key(api_user_id)
    print(f"API User: {api_user_id}")
    print(f"API Key: {key_result['api_key']}")
```

#### Production Environment (Live)

**Method: Partner Portal (Manual)**

In production, you **cannot** use the Provisioning API. You must:

1. Log in to MTN MoMo Partner Portal: https://momodeveloper.mtn.co.rw/
2. Navigate to your Collection API subscription
3. Go to "API User" or "Credentials" section
4. Click "Create API User" or similar
5. Generate an API Key for that user
6. **Save both credentials immediately** - API Key cannot be retrieved again!

**Important Notes:**
- API Keys can be revoked and regenerated through Partner Portal
- You cannot retrieve an existing API Key - only generate new ones
- Keep your API Key secure - never commit to version control

## Authentication Flow

### Step 1: Get OAuth 2.0 Access Token

```
POST /collection/token/
Headers:
  Authorization: Basic base64(api_user:api_key)
  Ocp-Apim-Subscription-Key: <subscription_key>
```

### Step 2: Use Access Token for API Requests

```
POST /collection/v1_0/requesttopay
Headers:
  Authorization: Bearer <access_token>
  Ocp-Apim-Subscription-Key: <subscription_key>
  X-Target-Environment: sandbox|production
  X-Reference-Id: <uuid>
```

## Configuration

### Environment Variables (Recommended)

```bash
# Subscription Keys (already have)
MOMO_SUBSCRIPTION_KEY_PRIMARY=99ac5454271a4b4ba9105b9217d9efa8
MOMO_SUBSCRIPTION_KEY_SECONDARY=e3cce05bee0845289bfe7ae7c5885cab

# API User and Key (generate from Provisioning API or Partner Portal)
MOMO_API_USER=your-api-user-id-here
MOMO_API_KEY=your-api-key-here

# Environment
MOMO_ENVIRONMENT=sandbox  # or 'production'
```

### Settings.py

The code automatically reads from environment variables with fallbacks:

```python
MOMO_SUBSCRIPTION_KEY_PRIMARY = os.environ.get('MOMO_SUBSCRIPTION_KEY_PRIMARY', '99ac5454271a4b4ba9105b9217d9efa8')
MOMO_SUBSCRIPTION_KEY_SECONDARY = os.environ.get('MOMO_SUBSCRIPTION_KEY_SECONDARY', 'e3cce05bee0845289bfe7ae7c5885cab')
MOMO_API_USER = os.environ.get('MOMO_API_USER', '')
MOMO_API_KEY = os.environ.get('MOMO_API_KEY', '')
```

## Security Best Practices

1. **Never commit API Keys to version control**
   - Use environment variables
   - Add `.env` to `.gitignore`
   - Use secrets management in production

2. **Use different credentials for Sandbox and Production**
   - Sandbox: Use Provisioning API
   - Production: Use Partner Portal

3. **Rotate API Keys regularly**
   - Revoke old keys in Partner Portal
   - Generate new keys
   - Update configuration

4. **Keep Subscription Keys secure**
   - Treat them like passwords
   - Don't share publicly
   - Use environment variables

## Troubleshooting

### "Failed to authenticate with MoMo API"

**Check:**
- ✅ API User and API Key are set correctly
- ✅ Credentials match the environment (sandbox vs production)
- ✅ API User and Key are active in Partner Portal
- ✅ Subscription Key is correct

### "API User provisioning is only available in sandbox"

**Solution:**
- For production, use Partner Portal to create API User
- Provisioning API is sandbox-only

### "Invalid credentials"

**Check:**
- API User format (should be UUID)
- API Key format (long string)
- No extra spaces or characters
- Correct environment (sandbox vs production)

## Summary

| Credential Type | Purpose | Where to Get | Environment |
|----------------|---------|--------------|-------------|
| Subscription Key | API access | API Manager Portal (Profile) | Both |
| API User | OAuth 2.0 | Provisioning API (Sandbox) or Partner Portal (Production) | Both |
| API Key | OAuth 2.0 | Provisioning API (Sandbox) or Partner Portal (Production) | Both |

**Your Status:**
- ✅ Subscription Keys: Configured
- ⚠️ API User: Need to generate
- ⚠️ API Key: Need to generate

**Next Steps:**
1. For Sandbox: Run `python create_momo_credentials.py`
2. For Production: Use Partner Portal to create credentials
3. Add credentials to environment variables or settings
4. Test the integration

