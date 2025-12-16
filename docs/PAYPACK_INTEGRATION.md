# Paypack Payment Integration

This document describes the Paypack payment integration that replaces the previous MoMo payment system.

## Overview

The checkout page payment system has been migrated from MTN MoMo to Paypack. Paypack is a mobile money payment gateway that supports cash-in transactions (customers paying merchants).

## Changes Made

### 1. New Paypack Payment Module
- **File**: `authentication/paypack_payment.py`
- Implements Paypack SDK integration using `paypack-py` package
- Handles payment requests, status checks, and account information
- Main class: `PaypackPayment`
- Convenience function: `initiate_paypack_payment()`

### 2. Settings Configuration
- **File**: `InzuLink/settings.py`
- Added Paypack credentials:
  - `PAYPACK_CLIENT_ID`: Your Paypack client ID
  - `PAYPACK_CLIENT_SECRET`: Your Paypack client secret
- Set these via environment variables or directly in settings

### 3. Views Updated
- **File**: `authentication/views.py`
- `pay_listing_fee()`: Now uses Paypack instead of MoMo
- `check_payment_status()`: Updated to check Paypack payment status
- Payment flow: Sends payment request → User approves on phone → Status checked → Listing activated

### 4. Forms Updated
- **File**: `authentication/forms.py`
- `ListingFeePaymentForm`: Updated phone number field to accept both formats (0788123456 or 250788123456)
- Help text updated to reference Paypack instead of MoMo

### 5. Templates Updated
- **File**: `authentication/templates/authentication/pay_listing_fee.html`
- Changed payment method option from "MTN MoMo" to "Paypack"
- Updated all UI text and JavaScript to reference Paypack
- Payment info section explains Paypack payment flow

### 6. Models Updated
- **File**: `authentication/models.py`
- `Purchase.PAYMENT_METHOD_CHOICES`: Changed from 'momo' to 'paypack'
- `ListingFee`: Reusing `momo_transaction_id` and `momo_status` fields for Paypack (backward compatibility)
- Updated help text to reference Paypack

### 7. Requirements
- **File**: `requirements.txt`
- Added `paypack-py` package

## Installation

1. Install the Paypack Python SDK:
```bash
pip install paypack-py
```

2. Configure Paypack credentials in your environment or settings:
```python
PAYPACK_CLIENT_ID = 'your_client_id'
PAYPACK_CLIENT_SECRET = 'your_client_secret'
```

## Payment Flow

1. User selects "Paypack" payment method on checkout page
2. User enters phone number (format: 0788123456 or 250788123456)
3. User clicks "Pay with Paypack"
4. System sends payment request via Paypack SDK (`cashin` method)
5. User receives payment prompt on their phone
6. User approves payment on phone
7. System checks payment status via Events API
8. When payment is confirmed, listing is activated automatically

## Paypack SDK Usage

The integration uses the following Paypack SDK components:

- **HttpClient**: Initializes the Paypack client with credentials
- **Transaction.cashin()**: Initiates payment from customer
- **Event.list()**: Checks transaction status
- **Oauth**: Handles authentication (automatic via SDK)
- **Merchant.me()**: Gets account information

## API Response Format

Paypack cashin response:
```json
{
  "amount": 1000,
  "created_at": "2005-11-09T21:19:07.459Z",
  "kind": "CASHIN",
  "ref": "d0bb2807-1d52-4795-b373-3feaf63dceb1",
  "status": "pending"
}
```

## Phone Number Format

Paypack accepts phone numbers in local format (0788123456). The integration:
- Accepts both formats: 0788123456 or 250788123456
- Converts international format (250...) to local format (0...) for Paypack API
- Validates phone number format before submission

## Status Checking

Payment status is checked using the Events API:
- Status can be: `pending`, `successful`, `failed`
- System polls for status updates after payment request
- When status becomes `successful`, listing is activated

## Backward Compatibility

The `ListingFee` model reuses the `momo_transaction_id` and `momo_status` fields for Paypack transactions to avoid database migrations. The field names remain the same but now store Paypack transaction data.

## Testing

1. Set up Paypack sandbox/test credentials
2. Test payment flow with a test phone number
3. Verify payment status checking works
4. Confirm listing activation after successful payment

## Migration Notes

- Old MoMo payment records will still have `payment_method='momo'` in the database
- New payments will use `payment_method='paypack'`
- The `momo_transaction_id` field now stores Paypack transaction references
- Consider running a data migration if you want to rename fields (optional)

## Support

For Paypack SDK documentation, visit: https://docs.paypack.rw/sdk/python/

