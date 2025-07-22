# Price Component

A comprehensive price display component with international currency support, automatic formatting, discount display, and calculation utilities. Perfect for e-commerce applications, product listings, and shopping carts.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Price, PriceRange, usePriceCalculations } from '@/components/atoms/Price';

// Basic price
<Price amount={29.99} />

// With discount
<Price amount={19.99} originalAmount={29.99} />

// Price range
<PriceRange minAmount={10} maxAmount={50} />

// Price calculations
const calculations = usePriceCalculations(100, {
  discount: 20,
  discountType: 'percentage',
  taxRate: 8.5,
  quantity: 2
});
```

## Component Props

### PriceProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `amount` | `number \| string` | - | **Required**. Price amount |
| `currency` | `string` | `'USD'` | Currency code (ISO 4217) |
| `currencyDisplay` | `'symbol' \| 'code' \| 'name'` | `'symbol'` | How to display currency |
| `locale` | `string` | `'en-US'` | Locale for formatting |
| `minimumFractionDigits` | `number` | `2` | Minimum decimal places |
| `maximumFractionDigits` | `number` | `2` | Maximum decimal places |
| `showCurrency` | `boolean` | `true` | Show currency symbol/code |
| `currencyPosition` | `'before' \| 'after'` | `'before'` | Currency position |
| `originalAmount` | `number \| string` | - | Original price (for discounts) |
| `showOriginal` | `boolean` | `true` | Show original price |
| `prefix` | `string` | - | Text before price |
| `suffix` | `string` | - | Text after price |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | `'md'` | Text size |
| `variant` | `'default' \| 'primary' \| 'sale' \| 'muted' \| 'strikethrough'` | `'default'` | Visual variant |
| `weight` | `'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'medium'` | Font weight |
| `className` | `string` | - | Additional CSS classes |
| `originalClassName` | `string` | - | CSS classes for original price |
| `as` | `'span' \| 'div' \| 'p'` | `'span'` | HTML element |
| `aria-label` | `string` | - | Accessibility label |

### PriceRangeProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minAmount` | `number \| string` | - | **Required**. Minimum price |
| `maxAmount` | `number \| string` | - | **Required**. Maximum price |
| `currency` | `string` | `'USD'` | Currency code |
| `locale` | `string` | `'en-US'` | Locale for formatting |
| `size` | `PriceProps['size']` | `'md'` | Text size |
| `variant` | `PriceProps['variant']` | `'default'` | Visual variant |
| `weight` | `PriceProps['weight']` | `'medium'` | Font weight |
| `separator` | `string` | `' - '` | Range separator |
| `className` | `string` | - | Additional CSS classes |

### usePriceCalculations Hook

```tsx
const calculations = usePriceCalculations(price, {
  taxRate?: number,         // Tax percentage (0-100)
  discount?: number,        // Discount amount
  discountType?: 'percentage' | 'fixed',
  quantity?: number,        // Item quantity
});

// Returns:
{
  originalPrice: number,
  discountAmount: number,
  discountedPrice: number,
  taxAmount: number,
  finalPrice: number,
  totalPrice: number,
  savings: number,
  savingsPercentage: number,
}
```

## Examples

### Basic Pricing

```tsx
// Simple price
<Price amount={29.99} />

// Different currency
<Price amount={29.99} currency="EUR" locale="de-DE" />

// Without currency symbol
<Price amount={29.99} showCurrency={false} />

// Currency after amount
<Price amount={100} currency="JPY" currencyPosition="after" locale="ja-JP" />
```

### Sale Pricing

```tsx
// Automatic sale styling
<Price amount={19.99} originalAmount={29.99} />

// Hide original price
<Price amount={19.99} originalAmount={29.99} showOriginal={false} />

// Custom sale variant
<Price amount={19.99} variant="sale" weight="bold" size="lg" />
```

### Price Ranges

```tsx
// Basic range
<PriceRange minAmount={10} maxAmount={50} />

// Custom separator
<PriceRange minAmount={99} maxAmount={299} separator=" to " />

// Styled range
<PriceRange 
  minAmount={100} 
  maxAmount={500} 
  size="lg"
  weight="bold"
  variant="primary"
/>
```

### With Prefix/Suffix

```tsx
// Starting price
<Price amount={9.99} prefix="From" />

// Per unit pricing
<Price amount={4.99} suffix="/each" />

// Subscription pricing
<Price amount={19.99} suffix="/month" prefix="Only" />

// Hourly rate
<Price amount={75} suffix="/hr" />
```

