# Component Architecture

## Overview

The component architecture follows a monorepo structure with shared UI components across all applications. This ensures consistency while allowing application-specific customizations.

## Monorepo Structure

```
packages/
├── ui/                    # Shared UI components
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Shared React hooks
│   │   ├── utils/         # UI utilities
│   │   └── styles/        # Global styles
│   ├── package.json
│   └── tsconfig.json
├── marketplace-core/      # Business logic
│   ├── src/
│   │   ├── vendors/       # Vendor logic
│   │   ├── commission/    # Commission calculations
│   │   └── fulfillment/   # Routing logic
│   └── package.json
└── types/                 # TypeScript definitions
    ├── src/
    │   ├── vendor.ts
    │   ├── order.ts
    │   └── product.ts
    └── package.json
```

## Component Categories

### 1. Foundation Components (packages/ui)

#### Layout Components
```typescript
// packages/ui/src/components/layout/
├── Container.tsx
├── Grid.tsx
├── Stack.tsx
├── Flex.tsx
└── Section.tsx
```

#### Form Components
```typescript
// packages/ui/src/components/form/
├── Input.tsx
├── Select.tsx
├── Checkbox.tsx
├── RadioGroup.tsx
├── DatePicker.tsx
└── FileUpload.tsx
```

#### Feedback Components
```typescript
// packages/ui/src/components/feedback/
├── Alert.tsx
├── Toast.tsx
├── Modal.tsx
├── Drawer.tsx
├── Progress.tsx
└── Skeleton.tsx
```

### 2. Marketplace Components

#### Vendor Components
```typescript
// packages/ui/src/components/marketplace/vendor/
├── VendorCard.tsx
├── VendorBadge.tsx
├── VendorRating.tsx
├── VendorInfo.tsx
├── VendorGrid.tsx
└── VendorFilters.tsx

// Example: VendorCard Component
export interface VendorCardProps {
  vendor: Vendor
  variant?: 'default' | 'compact' | 'featured'
  showRating?: boolean
  showProducts?: boolean
  onSelect?: (vendor: Vendor) => void
}

export function VendorCard({ 
  vendor, 
  variant = 'default',
  showRating = true,
  showProducts = false,
  onSelect 
}: VendorCardProps) {
  return (
    <Card 
      className={cn(
        "vendor-card",
        `vendor-card--${variant}`,
        "hover:shadow-lg transition-shadow"
      )}
      onClick={() => onSelect?.(vendor)}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar src={vendor.logo} alt={vendor.name} />
          <div>
            <h3 className="font-semibold">{vendor.name}</h3>
            <VendorTypeBadge type={vendor.type} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showRating && <VendorRating rating={vendor.rating} />}
        {showProducts && <VendorProductPreview vendor={vendor} />}
      </CardContent>
    </Card>
  )
}
```

#### Commission Components
```typescript
// packages/ui/src/components/marketplace/commission/
├── CommissionDisplay.tsx
├── CommissionCalculator.tsx
├── TierBadge.tsx
└── EarningsChart.tsx
```

#### Cart Components
```typescript
// packages/ui/src/components/marketplace/cart/
├── MultiVendorCart.tsx
├── VendorCartSection.tsx
├── CartItemGroup.tsx
└── ShippingOptions.tsx
```

### 3. Age Verification Components

```typescript
// packages/ui/src/components/age-verification/
├── AgeGate.tsx
├── AgeVerificationModal.tsx
├── BirthdateInput.tsx
├── VerificationMethods.tsx
└── ComplianceBanner.tsx

// Example: AgeGate Wrapper
export function AgeGate({ 
  children, 
  requiredAge = 21,
  redirectUrl = '/age-restricted'
}: AgeGateProps) {
  const { isVerified, verify } = useAgeVerification()
  
  if (!isVerified) {
    return (
      <AgeVerificationModal 
        requiredAge={requiredAge}
        onVerify={verify}
        onCancel={() => router.push(redirectUrl)}
      />
    )
  }
  
  return <>{children}</>
}
```

### 4. Delivery Components

```typescript
// packages/ui/src/components/delivery/
├── DeliveryTracker.tsx
├── DriverInfo.tsx
├── DeliveryMap.tsx
├── DeliveryStatus.tsx
└── ProofOfDelivery.tsx
```

## Component Patterns

### 1. Compound Components

```typescript
// Vendor component with sub-components
export const Vendor = {
  Card: VendorCard,
  Badge: VendorBadge,
  Rating: VendorRating,
  Info: VendorInfo,
  Products: VendorProducts
}

// Usage
<Vendor.Card vendor={vendor}>
  <Vendor.Badge />
  <Vendor.Rating />
  <Vendor.Products limit={3} />
</Vendor.Card>
```

### 2. Polymorphic Components

```typescript
// Button that can render as different elements
interface ButtonProps<T extends ElementType> {
  as?: T
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button<T extends ElementType = 'button'>({
  as,
  ...props
}: ButtonProps<T> & ComponentPropsWithoutRef<T>) {
  const Component = as || 'button'
  return <Component {...props} />
}

// Usage
<Button as="a" href="/vendors">View Vendors</Button>
<Button as={Link} to="/products">Products</Button>
```

