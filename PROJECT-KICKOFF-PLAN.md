# MedusaJS Marketplace - Project Kickoff Implementation Plan

**Date**: July 22, 2025  
**Status**: Ready to Execute  
**Timeline**: 8 weeks to MVP

## Current State Analysis

### ✅ Completed
- MedusaJS backend v2.8.7 running
- PostgreSQL & Redis configured
- Basic marketplace module installed
- Integrations ready: Segment, Stripe, S3, SendGrid, MeiliSearch
- Comprehensive PRD documentation

### 🚧 Remaining Tasks
Based on the PRD analysis and current state, here are the critical remaining tasks organized by priority and phase.

## Implementation Phases

### Phase 1: Foundation Setup (Week 1-2) 🚀

#### 1.1 Monorepo Structure Setup
```bash
# Create monorepo structure
npx create-turbo@latest medusajs-marketplace-monorepo
cd medusajs-marketplace-monorepo

# Move existing backend
mv ../medusajs-marketplace apps/backend

# Create app directories
mkdir -p apps/storefront
mkdir -p apps/vendor-portal
mkdir -p apps/operations-hub
mkdir -p apps/admin-extended

# Create package directories
mkdir -p packages/ui
mkdir -p packages/marketplace-core
mkdir -p packages/types
```

#### 1.2 Next.js Storefront Setup
```bash
cd apps
git clone https://github.com/medusajs/nextjs-starter-medusa storefront
cd storefront
npm install
npm install @tanstack/react-query zustand @marketplace/ui @marketplace/types
```

#### 1.3 Shared Packages Creation
```bash
cd ../../packages

# UI Package with shadcn/ui
npx create-turbo@latest ui
cd ui
npx shadcn-ui@latest init
npm install tailwindcss @radix-ui/react-*

# Types Package
cd ../
npx create-turbo@latest types

# Marketplace Core Package
npx create-turbo@latest marketplace-core
```

### Phase 2: Core Marketplace Features (Week 3-4) 💼

#### 2.1 Vendor Type Implementation
**Location**: `apps/backend/src/modules/marketplace/`

```typescript
// Update vendor model with types
export interface Vendor {
  id: string
  type: 'shop' | 'brand' | 'distributor'
  name: string
  handle: string
  commission_tier: 1 | 2 | 3 | 4 // 15%, 18%, 22%, 25%
  capabilities: {
    can_fulfill_orders: boolean
    can_manage_inventory: boolean
    can_set_prices: boolean
    requires_age_verification: boolean
  }
  stripe_account_id?: string
  verification_status: 'pending' | 'approved' | 'suspended'
}
```

#### 2.2 Commission Calculation System
```typescript
// Commission tiers based on PRD
const COMMISSION_TIERS = {
  shop: {
    1: { rate: 0.15, threshold: 0 },        // Bronze: 15%
    2: { rate: 0.18, threshold: 15000 },    // Silver: 18%
    3: { rate: 0.22, threshold: 50000 },    // Gold: 22%
    4: { rate: 0.25, threshold: 50000 }     // Gold: 25%
  },
  brand: {
    platform_fee: {
      starter: 0.10,     // $0 - $100k
      growth: 0.15,      // $100k - $500k
      enterprise: 0.20   // $500k+
    }
  },
  distributor: {
    pioneer: 0.03,       // First 6 months in region
    standard: 0.10,      // Base rate
    volume: {            // Volume discounts
      100000: 0.10,
      250000: 0.07,
      500000: 0.05,
      1000000: 0.03
    }
  }
}
```

#### 2.3 Multi-Vendor Cart Implementation
- Group cart items by vendor
- Calculate shipping per vendor
- Apply commission calculations
- Handle split payments

### Phase 3: Unique Features (Week 5-6) 🎯

#### 3.1 Age Verification Module
```typescript
// Age verification service
export class AgeVerificationService {
  async verifyAge(birthDate: Date, requiredAge: number = 21): Promise<boolean>
  async createSession(customerId: string, verified: boolean): Promise<void>
  async checkProductRestrictions(productId: string): Promise<AgeRestriction>
}
```

#### 3.2 Fulfillment Routing Algorithm
Based on PRD routing criteria:
1. Inventory availability
2. Geographic proximity
3. Hub capacity
4. Delivery time requirements
5. Cost optimization

#### 3.3 Stripe Connect Integration
- Vendor onboarding flow
- Account creation and verification
- Payment splitting implementation
- Commission distribution

### Phase 4: Application Development (Week 7-8) 🖥️

#### 4.1 Vendor Portal
- Shop dashboard (referral tracking, commissions)
- Brand dashboard (inventory, products)
- Distributor dashboard (fulfillment, transfers)

#### 4.2 Operations Hub
- Real-time order monitoring
- Hub management interface
- Performance analytics
- Alert system

## Critical Path Tasks

