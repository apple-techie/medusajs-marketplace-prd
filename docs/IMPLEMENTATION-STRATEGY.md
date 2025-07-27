# Implementation Strategy - Hybrid Approach

**Last Updated**: July 22, 2025  
**Strategy**: Next.js Starter + Mercur Components + Custom Features

## Overview

This document outlines the updated implementation strategy using a hybrid approach that combines:
- **MedusaJS Next.js Starter** as the customer storefront base
- **Mercur marketplace components** for vendor-specific features
- **Custom development** for unique business requirements

## Architecture Overview

```
medusajs-marketplace/
├── apps/
│   ├── backend/              # MedusaJS v2 backend (existing)
│   ├── storefront/           # Next.js Starter (customer-facing)
│   ├── vendor-portal/        # Mercur-inspired vendor dashboard
│   ├── admin/                # Extended MedusaJS admin
│   ├── operations-hub/       # Custom Next.js app
│   └── driver-app/           # React Native mobile app
├── packages/
│   ├── ui/                   # Shared shadcn/ui components
│   ├── marketplace-core/     # Vendor logic adapted from Mercur
│   ├── types/                # Shared TypeScript definitions
│   └── utils/                # Shared utilities
└── integrations/
    ├── segment/              # Analytics (completed)
    ├── stripe/               # Payment processing
    ├── s3/                   # File storage
    ├── sendgrid/             # Email notifications
    └── meilisearch/          # Search functionality
```

## Implementation Phases

### Phase 1: Foundation Setup (Weeks 1-2)

#### 1.1 Storefront Setup
```bash
# Clone and customize Next.js Starter
cd apps
git clone https://github.com/medusajs/nextjs-starter-medusa storefront
cd storefront
npm install

# Install additional dependencies
npm install @tanstack/react-query zustand shadcn-ui
```

#### 1.2 Mercur Analysis
```bash
# Clone Mercur for reference
cd ../
git clone https://github.com/rigbyjs/mercur mercur-reference

# Extract key components:
# - Vendor registration flow
# - Vendor dashboard structure
# - Order splitting logic
# - Multi-vendor cart handling
```

#### 1.3 Shared Packages Setup
```bash
# Create shared packages
cd ../../packages
npx create-turbo@latest ui
npx create-turbo@latest marketplace-core
npx create-turbo@latest types
```

### Phase 2: Core Marketplace Features (Weeks 3-4)

#### 2.1 Adapt Next.js Starter
- Add vendor information to product displays
- Implement multi-vendor cart grouping
- Customize checkout for vendor-specific shipping
- Add marketplace-specific search filters

#### 2.2 Integrate Mercur Concepts
- Port vendor management logic
- Adapt for three vendor types (Shop, Brand, Distributor)
- Implement commission calculation (15-25% tiers)
- Create vendor-specific order views

#### 2.3 Custom Vendor Types
```typescript
// packages/types/src/vendor.ts
export interface Vendor {
  id: string
  type: 'shop' | 'brand' | 'distributor'
  name: string
  handle: string
  commission_tier: 1 | 2 | 3 | 4 // 15%, 18%, 22%, 25%
  capabilities: VendorCapabilities
  stripe_account_id?: string
  verification_status: 'pending' | 'approved' | 'suspended'
}

export interface VendorCapabilities {
  can_fulfill_orders: boolean
  can_manage_inventory: boolean
  can_set_prices: boolean
  can_create_promotions: boolean
  requires_age_verification: boolean
}
```

### Phase 3: Unique Features (Weeks 5-6)

#### 3.1 Age Verification System
- Implement age gate modal
- Create verification service
- Add session management
- Integrate with product restrictions

#### 3.2 Delivery Network
- Build driver management system
- Implement real-time tracking
- Create delivery assignment logic
- Add proof of delivery features

#### 3.3 Operations Hub
- Develop operations dashboard
- Add multi-hub management
- Implement routing algorithm
- Create performance monitoring

### Phase 4: Vendor Portals (Weeks 7-8)

#### 4.1 Shop Partner Portal
- Referral link management
- Commission tracking
- Performance analytics
- Marketing tools

#### 4.2 Brand Partner Portal
- Inventory management
- Product catalog control
- Order fulfillment interface
- Brand analytics

#### 4.3 Distributor Portal
- Multi-brand inventory
- Hub management
- Transfer requests
- Fulfillment operations

## Technology Decisions

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io client

