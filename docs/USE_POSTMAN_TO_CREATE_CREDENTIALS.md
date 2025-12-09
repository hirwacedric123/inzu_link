# 📮 Use Postman to Create API User and API Key

Since the portal doesn't show API User creation, use **Postman** - this is the **official method** recommended by MTN MoMo!

## Step 1: Install Postman (if needed)

1. Download Postman: https://www.postman.com/downloads/
2. Install and open Postman
3. Create a free account (if you don't have one)

## Step 2: Import MTN MoMo Collections

### Option A: Fork from Postman (Easiest)

1. Go to: https://momodeveloper.mtn.com/
2. Look for **"Run in Postman"** button or link
3. Click it - this will open Postman and import the collections automatically
4. You'll get:
   - **Sandbox Provisioning Collection** (for creating API User/Key)
   - **MoMo Open APIs Collection** (for making payments)

### Option B: Manual Import

1. In Postman, click **"Import"** button
2. Look for MTN MoMo collections in Postman Public API Network
3. Search for "MTN MoMo" or "MoMo API"
4. Import the collections

## Step 3: Set Up Variables

1. In Postman, go to your workspace
2. Click on the **"Sandbox Provisioning Collection"**
3. Click on **"Variables"** tab
4. Set these variables:

```
Collection_Subscription-Key = e968a63339b94f1dae91a9419d57d3ec
```

## Step 4: Create API User

1. In the **Sandbox Provisioning Collection**, find:
   - **"Create API User"** request
2. **Before sending**, you need to:
   - Generate a UUID for `X-Reference-Id` header
   - You can use: https://www.uuidgenerator.net/
   - Or in Postman, add this to Pre-request Script:
     ```javascript
     pm.variables.set("api_user_id", pm.variables.replaceIn("{{$randomUUID}}"));
     ```
3. Update the request:
   - **Headers**: 
     - `X-Reference-Id`: Your UUID (or use variable)
     - `Ocp-Apim-Subscription-Key`: `e968a63339b94f1dae91a9419d57d3ec`
   - **Body**:
     ```json
     {
       "providerCallbackHost": "localhost"
     }
     ```
4. **Click "Send"**
5. **Check response**: Should be `201 Created`
6. **Save the UUID** - this is your API User ID!

## Step 5: Create API Key

1. In the **Sandbox Provisioning Collection**, find:
   - **"Create API Key"** request
2. Update the request:
   - **URL**: Should include your API User ID
     - Example: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/YOUR_API_USER_ID/apikey`
   - **Headers**:
     - `Ocp-Apim-Subscription-Key`: `e968a63339b94f1dae91a9419d57d3ec`
3. **Click "Send"**
4. **Check response**: Should be `201 Created` with body:
   ```json
   {
     "apiKey": "your-api-key-here"
   }
   ```
5. **⚠️ COPY THE API KEY IMMEDIATELY** - you won't see it again!

## Step 6: Add to Your Settings

Once you have both:

1. **API User ID**: The UUID from Step 4
2. **API Key**: The key from Step 5

Add to `InzuLink/settings.py`:

```python
MOMO_API_USER = 'your-api-user-id-from-postman'
MOMO_API_KEY = 'your-api-key-from-postman'
```

## Alternative: Manual curl Commands

If you prefer command line, you can use curl:

### Step 1: Generate UUID

```bash
# Generate UUID
API_USER_ID=$(python3 -c "import uuid; print(uuid.uuid4())")
echo "API User ID: $API_USER_ID"
```

### Step 2: Create API User

```bash
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
  -H "X-Reference-Id: $API_USER_ID" \
  -H "Ocp-Apim-Subscription-Key: e968a63339b94f1dae91a9419d57d3ec" \
  -H "Content-Type: application/json" \
  -d '{"providerCallbackHost": "localhost"}'
```

### Step 3: Create API Key

```bash
# Replace YOUR_API_USER_ID with the UUID from Step 1
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/YOUR_API_USER_ID/apikey \
  -H "Ocp-Apim-Subscription-Key: e968a63339b94f1dae91a9419d57d3ec" \
  -H "Content-Type: application/json"
```

## Troubleshooting

### Still Getting 401 Error

If Postman also gives 401:
- Your subscription key might not be active for Provisioning API
- You might need to subscribe to "Sandbox User Provisioning" product separately
- Contact MTN support: mmitsupport.RW@mtn.com

### Can't Find Postman Collections

1. Go to: https://momodeveloper.mtn.com/
2. Look for documentation section
3. Find "Getting Started" or "Postman Collection" link
4. Or search in Postman Public API Network

## Why Postman Works

- ✅ Uses the official MTN MoMo collections
- ✅ Handles authentication correctly
- ✅ Shows you exactly what's being sent/received
- ✅ Easy to test and debug

---

**Recommendation**: Use **Postman** - it's the official method and most reliable! 🚀

