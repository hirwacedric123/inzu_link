# MTN MoMo Payment Integration Setup Guide

This guide will help you set up MTN Mobile Money (MoMo) payment integration for collecting listing fees from vendors in Rwanda.

## Prerequisites

1. **MTN MoMo Developer Account**: You already have an active subscription to the Collection Widget API
2. **API Credentials**: 
   - Primary Key: `99ac5454271a4b4ba9105b9217d9efa8`
   - Secondary Key: `e3cce05bee0845289bfe7ae7c5885cab`
3. **API User and API Key**: You need to generate these from the MTN MoMo Developer Portal

## Step 1: Generate API User and API Key

1. Log in to the MTN MoMo Developer Portal: https://momodeveloper.mtn.co.rw/
2. Navigate to your subscription: "Collection Widget | Receive mobile money payments on your website through a USSD or QR code"
3. Go to the "API User" section and create a new API User
4. Generate an API Key for that user
5. Save these credentials securely

## Step 2: Configure Environment Variables

Add the following environment variables to your Django settings or `.env` file:

```bash
# MoMo API Environment (use 'sandbox' for testing, 'production' for live)
MOMO_ENVIRONMENT=sandbox

# MoMo API Credentials (from your subscription)
MOMO_SUBSCRIPTION_KEY_PRIMARY=99ac5454271a4b4ba9105b9217d9efa8
MOMO_SUBSCRIPTION_KEY_SECONDARY=e3cce05bee0845289bfe7ae7c5885cab

# API User and Key (generate from developer portal)
MOMO_API_USER=your_api_user_here
MOMO_API_KEY=your_api_key_here

# Callback URL for payment status updates (optional)
# Format: https://yourdomain.com/auth/api/momo/callback/
MOMO_CALLBACK_URL=https://yourdomain.com/auth/api/momo/callback/
```

## Step 3: Run Database Migration

Apply the migration to add MoMo payment fields to the ListingFee model:

```bash
python manage.py migrate authentication
```

## Step 4: Update Settings (if needed)

The settings are already configured in `InzuLink/settings.py`. If you need to override them, you can:

1. Set environment variables (recommended for production)
2. Or directly modify the settings file

## Step 5: Test the Integration

### Testing in Sandbox Mode

1. Set `MOMO_ENVIRONMENT=sandbox` in your environment
2. Use test phone numbers provided by MTN MoMo sandbox
3. Test the payment flow:
   - Create a property listing
   - Go to pay listing fee
   - Select "MTN MoMo" payment method
   - Enter number of days
   - Click "Pay with MoMo"
   - Approve the payment on your test phone

### Testing Payment Status Check

After initiating a payment:
- The system will redirect you to a payment status page
- The page auto-refreshes every 10 seconds to check payment status
- You can also manually click "Check Status"

## Step 6: Configure Callback URL (Optional but Recommended)

For production, set up a callback URL so MTN MoMo can notify your system when payments are completed:

1. Set `MOMO_CALLBACK_URL` to your production callback endpoint
2. The callback endpoint is: `/auth/api/momo/callback/`
3. Ensure your server is accessible via HTTPS
4. Configure the callback URL in the MTN MoMo Developer Portal

## How It Works

### Payment Flow

1. **Vendor creates listing** → Listing fee record created with `payment_status='pending'`
2. **Vendor clicks "Pay Listing Fee"** → Payment page shows MoMo and Manual options
3. **Vendor selects MoMo and enters days** → System calculates total amount
4. **Vendor clicks "Pay with MoMo"** → System calls MTN MoMo API to request payment
5. **Vendor receives prompt on phone** → Approves payment via USSD or MoMo app
6. **System checks payment status** → Automatically verifies payment completion
7. **Payment confirmed** → Listing activated, vendor redirected to dashboard

### Payment Status Tracking

- **PENDING**: Payment request sent, waiting for user approval
- **SUCCESSFUL**: Payment approved and confirmed
- **FAILED**: Payment was declined or failed

## API Endpoints

### Payment Initiation
- **URL**: `/auth/listing/<listing_id>/pay-fee/`
- **Method**: POST
- **Payment Method**: Select "momo" in form

### Payment Status Check
- **URL**: `/auth/listing/<listing_id>/payment-status/<transaction_id>/`
- **Method**: GET
- **Auto-refreshes**: Every 10 seconds for pending payments

### Payment Callback (Webhook)
- **URL**: `/auth/api/momo/callback/`
- **Method**: POST
- **Purpose**: Receives payment status updates from MTN MoMo

## Troubleshooting

### Common Issues

1. **"Failed to authenticate with MoMo API"**
   - Check that `MOMO_API_USER` and `MOMO_API_KEY` are correctly set
   - Verify API User and Key are active in the developer portal

2. **"Payment request failed"**
   - Ensure phone number is in correct format (250XXXXXXXXX)
   - Check that phone number is registered with MTN MoMo
   - Verify you're using the correct environment (sandbox vs production)

3. **Payment status not updating**
   - Check callback URL is configured correctly
   - Verify server is accessible from internet (for callbacks)
   - Manually check payment status using the status page

4. **"Phone number is required"**
   - Ensure vendor has a phone number in their profile
   - Phone number should be in format: 250XXXXXXXXX

### API Endpoint Verification

If you encounter API endpoint issues, verify the correct endpoints in the MTN MoMo Developer Portal documentation. The endpoints may vary based on:
- API version
- Environment (sandbox vs production)
- Region (Rwanda specific)

## Production Checklist

Before going live:

- [ ] Switch `MOMO_ENVIRONMENT` to `production`
- [ ] Update API credentials to production keys
- [ ] Configure callback URL in MTN MoMo Developer Portal
- [ ] Test complete payment flow in production
- [ ] Set up monitoring for payment callbacks
- [ ] Configure error logging for payment failures
- [ ] Test with real phone numbers and amounts

## Support

For MTN MoMo API support:
- Email: mmitsupport.RW@mtn.com
- Developer Portal: https://momodeveloper.mtn.co.rw/
- Documentation: Check the developer portal for latest API documentation

## Security Notes

1. **Never commit API keys to version control**
   - Use environment variables
   - Keep credentials in `.env` file (add to `.gitignore`)

2. **Use HTTPS in production**
   - Required for callback URLs
   - Ensures secure payment data transmission

3. **Validate callbacks**
   - Consider adding signature verification
   - Verify callback source is from MTN MoMo

## Additional Resources

- MTN MoMo Developer Portal: https://momodeveloper.mtn.co.rw/
- Collection Widget Documentation: Available in developer portal
- API Reference: Check developer portal for latest API documentation



