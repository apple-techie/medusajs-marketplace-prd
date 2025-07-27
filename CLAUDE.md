# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A multi-vendor marketplace implementation using MedusaJS v2 backend with three Next.js frontend applications. The system supports three vendor types (Shop Partners, Brand Partners, Distributor Partners) with commission-based revenue sharing and smart fulfillment routing.

## Architecture Overview

### Backend Architecture (MedusaJS v2)

The backend extends MedusaJS with custom modules located in `monorepo-setup/marketplace-backend-fresh/`:

- **Marketplace Module** (`src/modules/marketplace/`): Core vendor management system
  - Vendor entity with types: shop_partner, brand_partner, distributor_partner
  - Commission tracking with tier-based calculations (15-25%)
  - Stripe Connect integration for vendor payouts
  - Smart fulfillment routing algorithm with multi-factor scoring

- **Age Verification Module** (`src/modules/age_verification/`): Product access control
  - Configurable age gates (18+/21+)
  - Session-based verification

### Frontend Architecture (Next.js 14)

Three applications in `monorepo-setup/medusajs-marketplace-monorepo/apps/`:

1. **Storefront** (port 3000): Customer-facing shopping experience
2. **Vendor Portal** (port 3001): Vendor dashboard and management
3. **Operations Hub** (port 3002): Admin operations center

## Development Commands

### Backend Development
```bash
cd monorepo-setup/marketplace-backend-fresh

# Core commands
npm run dev                    # Start development server (port 9000)
npm run build                  # Production build
npm run seed                   # Basic seed data
npm run seed:marketplace       # Comprehensive marketplace data
npm run seed:fulfillment      # Fulfillment locations and rules
npm run seed:order            # Test order creation

# Testing
npm run test:routing          # Test fulfillment routing algorithm
npm run test:unit             # Unit tests
npm run test:integration:http # HTTP integration tests
```

### Frontend Development
```bash
cd monorepo-setup/medusajs-marketplace-monorepo

# Run all apps
npm run dev                   # All three apps in parallel

# Run individual apps
npm run dev:storefront        # Customer storefront only
npm run dev:vendor           # Vendor portal only  
npm run dev:ops              # Operations hub only

# Other commands
npm run build                # Build all apps
npm run lint                 # Lint all apps
npm run check-types          # TypeScript validation
```

### Stripe Webhook Development
```bash
# Terminal 1: Forward webhooks to local
stripe listen --forward-to localhost:9000/webhooks/stripe

# Terminal 2: Forward Connect webhooks
stripe listen --forward-to localhost:9000/webhooks/stripe-connect \
  --events account.updated,account.application.authorized
```

## Key Implementation Details

### Database Schema

The marketplace extends MedusaJS with these key entities:
- **Vendor**: Core vendor entity with Stripe integration
- **VendorProduct**: Links products to vendors with commission rates
- **FulfillmentLocation**: Vendor warehouse/store locations
- **FulfillmentRoutingRule**: Smart routing configuration

### API Endpoints

Custom endpoints in `src/api/`:
- `/admin/vendors/*` - Vendor management (admin only)
- `/store/vendors/*` - Public vendor endpoints
- `/webhooks/stripe-connect` - Stripe Connect webhooks
- `/admin/vendors/commission-report` - Commission analytics

### Authentication Flow

1. Admin users authenticate via `/auth/admin/emailpass`
2. Vendors receive JWT tokens with vendor context
3. Vendor endpoints validate ownership through middleware

### Fulfillment Routing Algorithm

Located in `src/modules/marketplace/services/fulfillment-routing.ts`:
- Multi-factor scoring: distance (30%), inventory (25%), vendor priority (20%), cost (15%), reliability (10%)
- Supports split fulfillment across multiple vendors
- Configurable routing rules per vendor/product

### Environment Configuration

Key environment variables:
```bash
# Database (Remote PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Stripe (Currently using live keys - switch to test for dev)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

## Testing Approach

### Backend Testing
- Unit tests for business logic (commission calculations, routing)
- Integration tests for API endpoints
- Routing algorithm tests with various scenarios

### Manual Testing Credentials
- Admin: `admin@medusa.com` / `medusa123`
- Test vendors created via seed scripts

## Critical Business Logic

### Commission Calculation
- Shop Partners: 15-25% based on monthly revenue tiers
- Brand Partners: Fixed commission rates
- Distributor Partners: Volume-based pricing

### Order Fulfillment Flow
1. Order placed with items from multiple vendors
2. Routing algorithm determines optimal fulfillment
3. Order split into vendor-specific fulfillments
4. Each vendor processes their items
5. Commission calculated post-delivery

### Vendor Onboarding
1. Admin creates vendor account
2. Vendor completes Stripe Connect onboarding
3. System webhooks update vendor status
4. Vendor gains access to portal

## Module Dependencies

When modifying the marketplace module:
1. Run migrations after model changes
2. Update TypeORM entities in `src/modules/marketplace/models/`
3. Regenerate types if needed
4. Test with seed scripts

## Known Integration Points

- **Stripe Connect**: Vendor payouts and onboarding
- **PostgreSQL**: Remote database at 146.190.116.149
- **Redis**: Remote cache at same host
- **Frontend Apps**: Require correct publishable key