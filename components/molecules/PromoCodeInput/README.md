# PromoCodeInput Component

A comprehensive promo code input component for e-commerce applications. Supports validation, loading states, applied code display, and both percentage and fixed amount discounts.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { PromoCodeInput } from '@/components/molecules/PromoCodeInput';

// Basic usage
<PromoCodeInput
  onApply={(code) => applyPromoCode(code)}
/>

// With applied code
<PromoCodeInput
  appliedCode="SAVE20"
  discount={{
    type: 'percentage',
    value: 20,
    description: '20% off your order'
  }}
  onRemove={() => removePromoCode()}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onApply` | `(code: string) => void \| Promise<void>` | - | Apply code handler |
| `onRemove` | `() => void` | - | Remove code handler |
| `appliedCode` | `string` | - | Currently applied code |
| `discount` | `object` | - | Discount details |
| `label` | `string` | `'Promo code'` | Input label |
| `placeholder` | `string` | `'Enter promo code'` | Input placeholder |
| `applyLabel` | `string` | `'Apply'` | Apply button label |
| `removeLabel` | `string` | `'Remove'` | Remove button label |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `validateCode` | `(code: string) => boolean \| string` | - | Custom validation |
| `minLength` | `number` | `3` | Minimum code length |
| `maxLength` | `number` | `20` | Maximum code length |
| `pattern` | `RegExp` | - | Validation pattern |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `string` | - | Error message |
| `clearOnApply` | `boolean` | `true` | Clear input after apply |
| `autoFocus` | `boolean` | `false` | Auto focus input |
| `className` | `string` | - | Container CSS classes |
| `variant` | `'default' \| 'inline'` | `'default'` | Display variant |
| `aria-label` | `string` | - | Custom ARIA label |

### Discount Type

```tsx
interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
}
```

## Common Patterns

### Basic Promo Code

```tsx
function CheckoutPromoCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  
  const handleApply = async (code: string) => {
    setLoading(true);
    setError(undefined);
    
    try {
      const result = await validatePromoCode(code);
      if (result.valid) {
        applyDiscount(result.discount);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to apply promo code');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PromoCodeInput
      onApply={handleApply}
      loading={loading}
      error={error}
    />
  );
}
```

### Applied Code Display

```tsx
<PromoCodeInput
  appliedCode="SUMMER20"
  discount={{
    type: 'percentage',
    value: 20,
    description: 'Summer sale - 20% off your entire order'
  }}
  onRemove={() => {
    removePromoCode();
    recalculateTotals();
  }}
/>
```

### Fixed Amount Discount

```tsx
<PromoCodeInput
  appliedCode="SAVE10"
  discount={{
    type: 'fixed',
    value: 10,
    description: 'Save $10 on orders over $50'
  }}
  onRemove={handleRemove}
/>
```

### With Validation

```tsx
<PromoCodeInput
  minLength={6}
  maxLength={12}
  pattern={/^[A-Z0-9]+$/}
  validateCode={(code) => {
    // Custom validation logic
    if (!code.startsWith('VALID')) {
      return 'Invalid promo code format';
    }
    if (expiredCodes.includes(code)) {
      return 'This promo code has expired';
    }
    return true;
  }}
  onApply={handleApply}
/>
```

### Inline Variant

```tsx
// Compact inline style
<PromoCodeInput
  variant="inline"
  size="sm"
  onApply={handleApply}
/>
```

## Shopping Cart Integration

```tsx
function ShoppingCart() {
  const [promoCode, setPromoCode] = useState<string>();
  const [discount, setDiscount] = useState<any>();
  const [loading, setLoading] = useState(false);
  
  const subtotal = 99.99;
  const discountAmount = discount
    ? discount.type === 'percentage'
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0;
  const total = subtotal - discountAmount;
  
  const applyPromoCode = async (code: string) => {
    setLoading(true);
    
    try {
      const response = await api.validatePromoCode(code);
      if (response.valid) {
        setPromoCode(code);
        setDiscount({
          type: response.discountType,
          value: response.discountValue,
          description: response.description
        });
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <PromoCodeInput
        appliedCode={promoCode}
        discount={discount}
        loading={loading}
        onApply={applyPromoCode}
        onRemove={() => {
          setPromoCode(undefined);
          setDiscount(undefined);
        }}
      />
    </div>
  );
}
```

## Checkout Flow

```tsx
function CheckoutPayment() {
  const { promoCode, discount } = useCheckout();
  
  return (
    <div className="space-y-6">
      {/* Payment form fields */}
      
      <PromoCodeInput
        label="Have a promo code or gift card?"
        appliedCode={promoCode}
        discount={discount}
        onApply={async (code) => {
          await applyPromoCode(code);
        }}
        onRemove={() => {
          removePromoCode();
        }}
      />
      
      <Button onClick={submitOrder}>
        Complete Order
      </Button>
    </div>
  );
}
```

## Validation Examples

### Length Validation

```tsx
<PromoCodeInput
  minLength={8}
  maxLength={16}
  onApply={handleApply}
/>
```

### Pattern Validation

```tsx
// Alphanumeric only
<PromoCodeInput
  pattern={/^[A-Z0-9]+$/}
  onApply={handleApply}
/>

// Specific format
<PromoCodeInput
  pattern={/^SAVE-\d{4}$/}
  placeholder="Format: SAVE-XXXX"
  onApply={handleApply}
/>
```

### Custom Validation

```tsx
<PromoCodeInput
  validateCode={(code) => {
    // Check against valid codes
    if (!validCodes.includes(code)) {
      return 'Invalid promo code';
    }
    
    // Check expiry
    if (isExpired(code)) {
      return 'This code has expired';
    }
    
    // Check usage limit
    if (isMaxUsed(code)) {
      return 'This code has reached its usage limit';
    }
    
    return true;
  }}
  onApply={handleApply}
/>
```

## States

### Loading State

```tsx
<PromoCodeInput
  loading={isValidating}
  onApply={handleApply}
/>
```

### Error State

```tsx
<PromoCodeInput
  error={validationError}
  onApply={handleApply}
/>
```

### Disabled State

```tsx
<PromoCodeInput
  disabled={!isEligibleForPromo}
  onApply={handleApply}
/>
```

## Sizes

```tsx
// Small
<PromoCodeInput size="sm" onApply={handleApply} />

// Medium (default)
<PromoCodeInput size="md" onApply={handleApply} />

// Large
<PromoCodeInput size="lg" onApply={handleApply} />
```

## Accessibility

- Proper form labels and ARIA attributes
- Keyboard support (Enter to submit)
- Error messages linked to input
- Loading state announcements
- Clear visual feedback for all states

## Best Practices

1. **Uppercase Codes**: Component automatically converts input to uppercase
2. **Trim Input**: Codes are trimmed before validation
3. **Clear Errors**: Errors clear when user types
4. **Async Support**: Handle async validation with loading states
5. **Success Feedback**: Show applied code with discount details
6. **Error Messages**: Provide specific, helpful error messages
7. **Code Format**: Display expected format in placeholder
8. **Security**: Validate codes server-side, never trust client validation