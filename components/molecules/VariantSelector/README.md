# VariantSelector Component

A flexible variant selector component for e-commerce products. Supports multiple variant types including colors, sizes, text options, and images with stock and pricing information.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { VariantSelector } from '@/components/molecules/VariantSelector';

// Basic usage
<VariantSelector
  groups={[
    {
      id: 'color',
      name: 'Color',
      type: 'color',
      options: [
        { value: 'red', label: 'Red', color: '#FF0000', available: true },
        { value: 'blue', label: 'Blue', color: '#0000FF', available: true }
      ]
    },
    {
      id: 'size',
      name: 'Size',
      type: 'size',
      options: [
        { value: 's', label: 'S', available: true, stock: 10 },
        { value: 'm', label: 'M', available: true, stock: 3 }
      ]
    }
  ]}
  onChange={(groupId, value) => console.log(groupId, value)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `groups` | `VariantGroup[]` | - | **Required**. Array of variant groups |
| `selected` | `Record<string, string>` | `{}` | Currently selected values |
| `variant` | `'default' \| 'compact' \| 'inline'` | `'default'` | Display variant |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `showPrice` | `boolean` | `true` | Show price differences |
| `showStock` | `boolean` | `false` | Show stock information |
| `showImages` | `boolean` | `true` | Show images for image variants |
| `imageSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Image option size |
| `colorSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Color swatch size |
| `disableUnavailable` | `boolean` | `false` | Disable unavailable options |
| `singleGroup` | `boolean` | `false` | Single group mode |
| `outOfStockLabel` | `string` | `'Out of stock'` | Out of stock label |
| `lowStockThreshold` | `number` | `5` | Low stock threshold |
| `lowStockLabel` | `string` | `'Low stock'` | Low stock label |
| `selectLabel` | `string` | `'Select'` | Selection label |
| `onChange` | `(groupId, value) => void` | - | Change handler |
| `onComplete` | `(selections) => void` | - | Completion handler |
| `className` | `string` | - | Container CSS classes |
| `groupClassName` | `string` | - | Group CSS classes |
| `optionClassName` | `string` | - | Option CSS classes |
| `aria-label` | `string` | - | Accessibility label |

## Types

### VariantGroup

```typescript
interface VariantGroup {
  id: string;
  name: string;
  type: 'color' | 'size' | 'text' | 'image';
  options: VariantOption[];
  required?: boolean;
}
```

### VariantOption

```typescript
interface VariantOption {
  value: string;
  label: string;
  available?: boolean;
  price?: number;
  originalPrice?: number;
  color?: string;      // For color type
  image?: string;      // For image type
  stock?: number;      // Stock quantity
  metadata?: Record<string, any>;
}
```

## Variant Types

### Color Variants

```tsx
<VariantSelector
  groups={[
    {
      id: 'color',
      name: 'Color',
      type: 'color',
      options: [
        { value: 'black', label: 'Black', color: '#000000', available: true },
        { value: 'white', label: 'White', color: '#FFFFFF', available: true },
        { value: 'red', label: 'Red', color: '#EF4444', available: false }
      ]
    }
  ]}
/>
```

### Size Variants

```tsx
<VariantSelector
  groups={[
    {
      id: 'size',
      name: 'Size',
      type: 'size',
      options: [
        { value: 's', label: 'S', available: true, stock: 10 },
        { value: 'm', label: 'M', available: true, stock: 3 },
        { value: 'l', label: 'L', available: true, stock: 0 }
      ]
    }
  ]}
  showStock
/>
```

### Image Variants

```tsx
<VariantSelector
  groups={[
    {
      id: 'style',
      name: 'Style',
      type: 'image',
      options: [
        { 
          value: 'classic', 
          label: 'Classic', 
          image: 'classic.jpg',
          available: true 
        },
        { 
          value: 'modern', 
          label: 'Modern', 
          image: 'modern.jpg',
          available: true 
        }
      ]
    }
  ]}
  showImages
  imageSize="lg"
/>
```

### Text Variants

```tsx
<VariantSelector
  groups={[
    {
      id: 'material',
      name: 'Material',
      type: 'text',
      options: [
        { value: 'cotton', label: '100% Cotton', available: true, price: 29.99 },
        { value: 'blend', label: 'Cotton Blend', available: true, price: 24.99 }
      ]
    }
  ]}
  showPrice
/>
```

## Display Variants

### Default Variant

```tsx
<VariantSelector
  groups={groups}
  variant="default"
/>
```

### Compact Variant

```tsx
<VariantSelector
  groups={groups}
  variant="compact"
/>
```

### Inline Variant (Radio Style)

```tsx
<VariantSelector
  groups={[textGroup]}
  variant="inline"
  showPrice
/>
```

## Stock & Pricing

### Show Stock Information

```tsx
<VariantSelector
  groups={groups}
  showStock
  lowStockThreshold={5}
  lowStockLabel="Only few left"
  outOfStockLabel="Sold out"
/>
```

### Show Price Differences

```tsx
<VariantSelector
  groups={[
    {
      id: 'size',
      name: 'Size',
      type: 'size',
      options: [
        { value: 's', label: 'S', available: true, price: 29.99 },
        { value: 'l', label: 'L', available: true, price: 34.99 }
      ]
    }
  ]}
  showPrice
/>
```

## Behavior Options

### Disable Unavailable Options

```tsx
<VariantSelector
  groups={groups}
  disableUnavailable
/>
```

### Single Group Mode

```tsx
<VariantSelector
  groups={[sizeGroup]}
  singleGroup
/>
```

### Required vs Optional Groups

```tsx
<VariantSelector
  groups={[
    { id: 'size', name: 'Size', type: 'size', options: [...] },
    { id: 'gift', name: 'Gift Wrap', type: 'text', required: false, options: [...] }
  ]}
/>
```

## Event Handling

### Change Handler

```tsx
<VariantSelector
  groups={groups}
  onChange={(groupId, value) => {
    console.log(`Selected ${value} for ${groupId}`);
  }}
/>
```

### Completion Handler

```tsx
<VariantSelector
  groups={groups}
  onComplete={(selections) => {
    console.log('All required options selected:', selections);
    // Enable add to cart button
  }}
/>
```

## Complete Examples

### T-Shirt Product

```tsx
<VariantSelector
  groups={[
    {
      id: 'color',
      name: 'Color',
      type: 'color',
      options: [
        { value: 'black', label: 'Black', color: '#000000', available: true },
        { value: 'white', label: 'White', color: '#FFFFFF', available: true },
        { value: 'navy', label: 'Navy', color: '#1E3A8A', available: true }
      ]
    },
    {
      id: 'size',
      name: 'Size',
      type: 'size',
      options: [
        { value: 's', label: 'S', available: true, stock: 15 },
        { value: 'm', label: 'M', available: true, stock: 8 },
        { value: 'l', label: 'L', available: true, stock: 3 },
        { value: 'xl', label: 'XL', available: false }
      ]
    }
  ]}
  selected={{ color: 'black' }}
  showStock
  disableUnavailable
  onComplete={(selections) => {
    enableAddToCart(selections);
  }}
/>
```

### Computer Configuration

```tsx
<VariantSelector
  groups={[
    {
      id: 'processor',
      name: 'Processor',
      type: 'text',
      options: [
        { value: 'i5', label: 'Intel i5', available: true, price: 0 },
        { value: 'i7', label: 'Intel i7', available: true, price: 300 },
        { value: 'i9', label: 'Intel i9', available: true, price: 600 }
      ]
    },
    {
      id: 'memory',
      name: 'Memory',
      type: 'size',
      options: [
        { value: '8gb', label: '8GB', available: true, price: 0 },
        { value: '16gb', label: '16GB', available: true, price: 200 },
        { value: '32gb', label: '32GB', available: true, price: 600 }
      ]
    }
  ]}
  variant="inline"
  showPrice
  onChange={(groupId, value) => {
    updateConfiguration(groupId, value);
    recalculatePrice();
  }}
/>
```

## Accessibility

- Keyboard navigation support
- ARIA labels and pressed states
- Screen reader announcements
- Focus indicators
- Disabled state handling
- Required field indicators

## Best Practices

1. **Group Order**: Place most important variants first (usually color/size)
2. **Stock Display**: Show stock for sizes, hide for colors
3. **Price Display**: Show when variants affect pricing
4. **Disable Strategy**: Disable unavailable options for better UX
5. **Default Selection**: Pre-select popular options
6. **Image Quality**: Use consistent image sizes and quality
7. **Mobile**: Test touch targets on mobile devices
8. **Loading**: Show skeletons while loading options