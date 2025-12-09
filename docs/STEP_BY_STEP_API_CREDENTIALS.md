# 📋 Step-by-Step: Create API User and API Key

Based on official MTN MoMo documentation.

## Prerequisites

✅ You have:
- Subscription Key (Primary): `99ac5454271a4b4ba9105b9217d9efa8`
- Subscription Key (Secondary): `e3cce05bee0845289bfe7ae7c5885cab`
- Sandbox environment access

## Step 1: Create API User

### What You Need
- A UUID for Reference ID (we'll generate this)
- Your Subscription Key (Primary)
- A callback host (e.g., "localhost" for testing)

### API Request Details

**Endpoint**: `POST https://sandbox.momodeveloper.mtn.com/apiuser`

**Headers**:
```
X-Reference-Id: <your-uuid-here>
Ocp-Apim-Subscription-Key: 99ac5454271a4b4ba9105b9217d9efa8
Content-Type: application/json
```

**Body**:
```json
{
  "providerCallbackHost": "localhost"
}
```

**Expected Response**: `201 Created`

### Using Our Script

```bash
python create_momo_credentials.py
```

The script will:
1. Generate a UUID automatically
2. Ask for callback host (press Enter for "localhost")
3. Make the API call
4. Show you the result

### Manual Method (Using curl)

```bash
# Generate UUID
UUID=$(python3 -c "import uuid; print(uuid.uuid4())")

# Create API User
curl -X POST https://sandbox.momodeveloper.mtn.com/apiuser \
  -H "X-Reference-Id: $UUID" \
  -H "Ocp-Apim-Subscription-Key: 99ac5454271a4b4ba9105b9217d9efa8" \
  -H "Content-Type: application/json" \
  -d '{"providerCallbackHost": "localhost"}'
```

**Save the UUID** - this is your API User ID!

## Step 2: Create API Key

### What You Need
- API User ID (the UUID from Step 1)
- Your Subscription Key (Primary)

### API Request Details

**Endpoint**: `POST https://sandbox.momodeveloper.mtn.com/apiuser/{APIUser}/apikey`

**Example**: `POST https://sandbox.momodeveloper.mtn.com/apiuser/c72025f5-5cd1-4630-99e4-8ba4722fad56/apikey`

**Headers**:
```
Ocp-Apim-Subscription-Key: 99ac5454271a4b4ba9105b9217d9efa8
Content-Type: application/json
```

**Body**: None (empty)

**Expected Response**: `201 Created` with body:
```json
{
  "apiKey": "f1db798c98df4bcf83b538175893bbf0"
}
```

### Using Our Script

The script automatically does this after creating the API User!

### Manual Method (Using curl)

```bash
# Replace YOUR_API_USER_ID with the UUID from Step 1
curl -X POST https://sandbox.momodeveloper.mtn.com/apiuser/YOUR_API_USER_ID/apikey \
  -H "Ocp-Apim-Subscription-Key: 99ac5454271a4b4ba9105b9217d9efa8" \
  -H "Content-Type: application/json"
```

**⚠️ COPY THE API KEY IMMEDIATELY** - you won't see it again!

## Step 3: Add to Settings

Once you have both:

1. **API User ID**: The UUID from Step 1
2. **API Key**: The key from Step 2

Add them to `InzuLink/settings.py`:

```python
MOMO_API_USER = 'your-api-user-id-here'  # The UUID
MOMO_API_KEY = 'your-api-key-here'       # The key from Step 2
```

Or add to `.env` file:
```bash
MOMO_API_USER=your-api-user-id-here
MOMO_API_KEY=your-api-key-here
```

## Step 4: Verify (Optional)

You can verify your API User was created:

**Endpoint**: `GET https://sandbox.momodeveloper.mtn.com/apiuser/{APIUser}`

**Headers**:
```
Ocp-Apim-Subscription-Key: 99ac5454271a4b4ba9105b9217d9efa8
```

**Expected Response**: `200 OK`
```json
{
  "providerCallbackHost": "localhost",
  "targetEnvironment": "sandbox"
}
```

## Troubleshooting

### 401 Error: "Access denied due to invalid subscription key"

**Possible causes:**
1. Wrong subscription key
2. Subscription key not active
3. Wrong endpoint URL

**Solutions:**
1. Verify subscription key in Developer Portal
2. Make sure you're using the **Primary** key
3. Check endpoint URL is correct: `/apiuser` (not `/v1_0/apiuser`)

### 409 Error: "Reference ID already exists"

**Solution:**
- Generate a new UUID
- The UUID must be unique

### Can't see API Key

**Important**: API Key is only shown once in the response. If you missed it:
- You'll need to create a new API Key
- Old key cannot be retrieved

## Quick Reference

| Step | Endpoint | Method | What You Get |
|------|----------|--------|--------------|
| 1 | `/apiuser` | POST | API User ID (UUID) |
| 2 | `/apiuser/{id}/apikey` | POST | API Key |
| 3 | Settings | - | Configure in code |
| 4 | `/apiuser/{id}` | GET | Verify (optional) |

## Next Steps

After you have API User and API Key:

1. ✅ Add to settings
2. ✅ Run migration: `python manage.py migrate authentication`
3. ✅ Test payment flow!

---

**Ready?** Run `python create_momo_credentials.py` and follow the prompts!

