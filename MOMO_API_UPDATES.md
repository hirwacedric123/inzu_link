# MoMo API Implementation Updates

## Overview
Updated the MTN MoMo payment integration to align with the official MoMo API documentation.

## Changes Made

### 1. Updated `authentication/momo_payment.py`

#### Enhanced Documentation
- Updated class and method docstrings to reference official MoMo API documentation
- Added clear comments explaining OAuth 2.0 authentication flow
- Documented API endpoints per official specification

#### Improved Token Authentication
- Enhanced `_get_access_token()` method with better error handling
- Added timeout handling for token requests
- Improved logging for debugging authentication issues
- Validates API User and API Key before attempting authentication

#### Fixed Request Structure
- Updated endpoint URLs to match official documentation
- Fixed `X-Reference-Id` header usage (must be UUID)
- Improved phone number formatting for Rwanda (250 country code)
- Added callback URL support in payment requests
- Proper handling of 202 Accepted response (asynchronous operations)

#### Added Provisioning API Methods (Sandbox Only)
- `create_api_user()`: Create API User in sandbox environment
- `create_api_key()`: Generate API Key for an API User
- `get_api_user_details()`: Retrieve API User information

**Note**: These methods are only available in sandbox for testing. In production, API User and API Key are managed through the Partner Portal.

### 2. Updated `authentication/views.py`

#### Enhanced Callback Handler
- Updated `momo_payment_callback()` to accept both POST and PUT methods (per documentation, callbacks use PUT)
- Added comprehensive logging for callback processing
- Improved error handling and response codes
- Added status tracking for SUCCESSFUL and FAILED payments
- Proper acknowledgment of callbacks (returns 200 OK)

#### Added Logging
- Added logging import at module level
- Comprehensive logging throughout callback processing

## API Endpoints (Per Documentation)

### Base URLs
- **Sandbox**: `https://sandbox.momodeveloper.mtn.com`
- **Production**: `https://momodeveloper.mtn.co.rw`

### Collection API Endpoints
- **Request to Pay**: `POST /collection/v1_0/requesttopay`
- **Check Status**: `GET /collection/v1_0/requesttopay/{referenceId}`
- **Get Token**: `POST /collection/token/`

### Provisioning API Endpoints (Sandbox Only)
- **Create API User**: `POST /v1_0/apiuser`
- **Create API Key**: `POST /v1_0/apiuser/{apiUserId}/apikey`
- **Get API User**: `GET /v1_0/apiuser/{apiUserId}`

## Authentication Flow

1. **OAuth 2.0 Token Request**
   - Uses Basic Authentication with API User and API Key
   - Returns access token (Bearer token)
   - Token has expiry time (reuse until expired)

2. **Payment Request**
   - Uses Bearer token in Authorization header
   - Includes `X-Reference-Id` (UUID) in header
   - Includes `X-Target-Environment` header
   - Returns 202 Accepted (asynchronous operation)

3. **Status Check**
   - Uses Bearer token
   - GET request with reference ID in URL
   - Returns current payment status

4. **Callback (Webhook)**
   - MoMo sends PUT request to callback URL
   - Sent only once (no retry)
   - Contains transaction status update

## Configuration

### Required Settings (in `settings.py`)

```python
# Environment: 'sandbox' or 'production'
MOMO_ENVIRONMENT = 'sandbox'

# Subscription Key (from API Manager Portal)
MOMO_SUBSCRIPTION_KEY_PRIMARY = 'your-subscription-key'

# API User and Key (from Partner Portal or Provisioning API)
MOMO_API_USER = 'your-api-user-id'
MOMO_API_KEY = 'your-api-key'

# Callback URL (optional, for webhook notifications)
MOMO_CALLBACK_URL = 'https://yourdomain.com/api/momo/callback/'
```

## Sandbox Setup

For sandbox testing, you need to:

1. **Create API User**:
   ```python
   from authentication.momo_payment import MTNMoMoPayment
   
   momo = MTNMoMoPayment()
   reference_id = str(uuid.uuid4())
   result = momo.create_api_user(
       reference_id=reference_id,
       callback_host="yourdomain.com"
   )
   ```

2. **Create API Key**:
   ```python
   result = momo.create_api_key(api_user_id=reference_id)
   api_key = result.get('api_key')
   ```

3. **Update Settings**:
   - Set `MOMO_API_USER` to the reference_id
   - Set `MOMO_API_KEY` to the generated API key

## Production Setup

In production:
- API User and API Key are created through the Partner Portal
- No Provisioning API access
- Use production base URL
- Ensure callback URL is publicly accessible (HTTPS required)

## Testing

### Test Payment Flow
1. User initiates payment from listing fee page
2. System requests OAuth token
3. System sends payment request to MoMo
4. User approves payment on phone
5. MoMo sends callback to your server
6. System updates payment status and activates listing

### Manual Status Check
- Users can manually check payment status
- System polls MoMo API for status updates
- Auto-refresh on payment status page

## Error Handling

The implementation includes:
- Timeout handling for API requests
- Proper error logging
- User-friendly error messages
- Retry logic for status checks
- Callback validation

## Security Notes

1. **API Credentials**: Store securely (environment variables recommended)
2. **HTTPS**: Required for production callbacks
3. **Token Security**: Access tokens are treated as credentials
4. **Callback Validation**: Validate transaction IDs before processing

## Next Steps

1. Test in sandbox environment
2. Verify callback URL is accessible
3. Test payment flow end-to-end
4. Configure production credentials
5. Set up monitoring for payment callbacks

## References

- Official MoMo API Documentation
- OAuth 2.0 Specification (RFC 6749)
- Bearer Token Usage (RFC 6750)

