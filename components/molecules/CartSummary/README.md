# CartSummary Component

A comprehensive order summary component for e-commerce carts and checkout flows. Displays subtotals, taxes, shipping, discounts, and totals with multiple display variants and interactive features.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { CartSummary } from '@/components/molecules/CartSummary';

// Basic usage
<CartSummary
  subtotal={99.99}
  total={109.98}
/>

// With shipping and tax
<CartSummary
  subtotal={149.99}
  shipping={{
    amount: 9.99,
    method: "Standard Shipping"
  }}
  tax={{
    amount: 15.00,
    rate: 10
  }}
  total={174.98}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `subtotal` | `number` | - | **Required**. Order subtotal |
| `total` | `number` | - | **Required**. Order total |
| `originalTotal` | `number` | - | Original total before discounts |
| `items` | `CartSummaryLineItem[]` | `[]` | Additional line items |
| `currency` | `string` | `'USD'` | Currency code |
| `discount` | `object` | - | Discount information |
| `shipping` | `object` | - | Shipping information |
| `tax` | `object` | - | Tax information |
| `showSavings` | `boolean` | `true` | Show savings amount |
| `savingsLabel` | `string` | `'You save'` | Savings label text |
| `variant` | `'default' \| 'compact' \| 'detailed' \| 'minimal'` | `'default'` | Display variant |
| `showBreakdown` | `boolean` | `true` | Show price breakdown |
| `collapsible` | `boolean` | `false` | Allow collapsing breakdown |
| `defaultExpanded` | `boolean` | `true` | Initial expanded state |
| `loyaltyPoints` | `object` | - | Loyalty points info |
| `showPromoCode` | `boolean` | `false` | Show promo code input |
| `onApplyPromo` | `(code: string) => void` | - | Promo code handler |
| `checkoutButton` | `object` | - | Checkout button config |
| `continueShoppingUrl` | `string` | - | Continue shopping link |
| `className` | `string` | - | Container CSS classes |
| `loading` | `boolean` | `false` | Loading state |
| `subtotalLabel` | `string` | `'Subtotal'` | Subtotal label |
| `totalLabel` | `string` | `'Total'` | Total label |
| `taxLabel` | `string` | `'Tax'` | Tax label |
| `shippingLabel` | `string` | `'Shipping'` | Shipping label |
| `discountLabel` | `string` | `'Discount'` | Discount label |

### Line Item Type

```tsx
interface CartSummaryLineItem {
  label: string;
  value: number;
  description?: string;
  icon?: string;
  highlight?: boolean;
  type?: 'default' | 'discount' | 'fee' | 'tax';
}
```

## Display Variants

### Default
Standard cart summary with full breakdown.

```tsx
<CartSummary
  subtotal={99.99}
  total={109.98}
  variant="default"
/>
```

### Compact
Condensed layout for smaller spaces.

```tsx
<CartSummary
  subtotal={99.99}
  total={109.98}
  variant="compact"
/>
```

### Detailed
Includes additional details like tax breakdown.

```tsx
<CartSummary
  subtotal={99.99}
  total={109.98}
  variant="detailed"
  tax={{
    amount: 10,
    breakdown: [
      { label: "State Tax", amount: 6 },
      { label: "Local Tax", amount: 4 }
    ]
  }}
/>
```

### Minimal
Shows only the total without breakdown.

```tsx
<CartSummary
  subtotal={99.99}
  total={109.98}
  variant="minimal"
/>
```

## Common Patterns

### Shipping Options

```tsx
// Free shipping
<CartSummary
  subtotal={149.99}
  shipping={{
    amount: 0,
    isFree: true,
    method: "Free Standard Shipping"
  }}
  total={149.99}
/>

// With shipping threshold
<CartSummary
  subtotal={35.99}
  shipping={{
    amount: 9.99,
    isFree: false,
    freeThreshold: 50
  }}
  total={45.98}
/>
```

### Discounts and Promo Codes

```tsx
<CartSummary
  subtotal={199.99}
  discount={{
    amount: 40,
    code: "SAVE20",
    type: "percentage",
    description: "20% off your order"
  }}
  total={159.99}
  showPromoCode
  onApplyPromo={async (code) => {
    await applyPromoCode(code);
  }}
/>
```

