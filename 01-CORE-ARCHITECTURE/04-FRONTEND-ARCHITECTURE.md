# Frontend Architecture - Hybrid Approach

## Overview

The frontend architecture adopts a hybrid approach combining the MedusaJS Next.js Starter for the customer storefront with Mercur marketplace components for vendor-specific features. This strategy provides a solid e-commerce foundation while enabling marketplace functionality.

## Architecture Principles

### 1. Component-Based Architecture
- Shared UI components across all applications
- Consistent design system implementation
- Reusable marketplace-specific components

### 2. Monorepo Structure
```
medusajs-marketplace/
├── apps/
│   ├── storefront/           # Customer-facing (Next.js Starter base)
│   ├── vendor-portal/        # Vendor dashboard (Mercur-inspired)
│   ├── admin/                # Extended MedusaJS admin
│   ├── operations-hub/       # Operations management
│   └── driver-app/           # Mobile delivery app
└── packages/
    ├── ui/                   # Shared components
    ├── marketplace-core/     # Business logic
    └── types/                # TypeScript definitions
```

### 3. Technology Stack
- **Base**: Next.js 14 with App Router
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query
- **Real-time**: Socket.io for live updates
- **Forms**: React Hook Form + Zod validation

## Application Architecture

### Customer Storefront
**Base**: MedusaJS Next.js Starter

**Key Customizations**:
- Multi-vendor product display
- Vendor storefront pages
- Age verification system
- Multi-vendor cart handling
- Enhanced search with vendor filters

**Structure**:
```
apps/storefront/
├── app/
│   ├── (main)/
│   │   ├── products/
│   │   ├── vendors/
│   │   ├── cart/
│   │   └── checkout/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── api/
├── components/
│   ├── marketplace/      # Custom marketplace components
│   ├── age-verification/
│   └── vendor/
└── lib/
    ├── data/            # API integration
    └── hooks/           # Custom hooks
```

### Vendor Portal
**Base**: Mercur vendor dashboard concepts

**Vendor Types**:
1. **Shop Partners**: Referral management
2. **Brand Partners**: Inventory control
3. **Distributor Partners**: Multi-brand fulfillment

**Structure**:
```
apps/vendor-portal/
├── app/
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   ├── analytics/
│   └── settings/
├── components/
│   ├── shop/           # Shop-specific
│   ├── brand/          # Brand-specific
│   └── distributor/    # Distributor-specific
└── lib/
    └── vendor-api/
```

### Operations Hub
**Purpose**: Central command for marketplace operations

**Features**:
- Real-time order monitoring
- Multi-hub management
- Routing optimization
- Performance analytics

**Structure**:
```
apps/operations-hub/
├── app/
│   ├── dashboard/
│   ├── orders/
│   ├── fulfillment/
│   ├── transfers/
│   └── analytics/
└── components/
    ├── real-time/      # WebSocket components
    └── monitoring/
```

## Shared Packages

### UI Package
```typescript
// packages/ui/src/components/
├── marketplace/
│   ├── VendorCard.tsx
│   ├── VendorBadge.tsx
│   ├── CommissionDisplay.tsx
│   ├── MultiVendorCart.tsx
│   └── VendorRating.tsx
├── age-verification/
│   ├── AgeGate.tsx
│   └── VerificationModal.tsx
└── delivery/
    ├── TrackingMap.tsx
    └── DeliveryStatus.tsx
```

### Marketplace Core Package
```typescript
// packages/marketplace-core/src/
├── vendors/
│   ├── types.ts
│   ├── api.ts
│   └── utils.ts
├── commission/
│   ├── calculator.ts
│   └── tiers.ts
├── fulfillment/
│   ├── routing.ts
│   └── allocation.ts
└── age-verification/
    ├── service.ts
    └── validators.ts
```

## Data Flow Architecture

### API Integration Pattern
```typescript
// Using TanStack Query with MedusaJS
const useVendorProducts = (vendorId: string) => {
  return useQuery({
    queryKey: ['vendor-products', vendorId],
    queryFn: () => medusa.products.list({
      vendor_id: vendorId,
      expand: 'variants,images,options'
    })
  })
}
```

