# Counter Component

An interactive numeric input component that allows users to increment or decrement values within a defined range. Perfect for quantity selectors, rating inputs, and numeric adjustments.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Counter } from '@/components/atoms/Counter';

// Basic counter
<Counter defaultValue={1} />

// With constraints
<Counter 
  defaultValue={5}
  min={0}
  max={10}
/>

// Controlled counter
<Counter 
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={99}
/>

// With custom formatting
<Counter 
  defaultValue={29.99}
  step={0.01}
  formatValue={(value) => `$${value.toFixed(2)}`}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outline' \| 'primary'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `value` | `number` | - | Controlled value |
| `defaultValue` | `number` | `0` | Default value (uncontrolled) |
| `onChange` | `(value: number) => void` | - | Value change handler |
| `min` | `number` | `0` | Minimum allowed value |
| `max` | `number` | `999` | Maximum allowed value |
| `step` | `number` | `1` | Increment/decrement step |
| `disabled` | `boolean` | `false` | Disabled state |
| `readOnly` | `boolean` | `false` | Read-only state |
| `formatValue` | `(value: number) => string` | - | Custom value formatter |
| `label` | `string` | - | Accessibility label |
| `decrementAriaLabel` | `string` | `'Decrease value'` | Decrement button label |
| `incrementAriaLabel` | `string` | `'Increase value'` | Increment button label |

## Examples

### E-commerce Use Cases

#### Product Quantity Selector
```tsx
function ProductQuantity() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Quantity</label>
      <Counter
        value={quantity}
        onChange={setQuantity}
        min={1}
        max={99}
        label="Product quantity"
      />
      <p className="text-xs text-neutral-600">
        {quantity} {quantity === 1 ? 'item' : 'items'} selected
      </p>
    </div>
  );
}
```

#### Shopping Cart Items
```tsx
function CartItem({ item, onUpdateQuantity }) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-neutral-600">${item.price}</p>
      </div>
      <Counter
        size="sm"
        value={item.quantity}
        onChange={(value) => onUpdateQuantity(item.id, value)}
        min={0}
        max={99}
        label={`Quantity for ${item.name}`}
      />
    </div>
  );
}
```

#### Bulk Order Quantity
```tsx
function BulkOrder() {
  const [quantity, setQuantity] = useState(100);

  return (
    <Counter
      value={quantity}
      onChange={setQuantity}
      min={100}
      max={10000}
      step={100}
      variant="primary"
    />
  );
}
```

#### Price Adjustment
```tsx
function PriceInput() {
  const [price, setPrice] = useState(29.99);

  return (
    <Counter
      value={price}
      onChange={setPrice}
      min={0}
      max={999.99}
      step={0.01}
      formatValue={(value) => `$${value.toFixed(2)}`}
    />
  );
}
```

#### Inventory Management
```tsx
function StockControl() {
  const [stock, setStock] = useState(50);

  return (
    <div className="space-y-3">
      <Counter
        size="sm"
        variant="outline"
        value={stock}
        onChange={setStock}
        min={0}
        max={999}
        step={10}
        label="Stock quantity"
      />
      <div className="text-xs">
        {stock === 0 && <span className="text-danger-600">Out of stock</span>}
        {stock > 0 && stock <= 10 && <span className="text-warning-600">Low stock</span>}
        {stock > 10 && <span className="text-success-600">In stock</span>}
      </div>
    </div>
  );
}
```

#### Commission Rate Selector
```tsx
function CommissionSettings() {
  const [commission, setCommission] = useState(15);

  return (
    <div className="p-4 bg-primary-50 rounded-lg">
      <h4 className="font-medium mb-3">Commission Rate</h4>
      <Counter
        size="sm"
        variant="primary"
        value={commission}
        onChange={setCommission}
        min={15}
        max={25}
        step={5}
        formatValue={(value) => `${value}%`}
      />
      <p className="text-xs text-primary-700 mt-2">
        {commission === 15 && 'Bronze Tier'}
        {commission === 20 && 'Silver Tier'}
        {commission === 25 && 'Gold Tier'}
      </p>
    </div>
  );
}
```

### Advanced Use Cases

#### Product Configurator
```tsx
function ProductConfig() {
  const [config, setConfig] = useState({
    quantity: 1,
    warranty: 0,
    accessories: 0,
  });

  return (
    <div className="space-y-4">
      <div>
        <label>Quantity</label>
        <Counter
          value={config.quantity}
          onChange={(value) => setConfig({...config, quantity: value})}
          min={1}
          max={10}
        />
      </div>
      
      <div>
        <label>Extended Warranty (Years)</label>
        <Counter
          value={config.warranty}
          onChange={(value) => setConfig({...config, warranty: value})}
          min={0}
          max={3}
          size="sm"
        />
      </div>
      
      <div>
        <label>Accessories</label>
        <Counter
          value={config.accessories}
          onChange={(value) => setConfig({...config, accessories: value})}
          min={0}
          max={5}
          size="sm"
        />
      </div>
    </div>
  );
}
```

#### Rating Selector
```tsx
function RatingInput() {
  const [rating, setRating] = useState(4);

  return (
    <Counter
      value={rating}
      onChange={setRating}
      min={1}
      max={5}
      formatValue={(value) => `${value} ★`}
      size="sm"
    />
  );
}
```

## Keyboard Support

- **Arrow Up**: Increment value
- **Arrow Down**: Decrement value
- **Home**: Jump to minimum value
- **End**: Jump to maximum value

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements for value changes
- Focus management
- Disabled state support

## Styling

- Clean, minimal design
- Clear hover and active states
- Disabled visual feedback
- Consistent with form components
- Responsive sizing

## Integration with Forms

```tsx
// With React Hook Form
import { useForm, Controller } from 'react-hook-form';

function CheckoutForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      quantity: 1,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="quantity"
        control={control}
        rules={{ min: 1, max: 99 }}
        render={({ field }) => (
          <Counter
            value={field.value}
            onChange={field.onChange}
            min={1}
            max={99}
          />
        )}
      />
    </form>
  );
}
```

## Best Practices

1. **Set appropriate constraints** - Always define min/max values
2. **Use meaningful steps** - Match step size to the use case
3. **Provide clear labels** - Use accessibility labels for screen readers
4. **Format display values** - Use formatValue for currency, percentages, etc.
5. **Handle edge cases** - Consider what happens at min/max values
6. **Responsive sizing** - Use appropriate size variant for context
7. **Keyboard support** - Ensure all features work without mouse