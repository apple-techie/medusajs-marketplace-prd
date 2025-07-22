# Checkbox Component

A flexible checkbox component with support for labels, descriptions, and various states including indeterminate.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

## Usage

```tsx
import { Checkbox } from '@/components/atoms/Checkbox';

// Basic checkbox
<Checkbox />

// With label
<Checkbox label="Remember me" />

// With label and description
<Checkbox 
  label="Send me emails"
  description="You can unsubscribe at any time"
/>

// Controlled checkbox
<Checkbox 
  label="I agree to terms"
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
/>

// Error state
<Checkbox 
  label="Required field"
  error
  required
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'error'` | `'default'` | Visual variant |
| `label` | `ReactNode` | - | Checkbox label |
| `labelClassName` | `string` | - | Custom label styles |
| `description` | `string` | - | Helper text below label |
| `descriptionClassName` | `string` | - | Custom description styles |
| `error` | `boolean` | `false` | Error state |
| `indeterminate` | `boolean` | `false` | Indeterminate state |
| `containerClassName` | `string` | - | Container wrapper classes |
| `checkIcon` | `ReactNode` | `<Check />` | Custom check icon |
| `disabled` | `boolean` | `false` | Disabled state |
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state |

## States

### Checked/Unchecked
The checkbox can be controlled or uncontrolled:

```tsx
// Uncontrolled
<Checkbox defaultChecked />

// Controlled
const [checked, setChecked] = useState(false);
<Checkbox 
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

### Indeterminate
Used for "select all" scenarios:

```tsx
<Checkbox 
  label="Select all"
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onChange={handleSelectAll}
/>
```

### Error State
```tsx
<Checkbox 
  label="Accept terms"
  error={hasError}
  required
/>
```

## Examples

### E-commerce Use Cases

#### Terms and Conditions
```tsx
<Checkbox 
  label="I agree to the Terms and Conditions"
  required
  error={!termsAccepted && submitted}
/>
```

#### Product Filters
```tsx
function ProductFilters() {
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    freeShipping: false,
  });

  return (
    <div className="space-y-3">
      <Checkbox
        label="In Stock"
        checked={filters.inStock}
        onChange={(e) => setFilters({
          ...filters,
          inStock: e.target.checked
        })}
      />
      <Checkbox
        label="On Sale"
        checked={filters.onSale}
        onChange={(e) => setFilters({
          ...filters,
          onSale: e.target.checked
        })}
      />
      <Checkbox
        label="Free Shipping"
        checked={filters.freeShipping}
        onChange={(e) => setFilters({
          ...filters,
          freeShipping: e.target.checked
        })}
      />
    </div>
  );
}
```

#### Bulk Selection
```tsx
function ProductList() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected = selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  return (
    <>
      <Checkbox
        label="Select all"
        checked={allSelected}
        indeterminate={someSelected && !allSelected}
        onChange={handleSelectAll}
      />
      {products.map(product => (
        <Checkbox
          key={product.id}
          label={product.name}
          checked={selectedIds.includes(product.id)}
          onChange={() => toggleProduct(product.id)}
        />
      ))}
    </>
  );
}
```

### Vendor Dashboard

#### Permissions
```tsx
<div className="space-y-3">
  <h3 className="font-medium">User Permissions</h3>
  
  <Checkbox
    label="View Orders"
    description="Can view order details and history"
    checked={permissions.viewOrders}
    onChange={updatePermission('viewOrders')}
  />
  
  <Checkbox
    label="Manage Products"
    description="Can add, edit, and delete products"
    checked={permissions.manageProducts}
    onChange={updatePermission('manageProducts')}
  />
  
  <Checkbox
    label="View Analytics"
    description="Can access sales and performance data"
    checked={permissions.viewAnalytics}
    onChange={updatePermission('viewAnalytics')}
  />
</div>
```

#### Email Preferences
```tsx
<div className="space-y-3">
  <h3 className="font-medium">Email Notifications</h3>
  
  <Checkbox
    label="Order notifications"
    description="Get notified when you receive new orders"
    defaultChecked
  />
  
  <Checkbox
    label="Marketing emails"
    description="Receive tips and promotional content"
  />
  
  <Checkbox
    label="Weekly reports"
    description="Summary of your sales performance"
    defaultChecked
  />
</div>
```

## Accessibility

- Uses native checkbox input for full accessibility
- Screen reader friendly with proper labeling
- Keyboard navigable (Space to toggle)
- Focus states for keyboard navigation
- ARIA attributes for state indication
- Label click toggles checkbox

## Styling

The checkbox uses:
- Primary color (purple) for checked state
- Neutral borders for unchecked state
- Error color (red) for error variant
- Smooth transitions for state changes
- Clear focus indicators

## Integration with Forms

```tsx
// With React Hook Form
import { useForm } from 'react-hook-form';

function CheckoutForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <form>
      <Checkbox
        label="Save payment method"
        {...register('savePayment')}
      />
      
      <Checkbox
        label="I agree to the terms"
        error={!!errors.terms}
        {...register('terms', { required: true })}
      />
    </form>
  );
}
```

## Custom Icons

You can provide a custom check icon:

```tsx
<Checkbox
  label="Custom check"
  checkIcon={<Heart className="h-3 w-3" />}
/>
```