### Tax Display

```tsx
// With tax rate
<CartSummary
  subtotal={99.99}
  tax={{
    amount: 8.99,
    rate: 9,
    inclusive: false
  }}
  total={108.98}
/>

// Tax included in price
<CartSummary
  subtotal={99.99}
  tax={{
    amount: 8.18,
    inclusive: true
  }}
  total={99.99}
/>
```

### Custom Line Items

```tsx
<CartSummary
  subtotal={149.99}
  items={[
    {
      label: "Gift Wrapping",
      value: 5.99,
      icon: "gift",
      description: "Premium gift wrap"
    },
    {
      label: "Express Processing",
      value: 15.00,
      type: "fee"
    }
  ]}
  total={170.98}
/>
```

### Loyalty Points

```tsx
<CartSummary
  subtotal={99.99}
  loyaltyPoints={{
    earned: 100,
    used: 50,
    balance: 1500
  }}
  total={99.99}
/>
```

## Interactive Features

### Checkout Button

```tsx
<CartSummary
  subtotal={149.99}
  total={164.98}
  checkoutButton={{
    label: "Proceed to Checkout",
    onClick: handleCheckout,
    disabled: !isValid,
    loading: isProcessing
  }}
/>
```

### Collapsible Breakdown

```tsx
<CartSummary
  subtotal={299.99}
  total={329.98}
  collapsible
  defaultExpanded={false}
/>
```

### Continue Shopping

```tsx
<CartSummary
  subtotal={49.99}
  total={59.98}
  continueShoppingUrl="/products"
/>
```

## Complete Example

```tsx
function ShoppingCart() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const handleApplyPromo = async (code: string) => {
    const discount = await validatePromoCode(code);
    if (discount) {
      updateCart({ promoCode: code, discount });
    }
  };
  
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await processCheckout();
  };
  
  return (
    <CartSummary
      subtotal={324.97}
      items={[
        {
          label: "Product Protection",
          value: 29.99,
          icon: "shield",
          description: "2-year coverage"
        }
      ]}
      shipping={{
        amount: 0,
        isFree: true,
        method: "Free 2-Day Shipping"
      }}
      discount={{
        amount: 48.75,
        code: "SUMMER15",
        description: "15% off summer sale"
      }}
      tax={{
        amount: 27.61,
        rate: 8.5
      }}
      total={333.82}
      originalTotal={382.57}
      showSavings
      showPromoCode
      onApplyPromo={handleApplyPromo}
      checkoutButton={{
        onClick: handleCheckout,
        loading: isCheckingOut
      }}
      continueShoppingUrl="/shop"
    />
  );
}
```

## Marketplace Example

```tsx
// Multiple vendor fees
<CartSummary
  subtotal={189.96}
  items={[
    {
      label: "Vendor A Shipping",
      value: 5.99,
      icon: "truck",
      description: "Standard delivery"
    },
    {
      label: "Vendor B Shipping", 
      value: 7.99,
      icon: "truck",
      description: "Express delivery"
    },
    {
      label: "Marketplace Fee",
      value: 2.85,
      type: "fee"
    }
  ]}
  tax={{
    amount: 17.65,
    rate: 8.25
  }}
  total={224.44}
/>
```

## Mobile Optimization

```tsx
// Use compact variant for mobile
<CartSummary
  subtotal={89.99}
  total={99.98}
  variant={isMobile ? "compact" : "default"}
/>
```

## Loading State

```tsx
<CartSummary
  subtotal={0}
  total={0}
  loading
/>
```

## Accessibility

- Semantic HTML structure
- ARIA labels for all sections
- Keyboard navigation support
- Screen reader friendly
- Loading state announcements

## Best Practices

1. **Currency**: Always specify currency for international apps
2. **Breakdown**: Show detailed breakdown for transparency
3. **Savings**: Highlight savings to encourage conversion
4. **Loading**: Show loading state during calculations
5. **Mobile**: Use compact variant on small screens
6. **Validation**: Validate promo codes before applying
7. **Tax**: Clearly indicate if tax is included or added
8. **Shipping**: Show free shipping thresholds to increase AOV