### 3. Render Props Pattern

```typescript
// Flexible data display component
export function VendorList({ 
  vendors,
  renderItem,
  renderEmpty 
}: VendorListProps) {
  if (vendors.length === 0) {
    return renderEmpty?.() || <EmptyState />
  }
  
  return (
    <div className="vendor-list">
      {vendors.map(vendor => renderItem(vendor))}
    </div>
  )
}

// Usage
<VendorList
  vendors={vendors}
  renderItem={(vendor) => <VendorCard vendor={vendor} />}
  renderEmpty={() => <p>No vendors found</p>}
/>
```

## Styling Architecture

### 1. CSS-in-JS with Tailwind

```typescript
// Using cn utility for conditional classes
import { cn } from '@/lib/utils'

export function Badge({ 
  children, 
  variant = 'default',
  className 
}: BadgeProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-gray-100 text-gray-800": variant === 'default',
          "bg-green-100 text-green-800": variant === 'success',
          "bg-red-100 text-red-800": variant === 'error',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
```

### 2. Theme Configuration

```typescript
// packages/ui/src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    vendor: {
      shop: '#10b981',      // Green
      brand: '#3b82f6',     // Blue
      distributor: '#8b5cf6' // Purple
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  }
}
```

## Accessibility Standards

### 1. ARIA Labels

```typescript
export function VendorRating({ rating, maxRating = 5 }: VendorRatingProps) {
  return (
    <div 
      role="img"
      aria-label={`Rating: ${rating} out of ${maxRating} stars`}
      className="flex items-center"
    >
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          filled={i < rating}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">
        {rating} out of {maxRating} stars
      </span>
    </div>
  )
}
```

### 2. Keyboard Navigation

```typescript
export function VendorSelect({ vendors, onSelect }: VendorSelectProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex(prev => 
          Math.min(prev + 1, vendors.length - 1)
        )
        break
      case 'ArrowUp':
        setFocusedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        onSelect(vendors[focusedIndex])
        break
    }
  }
  
  return (
    <div role="listbox" onKeyDown={handleKeyDown}>
      {vendors.map((vendor, index) => (
        <div
          key={vendor.id}
          role="option"
          aria-selected={index === focusedIndex}
          tabIndex={index === focusedIndex ? 0 : -1}
        >
          {vendor.name}
        </div>
      ))}
    </div>
  )
}
```

## Component Documentation

### 1. Storybook Setup

```typescript
// packages/ui/.storybook/main.ts
export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  }
}
```

### 2. Component Stories

```typescript
// VendorCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { VendorCard } from './VendorCard'

const meta: Meta<typeof VendorCard> = {
  title: 'Marketplace/VendorCard',
  component: VendorCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'featured']
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    vendor: {
      id: '1',
      name: 'Sample Shop',
      type: 'shop',
      rating: 4.5,
      logo: '/vendor-logo.png'
    }
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <VendorCard vendor={sampleVendor} variant="default" />
      <VendorCard vendor={sampleVendor} variant="compact" />
      <VendorCard vendor={sampleVendor} variant="featured" />
    </div>
  )
}
```

## Testing Strategy

### 1. Component Testing

```typescript
// VendorCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VendorCard } from './VendorCard'

describe('VendorCard', () => {
  const mockVendor = {
    id: '1',
    name: 'Test Vendor',
    type: 'shop' as const,
    rating: 4.5
  }
  
  it('renders vendor information', () => {
    render(<VendorCard vendor={mockVendor} />)
    
    expect(screen.getByText('Test Vendor')).toBeInTheDocument()
    expect(screen.getByText('Shop')).toBeInTheDocument()
  })
  
  it('calls onSelect when clicked', async () => {
    const handleSelect = jest.fn()
    render(
      <VendorCard 
        vendor={mockVendor} 
        onSelect={handleSelect} 
      />
    )
    
    await userEvent.click(screen.getByRole('article'))
    expect(handleSelect).toHaveBeenCalledWith(mockVendor)
  })
})
```

### 2. Visual Regression Testing

```typescript
// Using Chromatic with Storybook
// .github/workflows/chromatic.yml
name: Chromatic
on: push
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
```

## Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load heavy components
const VendorAnalytics = lazy(() => 
  import('./VendorAnalytics')
)

// Use with Suspense
<Suspense fallback={<Skeleton />}>
  <VendorAnalytics vendorId={vendor.id} />
</Suspense>
```

### 2. Memoization

```typescript
// Memoize expensive calculations
export const VendorStats = memo(({ vendor }: VendorStatsProps) => {
  const stats = useMemo(() => 
    calculateVendorStats(vendor), [vendor.id]
  )
  
  return (
    <div className="vendor-stats">
      {/* Render stats */}
    </div>
  )
})
```

This component architecture provides a scalable foundation for building consistent UI across all marketplace applications while maintaining flexibility for specific use cases.