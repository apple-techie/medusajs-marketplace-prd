# Customer Storefront Implementation

> **Note**: This document provides detailed implementation specifics for the customer storefront. For the overall technical strategy including all applications, see [IMPLEMENTATION-STRATEGY.md](../IMPLEMENTATION-STRATEGY.md).

## Overview

The customer storefront is built on the MedusaJS Next.js Starter template, customized for marketplace functionality. This approach provides a solid e-commerce foundation while enabling multi-vendor features as part of our hybrid implementation strategy.

## Architecture

### Base Template
- **Foundation**: MedusaJS Next.js Starter
- **Version**: Latest stable (compatible with MedusaJS 2.0)
- **Repository**: https://github.com/medusajs/nextjs-starter-medusa

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Authentication**: MedusaJS Auth
- **Payments**: Stripe (via MedusaJS)

## Marketplace Customizations

### 1. Multi-Vendor Product Display

#### Product Card Enhancement
```tsx
// components/products/product-card.tsx
import { Product } from "@medusajs/medusa"
import { VendorBadge } from "@/components/marketplace/vendor-badge"

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative">
      <div className="aspect-square overflow-hidden rounded-lg">
        <img src={product.thumbnail} alt={product.title} />
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium">{product.title}</h3>
        <VendorBadge vendor={product.vendor} size="sm" />
        <p className="text-sm text-muted-foreground">
          ${product.variants[0]?.prices[0]?.amount / 100}
        </p>
      </div>
    </div>
  )
}
```

#### Product Detail Page
```tsx
// app/(main)/products/[handle]/page.tsx
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle)
  
  return (
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-8">
        <ProductGallery images={product.images} />
        <div>
          <h1>{product.title}</h1>
          <VendorInfo vendor={product.vendor} />
          <ProductOptions product={product} />
          <AddToCart product={product} />
        </div>
      </div>
      <VendorProducts vendorId={product.vendor.id} />
    </div>
  )
}
```

### 2. Vendor Storefronts

#### Vendor Directory
```tsx
// app/(main)/vendors/page.tsx
export default function VendorsPage() {
  const { vendors, filters, setFilters } = useVendors()
  
  return (
    <div className="container">
      <h1>All Vendors</h1>
      <div className="grid lg:grid-cols-4 gap-6">
        <aside>
          <VendorFilters 
            filters={filters}
            onChange={setFilters}
          />
        </aside>
        <div className="lg:col-span-3">
          <VendorGrid vendors={vendors} />
        </div>
      </div>
    </div>
  )
}
```

#### Individual Vendor Page
```tsx
// app/(main)/vendors/[handle]/page.tsx
export default function VendorPage({ params }) {
  const vendor = await getVendor(params.handle)
  const products = await getVendorProducts(vendor.id)
  
  return (
    <div>
      <VendorHero vendor={vendor} />
      <div className="container">
        <VendorStats vendor={vendor} />
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
```

### 3. Multi-Vendor Cart

