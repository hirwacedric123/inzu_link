# 🔍 How to Find API User Section in MoMo Developer Portal

Based on your profile page, here's where to find the API User creation section:

## Where to Look

### Option 1: API Sandbox Section (Most Likely)

1. **Click on "API Sandbox"** in the top navigation bar
2. Look for:
   - **"API User"** section
   - **"Sandbox User Provisioning"** 
   - **"Credentials"** or **"API Access"**

### Option 2: Documentation Section

1. **Click on "Documentation"** in the top navigation
2. Look for **"API User & API Key Management"** (I can see this in the footer)
3. This might have a link to create API User

### Option 3: Products Section

1. **Click on "Products"** in the top navigation
2. Find your **"Collection Widget"** product
3. Click on it to see product details
4. Look for **"API User"** or **"Credentials"** tab/section

### Option 4: Direct URL (Try This)

Sometimes the API User section is at a direct URL. Try:

- `https://ericssondeveloperapi.developer.azure-api.net/apiuser` (or similar)
- Look for a link in the footer under "Documentation" → "API User & API Key Management"

## What You're Looking For

You should see something like:
- **"Create API User"** button
- **"Add API User"** button
- A form with:
  - **Provider Callback Host** field
  - **Target Environment** (should be "sandbox")
  - **Create** or **Submit** button

## If You Can't Find It

1. **Check the footer**: Click on "Documentation" → "API User & API Key Management"
2. **Contact Support**: Use the "Support" link in navigation
3. **Check API Sandbox**: This is usually where sandbox credentials are managed

## Alternative: Use Postman

If you can't find it in the portal, you can use Postman:

1. Import the **"Sandbox Provisioning Collection"** from Postman
2. Set your subscription key: `e968a63339b94f1dae91a9419d57d3ec`
3. Run the collection to create API User and API Key
4. Copy the credentials from Postman console

---

**Try clicking on "API Sandbox" first** - that's where API User management usually is! 🎯

