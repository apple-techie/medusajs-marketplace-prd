# PriceGroup Component

A comprehensive price display component that groups price-related elements including current price, original price, discount badges, savings information, and installment options. Perfect for e-commerce product cards, pricing tables, and checkout summaries.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { 
  PriceGroup, 
  ProductPriceGroup, 
  ComparisonPriceGroup 
} from '@/components/molecules/PriceGroup';

// Basic price group
<PriceGroup price={29.99} />

// With discount
<PriceGroup price={19.99} originalPrice={29.99} />

// Product card pricing
<ProductPriceGroup 
  price={79.99}
  originalPrice={119.99}
  rating={4.5}
  reviewCount={234}
/>

// Comparison pricing
<ComparisonPriceGroup
  prices={[
    { label: 'Basic', price: 9.99 },
    { label: 'Pro', price: 19.99, highlighted: true },
    { label: 'Enterprise', price: 49.99 },
  ]}
/>
```

## Components

### PriceGroup

The main component for displaying prices with various options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `price` | `number \| string` | - | **Required**. Current price |
| `originalPrice` | `number \| string` | - | Original price (for discounts) |
| `currency` | `string` | `'USD'` | Currency code |
| `locale` | `string` | `'en-US'` | Locale for formatting |
| `layout` | `'horizontal' \| 'vertical' \| 'compact'` | `'horizontal'` | Layout direction |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Alignment |
| `showBadge` | `boolean` | `true` | Show discount badge |
| `badgePosition` | `'inline' \| 'top' \| 'bottom'` | `'inline'` | Badge position |
| `badgeVariant` | `'percentage' \| 'amount' \| 'text'` | `'percentage'` | Badge display type |
| `customBadgeText` | `string` | - | Custom badge text |
| `showSavings` | `boolean` | `false` | Show savings amount |
| `savingsText` | `string` | `'You save'` | Savings label text |
| `showInstallments` | `boolean` | `false` | Show installment option |
| `installmentCount` | `number` | `12` | Number of installments |
| `installmentText` | `string` | `'mo'` | Installment period text |
| `priceRange` | `{ min: number \| string; max: number \| string }` | - | Price range |
| `className` | `string` | - | Container CSS classes |
| `priceClassName` | `string` | - | Price CSS classes |
| `originalPriceClassName` | `string` | - | Original price CSS classes |
| `badgeClassName` | `string` | - | Badge CSS classes |
| `savingsClassName` | `string` | - | Savings CSS classes |
| `prefix` | `React.ReactNode` | - | Content before price |
| `suffix` | `React.ReactNode` | - | Content after price |
| `aria-label` | `string` | - | Accessibility label |

### ProductPriceGroup

Specialized price group for product cards with rating integration.

#### Props

Extends PriceGroupProps with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | `number` | - | Product rating |
| `reviewCount` | `number` | - | Number of reviews |
| `showRating` | `boolean` | `true` | Show rating |
| `ratingPosition` | `'above' \| 'below'` | `'above'` | Rating position |

### ComparisonPriceGroup

Display multiple price options for comparison.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prices` | `Array<{ label: string; price: number \| string; originalPrice?: number \| string; highlighted?: boolean }>` | - | **Required**. Price options |
| `currency` | `string` | `'USD'` | Currency code |
| `locale` | `string` | `'en-US'` | Locale |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout |
| `className` | `string` | - | CSS classes |

## Examples

### Basic Pricing

```tsx
// Simple price
<PriceGroup price={29.99} />

// With discount
<PriceGroup price={19.99} originalPrice={29.99} />

// Price range
<PriceGroup price={0} priceRange={{ min: 10, max: 50 }} />
```

### Layout Options

```tsx
// Horizontal (default)
<PriceGroup 
  price={19.99} 
  originalPrice={29.99}
  layout="horizontal"
/>

// Vertical
<PriceGroup 
  price={19.99} 
  originalPrice={29.99}
  layout="vertical"
/>

// Compact
<PriceGroup 
  price={19.99} 
  originalPrice={29.99}
  layout="compact"
/>
```

### Size Variants

```tsx
// Small
<PriceGroup price={19.99} size="sm" />

// Medium (default)
<PriceGroup price={19.99} size="md" />

// Large
<PriceGroup price={19.99} size="lg" />

// Extra large
<PriceGroup price={19.99} size="xl" />
```

### Badge Options

