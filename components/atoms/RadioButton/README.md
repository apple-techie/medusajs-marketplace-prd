# RadioButton Component

A flexible radio button component with support for single selection from multiple options. Includes a RadioGroup component for managing state.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { RadioButton, RadioGroup } from '@/components/atoms/RadioButton';

// Basic radio group
<RadioGroup name="options" value={value} onChange={setValue}>
  <RadioButton value="option1" label="Option 1" />
  <RadioButton value="option2" label="Option 2" />
  <RadioButton value="option3" label="Option 3" />
</RadioGroup>

// With descriptions
<RadioGroup name="payment">
  <RadioButton 
    value="card" 
    label="Credit Card"
    description="Visa, Mastercard, Amex"
  />
  <RadioButton 
    value="bank" 
    label="Bank Transfer"
    description="Direct bank payment"
  />
</RadioGroup>
```

## RadioButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'error'` | `'default'` | Visual variant |
| `label` | `ReactNode` | - | Radio button label |
| `labelClassName` | `string` | - | Custom label styles |
| `description` | `string` | - | Helper text below label |
| `descriptionClassName` | `string` | - | Custom description styles |
| `error` | `boolean` | `false` | Error state |
| `containerClassName` | `string` | - | Container wrapper classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `value` | `string` | - | Radio button value |
| `name` | `string` | - | Input name (usually set by RadioGroup) |

## RadioGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Name for all radio inputs |
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Default selected value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |
| `className` | `string` | - | Group container styles |

## Examples

### E-commerce Use Cases

#### Payment Method Selection
```tsx
function PaymentMethodSelector() {
  const [payment, setPayment] = useState('card');

  return (
    <RadioGroup name="payment" value={payment} onChange={setPayment}>
      <RadioButton 
        value="card" 
        label="Credit/Debit Card"
        description="Visa, Mastercard, American Express"
      />
      <RadioButton 
        value="bank" 
        label="Bank Transfer"
        description="Direct bank transfer"
      />
      <RadioButton 
        value="ewallet" 
        label="E-Wallet"
        description="GoPay, OVO, DANA"
      />
      <RadioButton 
        value="cod" 
        label="Cash on Delivery"
        description="Pay when you receive"
      />
    </RadioGroup>
  );
}
```

#### Shipping Method
```tsx
function ShippingSelector() {
  const [shipping, setShipping] = useState('standard');

  return (
    <RadioGroup name="shipping" value={shipping} onChange={setShipping}>
      <RadioButton 
        value="standard" 
        label="Standard Shipping"
        description="5-7 business days • Free"
      />
      <RadioButton 
        value="express" 
        label="Express Shipping"
        description="2-3 business days • IDR 25,000"
      />
      <RadioButton 
        value="overnight" 
        label="Overnight Shipping"
        description="Next business day • IDR 50,000"
      />
    </RadioGroup>
  );
}
```

#### Account Type Selection
```tsx
<RadioGroup name="account" value={accountType} onChange={setAccountType}>
  <RadioButton 
    value="customer" 
    label="Customer"
    description="Shop and track orders"
  />
  <RadioButton 
    value="shop" 
    label="Shop (Affiliate)"
    description="Earn commission on sales"
  />
  <RadioButton 
    value="brand" 
    label="Brand"
    description="Sell your products directly"
  />
  <RadioButton 
    value="distributor" 
    label="Distributor"
    description="Fulfill orders for brands"
  />
</RadioGroup>
```

### Layout Options

#### Horizontal Layout
```tsx
<RadioGroup 
  name="sort" 
  value={sortBy} 
  onChange={setSortBy}
  orientation="horizontal"
>
  <RadioButton value="relevance" label="Relevance" />
  <RadioButton value="price-low" label="Price ↑" />
  <RadioButton value="price-high" label="Price ↓" />
  <RadioButton value="newest" label="Newest" />
</RadioGroup>
```

#### With Custom Styling
```tsx
<RadioGroup name="plan" value={plan} onChange={setPlan}>
  <div className="p-4 border rounded-lg">
    <RadioButton 
      value="bronze" 
      label="Bronze Tier"
      description="15% commission"
    />
  </div>
  <div className="p-4 border-2 rounded-lg border-primary-500 bg-primary-50">
    <RadioButton 
      value="silver" 
      label="Silver Tier"
      description="20% commission"
    />
  </div>
  <div className="p-4 border rounded-lg">
    <RadioButton 
      value="gold" 
      label="Gold Tier"
      description="25% commission"
    />
  </div>
</RadioGroup>
```

### Form Validation

```tsx
function RequiredRadioGroup() {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) {
      setError(true);
      return;
    }
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup name="required" value={value} onChange={setValue}>
        <RadioButton 
          value="yes" 
          label="Yes" 
          error={error && !value}
        />
        <RadioButton 
          value="no" 
          label="No" 
          error={error && !value}
        />
      </RadioGroup>
      {error && !value && (
        <p className="text-sm text-danger-600 mt-2">
          This field is required
        </p>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Accessibility

- Native radio input for full accessibility
- Keyboard navigation (Arrow keys within group)
- Screen reader friendly
- Proper ARIA attributes
- Focus states for keyboard users
- Label association for click targets

## Styling

- Circular design with smooth transitions
- Primary color dot when selected
- Consistent with other form components
- Error state with red coloring
- Disabled state with reduced opacity

## Integration with Forms

```tsx
// With React Hook Form
import { useForm, Controller } from 'react-hook-form';

function CheckoutForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="shippingMethod"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <RadioGroup {...field}>
            <RadioButton 
              value="standard" 
              label="Standard"
              error={!!fieldState.error}
            />
            <RadioButton 
              value="express" 
              label="Express"
              error={!!fieldState.error}
            />
          </RadioGroup>
        )}
      />
    </form>
  );
}
```

## Best Practices

1. Always use RadioGroup to manage state
2. Provide clear labels and descriptions
3. Group related options together
4. Use error states for validation
5. Consider layout based on number of options
6. Ensure only one selection is possible
7. Provide sensible default values when appropriate