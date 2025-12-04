# Quick Start: MTN MoMo Payment Integration

## ✅ What You Already Have

- ✅ Primary Key: `99ac5454271a4b4ba9105b9217d9efa8`
- ✅ Secondary Key: `e3cce05bee0845289bfe7ae7c5885cab`
- ✅ Active Collection Widget Subscription

## 🔑 Step 1: Generate API User and API Key

1. **Log in** to https://momodeveloper.mtn.co.rw/
2. **Navigate** to your "Collection Widget" subscription
3. **Find** the "API User" section (usually under "API Access" or "Credentials")
4. **Create** a new API User (if you don't have one)
   - Give it a name (e.g., "inzulink-api-user")
5. **Generate** an API Key for that user
   - ⚠️ **Important**: Copy the API Key immediately - you won't be able to see it again!
6. **Save** both:
   - API User ID (e.g., `your-api-user-id`)
   - API Key (e.g., `your-api-key-here`)

## ⚙️ Step 2: Configure Your Environment

### Option A: Environment Variables (Recommended)

Create a `.env` file in your project root or set these in your deployment environment:

```bash
# MoMo API Configuration
MOMO_ENVIRONMENT=sandbox  # Change to 'production' when ready
MOMO_SUBSCRIPTION_KEY_PRIMARY=99ac5454271a4b4ba9105b9217d9efa8
MOMO_SUBSCRIPTION_KEY_SECONDARY=e3cce05bee0845289bfe7ae7c5885cab
MOMO_API_USER=your-api-user-id-here
MOMO_API_KEY=your-api-key-here

# Optional: Callback URL (for automatic payment status updates)
MOMO_CALLBACK_URL=https://yourdomain.com/auth/api/momo/callback/
```

### Option B: Direct Settings (For Testing Only)

If you want to test quickly, you can temporarily add these to `InzuLink/settings.py`:

```python
MOMO_API_USER = 'your-api-user-id-here'
MOMO_API_KEY = 'your-api-key-here'
```

⚠️ **Never commit API keys to version control!**

## 🗄️ Step 3: Run Database Migration

```bash
# Activate your virtual environment first
source cedenv/bin/activate  # or your venv path

# Run the migration
python manage.py migrate authentication
```

## 🧪 Step 4: Test the Integration

### Test in Sandbox Mode

1. **Ensure** `MOMO_ENVIRONMENT=sandbox` is set
2. **Create a test property listing**:
   - Go to your vendor dashboard
   - Create a new property listing
3. **Pay the listing fee**:
   - Click "Pay Listing Fee" on your property
   - Select **"MTN MoMo"** payment method
   - Enter number of days (e.g., 30)
   - Click **"Pay with MoMo"**
4. **Approve on your phone**:
   - You'll receive a MoMo prompt on your registered phone
   - Approve the payment
5. **Check status**:
   - The page will auto-refresh to show payment status
   - Once successful, your listing will be activated

### Test Phone Numbers (Sandbox)

Check the MTN MoMo Developer Portal for test phone numbers you can use in sandbox mode.

## 🚀 Step 5: Go to Production

When you're ready for live payments:

1. **Switch environment**:
   ```bash
   MOMO_ENVIRONMENT=production
   ```

2. **Update credentials** (if production uses different keys):
   - Use production API User and API Key from the portal

3. **Configure callback URL**:
   - Set `MOMO_CALLBACK_URL` to your production domain
   - Format: `https://yourdomain.com/auth/api/momo/callback/`
   - Register this URL in the MTN MoMo Developer Portal

4. **Test with real phone numbers**:
   - Use actual MTN MoMo registered phone numbers
   - Test with small amounts first

## 📱 How It Works for Vendors

1. Vendor creates a property listing
2. System calculates listing fee based on property value:
   - Under 1M RWF: 100 RWF/day
   - 1M-5M RWF: 200 RWF/day
   - 5M-10M RWF: 500 RWF/day
   - Over 10M RWF: 1,000 RWF/day
3. Vendor selects number of days to pay for
4. Vendor chooses "MTN MoMo" payment method
5. System sends payment request to vendor's phone
6. Vendor approves payment on their phone
7. Listing is automatically activated

## 🔍 Troubleshooting

### "Failed to authenticate with MoMo API"
- ✅ Check `MOMO_API_USER` and `MOMO_API_KEY` are set correctly
- ✅ Verify API User and Key are active in the developer portal
- ✅ Ensure you're using the correct environment (sandbox vs production)

### "Payment request failed"
- ✅ Verify phone number format: `250XXXXXXXXX` (Rwanda format)
- ✅ Ensure phone number is registered with MTN MoMo
- ✅ Check you're using test numbers in sandbox mode

### "Phone number is required"
- ✅ Vendor must have a phone number in their profile
- ✅ Phone number should be in format: `250XXXXXXXXX`

### Payment status not updating
- ✅ Check callback URL is configured (for automatic updates)
- ✅ Manually check status using the payment status page
- ✅ Verify your server is accessible from the internet (for callbacks)

## 📞 Support

- **MTN MoMo Support**: mmitsupport.RW@mtn.com
- **Developer Portal**: https://momodeveloper.mtn.co.rw/
- **Documentation**: Available in the developer portal

## ✅ Checklist

Before going live:
- [ ] API User and API Key generated and configured
- [ ] Database migration run successfully
- [ ] Tested in sandbox mode
- [ ] Callback URL configured (if using)
- [ ] Environment switched to production
- [ ] Tested with real phone numbers
- [ ] Error logging configured
- [ ] Payment flow tested end-to-end

---

**Need Help?** Check `MOMO_PAYMENT_SETUP.md` for detailed documentation.