#### Cart Grouping by Vendor
```tsx
// components/cart/multi-vendor-cart.tsx
export function MultiVendorCart({ cart }) {
  const vendorGroups = useMemo(() => 
    groupCartItemsByVendor(cart.items), [cart.items]
  )
  
  return (
    <div className="space-y-6">
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

#### Vendor Cart Section
```tsx
// components/cart/vendor-cart-section.tsx
export function VendorCartSection({ vendor, items, shipping }) {
  const subtotal = calculateSubtotal(items)
  const commission = calculateCommission(subtotal, vendor.commission_tier)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <VendorBadge vendor={vendor} />
          <span className="text-sm text-muted-foreground">
            Ships from: {vendor.fulfillment_location}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </CardContent>
      <CardFooter>
        <ShippingOptions options={shipping} />
      </CardFooter>
    </Card>
  )
}
```

### 4. Age Verification Integration

#### Age Gate Component
```tsx
// components/age-verification/age-gate.tsx
export function AgeGate({ children, requiredAge = 21 }) {
  const { isVerified, showModal } = useAgeVerification()
  
  useEffect(() => {
    if (!isVerified) {
      showModal()
    }
  }, [isVerified])
  
  if (!isVerified) {
    return <AgeVerificationModal requiredAge={requiredAge} />
  }
  
  return children
}
```

#### Protected Routes
```tsx
// app/(main)/layout.tsx
export default function MainLayout({ children }) {
  const requiresAgeVerification = useRequiresAgeVerification()
  
  if (requiresAgeVerification) {
    return (
      <AgeGate>
        {children}
      </AgeGate>
    )
  }
  
  return children
}
```

### 5. Enhanced Search

#### Search with Vendor Filters
```tsx
// components/search/marketplace-search.tsx
export function MarketplaceSearch() {
  const [query, setQuery] = useState("")
  const [vendorFilter, setVendorFilter] = useState<string[]>([])
  
  const { data } = useSearch({
    query,
    filters: {
      vendor_id: vendorFilter
    }
  })
  
  return (
    <div>
      <SearchInput 
        value={query}
        onChange={setQuery}
      />
      <VendorFilter
        selected={vendorFilter}
        onChange={setVendorFilter}
      />
      <SearchResults results={data} />
    </div>
  )
}
```

## Navigation Structure

### Main Navigation
```tsx
// components/layout/navigation.tsx
export function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/vendors">Vendors</Link>
      <Link href="/categories">Categories</Link>
      <Link href="/deals">Deals</Link>
    </nav>
  )
}
```

### Mobile Navigation
- Bottom tab bar for key actions
- Slide-out menu for full navigation
- Search accessible from all screens
- Quick access to cart and account

## Performance Optimizations

### Image Optimization
```tsx
// Using Next.js Image for vendor and product images
<Image
  src={product.thumbnail}
  alt={product.title}
  width={400}
  height={400}
  placeholder="blur"
  blurDataURL={product.thumbnailBlur}
  className="object-cover"
/>
```

### Data Fetching Strategy
- ISR for product pages (revalidate: 60s)
- SSG for vendor pages (revalidate: 300s)
- Client-side for cart and user data
- Prefetching for navigation

### Code Splitting
```tsx
// Lazy load marketplace components
const VendorDashboard = dynamic(() => 
  import('@/components/vendor/dashboard')
)
const AgeVerification = dynamic(() => 
  import('@/components/age-verification')
)
```

## State Management

### Global Store Structure
```typescript
// stores/marketplace.ts
interface MarketplaceStore {
  // Vendor state
  selectedVendor: Vendor | null
  vendorFilters: VendorFilters
  
  // Age verification
  ageVerified: boolean
  verificationDate: Date | null
  
  // UI state
  sidebarOpen: boolean
  searchOpen: boolean
  
  // Actions
  setSelectedVendor: (vendor: Vendor) => void
  setVendorFilters: (filters: VendorFilters) => void
  verifyAge: (birthDate: Date) => void
}
```

## SEO Optimization

### Meta Tags
```tsx
// app/(main)/products/[handle]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle)
  
  return {
    title: `${product.title} - ${product.vendor.name}`,
    description: product.description,
    openGraph: {
      images: [product.thumbnail],
    },
  }
}
```

### Structured Data
```tsx
// components/seo/product-schema.tsx
export function ProductSchema({ product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    seller: {
      "@type": "Organization",
      name: product.vendor.name
    }
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

## Checkout Customization

### Multi-Vendor Checkout
- Step-by-step checkout process
- Vendor-specific shipping options
- Combined payment processing
- Order splitting for fulfillment

### Checkout Flow
1. Cart review (grouped by vendor)
2. Shipping address
3. Shipping methods (per vendor)
4. Payment information
5. Order confirmation

## Mobile Experience

### Responsive Design
- Mobile-first approach
- Touch-optimized interactions
- Bottom sheet modals
- Swipeable image galleries

### PWA Features
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  // config
})
```

## Analytics Integration

### Segment Events
```typescript
// utils/analytics.ts
export const trackProductView = (product: Product) => {
  analytics.track('Product Viewed', {
    product_id: product.id,
    product_name: product.title,
    vendor_id: product.vendor.id,
    vendor_name: product.vendor.name,
    price: product.variants[0]?.prices[0]?.amount / 100
  })
}
```

## Testing Strategy

### Component Testing
```typescript
// __tests__/components/vendor-badge.test.tsx
describe('VendorBadge', () => {
  it('displays vendor name and rating', () => {
    render(<VendorBadge vendor={mockVendor} />)
    expect(screen.getByText(mockVendor.name)).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })
})
```

### E2E Testing
- Product browsing flow
- Multi-vendor cart flow
- Checkout completion
- Age verification flow

This implementation leverages the Next.js Starter's solid foundation while adding the marketplace-specific features needed for a multi-vendor platform.