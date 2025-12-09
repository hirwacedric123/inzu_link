# 📮 Postman Setup Guide - Generate API User and API Key

Using Postman is the **official recommended method** by MTN MoMo. This guide will walk you through it step-by-step.

## Prerequisites

- ✅ Postman installed (download from https://www.postman.com/downloads/)
- ✅ Your Subscription Key: `e968a63339b94f1dae91a9419d57d3ec`
- ✅ Internet connection

## Step 1: Import Postman Collections

### Option A: Import from MTN MoMo Portal

1. **Go to**: https://momodeveloper.mtn.com/ (or your Rwanda portal)
2. **Look for**: "Run in Postman" or "Postman Collection" link
3. **Click** to import collections
4. You need **two collections**:
   - **Sandbox Provisioning Collection** (for creating API User/Key)
   - **MoMo Open APIs Collection** (for testing payments)

### Option B: Manual Setup (If Import Doesn't Work)

We'll create the requests manually below.

## Step 2: Set Up Environment Variables

1. **In Postman**, click on **"Environments"** (left sidebar)
2. **Create New Environment**:
   - Name: `MTN MoMo Sandbox`
3. **Add Variables**:

| Variable Name | Initial Value | Current Value |
|--------------|---------------|---------------|
| `Collection_Subscription_Key` | `e968a63339b94f1dae91a9419d57d3ec` | `e968a63339b94f1dae91a9419d57d3ec` |
| `api_user` | (leave empty) | (will fill after Step 3) |
| `api_key` | (leave empty) | (will fill after Step 3) |
| `base_url` | `https://sandbox.momodeveloper.mtn.com` | `https://sandbox.momodeveloper.mtn.com` |

4. **Save** the environment
5. **Select** this environment from the dropdown (top right)

## Step 3: Create API User

### Create New Request

1. **Click** "New" → "HTTP Request"
2. **Name it**: "Create API User"

### Configure Request

**Method**: `POST`

**URL**: 
```
{{base_url}}/v1_0/apiuser
```

Or directly:
```
https://sandbox.momodeveloper.mtn.com/v1_0/apiuser
```

**Headers**:
```
X-Reference-Id: {{$guid}}
Ocp-Apim-Subscription-Key: {{Collection_Subscription_Key}}
Content-Type: application/json
```

**Body** (select "raw" and "JSON"):
```json
{
  "providerCallbackHost": "localhost"
}
```

### Send Request

1. **Click "Send"**
2. **Check Response**:
   - Status: `201 Created` ✅
   - If you get `401`, check your subscription key
   - If you get `404`, check the URL

### Save API User ID

1. **Look at the request** - the `X-Reference-Id` header contains your API User ID
2. **Copy the UUID** from the `X-Reference-Id` header (or generate a new one)
3. **Update Environment Variable**:
   - Variable: `api_user`
   - Value: `your-uuid-here` (e.g., `81660f34-0fda-4873-9fbd-057d8ecf1b98`)

**Or generate a new UUID**:
- In Postman, use `{{$guid}}` in the header
- Copy the generated UUID from the request
- Save it to `api_user` variable

## Step 4: Create API Key

### Create New Request

1. **Click** "New" → "HTTP Request"
2. **Name it**: "Create API Key"

### Configure Request

**Method**: `POST`

**URL**: 
```
{{base_url}}/v1_0/apiuser/{{api_user}}/apikey
```

Or directly (replace `YOUR_API_USER_ID`):
```
https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/YOUR_API_USER_ID/apikey
```

**Headers**:
```
Ocp-Apim-Subscription-Key: {{Collection_Subscription_Key}}
Content-Type: application/json
```

**Body**: Leave empty (no body needed)

### Send Request

1. **Click "Send"**
2. **Check Response**:
   - Status: `201 Created` ✅
   - Response Body should contain:
   ```json
   {
     "apiKey": "f1db798c98df4bcf83b538175893bbf0"
   }
   ```

### Save API Key

1. **Copy the `apiKey` value** from the response body
2. **⚠️ COPY IT IMMEDIATELY** - you won't see it again!
3. **Update Environment Variable**:
   - Variable: `api_key`
   - Value: `your-api-key-here` (e.g., `f1db798c98df4bcf83b538175893bbf0`)

## Step 5: Add to Django Settings

Once you have both credentials:

1. **Copy API User ID** from Postman environment variable
2. **Copy API Key** from Postman environment variable
3. **Edit** `InzuLink/settings.py`:

```python
MOMO_API_USER = 'your-api-user-id-from-postman'
MOMO_API_KEY = 'your-api-key-from-postman'
```

**Example:**
```python
MOMO_API_USER = '81660f34-0fda-4873-9fbd-057d8ecf1b98'
MOMO_API_KEY = 'f1db798c98df4bcf83b538175893bbf0'
```

## Step 6: Test Access Token (Optional)

You can test if your credentials work by getting an access token:

### Create New Request

**Method**: `POST`

**URL**: 
```
{{base_url}}/collection/token/
```

**Headers**:
```
Authorization: Basic {{base64(api_user:api_key)}}
Ocp-Apim-Subscription-Key: {{Collection_Subscription_Key}}
```

**Note**: Postman can auto-encode Basic Auth. Click "Authorization" tab → Select "Basic Auth" → Enter:
- Username: `{{api_user}}`
- Password: `{{api_key}}`

**Send Request**:
- Status: `200 OK` ✅
- Response should contain `access_token`

## Troubleshooting

### 401 Error: "Access denied due to invalid subscription key"

**Check:**
- ✅ Subscription key is correct: `e968a63339b94f1dae91a9419d57d3ec`
- ✅ Using Primary key (not secondary)
- ✅ Key is for Collection API product

### 404 Error: "Resource not found"

**Check:**
- ✅ URL is correct: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser`
- ✅ Using `/v1_0/apiuser` (with version prefix)

### Can't Find Postman Collections

**Alternative:**
- Use the manual requests above
- Or contact MTN support for collection links

## Quick Reference

| Step | Endpoint | Method | What You Get |
|------|----------|--------|--------------|
| 1 | Setup | - | Postman configured |
| 2 | Variables | - | Environment ready |
| 3 | `/v1_0/apiuser` | POST | API User ID (UUID) |
| 4 | `/v1_0/apiuser/{id}/apikey` | POST | API Key |
| 5 | Settings | - | Credentials saved |
| 6 | `/collection/token/` | POST | Access Token (test) |

## Next Steps

After you have API User and API Key:

1. ✅ Add to `settings.py`
2. ✅ Run migration: `python manage.py migrate authentication`
3. ✅ Test payment flow!

---

**Ready?** Open Postman and follow the steps above! 🚀