### Shared Components
```typescript
// packages/ui/src/components/marketplace/
├── VendorCard.tsx
├── VendorBadge.tsx
├── CommissionDisplay.tsx
├── AgeVerificationModal.tsx
├── DeliveryTracker.tsx
├── MultiVendorCart.tsx
└── VendorRating.tsx
```

### API Integration Strategy
```typescript
// packages/marketplace-core/src/api/
├── vendors.ts         // Vendor management APIs
├── commissions.ts     // Commission calculation
├── fulfillment.ts     // Order routing logic
├── delivery.ts        // Delivery network APIs
└── analytics.ts       // Performance tracking
```

## Key Customizations

### 1. Product Display Enhancement
```typescript
// apps/storefront/src/components/products/product-info.tsx
import { VendorBadge } from '@marketplace/ui'

export function ProductInfo({ product }) {
  return (
    <div>
      <h1>{product.title}</h1>
      <VendorBadge 
        vendor={product.vendor}
        showRating={true}
        showFulfillmentLocation={true}
      />
      {/* Rest of product info */}
    </div>
  )
}
```

### 2. Multi-Vendor Cart
```typescript
// apps/storefront/src/components/cart/multi-vendor-cart.tsx
export function MultiVendorCart({ cart }) {
  const groupedItems = groupItemsByVendor(cart.items)
  
  return (
    <div>
      {groupedItems.map(group => (
        <VendorCartSection
          key={group.vendor.id}
          vendor={group.vendor}
          items={group.items}
          shipping={group.shipping_options}
        />
      ))}
    </div>
  )
}
```

### 3. Age Verification Wrapper
```typescript
// apps/storefront/src/components/age-verification/age-gate.tsx
export function AgeGate({ requiredAge = 21, children }) {
  const { isVerified, verify } = useAgeVerification()
  
  if (!isVerified) {
    return <AgeVerificationModal onVerify={verify} requiredAge={requiredAge} />
  }
  
  return children
}
```

## Integration Points

### With Existing Backend
- Use existing marketplace module
- Connect to vendor management APIs
- Integrate commission calculation
- Utilize order splitting logic

### With Mercur Components
- Vendor registration flow
- Dashboard layouts
- Order management UI
- Shipping configuration

### Custom Additions
- Age verification middleware
- Delivery tracking system
- Operations monitoring
- Advanced analytics

## Development Workflow

### 1. Component Development
```bash
# Develop in isolation
cd packages/ui
npm run storybook

# Test components
npm run test
```

### 2. Feature Development
```bash
# Work on specific app
cd apps/storefront
npm run dev

# Test with backend
cd ../../
npm run dev:all
```

### 3. Integration Testing
```bash
# Run e2e tests
npm run test:e2e

# Test marketplace flows
npm run test:marketplace
```

## Deployment Strategy

### 1. Monorepo Structure
- Use Turborepo for build optimization
- Implement shared caching
- Set up parallel builds

### 2. Environment Configuration
```env
# Apps specific configs
NEXT_PUBLIC_MEDUSA_BACKEND_URL=
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_SEARCH_ENDPOINT=

# Shared configs
MARKETPLACE_COMMISSION_SERVICE_URL=
AGE_VERIFICATION_SERVICE_URL=
DELIVERY_TRACKING_SERVICE_URL=
```

### 3. CI/CD Pipeline
- Automated testing for all apps
- Progressive deployment
- Feature flag management
- Performance monitoring

## Success Metrics

### Development Efficiency
- 3-4 months saved vs. building from scratch
- Reusable components across apps
- Consistent user experience

### Technical Goals
- <3s page load time
- 99.9% uptime
- <200ms API response time
- Real-time order tracking

### Business Objectives
- Support 1000+ vendors
- Handle 10,000+ daily orders
- Scale to multiple regions
- Maintain platform flexibility

## Risk Mitigation

### Technical Risks
- **Mercur compatibility**: Extract concepts, don't depend directly
- **Customization complexity**: Use composition over modification
- **Performance at scale**: Implement caching and optimization early

### Business Risks
- **Vendor onboarding**: Streamline with adapted Mercur flows
- **Commission accuracy**: Extensive testing of calculation logic
- **Compliance**: Build age verification from day one

## Next Steps

1. **Week 1**: Set up monorepo and install base dependencies
2. **Week 2**: Analyze Mercur and extract reusable patterns
3. **Week 3**: Begin storefront customization
4. **Week 4**: Implement vendor management features
5. **Week 5**: Add unique marketplace features
6. **Week 6**: Build vendor portals
7. **Week 7-8**: Integration testing and optimization

This hybrid approach leverages the best of existing solutions while maintaining flexibility for your unique marketplace requirements.