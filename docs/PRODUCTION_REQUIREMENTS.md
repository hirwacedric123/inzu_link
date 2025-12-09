# 🚀 Production API Requirements - MTN MoMo

## Overview

To use the **Production API** (real payments) instead of Sandbox, you need to complete the "Go Live" process with MTN MoMo.

## Requirements for Production

### 1. Complete KYC (Know Your Customer)

**Documents typically required:**
- Business registration documents
- Tax identification number
- Bank account details
- Business license (if applicable)
- Identity documents of business owner/representative

### 2. Go Live Application

1. **Log in** to: https://momodeveloper.mtn.co.rw/
2. **Navigate** to "Go Live" section (usually in top navigation)
3. **Submit application** with:
   - Business information
   - KYC documents
   - Business use case description
   - Expected transaction volumes

### 3. Contractual Agreement

- Sign agreement with MTN Rwanda
- Agree to terms and conditions
- Set up payment/commission structure

### 4. Production Credentials

After approval, you'll receive:
- **Production Subscription Keys** (different from sandbox)
- Access to **Partner Portal** for creating API User and API Key
- Production API endpoints

### 5. API User and API Key (Production)

**How to create in Production:**

1. **Log in** to Partner Portal: https://momodeveloper.mtn.co.rw/
2. **Navigate** to your Collection API subscription (production)
3. **Go to "API User"** section
4. **Create API User**:
   - Enter Provider Callback Host (your production domain)
   - Set Target Environment: **production**
5. **Generate API Key** for that user
6. **Save both credentials** securely

**Note**: In production, you **cannot** use Provisioning API. You **must** use Partner Portal.

## Configuration for Production

### Update Settings

Edit `InzuLink/settings.py`:

```python
# Environment
MOMO_ENVIRONMENT = 'production'  # Change from 'sandbox'

# Production Subscription Keys (from MTN after Go Live approval)
MOMO_SUBSCRIPTION_KEY_PRIMARY = 'your-production-primary-key'
MOMO_SUBSCRIPTION_KEY_SECONDARY = 'your-production-secondary-key'

# Production API User and Key (from Partner Portal)
MOMO_API_USER = 'your-production-api-user-id'
MOMO_API_KEY = 'your-production-api-key'

# Production Callback URL (required)
MOMO_CALLBACK_URL = 'https://yourdomain.com/auth/api/momo/callback/'
```

### Environment Variables (Recommended)

For production, use environment variables:

```bash
MOMO_ENVIRONMENT=production
MOMO_SUBSCRIPTION_KEY_PRIMARY=your-production-primary-key
MOMO_SUBSCRIPTION_KEY_SECONDARY=your-production-secondary-key
MOMO_API_USER=your-production-api-user-id
MOMO_API_KEY=your-production-api-key
MOMO_CALLBACK_URL=https://yourdomain.com/auth/api/momo/callback/
```

## Production API Endpoints

The code automatically uses production endpoints when `MOMO_ENVIRONMENT=production`:

- **Base URL**: `https://momodeveloper.mtn.co.rw`
- **Token**: `/collection/token/`
- **Request Payment**: `/collection/v1_0/requesttopay`
- **Payment Status**: `/collection/v1_0/requesttopay/{referenceId}`

## Important Production Considerations

### 1. Callback URL (Required)

- Must be **HTTPS** (not HTTP)
- Must be **publicly accessible**
- Must be registered in Partner Portal
- Format: `https://yourdomain.com/auth/api/momo/callback/`

### 2. Security

- **Never commit** production credentials to git
- Use environment variables or secrets management
- Rotate API keys regularly
- Monitor for suspicious activity

### 3. Testing

- Test thoroughly in sandbox first
- Start with small amounts in production
- Monitor transactions closely
- Have rollback plan ready

### 4. Fees

- MTN charges **0.5% fee** on transactions above 4,001 RWF
- Transactions below 4,000 RWF are free
- Fees are deducted from merchant account
- Understand fee structure before going live

### 5. Compliance

- Follow MTN MoMo terms and conditions
- Comply with financial regulations
- Keep transaction records
- Report issues promptly

## Go Live Process Timeline

1. **Application**: 1-2 weeks
2. **Review**: 2-4 weeks
3. **Approval**: 1-2 weeks
4. **Setup**: 1 week
5. **Total**: Approximately 4-8 weeks

## Checklist Before Going Live

- [ ] KYC documents ready
- [ ] Business information complete
- [ ] Go Live application submitted
- [ ] Contract signed with MTN
- [ ] Production credentials received
- [ ] API User and API Key created in Partner Portal
- [ ] Callback URL configured and tested
- [ ] HTTPS certificate installed
- [ ] Production environment configured
- [ ] Security measures in place
- [ ] Monitoring and logging setup
- [ ] Support contact information ready
- [ ] Test transactions completed
- [ ] Team trained on production system

## Support Contacts

- **MTN MoMo Support**: mmitsupport.RW@mtn.com
- **Developer Portal**: https://momodeveloper.mtn.co.rw/
- **Go Live Application**: Available in Developer Portal

## Differences: Sandbox vs Production

| Feature | Sandbox | Production |
|---------|---------|------------|
| **Subscription** | Automatic | Requires Go Live approval |
| **KYC** | Not required | Required |
| **Contract** | Not required | Required |
| **API User Creation** | Provisioning API or Portal | Partner Portal only |
| **Endpoints** | sandbox.momodeveloper.mtn.com | momodeveloper.mtn.co.rw |
| **Real Money** | No | Yes |
| **Fees** | None | 0.5% (above 4,001 RWF) |
| **Callback URL** | Optional | Required (HTTPS) |
| **Testing** | Unlimited | Use carefully |

## Current Status

**Your Current Setup:**
- ✅ Sandbox subscription active
- ✅ Sandbox subscription keys configured
- ⚠️ Need to create API User and API Key
- ⚠️ Need to complete Go Live for production

## Next Steps

### For Sandbox (Now):
1. Create API User and API Key (use Postman or Partner Portal)
2. Test payment flow
3. Verify everything works

### For Production (Later):
1. Complete Go Live application
2. Submit KYC documents
3. Sign contract with MTN
4. Get production credentials
5. Create production API User and API Key
6. Configure production environment
7. Test with small amounts
8. Go live!

---

**Recommendation**: Start with **Sandbox** to test everything, then apply for **Go Live** when ready for production! 🚀

