# Select Component

A flexible dropdown select component that matches the input field styling with a chevron indicator.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

## Usage

```tsx
import { Select } from '@/components/atoms/Select';

// Basic usage
<Select 
  placeholder="Select an option"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]}
/>

// With label and helper text
<Select 
  label="Category"
  placeholder="Select a category"
  helperText="Choose the most relevant category"
  options={categories}
  required
/>

// Error state
<Select 
  label="Country"
  error
  errorMessage="Please select your country"
  options={countries}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'error' \| 'success'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Select size |
| `label` | `string` | - | Label text |
| `labelClassName` | `string` | - | Custom label classes |
| `required` | `boolean` | `false` | Show required asterisk |
| `helperText` | `string` | - | Helper text below select |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `string` | - | Error message (overrides helperText) |
| `options` | `Array<{value, label, disabled?}>` | `[]` | Select options |
| `placeholder` | `string` | `'Select an option'` | Placeholder text |
| `containerClassName` | `string` | - | Container wrapper classes |
| `icon` | `ReactNode` | `<ChevronDown />` | Custom dropdown icon |

## Options Format

```typescript
interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

const options: Option[] = [
  { value: 'id', label: 'Indonesia' },
  { value: 'my', label: 'Malaysia' },
  { value: 'sg', label: 'Singapore' },
  { value: 'th', label: 'Thailand', disabled: true },
];
```

## Examples

### E-commerce Use Cases

#### Product Category
```tsx
<Select 
  label="Product Category"
  placeholder="Select a category"
  required
  options={[
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
  ]}
/>
```

#### Vendor Type Selection
```tsx
<Select 
  label="Vendor Type"
  placeholder="Select vendor type"
  helperText="This determines your commission structure"
  options={[
    { value: 'shop', label: 'Shop (Affiliate)' },
    { value: 'brand', label: 'Brand (Direct Supplier)' },
    { value: 'distributor', label: 'Distributor (Fulfillment)' },
  ]}
/>
```

#### Order Status
```tsx
<Select 
  label="Order Status"
  defaultValue="pending"
  options={[
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ]}
/>
```

#### Shipping Provider
```tsx
<Select 
  label="Shipping Provider"
  options={[
    { value: 'internal', label: 'Neo Mart Express' },
    { value: 'jne', label: 'JNE' },
    { value: 'jnt', label: 'J&T Express' },
    { value: 'sicepat', label: 'SiCepat' },
  ]}
/>
```

### Form Integration

```tsx
function CheckoutForm() {
  const [country, setCountry] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [errors, setErrors] = useState({});

  return (
    <form>
      <Select 
        label="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        error={!!errors.country}
        errorMessage={errors.country}
        required
        options={[
          { value: 'id', label: 'Indonesia' },
          { value: 'my', label: 'Malaysia' },
          { value: 'sg', label: 'Singapore' },
        ]}
      />
      
      <Select 
        label="Shipping Method"
        value={shippingMethod}
        onChange={(e) => setShippingMethod(e.target.value)}
        error={!!errors.shippingMethod}
        errorMessage={errors.shippingMethod}
        required
        options={[
          { value: 'standard', label: 'Standard (5-7 days)' },
          { value: 'express', label: 'Express (2-3 days)' },
          { value: 'overnight', label: 'Overnight' },
        ]}
      />
    </form>
  );
}
```

## Styling

The Select component is styled to match the Input component:
- Same border styles and colors
- Same focus states
- Same size variants
- Same error/success states

## Accessibility

- Proper label association
- Required field indication
- Error state announcements
- Keyboard navigation support
- Screen reader compatible

## Integration with MedusaJS

```tsx
// Example: Product variant selector
import { useProduct } from '@medusajs/medusa-react';
import { Select } from '@/components/atoms/Select';

function ProductVariantSelector({ productId }) {
  const { product } = useProduct(productId);
  const [selectedVariant, setSelectedVariant] = useState('');

  const variantOptions = product?.variants.map(variant => ({
    value: variant.id,
    label: variant.title,
    disabled: variant.inventory_quantity === 0,
  })) || [];

  return (
    <Select 
      label="Select Size"
      value={selectedVariant}
      onChange={(e) => setSelectedVariant(e.target.value)}
      options={variantOptions}
      required
      helperText="Out of stock sizes are disabled"
    />
  );
}
```

## Future Enhancements

For production use, consider implementing a custom select component using:
- **Radix UI Select**: For better accessibility and customization
- **React Select**: For advanced features like search, multi-select
- **Headless UI**: For unstyled, accessible components

This would allow for:
- Custom option rendering (with icons, descriptions)
- Search/filter functionality
- Multi-select capability
- Better mobile experience
- Keyboard navigation improvements