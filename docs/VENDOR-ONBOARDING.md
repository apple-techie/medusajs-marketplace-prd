# Vendor Onboarding with Stripe Connect

## Overview

The vendor onboarding system provides a comprehensive workflow for new vendors to join the marketplace. It includes:
- Business information collection
- Address verification
- Tax information
- Stripe Connect integration for automated payments
- Business verification (optional)

## Onboarding Steps

### 1. Basic Information
- Business name and description
- Contact information
- Website URL

### 2. Address Verification
- Physical business address
- Required for Stripe Connect and shipping

### 3. Tax Information
- Tax ID/EIN collection
- Required for 1099 reporting

### 4. Stripe Connect Setup
- Automated account creation
- Bank account connection
- Identity verification
- Terms of Service acceptance

### 5. Business Verification (Optional)
- Additional documentation upload
- Enhanced trust for customers

## API Endpoints

### Vendor Onboarding APIs

#### Get Onboarding Status
```
GET /vendor/onboarding
Authorization: Bearer {vendor_token}

Response:
{
  "onboarding": {
    "vendor_id": "vendor_123",
    "overall_status": "in_progress", // not_started | in_progress | completed | blocked
    "steps": [
      {
        "step": "basic_information",
        "completed": true,
        "required": true,
        "description": "Complete basic business information"
      },
      {
        "step": "stripe_connect",
        "completed": false,
        "required": true,
        "description": "Complete Stripe Connect setup for payments"
      }
    ],
    "stripe_onboarding_url": "https://connect.stripe.com/...",
    "blockers": ["Stripe requirements pending: individual.id_number"]
  }
}
```

#### Start Onboarding
```
POST /vendor/onboarding
Authorization: Bearer {vendor_token}

Response:
{
  "onboarding": { /* status object */ },
  "message": "Onboarding started successfully"
}
```

#### Complete Onboarding Step
```
POST /vendor/onboarding/{step}
Authorization: Bearer {vendor_token}

// For basic_information
{
  "description": "Premium electronics retailer",
  "website": "https://example.com",
  "contact_email": "support@example.com",
  "contact_phone": "+1-555-0123"
}

// For address_verification
{
  "address_line_1": "123 Main St",
  "address_line_2": "Suite 100",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country_code": "US"
}

// For tax_information
{
  "tax_id": "12-3456789"
}
```

#### Get Stripe Connect Link
```
GET /vendor/onboarding/stripe
Authorization: Bearer {vendor_token}

Response:
{
  "stripe_onboarding_url": "https://connect.stripe.com/express/onboarding/...",
  "vendor_id": "vendor_123"
}
```

#### Handle Stripe Return
```
POST /vendor/onboarding/stripe/return
Authorization: Bearer {vendor_token}

Response:
{
  "onboarding": { /* updated status */ },
  "message": "Stripe Connect status updated",
  "vendor_active": true
}
```

### Stripe Dashboard Access
```
GET /vendor/stripe-dashboard
Authorization: Bearer {vendor_token}

Response:
{
  "stripe_dashboard_url": "https://connect.stripe.com/express/...",
  "created": 1234567890,
  "expires_at": "2024-01-01T12:00:00Z"
}
```

## Stripe Connect Integration

### Account Types
The system uses **Stripe Express** accounts which provide:
- Simplified onboarding flow
- Stripe-hosted dashboard
- Automated tax reporting
- Platform handles compliance

### Capabilities
- Card payments
- Bank transfers
- Automated payouts

### Commission Handling
When an order is placed:
1. Customer pays full amount to platform
2. Platform calculates commission based on vendor type/tier
3. Platform transfers net amount to vendor via Stripe Connect
4. Vendor receives payout based on their payout schedule

### Webhook Events
The system handles these Stripe Connect webhooks:
- `account.updated` - Updates vendor status
- `account.application.deauthorized` - Handles disconnection
- `payout.paid` - Tracks successful payouts
- `payout.failed` - Handles payout failures

## Environment Variables

Required for Stripe Connect:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...
VENDOR_PORTAL_URL=http://localhost:3001
```

## Testing

### Test Stripe Connect Flow
1. Create a vendor account
2. Start onboarding: `POST /vendor/onboarding`
3. Complete basic steps
4. Get Stripe link: `GET /vendor/onboarding/stripe`
5. Complete Stripe onboarding (use test data)
6. Return to platform: `POST /vendor/onboarding/stripe/return`
7. Verify vendor is activated

### Test Data for Stripe
- Test routing number: 110000000
- Test account number: 000123456789
- Test SSN: 000-00-0000
- Test phone: (000) 000-0000

## Security Considerations

1. **Authentication**: All vendor endpoints require valid JWT token
2. **Webhook Validation**: Stripe signatures verified on all webhooks
3. **Data Protection**: Sensitive data (SSN, bank info) stored only in Stripe
4. **PCI Compliance**: Platform never handles card details directly
5. **Account Isolation**: Each vendor has isolated Stripe Connect account

## Next Steps

1. **Email Notifications**: Send emails at each onboarding step
2. **Document Upload**: Support for business verification documents
3. **Multi-Currency**: Support international vendors
4. **Custom Payout Schedules**: Allow vendors to set payout frequency
5. **Advanced Reporting**: Vendor-specific financial reports