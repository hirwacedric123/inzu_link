#!/bin/bash
# Script to create MTN MoMo API User and API Key using curl
# This is an alternative to the Python script

echo "============================================================"
echo "MTN MoMo API User and API Key Creator (curl method)"
echo "============================================================"
echo ""

# Subscription Key
SUBSCRIPTION_KEY="e968a63339b94f1dae91a9419d57d3ec"

# Generate UUID for API User
API_USER_ID=$(python3 -c "import uuid; print(uuid.uuid4())")
echo "Generated API User ID: $API_USER_ID"
echo ""

# Get callback host
read -p "Enter callback host (default: localhost): " CALLBACK_HOST
CALLBACK_HOST=${CALLBACK_HOST:-localhost}
echo "Using callback host: $CALLBACK_HOST"
echo ""

# Step 1: Create API User
echo "Step 1: Creating API User..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
  -H "X-Reference-Id: $API_USER_ID" \
  -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"providerCallbackHost\": \"$CALLBACK_HOST\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ API User created successfully!"
    echo ""
    
    # Step 2: Create API Key
    echo "Step 2: Generating API Key..."
    echo ""
    
    KEY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/$API_USER_ID/apikey \
      -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY" \
      -H "Content-Type: application/json")
    
    KEY_HTTP_CODE=$(echo "$KEY_RESPONSE" | tail -n1)
    KEY_BODY=$(echo "$KEY_RESPONSE" | sed '$d')
    
    if [ "$KEY_HTTP_CODE" = "201" ]; then
        # Extract API Key from JSON response
        API_KEY=$(echo "$KEY_BODY" | python3 -c "import sys, json; print(json.load(sys.stdin).get('apiKey', ''))")
        
        echo "✅ API Key generated successfully!"
        echo ""
        echo "============================================================"
        echo "✅ CREDENTIALS GENERATED"
        echo "============================================================"
        echo ""
        echo "Add these to your InzuLink/settings.py:"
        echo ""
        echo "MOMO_API_USER = '$API_USER_ID'"
        echo "MOMO_API_KEY = '$API_KEY'"
        echo ""
        echo "⚠️  IMPORTANT: Save these credentials securely!"
        echo "   You won't be able to see the API Key again."
        echo ""
        echo "============================================================"
    else
        echo "❌ Failed to create API Key"
        echo "HTTP Code: $KEY_HTTP_CODE"
        echo "Response: $KEY_BODY"
    fi
else
    echo "❌ Failed to create API User"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
    echo ""
    echo "Possible reasons:"
    echo "- Subscription key is invalid or not active"
    echo "- Subscription key doesn't have access to Provisioning API"
    echo "- Try using Postman method instead (see docs/USE_POSTMAN_TO_CREATE_CREDENTIALS.md)"
fi

