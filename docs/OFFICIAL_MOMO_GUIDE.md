# 📚 Official MTN MoMo API Setup Guide

Based on the official MTN MoMo Developer documentation.

## Steps to Create Your First API Request

### Step 1: Fork Collection
- Fork the Collection using "Run In Postman"
- This gives you the Postman collection with all API endpoints

### Step 2: Create Subscription Keys

1. **Sign up**: https://momodeveloper.mtn.com
2. **Navigate** to the products page
3. **Select** the product that suits your business case and subscribe
4. **Locate Subscription Keys** in your profile after completion
5. **Update Variables** in Postman:
   - `Collection_Subscription-Key` = Your Primary Subscription Key
   - Use the **Primary** key (not secondary)

**Your Subscription Keys:**
- Primary: `99ac5454271a4b4ba9105b9217d9efa8`
- Secondary: `e3cce05bee0845289bfe7ae7c5885cab`

### Step 3: Generate API User and API Key

1. **Fork the Sandbox Provisioning Collection** using "Run in Postman"
2. **Run the Sandbox Provisioning Collection**
3. **Copy the API User and API Key** displayed via console and test results
4. **Update Variables** in Postman:
   - `api_user` = Your generated API User ID
   - `api_key` = Your generated API Key

**Note**: The Provisioning API should work with your Collection subscription key!

### Step 4: Get Access Token

- Access token is **automatically generated** using your `api_user` and `api_key`
- A pre-request script in Postman generates and manages token expiry automatically
- In our code, we call `/collection/token/` endpoint with Basic Auth

### Step 5: Make Your First MoMo API Call

1. **Navigate** to your fork of the MoMo Open APIs collection
2. **Select**: Get Paid > Request Payment
3. **Click Send** to request a payment
4. **Response**: 202 Accepted (on success)
5. **Customer** receives PIN to approve debit from MoMo Wallet
6. **Check Callback URL** for payment status
7. **Check Status**: Get Paid > Payment Status
8. **Response**: 200 OK with status in response body

## Using Postman vs Our Script

### Option A: Use Postman (Recommended for First Time)

1. **Import Postman Collection**:
   - Fork "Sandbox Provisioning Collection"
   - Fork "MoMo Open APIs Collection"

2. **Set Variables**:
   - `Collection_Subscription-Key` = `99ac5454271a4b4ba9105b9217d9efa8`
   - Run Provisioning collection to get `api_user` and `api_key`
   - Update these in variables

3. **Test**:
   - Use Postman to test all endpoints
   - Copy credentials to your Django settings

### Option B: Use Our Script

Our `create_momo_credentials.py` script does the same thing as Postman, but:
- It might need the correct subscription key
- The endpoint URL must match Postman collection

## Troubleshooting 401 Error

If you get "Access denied due to invalid subscription key":

1. **Verify Subscription Key**:
   - Make sure you're using the **Primary** subscription key
   - Key should be for **Collection** product

2. **Check Postman Collection**:
   - Import the official Postman collection
   - See what subscription key it uses
   - Compare with your key

3. **Try Postman First**:
   - Use Postman to generate credentials
   - Then copy them to your settings
   - This confirms the subscription key works

4. **Alternative**:
   - Use Partner Portal method (manual)
   - See `docs/MANUAL_API_CREDENTIALS.md`

## Quick Reference

| Step | Method | What You Need |
|------|--------|---------------|
| 1 | Postman | Fork collections |
| 2 | Portal | Subscription keys (✅ you have) |
| 3 | Postman/API | API User & Key (⚠️ need to generate) |
| 4 | Automatic | Access token (auto-generated) |
| 5 | API Call | Request payment |

## Next Steps

1. **Try Postman** to generate API User/Key (easiest)
2. **Or use Partner Portal** if Postman doesn't work
3. **Copy credentials** to `settings.py`
4. **Test payment flow**

---

**Recommendation**: Use **Postman** first - it's the official method and will help you understand the API flow!

