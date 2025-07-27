# AI Agents Context Guide

## Project Overview
This is a MedusaJS v2 multi-vendor marketplace with three frontend applications. The system supports three vendor types (Shop Partners, Brand Partners, Distributor Partners) with commission-based revenue sharing.

## Current Implementation Status

### ✅ Implemented Features
- **Multi-vendor marketplace module** with vendor management
- **Stripe Connect integration** for vendor onboarding and payment splitting
- **Smart fulfillment routing** algorithm with multi-factor scoring
- **Age verification module** for restricted products
- **Multi-vendor cart** functionality
- **Vendor authentication** system
- **Database schema** with vendor relationships

### 🚧 Partially Implemented
- **Segment analytics** - Configuration exists but not integrated
- **S3 file storage** - Configuration template exists
- **SendGrid email** - Configuration template exists
- **MeiliSearch** - Configuration template exists

### ❌ Not Implemented
- Real-time features (Socket.io)
- Delivery driver management module
- Advanced analytics dashboards

## Project Structure

```
/
├── monorepo-setup/
│   ├── marketplace-backend-fresh/     # MedusaJS v2 backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── marketplace/      # Core vendor management
│   │   │   │   └── age_verification/ # Age gate functionality
│   │   │   ├── api/                  # Custom endpoints
│   │   │   └── scripts/              # Seed and test scripts
│   │   └── medusa-config.ts
│   └── medusajs-marketplace-monorepo/  # Frontend apps
│       └── apps/
│           ├── storefront/            # Next.js customer store
│           ├── vendor-portal/         # Vendor dashboard
│           └── operations-hub/        # Admin operations
├── prd-docs/                          # Product requirements (11 sections)
└── docs/                              # Implementation documentation
```

## Key Technical Details

### Backend (MedusaJS v2)
- **Database**: PostgreSQL (remote: 146.190.116.149)
- **Cache**: Redis (remote: 146.190.116.149)
- **Authentication**: JWT-based with vendor context
- **API**: RESTful with `/admin`, `/store`, and custom vendor endpoints

### Frontend Applications
- **Framework**: Next.js 14 with App Router
- **Ports**: Storefront (3000), Vendor Portal (3001), Operations Hub (3002)
- **State Management**: Zustand
- **UI**: Tailwind CSS + shadcn/ui

### Environment Variables
Key variables needed:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `JWT_SECRET` - Authentication secret
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - Frontend API key

## Working with this Codebase

### Common Tasks

1. **Start the backend**:
   ```bash
   cd monorepo-setup/marketplace-backend-fresh
   npm run dev
   ```

2. **Start frontend apps**:
   ```bash
   cd monorepo-setup/medusajs-marketplace-monorepo
   npm run dev  # Starts all three apps
   ```

3. **Run seeds**:
   ```bash
   npm run seed              # Basic data
   npm run seed:vendors      # Vendor data
   npm run seed:fulfillment  # Fulfillment locations
   ```

### Key Modules to Understand

1. **Marketplace Module** (`src/modules/marketplace/`)
   - Vendor management and relationships
   - Commission calculations
   - Stripe Connect integration

2. **Fulfillment Routing** (`src/modules/marketplace/services/fulfillment-routing.ts`)
   - Smart algorithm for order routing
   - Multi-factor scoring system

3. **Vendor Authentication** (`src/utils/vendor-auth.ts`)
   - JWT-based vendor context
   - Middleware for vendor endpoints

### Testing Credentials
- Admin: `admin@medusa.com` / `medusa123`
- Database is pre-seeded with test vendors and products

## Important Considerations

1. **Stripe Keys**: Currently using live keys - should switch to test keys for development
2. **Remote Database**: Using a shared remote PostgreSQL instance
3. **Publishable Key**: Must match between backend and frontend
4. **CORS**: Configured for localhost development

## PRD vs Implementation
The PRD in `/prd-docs/` is comprehensive but not all features are implemented. Current focus has been on core marketplace functionality, vendor management, and order fulfillment.