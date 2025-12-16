"""
Paypack Payment Integration for Rwanda
Handles payment requests, status checks, and callbacks using Paypack SDK
"""
import uuid
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

try:
    from paypack.client import HttpClient
    from paypack.transactions import Transaction
    from paypack.oauth2 import Oauth
    from paypack.events import Event
    PAYPACK_AVAILABLE = True
except ImportError:
    PAYPACK_AVAILABLE = False
    logger.warning("paypack-py package not installed. Please install it with: pip install paypack-py")


class PaypackPayment:
    """
    Paypack Payment Handler for Rwanda
    Uses Paypack SDK to process cash-in transactions (customer payments)
    
    Based on Paypack Python SDK documentation:
    - Uses client_id and client_secret for authentication
    - Supports cashin (customer pays) and cashout (merchant pays) transactions
    - Transaction status can be checked via events API
    """
    
    def __init__(self):
        """Initialize Paypack payment with credentials from settings"""
        if not PAYPACK_AVAILABLE:
            raise ImportError("paypack-py package is not installed. Install it with: pip install paypack-py")
        
        # Get credentials from settings
        self.client_id = getattr(settings, 'PAYPACK_CLIENT_ID', '')
        self.client_secret = getattr(settings, 'PAYPACK_CLIENT_SECRET', '')
        
        if not self.client_id or not self.client_secret:
            logger.warning("Paypack credentials not configured in settings")
        
        # Initialize Paypack client
        try:
            self.client = HttpClient(client_id=self.client_id, client_secret=self.client_secret)
            self.transaction = Transaction(client=self.client)
            self.oauth = Oauth(client=self.client)
            self.event = Event(client=self.client)
        except Exception as e:
            logger.error(f"Failed to initialize Paypack client: {str(e)}")
            raise
    
    def request_payment(self, amount, phone_number, external_id=None, payment_reason="Listing Fee Payment"):
        """
        Request payment from a customer using Paypack cashin
        
        Args:
            amount: Payment amount in RWF (Decimal or float)
            phone_number: Customer's phone number (format: 078xxxxxxx or 250788xxxxxx)
            external_id: Unique transaction ID (auto-generated if not provided)
            payment_reason: Description of the payment
            
        Returns:
            dict with keys: success, transaction_id, status, message, ref
        """
        try:
            # Format phone number (Paypack expects format like 078xxxxxxx)
            phone = str(phone_number).strip()
            # Remove country code if present and convert to local format
            if phone.startswith('250'):
                phone = '0' + phone[3:]  # Convert 250788123456 to 0788123456
            elif phone.startswith('+250'):
                phone = '0' + phone[4:]  # Convert +250788123456 to 0788123456
            # Ensure it starts with 0
            if not phone.startswith('0'):
                phone = '0' + phone
            
            # Convert amount to integer (Paypack expects integer)
            amount_int = int(Decimal(str(amount)))
            
            # Generate external ID if not provided
            if not external_id:
                external_id = f"LISTING-{uuid.uuid4().hex[:8].upper()}"
            
            # Request payment using cashin
            logger.info(f"Initiating Paypack cashin: amount={amount_int}, phone={phone}, ref={external_id}")
            cashin_response = self.transaction.cashin(amount=amount_int, phone_number=phone)
            
            # Parse response
            if cashin_response and isinstance(cashin_response, dict):
                ref = cashin_response.get('ref', external_id)
                status = cashin_response.get('status', 'pending')
                created_at = cashin_response.get('created_at')
                
                logger.info(f"Paypack cashin response: ref={ref}, status={status}")
                
                return {
                    'success': True,
                    'transaction_id': ref,
                    'ref': ref,
                    'status': status.upper() if status else 'PENDING',
                    'message': 'Payment request sent successfully. Please approve on your phone.',
                    'reference_id': ref,
                    'created_at': created_at,
                    'amount': cashin_response.get('amount', amount_int),
                    'kind': cashin_response.get('kind', 'CASHIN')
                }
            else:
                logger.error(f"Unexpected Paypack response format: {cashin_response}")
                return {
                    'success': False,
                    'transaction_id': external_id,
                    'status': 'FAILED',
                    'message': 'Unexpected response from Paypack API'
                }
                
        except Exception as e:
            logger.error(f"Error requesting Paypack payment: {str(e)}")
            return {
                'success': False,
                'message': f'An error occurred: {str(e)}'
            }
    
    def check_payment_status(self, transaction_ref):
        """
        Check the status of a payment transaction using Events API
        
        Args:
            transaction_ref: The transaction reference (ref) from cashin response
            
        Returns:
            dict with keys: success, status, message, data
            Status can be: pending, successful, failed
        """
        try:
            # Use Events API to check transaction status
            # Check for cashin events with the transaction ref
            events_response = self.event.list(kind='cashin', limit=100, offset=0)
            
            if events_response and isinstance(events_response, dict):
                transactions = events_response.get('transactions', [])
                
                # Find the transaction with matching ref
                for transaction in transactions:
                    event_data = transaction.get('data', {})
                    if event_data.get('ref') == transaction_ref:
                        status = event_data.get('status', 'pending')
                        return {
                            'success': True,
                            'status': status.upper() if status else 'PENDING',
                            'message': f'Payment status: {status}',
                            'data': event_data
                        }
                
                # Transaction not found in events yet (might still be pending)
                return {
                    'success': True,
                    'status': 'PENDING',
                    'message': 'Transaction is still pending. Please wait for confirmation.'
                }
            else:
                logger.warning(f"Unexpected events response format: {events_response}")
                return {
                    'success': False,
                    'status': 'UNKNOWN',
                    'message': 'Could not check payment status'
                }
                
        except Exception as e:
            logger.error(f"Error checking Paypack payment status: {str(e)}")
            return {
                'success': False,
                'status': 'UNKNOWN',
                'message': f'Error checking status: {str(e)}'
            }
    
    def get_account_info(self):
        """
        Get merchant account information
        
        Returns:
            dict with account information including balance
        """
        try:
            from paypack.merchant import Merchant
            merchant = Merchant(client=self.client)
            account_info = merchant.me()
            return {
                'success': True,
                'data': account_info
            }
        except Exception as e:
            logger.error(f"Error getting account info: {str(e)}")
            return {
                'success': False,
                'message': f'Error getting account info: {str(e)}'
            }


def initiate_paypack_payment(listing_fee, user, phone_number=None):
    """
    Convenience function to initiate Paypack payment for a listing fee
    
    Args:
        listing_fee: ListingFee instance
        user: User instance (vendor making payment)
        phone_number: Optional phone number (if not provided, uses user's profile phone)
        
    Returns:
        dict with payment request result
    """
    try:
        paypack = PaypackPayment()
    except ImportError as e:
        return {
            'success': False,
            'message': 'Paypack SDK not available. Please install paypack-py package.'
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'Failed to initialize Paypack: {str(e)}'
        }
    
    # Get phone number from parameter or user profile
    payer_phone = phone_number or user.phone_number or ''
    
    if not payer_phone:
        return {
            'success': False,
            'message': 'Phone number is required for Paypack payment. Please enter your phone number.'
        }
    
    # Generate transaction ID
    transaction_id = f"LISTING-{listing_fee.id}-{uuid.uuid4().hex[:8].upper()}"
    
    # Request payment
    result = paypack.request_payment(
        amount=listing_fee.total_amount,
        phone_number=payer_phone,
        external_id=transaction_id,
        payment_reason=f"Listing fee for {listing_fee.listing.title}"
    )
    
    return result

