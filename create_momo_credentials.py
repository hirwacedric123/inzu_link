#!/usr/bin/env python
"""
Helper script to create MTN MoMo API User and API Key in Sandbox environment
Run this script to automatically generate credentials for testing
"""
import os
import sys
import django
import uuid

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'InzuLink.settings')
django.setup()

from authentication.momo_payment import MTNMoMoPayment

def create_momo_credentials():
    """Create API User and API Key for MoMo integration"""
    
    print("=" * 60)
    print("MTN MoMo Credential Generator")
    print("=" * 60)
    print()
    
    # Check environment
    from django.conf import settings
    environment = getattr(settings, 'MOMO_ENVIRONMENT', 'sandbox')
    
    if environment != 'sandbox':
        print("⚠️  WARNING: This script only works in sandbox environment!")
        print(f"   Current environment: {environment}")
        print("   Please use the Developer Portal to create credentials for production.")
        return
    
    print(f"Environment: {environment}")
    print()
    
    # Initialize MoMo payment handler
    momo = MTNMoMoPayment()
    
    # Generate unique API User ID
    api_user_id = str(uuid.uuid4())
    print(f"Generated API User ID: {api_user_id}")
    print()
    
    # Get callback host
    print("Enter your callback host (e.g., 'example.com' or 'localhost'):")
    callback_host = input("Callback host: ").strip()
    
    if not callback_host:
        callback_host = "localhost"
        print(f"Using default: {callback_host}")
    
    print()
    print("Creating API User...")
    
    # Create API User
    user_result = momo.create_api_user(api_user_id, callback_host)
    
    if not user_result.get('success'):
        print(f"❌ Failed to create API User: {user_result.get('message')}")
        return
    
    print("✅ API User created successfully!")
    print()
    
    # Create API Key
    print("Generating API Key...")
    key_result = momo.create_api_key(api_user_id)
    
    if not key_result.get('success'):
        print(f"❌ Failed to create API Key: {key_result.get('message')}")
        return
    
    api_key = key_result.get('api_key')
    print("✅ API Key generated successfully!")
    print()
    print("=" * 60)
    print("✅ CREDENTIALS GENERATED")
    print("=" * 60)
    print()
    print("Add these to your .env file or settings.py:")
    print()
    print(f"MOMO_API_USER={api_user_id}")
    print(f"MOMO_API_KEY={api_key}")
    print()
    print("⚠️  IMPORTANT: Save these credentials securely!")
    print("   You won't be able to see the API Key again.")
    print()
    print("=" * 60)

if __name__ == '__main__':
    try:
        create_momo_credentials()
    except KeyboardInterrupt:
        print("\n\nCancelled by user.")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