### State Management
```typescript
// Zustand store for marketplace features
interface MarketplaceStore {
  selectedVendor: Vendor | null
  vendorFilters: VendorFilters
  ageVerified: boolean
  setSelectedVendor: (vendor: Vendor) => void
  setVendorFilters: (filters: VendorFilters) => void
  setAgeVerified: (verified: boolean) => void
}
```

### Real-time Updates
```typescript
// Socket.io integration for live features
useEffect(() => {
  socket.on('order:updated', handleOrderUpdate)
  socket.on('inventory:changed', handleInventoryChange)
  socket.on('delivery:location', handleDeliveryLocation)
  
  return () => {
    socket.off('order:updated')
    socket.off('inventory:changed')
    socket.off('delivery:location')
  }
}, [])
```

## Component Patterns

### Vendor-Aware Components
```typescript
// Product card with vendor information
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <ProductImage src={product.thumbnail} />
      <ProductInfo product={product} />
      <VendorBadge vendor={product.vendor} />
      <AddToCartButton product={product} />
    </div>
  )
}
```

### Multi-Vendor Cart
```typescript
// Cart grouped by vendor
export function MultiVendorCart({ cart }: { cart: Cart }) {
  const vendorGroups = groupCartByVendor(cart.items)
  
  return (
    <div className="multi-vendor-cart">
      {vendorGroups.map(group => (
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

## Performance Optimization

### Code Splitting
```typescript
// Lazy load vendor-specific components
const VendorDashboard = lazy(() => import('./VendorDashboard'))
const ShopAnalytics = lazy(() => import('./ShopAnalytics'))
const BrandInventory = lazy(() => import('./BrandInventory'))
```

### Image Optimization
```typescript
// Next.js Image with vendor logos
<Image
  src={vendor.logo}
  alt={vendor.name}
  width={200}
  height={200}
  placeholder="blur"
  blurDataURL={vendor.logoBlur}
/>
```

### Caching Strategy
- Static pages: ISR with 60s revalidation
- Product data: 5-minute cache
- Vendor data: 15-minute cache
- Cart data: No cache (real-time)
- Analytics: 1-hour cache

## Security Considerations

### Authentication Flow
- Customer auth via MedusaJS
- Vendor auth with role-based access
- Operations staff with admin privileges
- Driver auth via mobile app

### Data Protection
- PII encryption in transit and at rest
- Age verification data compliance
- Payment data via Stripe (PCI compliant)
- GDPR-compliant data handling

## Mobile Responsiveness

### Breakpoint Strategy
```scss
// Tailwind breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

### Mobile-First Components
- Touch-optimized interactions
- Bottom sheet modals
- Swipeable product galleries
- Mobile-specific navigation

## Deployment Architecture

### Build Process
```bash
# Turborepo parallel builds
turbo build --filter=storefront
turbo build --filter=vendor-portal
turbo build --filter=operations-hub
```

### Environment Configuration
```env
# Shared across apps
NEXT_PUBLIC_MEDUSA_BACKEND_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SEGMENT_WRITE_KEY=

# App-specific
VENDOR_PORTAL_SECRET=
OPERATIONS_HUB_SECRET=
```

### CDN Strategy
- Static assets on CloudFront
- Image optimization via Next.js
- API responses cached at edge
- WebSocket connections direct

## Development Workflow

### Component Development
1. Design in Figma
2. Build in Storybook
3. Test in isolation
4. Integrate into apps
5. E2E testing

### Feature Flags
```typescript
// LaunchDarkly integration
const features = useFlags()

if (features.multiVendorCheckout) {
  return <MultiVendorCheckout />
}
```

### Testing Strategy
- Unit tests for utilities
- Component tests with Testing Library
- E2E tests with Playwright
- Visual regression with Chromatic

## Migration Path

### From Next.js Starter
1. Keep core e-commerce flows
2. Add marketplace layer
3. Integrate vendor features
4. Customize UI progressively

### From Mercur Components
1. Extract vendor logic
2. Adapt to our vendor types
3. Integrate with MedusaJS APIs
4. Customize for our needs

This hybrid architecture provides the best of both worlds: proven e-commerce functionality from Next.js Starter and marketplace features inspired by Mercur, all unified under a consistent design system and shared component library.