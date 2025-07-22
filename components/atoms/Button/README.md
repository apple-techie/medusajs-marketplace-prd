# Button Component

A flexible and accessible button component that supports multiple variants, sizes, and states.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

## Usage

```tsx
import { Button } from '@/components/atoms/Button';
import { ShoppingCart } from 'lucide-react';

// Basic usage
<Button>Click me</Button>

// With variant
<Button variant="outline">Outline Button</Button>

// With icon
<Button leftIcon={<ShoppingCart className="h-5 w-5" />}>
  Add to Cart
</Button>

// Loading state
<Button isLoading loadingText="Processing...">
  Submit
</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'primaryDark' \| 'ghost' \| 'ghostDark' \| 'outline' \| 'outlineDark' \| 'outlineNeutral'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `leftIcon` | `ReactNode` | - | Icon to display on the left |
| `rightIcon` | `ReactNode` | - | Icon to display on the right |
| `isLoading` | `boolean` | `false` | Show loading spinner |
| `loadingText` | `string` | - | Text to show while loading |
| `disabled` | `boolean` | `false` | Disable the button |
| `asChild` | `boolean` | `false` | Render as child component |

## Variants

### Primary
- `primary` - Primary brand color (purple-500)
- `primaryDark` - Darker primary (purple-800)

### Ghost
- `ghost` - Text only with hover background
- `ghostDark` - Darker ghost variant

### Outline
- `outline` - Primary color outline
- `outlineDark` - Dark primary outline
- `outlineNeutral` - Neutral gray outline

## Sizes

- `sm` - Small (h-9, text-sm)
- `md` - Medium (h-10, text-base) - Default
- `lg` - Large (h-11, text-base)
- `xl` - Extra Large (h-12, text-lg)

## Examples

### E-commerce Actions
```tsx
// Add to cart
<Button leftIcon={<ShoppingCart />}>
  Add to Cart
</Button>

// Buy now
<Button variant="primaryDark" size="lg">
  Buy Now
</Button>

// Save for later
<Button variant="ghost" leftIcon={<Heart />}>
  Save
</Button>
```

### Form Actions
```tsx
// Submit form
<Button type="submit" isLoading={isSubmitting}>
  Submit Order
</Button>

// Cancel
<Button variant="outlineNeutral" onClick={onCancel}>
  Cancel
</Button>
```

### Vendor Dashboard
```tsx
// Create product
<Button leftIcon={<Plus />}>
  Add Product
</Button>

// Export data
<Button variant="outline" leftIcon={<Download />}>
  Export CSV
</Button>
```

## Accessibility

- Proper focus states with visible ring
- Disabled state handling
- Loading state announces to screen readers
- Semantic HTML button element
- Keyboard navigation support

## Integration with MedusaJS

```tsx
// Example: Add to cart button
import { useCart } from '@medusajs/medusa-react';
import { Button } from '@/components/atoms/Button';

function AddToCartButton({ variant }: { variant: ProductVariant }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart({
      variant_id: variant.id,
      quantity: 1,
    });
    setIsAdding(false);
  };

  return (
    <Button
      onClick={handleAddToCart}
      isLoading={isAdding}
      loadingText="Adding..."
      leftIcon={<ShoppingCart className="h-5 w-5" />}
    >
      Add to Cart
    </Button>
  );
}
```