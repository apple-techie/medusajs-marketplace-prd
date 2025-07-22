# Input Component

A flexible and accessible input field component with support for labels, icons, addons, and validation states.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

## Usage

```tsx
import { Input } from '@/components/atoms/Input';
import { Mail, Lock } from 'lucide-react';

// Basic input
<Input placeholder="Enter text" />

// With label and helper text
<Input 
  label="Email"
  placeholder="you@example.com"
  helperText="We'll never share your email"
  required
/>

// With icons
<Input 
  label="Email"
  placeholder="Enter your email"
  leftIcon={<Mail className="h-4 w-4" />}
/>

// Error state
<Input 
  label="Email"
  placeholder="Enter your email"
  error
  errorMessage="Please enter a valid email"
/>

// With addons
<Input 
  label="Price"
  placeholder="0.00"
  leftAddon="IDR"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'error' \| 'success'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `label` | `string` | - | Label text |
| `labelClassName` | `string` | - | Custom label classes |
| `required` | `boolean` | `false` | Show required asterisk |
| `helperText` | `string` | - | Helper text below input |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `string` | - | Error message (overrides helperText) |
| `leftIcon` | `ReactNode` | - | Icon on the left |
| `rightIcon` | `ReactNode` | - | Icon on the right |
| `leftAddon` | `ReactNode` | - | Addon on the left |
| `rightAddon` | `ReactNode` | - | Addon on the right |
| `containerClassName` | `string` | - | Container wrapper classes |

## Variants

### Default
Standard input with neutral border and primary focus state.

### Error
Red border with error focus state. Automatically applied when `error` prop is true.

### Success
Green border with success focus state.

## Sizes

- `sm` - Small (h-9, text-xs)
- `md` - Medium (h-10, text-sm) - Default
- `lg` - Large (h-11, text-base)

## Examples

### Form Fields

```tsx
// Login form
<form>
  <Input 
    label="Email"
    type="email"
    placeholder="you@example.com"
    leftIcon={<Mail className="h-4 w-4" />}
    required
  />
  
  <Input 
    label="Password"
    type="password"
    placeholder="Enter your password"
    leftIcon={<Lock className="h-4 w-4" />}
    required
  />
</form>
```

### E-commerce Fields

```tsx
// Product form
<Input 
  label="Product Name"
  placeholder="Enter product name"
  required
  helperText="Use a descriptive name"
/>

<Input 
  label="Price"
  type="number"
  placeholder="0.00"
  leftAddon="IDR"
  required
/>

<Input 
  label="SKU"
  placeholder="ABC-123-XYZ"
  helperText="Stock Keeping Unit"
/>
```

### Search Input

```tsx
<Input 
  type="search"
  placeholder="Search products..."
  leftIcon={<Search className="h-4 w-4" />}
  containerClassName="max-w-md"
/>
```

### Password Input with Toggle

```tsx
function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <Input
      label="Password"
      type={showPassword ? 'text' : 'password'}
      placeholder="Enter password"
      leftIcon={<Lock className="h-4 w-4" />}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="cursor-pointer"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
    />
  );
}
```

## Validation

```tsx
// With validation
const [email, setEmail] = useState('');
const [error, setError] = useState(false);

const validateEmail = (value: string) => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  setError(!isValid);
};

<Input 
  label="Email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  }}
  error={error}
  errorMessage="Please enter a valid email"
  leftIcon={<Mail className="h-4 w-4" />}
/>
```

## Accessibility

- Proper label association with input
- Required field indication
- Error state announcements
- Keyboard navigation support
- Focus management
- ARIA attributes for screen readers

## Integration with MedusaJS

```tsx
// Example: Vendor product form
import { useAdminCreateProduct } from '@medusajs/medusa-react';
import { Input } from '@/components/atoms/Input';

function CreateProductForm() {
  const createProduct = useAdminCreateProduct();
  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createProduct.mutate({
        title,
        handle,
        // ... other fields
      });
    } catch (error) {
      setErrors(error.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        label="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!!errors.title}
        errorMessage={errors.title}
        required
      />
      
      <Input 
        label="URL Handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        helperText="This will be used in the product URL"
        error={!!errors.handle}
        errorMessage={errors.handle}
      />
    </form>
  );
}
```