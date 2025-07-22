# DiscountBadge Component

A versatile discount badge component family for displaying promotional information, sales, limited-time offers, and special tags. Includes specialized variants for common e-commerce scenarios.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { 
  DiscountBadge, 
  SaleBadge, 
  LimitedTimeBadge, 
  NewBadge, 
  HotBadge 
} from '@/components/atoms/DiscountBadge';

// Basic percentage discount
<DiscountBadge value={25} />

// Fixed amount discount
<DiscountBadge value={10} type="fixed" currency="$" />

// Automatic sale badge
<SaleBadge originalPrice={100} salePrice={75} />

// Limited time offer
<LimitedTimeBadge endTime={new Date(Date.now() + 3600000)} />

// Special badges
<NewBadge />
<HotBadge />
```

## Components

### DiscountBadge

The base component for all discount displays.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | **Required**. The discount value |
| `type` | `'percentage' \| 'fixed' \| 'text'` | `'percentage'` | Type of discount display |
| `currency` | `string` | `'$'` | Currency symbol for fixed discounts |
| `prefix` | `string` | - | Text before the discount value |
| `suffix` | `string` | - | Text after the discount value |
| `showIcon` | `boolean` | `false` | Show icon in badge |
| `icon` | `string` | `'tag'` | Icon name to display |
| `animate` | `boolean` | `false` | Enable bounce animation |
| `pulse` | `boolean` | `false` | Enable pulse animation |
| `variant` | `'filled' \| 'outlined' \| 'gradient' \| 'subtle'` | `'filled'` | Visual variant |
| `color` | `'red' \| 'green' \| 'orange' \| 'purple' \| 'primary'` | `'red'` | Color scheme |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Badge size |
| `shape` | `'rounded' \| 'square' \| 'pill' \| 'flag'` | `'rounded'` | Shape variant |
| `position` | `'inline' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'inline'` | Position for absolute placement |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Custom content (overrides value) |
| `aria-label` | `string` | - | Accessibility label |

### SaleBadge

Automatically calculates discount percentage or savings amount.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `originalPrice` | `number` | - | **Required**. Original price |
| `salePrice` | `number` | - | **Required**. Sale price |
| `showAmount` | `boolean` | `false` | Show amount saved instead of percentage |
| `currency` | `string` | `'$'` | Currency symbol |
| ...DiscountBadgeProps | - | - | All other DiscountBadge props |

### LimitedTimeBadge

Displays countdown for time-limited offers.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endTime` | `Date` | - | End time for countdown |
| `text` | `string` | `'Limited Time'` | Default text when no endTime |
| `icon` | `string` | `'clock'` | Icon to display |
| `color` | `string` | `'orange'` | Badge color |
| `animate` | `boolean` | `true` | Enable animation |
| ...DiscountBadgeProps | - | - | Other DiscountBadge props |

### NewBadge & HotBadge

Pre-configured badges for common scenarios.

```tsx
// New arrival
<NewBadge />
<NewBadge>Just Arrived</NewBadge>

// Hot/Trending item
<HotBadge />
<HotBadge>Best Seller</HotBadge>
```

## Examples

### Basic Discounts

```tsx
// Percentage discount
<DiscountBadge value={30} />

// Fixed amount
<DiscountBadge value={5} type="fixed" currency="€" />

// Custom text
<DiscountBadge value="BOGO" type="text" />

// With prefix/suffix
<DiscountBadge value={20} prefix="Save" suffix="today" />
```

### Visual Variants

```tsx
// Filled (default)
<DiscountBadge value={25} variant="filled" color="red" />

// Outlined
<DiscountBadge value={25} variant="outlined" color="green" />

// Gradient
<DiscountBadge value={25} variant="gradient" color="orange" />

// Subtle
<DiscountBadge value={25} variant="subtle" color="purple" />
```

### Sizes and Shapes