### Week 1-2: Foundation
- [ ] Set up monorepo with Turborepo
- [ ] Install and customize Next.js Starter
- [ ] Create shared UI components package
- [ ] Set up TypeScript types package

### Week 3-4: Marketplace Core
- [ ] Implement 3 vendor types
- [ ] Build commission calculation engine
- [ ] Create multi-vendor cart logic
- [ ] Set up vendor API endpoints

### Week 5-6: Unique Features
- [ ] Implement age verification system
- [ ] Build fulfillment routing algorithm
- [ ] Integrate Stripe Connect
- [ ] Create vendor onboarding flow

### Week 7-8: Applications
- [ ] Build vendor portal dashboards
- [ ] Create operations hub
- [ ] Implement real-time features
- [ ] Complete integration testing

## Key Implementation Files

### Backend Extensions
```
apps/backend/src/
├── modules/
│   ├── marketplace/
│   │   ├── models/
│   │   │   ├── vendor.ts (extend)
│   │   │   ├── vendor-admin.ts
│   │   │   └── commission.ts (new)
│   │   ├── services/
│   │   │   ├── vendor.service.ts
│   │   │   ├── commission.service.ts (new)
│   │   │   └── stripe-connect.service.ts (new)
│   │   └── workflows/
│   │       ├── vendor-onboarding.ts (new)
│   │       └── commission-calculation.ts (new)
│   ├── age-verification/ (new)
│   │   ├── models/
│   │   ├── services/
│   │   └── api/
│   └── fulfillment-routing/ (new)
│       ├── algorithm.ts
│       └── service.ts
```

### Frontend Applications
```
apps/
├── storefront/ (Next.js Starter customized)
│   ├── app/
│   │   ├── vendors/
│   │   ├── age-verification/
│   │   └── checkout/ (multi-vendor)
│   └── components/
│       ├── marketplace/
│       └── age-gate/
├── vendor-portal/ (new)
│   ├── app/
│   │   ├── [vendorType]/
│   │   ├── dashboard/
│   │   └── onboarding/
│   └── components/
└── operations-hub/ (new)
    ├── app/
    │   ├── orders/
    │   ├── fulfillment/
    │   └── analytics/
    └── components/
```

### Shared Packages
```
packages/
├── ui/
│   ├── src/
│   │   └── components/
│   │       ├── vendor/
│   │       ├── commission/
│   │       └── age-verification/
│   └── package.json
├── marketplace-core/
│   ├── src/
│   │   ├── commission/
│   │   ├── vendor/
│   │   └── fulfillment/
│   └── package.json
└── types/
    ├── src/
    │   ├── vendor.ts
    │   ├── commission.ts
    │   └── order.ts
    └── package.json
```

## Environment Configuration

### Backend (.env additions)
```env
# Stripe Connect
STRIPE_CONNECT_CLIENT_ID=ca_xxx
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_xxx

# Age Verification
AGE_VERIFICATION_ENABLED=true
AGE_VERIFICATION_REQUIRED_AGE=21

# Commission Settings
COMMISSION_PAYOUT_SCHEDULE=weekly
COMMISSION_MINIMUM_PAYOUT=50
```

### Frontend (.env additions)
```env
# Storefront
NEXT_PUBLIC_AGE_VERIFICATION_ENABLED=true
NEXT_PUBLIC_VENDOR_PORTAL_URL=http://localhost:3001

# Vendor Portal
NEXT_PUBLIC_VENDOR_API_URL=http://localhost:9000/vendor
```

## Success Criteria

### Technical Milestones
- [ ] Monorepo builds successfully with shared packages
- [ ] All vendor types can register and onboard
- [ ] Commission calculations match PRD specifications
- [ ] Age verification blocks restricted products
- [ ] Multi-vendor checkout processes payments correctly

### Business Milestones
- [ ] Shop partners can track referrals and commissions
- [ ] Brands can manage inventory and products
- [ ] Distributors can handle fulfillment
- [ ] Operations team has real-time visibility

## Risk Mitigation

### Technical Risks
1. **Stripe Connect complexity**: Start with test mode, implement incrementally
2. **Real-time performance**: Use Redis pub/sub, implement caching
3. **Commission accuracy**: Extensive unit testing, audit logs

### Business Risks
1. **Vendor adoption**: Attractive onboarding incentives (3-month gold tier)
2. **Commission disputes**: Clear reporting, transparent calculations
3. **Compliance**: Age verification audit trail, geographic restrictions

## Next Immediate Steps

1. **Today**: Set up monorepo structure
2. **Tomorrow**: Install Next.js Starter and begin customization
3. **This Week**: Create shared packages and vendor types
4. **Next Week**: Implement commission system and age verification

This plan provides a clear 8-week path to MVP launch, leveraging the hybrid approach with existing MedusaJS backend and proven frontend solutions.