### International Pricing

```tsx
function InternationalPricing({ amount }) {
  return (
    <div className="space-y-2">
      <Price amount={amount} currency="USD" locale="en-US" />
      <Price amount={amount * 0.85} currency="EUR" locale="de-DE" />
      <Price amount={amount * 0.73} currency="GBP" locale="en-GB" />
      <Price amount={amount * 110} currency="JPY" locale="ja-JP" minimumFractionDigits={0} />
    </div>
  );
}
```

### Shopping Cart

```tsx
function CartSummary({ items }) {
  const calculations = usePriceCalculations(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    { taxRate: 8.5 }
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <Price amount={calculations.originalPrice} />
      </div>
      <div className="flex justify-between">
        <span>Tax</span>
        <Price amount={calculations.taxAmount} />
      </div>
      <div className="flex justify-between font-bold">
        <span>Total</span>
        <Price amount={calculations.finalPrice} size="lg" />
      </div>
    </div>
  );
}
```

### Product Card

```tsx
function ProductPrice({ price, originalPrice, discount }) {
  return (
    <div className="flex items-baseline gap-2">
      <Price 
        amount={price} 
        originalAmount={originalPrice}
        size="lg"
        weight="bold"
      />
      {discount && (
        <span className="text-sm text-success-600 font-medium">
          {discount}% off
        </span>
      )}
    </div>
  );
}
```

### Price Calculator

```tsx
function PriceCalculator({ basePrice }) {
  const [quantity, setQuantity] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  
  const discount = discountCode === 'SAVE20' ? 20 : 0;
  
  const calculations = usePriceCalculations(basePrice, {
    discount,
    discountType: 'percentage',
    taxRate: 8.5,
    quantity,
  });

  return (
    <div className="space-y-4">
      <input 
        type="number" 
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min={1}
      />
      
      <input 
        type="text"
        placeholder="Discount code"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value)}
      />
      
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal ({quantity} items)</span>
          <Price amount={basePrice * quantity} />
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between mb-2 text-success-600">
            <span>Discount ({discount}%)</span>
            <span>-<Price amount={calculations.discountAmount} /></span>
          </div>
        )}
        
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <Price amount={calculations.taxAmount} variant="muted" />
        </div>
        
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <Price amount={calculations.totalPrice} size="lg" />
        </div>
      </div>
    </div>
  );
}
```

## Styling

### Size Variants
- `xs`: Extra small (12px)
- `sm`: Small (14px)
- `md`: Medium (16px) - Default
- `lg`: Large (18px)
- `xl`: Extra large (20px)
- `2xl`: 2X large (24px)
- `3xl`: 3X large (30px)

### Visual Variants
- `default`: Standard black text
- `primary`: Primary brand color
- `sale`: Red sale color
- `muted`: Gray muted color
- `strikethrough`: Gray with line-through

### Font Weights
- `normal`: Regular weight
- `medium`: Medium weight (default)
- `semibold`: Semi-bold weight
- `bold`: Bold weight

## Features

### Automatic Formatting
- Locale-aware number formatting
- Currency symbol placement
- Thousands separators
- Decimal precision control

### Smart Discount Display
- Automatic strikethrough for original price
- Sale variant auto-applied when discounted
- Percentage savings calculation

### International Support
- All ISO 4217 currency codes
- Locale-specific formatting
- RTL language support

### Calculation Utilities
- Tax calculations
- Discount calculations (percentage/fixed)
- Quantity pricing
- Savings calculations

## Accessibility

- Semantic HTML with proper ARIA labels
- Screen reader friendly price announcements
- Sufficient color contrast
- Clear visual hierarchy

## Best Practices

1. **Always specify locale**: Ensures correct formatting for the user's region
2. **Use appropriate sizes**: Larger for primary prices, smaller for secondary
3. **Show savings**: Display both original and sale price for discounts
4. **Include tax info**: Be transparent about additional costs
5. **Test currencies**: Verify formatting with target market currencies
6. **Mobile consideration**: Use smaller sizes on mobile devices
7. **Loading states**: Show skeleton while prices load
8. **Error handling**: Gracefully handle invalid amounts
9. **Consistency**: Use the same formatting throughout your app
10. **Performance**: Memoize calculations for complex pricing logic