```tsx
// Different sizes
<DiscountBadge value={30} size="xs" />
<DiscountBadge value={30} size="lg" />

// Different shapes
<DiscountBadge value={30} shape="square" />
<DiscountBadge value={30} shape="pill" />
<DiscountBadge value={30} shape="flag" />
```

### Animated Badges

```tsx
// Bounce animation
<DiscountBadge value={50} animate />

// Pulse animation
<DiscountBadge value={50} pulse />

// Combined animations
<DiscountBadge value={50} animate pulse />
```

### Product Card Integration

```tsx
function ProductCard({ product }) {
  return (
    <div className="relative border rounded-lg p-4">
      {/* Positioned badges */}
      <DiscountBadge 
        value={product.discountPercent} 
        position="top-left" 
      />
      {product.isHot && (
        <HotBadge position="top-right" size="sm" />
      )}
      
      <img src={product.image} alt={product.name} />
      
      <h3>{product.name}</h3>
      
      <div className="flex items-baseline gap-2">
        <span>${product.salePrice}</span>
        <span className="line-through">${product.originalPrice}</span>
      </div>
      
      {/* Inline badges */}
      <div className="flex gap-2 mt-2">
        <SaleBadge 
          originalPrice={product.originalPrice}
          salePrice={product.salePrice}
          size="sm"
          variant="subtle"
        />
        {product.endsAt && (
          <LimitedTimeBadge 
            endTime={product.endsAt}
            size="sm"
            variant="subtle"
          />
        )}
      </div>
    </div>
  );
}
```

### Sale Calculations

```tsx
// Show percentage off
<SaleBadge originalPrice={100} salePrice={70} />
// Output: -30%

// Show amount saved
<SaleBadge 
  originalPrice={100} 
  salePrice={70} 
  showAmount 
  currency="$"
/>
// Output: Save -$30
```

### Limited Time Offers

```tsx
// Countdown timer
const saleEnds = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
<LimitedTimeBadge endTime={saleEnds} />
// Output: 2h 0m

// Flash sale
<LimitedTimeBadge 
  text="Flash Sale" 
  icon="bolt" 
  color="red"
  variant="gradient"
/>
```

### Badge Combinations

```tsx
function ProductBadges({ product }) {
  return (
    <div className="flex gap-2">
      {product.discount > 0 && (
        <DiscountBadge value={product.discount} />
      )}
      {product.isNew && <NewBadge />}
      {product.isHot && <HotBadge size="sm" />}
      {product.limitedTime && (
        <LimitedTimeBadge 
          endTime={product.offerEnds}
          size="sm" 
        />
      )}
    </div>
  );
}
```

## Styling

### Variants
- **Filled**: Solid background with white text
- **Outlined**: Transparent with colored border
- **Gradient**: Gradient background
- **Subtle**: Light background with dark text

### Colors
- **Red**: Sales and discounts
- **Green**: New arrivals, success
- **Orange**: Warnings, limited time
- **Purple**: Special offers
- **Primary**: Brand-specific promotions

### Animations
- **Bounce**: Gentle bounce effect for attention
- **Pulse**: Pulsing effect for urgency

## Accessibility

- Semantic HTML with proper ARIA labels
- Screen reader friendly discount announcements
- Sufficient color contrast in all variants
- Keyboard accessible (when interactive)

## Best Practices

1. **Use appropriate colors**: Red for sales, orange for limited time, green for new
2. **Size consistently**: Use same size for badges in same context
3. **Don't overuse**: Limit badges per product to maintain impact
4. **Position thoughtfully**: Top-left for primary discount, top-right for status
5. **Animate sparingly**: Only for high-priority promotions
6. **Provide context**: Use prefix/suffix for clarity ("Save $10" vs "$10")
7. **Update timers**: Ensure countdown badges update in real-time
8. **Test combinations**: Verify badge combinations don't overlap
9. **Mobile consideration**: Test positioned badges on small screens
10. **Dark mode support**: Ensure badges are visible on dark backgrounds