"""
MTN MoMo Payment Integration for Rwanda
Handles payment requests, status checks, and callbacks for Collection API
Based on official MTN MoMo API documentation
"""
import requests
import base64
import json
import uuid
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class MTNMoMoPayment:
    """
    MTN Mobile Money Payment Handler for Rwanda
    Uses Collection API to request payments via USSD or QR code
    
    Based on official MoMo API documentation:
    - Uses OAuth 2.0 for authentication
    - Requires Subscription Key, API User, and API Key
    - Supports sandbox and production environments
    """
    
    # API Base URLs
    SANDBOX_BASE_URL = "https://sandbox.momodeveloper.mtn.com"
    PRODUCTION_BASE_URL = "https://momodeveloper.mtn.co.rw"
    
    def __init__(self):
        """Initialize MoMo payment with credentials from settings"""
        self.environment = getattr(settings, 'MOMO_ENVIRONMENT', 'sandbox')
        self.base_url = self.PRODUCTION_BASE_URL if self.environment == 'production' else self.SANDBOX_BASE_URL
        
        # API Credentials
        self.subscription_key_primary = getattr(settings, 'MOMO_SUBSCRIPTION_KEY_PRIMARY', '')
        self.subscription_key_secondary = getattr(settings, 'MOMO_SUBSCRIPTION_KEY_SECONDARY', '')
        self.api_user = getattr(settings, 'MOMO_API_USER', '')
        self.api_key = getattr(settings, 'MOMO_API_KEY', '')
        
        # Collection API endpoints (per official documentation)
        self.collection_request_to_pay_url = f"{self.base_url}/collection/v1_0/requesttopay"
        self.token_url = f"{self.base_url}/collection/token/"
        self.request_to_pay_status_url = f"{self.base_url}/collection/v1_0/requesttopay"
        
        # Provisioning API endpoints (for sandbox only)
        # Based on official MTN MoMo Postman collection
        # Note: Sandbox URL might be different - check Postman collection
        if self.environment == 'sandbox':
            # Sandbox Provisioning API (may use different base URL)
            provisioning_base = "https://sandbox.momodeveloper.mtn.com"
        else:
            provisioning_base = self.base_url
        
        self.provisioning_api_user_url = f"{provisioning_base}/v1_0/apiuser"
        self.provisioning_api_key_url = f"{provisioning_base}/v1_0/apiuser"
        
        # Callback URL (will be set dynamically)
        self.callback_url = getattr(settings, 'MOMO_CALLBACK_URL', '')
        
    def _get_access_token(self):
        """
        Get OAuth 2.0 access token for API authentication
        Uses Client Credential Grant (RFC 6749) with Basic Authentication
        
        Returns: access_token string or None if failed
        """
        try:
            # Validate credentials
            if not self.api_user or not self.api_key:
                logger.error("API User or API Key not configured")
                return None
            
            # Create basic auth header (per OAuth 2.0 spec)
            credentials = f"{self.api_user}:{self.api_key}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()
            
            headers = {
                'Authorization': f'Basic {encoded_credentials}',
                'Ocp-Apim-Subscription-Key': self.subscription_key_primary,
                'Content-Type': 'application/json'
            }
            
            # Request token (OAuth 2.0 Client Credentials Grant)
            response = requests.post(self.token_url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                token_data = response.json()
                access_token = token_data.get('access_token')
                if access_token:
                    logger.info("Successfully obtained access token")
                    return access_token
                else:
                    logger.error(f"No access_token in response: {token_data}")
                    return None
            else:
                logger.error(f"Failed to get access token: {response.status_code} - {response.text}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error("Token request timeout")
            return None
        except Exception as e:
            logger.error(f"Error getting access token: {str(e)}")
            return None
    
    def request_payment(self, amount, payer_phone, external_id=None, payment_reason="Listing Fee Payment"):
        """
        Request payment from a customer using Collection Widget API
        
        Args:
            amount: Payment amount in RWF (Decimal or float)
            payer_phone: Customer's phone number (format: 250788123456)
            external_id: Unique transaction ID (auto-generated if not provided)
            payment_reason: Description of the payment
            
        Returns:
            dict with keys: success, transaction_id, status, message, qr_code (if available)
        """
        try:
            # Get access token
            access_token = self._get_access_token()
            if not access_token:
                return {
                    'success': False,
                    'message': 'Failed to authenticate with MoMo API'
                }
            
            # Generate external ID (X-Reference-Id) if not provided
            # Must be a unique UUID per documentation
            if not external_id:
                external_id = str(uuid.uuid4())
            
            # Format phone number (ensure it starts with country code for Rwanda: 250)
            phone = str(payer_phone).strip()
            if not phone.startswith('250'):
                if phone.startswith('0'):
                    phone = '250' + phone[1:]
                elif phone.startswith('+250'):
                    phone = phone[1:]  # Remove +
                else:
                    phone = '250' + phone
            
            # Convert amount to string (MoMo API expects string, no decimals)
            amount_str = str(int(Decimal(str(amount))))
            
            # Prepare request payload (per Collection API specification)
            payload = {
                "amount": amount_str,
                "currency": "RWF",
                "externalId": external_id,
                "payer": {
                    "partyIdType": "MSISDN",
                    "partyId": phone
                },
                "payerMessage": payment_reason,
                "payeeNote": f"Payment for {payment_reason}"
            }
            
            # Add callback URL if configured
            if self.callback_url:
                payload["callbackUrl"] = self.callback_url
            
            # Request headers (per official documentation)
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Ocp-Apim-Subscription-Key': self.subscription_key_primary,
                'X-Target-Environment': 'sandbox' if self.environment == 'sandbox' else 'production',
                'Content-Type': 'application/json',
                'X-Reference-Id': external_id  # UUID reference ID in header
            }
            
            # Make payment request (POST is asynchronous per documentation)
            response = requests.post(
                self.collection_request_to_pay_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            # Handle response (per documentation: POST returns 202 Accepted for async operations)
            if response.status_code == 202:
                # Payment request accepted (asynchronous - status will be PENDING initially)
                return {
                    'success': True,
                    'transaction_id': external_id,
                    'status': 'PENDING',
                    'message': 'Payment request sent successfully. Please approve on your phone.',
                    'reference_id': external_id
                }
            elif response.status_code == 200:
                # Some implementations may return 200
                return {
                    'success': True,
                    'transaction_id': external_id,
                    'status': 'PENDING',
                    'message': 'Payment request sent successfully. Please approve on your phone.',
                    'reference_id': external_id
                }
            else:
                error_message = response.text
                try:
                    error_data = response.json()
                    error_message = error_data.get('message', error_message)
                except:
                    pass
                
                logger.error(f"Payment request failed: {response.status_code} - {error_message}")
                return {
                    'success': False,
                    'transaction_id': external_id,
                    'status': 'FAILED',
                    'message': f'Payment request failed: {error_message}'
                }
                
        except requests.exceptions.Timeout:
            logger.error("MoMo API request timeout")
            return {
                'success': False,
                'message': 'Payment request timed out. Please try again.'
            }
        except Exception as e:
            logger.error(f"Error requesting payment: {str(e)}")
            return {
                'success': False,
                'message': f'An error occurred: {str(e)}'
            }
    
    def check_payment_status(self, transaction_id):
        """
        Check the status of a payment transaction
        
        Args:
            transaction_id: The external ID used for the payment request
            
        Returns:
            dict with keys: success, status, message
            Status can be: PENDING, SUCCESSFUL, FAILED
        """
        try:
            # Get access token
            access_token = self._get_access_token()
            if not access_token:
                return {
                    'success': False,
                    'message': 'Failed to authenticate with MoMo API'
                }
            
            # Request headers
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Ocp-Apim-Subscription-Key': self.subscription_key_primary,
                'X-Target-Environment': 'sandbox' if self.environment == 'sandbox' else 'production'
            }
            
            # Check payment status
            status_url = f"{self.request_to_pay_status_url}/{transaction_id}"
            response = requests.get(status_url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                status_data = response.json()
                status = status_data.get('status', 'UNKNOWN')
                
                return {
                    'success': True,
                    'status': status,
                    'message': f'Payment status: {status}',
                    'data': status_data
                }
            else:
                logger.error(f"Failed to check payment status: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'status': 'UNKNOWN',
                    'message': 'Failed to check payment status'
                }
                
        except Exception as e:
            logger.error(f"Error checking payment status: {str(e)}")
            return {
                'success': False,
                'status': 'UNKNOWN',
                'message': f'Error checking status: {str(e)}'
            }
    
    def create_api_user(self, reference_id, callback_host):
        """
        Create API User in Sandbox environment (Provisioning API)
        This is only available in sandbox for testing purposes.
        
        Args:
            reference_id: UUID to use as API User ID
            callback_host: Provider callback host (e.g., "example.com")
            
        Returns:
            dict with success status and api_user_id
        """
        if self.environment != 'sandbox':
            return {
                'success': False,
                'message': 'API User provisioning is only available in sandbox environment'
            }
        
        try:
            headers = {
                'X-Reference-Id': reference_id,
                'Ocp-Apim-Subscription-Key': self.subscription_key_primary,
                'Content-Type': 'application/json'
            }
            
            payload = {
                "providerCallbackHost": callback_host
            }
            
            response = requests.post(
                self.provisioning_api_user_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 201:
                return {
                    'success': True,
                    'api_user_id': reference_id,
                    'message': 'API User created successfully'
                }
            else:
                logger.error(f"Failed to create API User: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'message': f'Failed to create API User: {response.text}'
                }
        except Exception as e:
            logger.error(f"Error creating API User: {str(e)}")
            return {
                'success': False,
                'message': f'Error creating API User: {str(e)}'
            }
    
    def create_api_key(self, api_user_id):
        """
        Create API Key for an API User in Sandbox environment (Provisioning API)
        This is only available in sandbox for testing purposes.
        
        Args:
            api_user_id: The API User ID (UUID reference ID)
            
        Returns:
            dict with success status and api_key
        """
        if self.environment != 'sandbox':
            return {
                'success': False,
                'message': 'API Key provisioning is only available in sandbox environment'
            }
        
        try:
            headers = {
                'Ocp-Apim-Subscription-Key': self.subscription_key_primary,
                'Content-Type': 'application/json'
            }
            
            api_key_url = f"{self.provisioning_api_key_url}/{api_user_id}/apikey"
            response = requests.post(api_key_url, headers=headers, timeout=30)
            
            if response.status_code == 201:
                key_data = response.json()
                api_key = key_data.get('apiKey')
                return {
                    'success': True,
                    'api_key': api_key,
                    'message': 'API Key created successfully'
                }
            else:
                logger.error(f"Failed to create API Key: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'message': f'Failed to create API Key: {response.text}'
                }
        except Exception as e:
            logger.error(f"Error creating API Key: {str(e)}")
            return {
                'success': False,
                'message': f'Error creating API Key: {str(e)}'
            }
    
    def get_api_user_details(self, api_user_id):
        """
        Get API User details (callback host, target environment)
        Note: API Key cannot be retrieved - must be generated again if lost.
        
        Args:
            api_user_id: The API User ID (UUID reference ID)
            
        Returns:
            dict with user details
        """
        try:
            headers = {
                'Ocp-Apim-Subscription-Key': self.subscription_key_primary
            }
            
            user_url = f"{self.provisioning_api_user_url}/{api_user_id}"
            response = requests.get(user_url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'data': response.json()
                }
            else:
                logger.error(f"Failed to get API User details: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'message': f'Failed to get API User details: {response.text}'
                }
        except Exception as e:
            logger.error(f"Error getting API User details: {str(e)}")
            return {
                'success': False,
                'message': f'Error getting API User details: {str(e)}'
            }
    
    def generate_qr_code_data(self, amount, transaction_id, payer_phone):
        """
        Generate QR code data for payment
        Note: This is a simplified version. Actual QR code generation
        may require additional API calls or widget integration.
        
        Returns:
            dict with qr_data for generating QR code
        """
        qr_data = {
            'amount': str(amount),
            'currency': 'RWF',
            'transaction_id': transaction_id,
            'phone': payer_phone,
            'timestamp': timezone.now().isoformat()
        }
        return qr_data


def initiate_momo_payment(listing_fee, user, phone_number=None):
    """
    Convenience function to initiate MoMo payment for a listing fee
    
    Args:
        listing_fee: ListingFee instance
        user: User instance (vendor making payment)
        phone_number: Optional phone number (if not provided, uses user's profile phone)
        
    Returns:
        dict with payment request result
    """
    momo = MTNMoMoPayment()
    
    # Get phone number from parameter or user profile
    payer_phone = phone_number or user.phone_number or ''
    
    if not payer_phone:
        return {
            'success': False,
            'message': 'Phone number is required for MoMo payment. Please enter your phone number.'
        }
    
    # Format phone number (ensure it's in correct format)
    phone = str(payer_phone).strip()
    if not phone.startswith('250'):
        if phone.startswith('0'):
            phone = '250' + phone[1:]
        elif phone.startswith('+250'):
            phone = phone[1:]
        else:
            phone = '250' + phone
    
    # Generate transaction ID
    transaction_id = f"LISTING-{listing_fee.id}-{uuid.uuid4().hex[:8].upper()}"
    
    # Request payment
    result = momo.request_payment(
        amount=listing_fee.total_amount,
        payer_phone=phone,
        external_id=transaction_id,
        payment_reason=f"Listing fee for {listing_fee.listing.title}"
    )
    
    return result