```tsx
// Inline badge (default)
<PriceGroup 
  price={19.99} 
  originalPrice={29.99}
  badgePosition="inline"
/>

// Top badge
<PriceGroup 
  price={19.99} 
  originalPrice={29.99}
  badgePosition="top"
/>

// Custom badge text
<PriceGroup 
  price={19.99} 
  originalPrice={29.99}
  customBadgeText="Flash Sale"
/>

// Show amount saved
<PriceGroup 
  price={19.99} 
  originalPrice={29.99}
  badgeVariant="amount"
/>
```

### Additional Information

```tsx
// With savings
<PriceGroup 
  price={19.99} 
  originalPrice={39.99}
  showSavings
  savingsText="You save"
/>

// With installments
<PriceGroup 
  price={299.99}
  showInstallments
  installmentCount={12}
  installmentText="mo"
/>

// Everything combined
<PriceGroup 
  price={179.99} 
  originalPrice={299.99}
  showSavings
  showInstallments
  layout="vertical"
  size="lg"
/>
```

### Product Card Integration

```tsx
function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      
      <ProductPriceGroup 
        price={product.salePrice}
        originalPrice={product.originalPrice}
        rating={product.rating}
        reviewCount={product.reviewCount}
        showSavings
        size="lg"
      />
      
      <button>Add to Cart</button>
    </div>
  );
}
```

### Pricing Comparison

```tsx
function PricingPlans() {
  return (
    <ComparisonPriceGroup
      prices={[
        { 
          label: 'Basic', 
          price: 9.99 
        },
        { 
          label: 'Professional', 
          price: 19.99, 
          originalPrice: 29.99, 
          highlighted: true 
        },
        { 
          label: 'Enterprise', 
          price: 49.99 
        },
      ]}
    />
  );
}
```

### Checkout Summary

```tsx
function CheckoutSummary({ order }) {
  return (
    <div className="border rounded p-4">
      <h3>Order Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <PriceGroup price={order.subtotal} size="sm" />
        </div>
        
        {order.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <PriceGroup 
              price={order.discountedTotal} 
              originalPrice={order.subtotal}
              showBadge={false}
              size="sm"
            />
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Tax</span>
          <PriceGroup price={order.tax} size="sm" />
        </div>
      </div>
      
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between">
          <span className="font-semibold">Total</span>
          <PriceGroup 
            price={order.total}
            size="lg"
            showInstallments
            installmentCount={4}
          />
        </div>
      </div>
    </div>
  );
}
```

### With Icons and Badges

```tsx
// With icon prefix
<PriceGroup 
  price={49.99}
  originalPrice={79.99}
  prefix={<Icon icon="tag" size="sm" />}
/>

// With shipping info
<PriceGroup 
  price={49.99}
  suffix={<span className="text-xs">+ shipping</span>}
/>

// With both
<PriceGroup 
  price={19.99}
  originalPrice={29.99}
  prefix={<span className="text-sm">From</span>}
  suffix={<span className="text-sm">/month</span>}
/>
```

### International Pricing

```tsx
function InternationalPricing({ prices }) {
  return (
    <div className="space-y-2">
      <PriceGroup 
        price={prices.usd} 
        currency="USD"
        locale="en-US"
      />
      <PriceGroup 
        price={prices.eur} 
        currency="EUR"
        locale="de-DE"
      />
      <PriceGroup 
        price={prices.gbp} 
        currency="GBP"
        locale="en-GB"
      />
    </div>
  );
}
```

## Styling

### Size System
- **Small**: Compact pricing for lists and tables
- **Medium**: Default size for most use cases
- **Large**: Prominent pricing for product pages
- **Extra Large**: Hero sections and featured products

### Layout Patterns
- **Horizontal**: Side-by-side elements (default)
- **Vertical**: Stacked elements for narrow spaces
- **Compact**: Inline display for tight spaces

### Alignment
- **Left**: Default alignment
- **Center**: Centered pricing for cards
- **Right**: Right-aligned for tables

## Accessibility

- Semantic price markup with proper ARIA labels
- Screen reader friendly price announcements
- Clear visual hierarchy
- Sufficient color contrast for all elements

## Best Practices

1. **Always show savings**: When discounted, show the amount saved
2. **Size appropriately**: Use larger sizes for primary prices
3. **Badge positioning**: Inline for horizontal, top/bottom for vertical
4. **Installments context**: Only show when relevant to the product
5. **Currency consistency**: Use same currency throughout the page
6. **Loading states**: Use skeleton loaders while prices load
7. **Error handling**: Gracefully handle invalid prices
8. **Mobile optimization**: Test layouts on small screens
9. **Animation**: Consider subtle animations for price changes
10. **Comparison clarity**: Highlight recommended options in comparisons