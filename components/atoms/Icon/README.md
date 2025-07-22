# Icon Component

A comprehensive icon system providing a consistent set of SVG icons for the application. The component supports multiple sizes, colors, and includes a complete icon library for e-commerce use cases.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Icon } from '@/components/atoms/Icon';

// Basic usage
<Icon icon="search" />

// With size
<Icon icon="cart" size="lg" />

// With color
<Icon icon="check" color="success" />

// With accessibility label
<Icon icon="bell" label="Notifications" />

// With custom styling
<Icon icon="star" className="animate-pulse" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `keyof typeof icons` | - | Icon name from the library |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Icon size |
| `color` | `'current' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'neutral' \| 'white'` | `'current'` | Icon color |
| `label` | `string` | - | Accessibility label |
| `className` | `string` | - | Additional CSS classes |
| ...SVGProps | - | - | All standard SVG properties |

## Icon Library

### Navigation Icons
- `chevronDown`, `chevronUp`, `chevronLeft`, `chevronRight`
- `arrowDown`, `arrowUp`
- `menu`, `close`
- `home`

### Action Icons
- `plus`, `minus`
- `edit`, `trash`, `copy`
- `search`, `logout`
- `expand`, `externalLink`

### E-commerce Icons
- `cart`, `bag`, `tag`
- `star`, `starFilled`
- `store`

### Communication Icons
- `bell`, `message`, `mail`
- `user`, `users`

### Status Icons
- `check`, `info`, `alert`
- `clock`, `calendar`
- `activity`

### File Icons
- `file`, `folder`, `image`

### UI Icons
- `moreHorizontal`
- `settings`
- `location`
- `sort`

## Size Reference

- **xs**: 12x12px (h-3 w-3)
- **sm**: 16x16px (h-4 w-4)
- **md**: 20x20px (h-5 w-5)
- **lg**: 24x24px (h-6 w-6)
- **xl**: 32x32px (h-8 w-8)

## Color Reference

- **current**: Inherits text color
- **primary**: Primary brand color (primary-600)
- **secondary**: Neutral secondary (neutral-600)
- **success**: Success green (success-600)
- **warning**: Warning yellow (warning-600)
- **danger**: Danger red (danger-600)
- **neutral**: Dark neutral (neutral-900)
- **white**: White

## Examples

### In Buttons
```tsx
<button className="inline-flex items-center gap-2">
  <Icon icon="plus" size="sm" />
  Add to Cart
</button>

<button className="inline-flex items-center gap-2">
  <Icon icon="trash" size="sm" color="danger" />
  Delete
</button>
```

### Navigation Menu
```tsx
<nav className="flex gap-6">
  <a href="#" className="flex items-center gap-2">
    <Icon icon="home" />
    Home
  </a>
  <a href="#" className="flex items-center gap-2">
    <Icon icon="bag" />
    Products
  </a>
  <a href="#" className="flex items-center gap-2">
    <Icon icon="cart" />
    Cart
  </a>
</nav>
```

### Status Messages
```tsx
<div className="flex items-center gap-2 text-success-600">
  <Icon icon="check" color="success" />
  Order completed successfully
</div>

<div className="flex items-center gap-2 text-warning-600">
  <Icon icon="alert" color="warning" />
  Low stock warning
</div>
```

### Notification Badge
```tsx
<div className="relative">
  <Icon icon="bell" size="lg" />
  <span className="absolute -top-1 -right-1 h-2 w-2 bg-danger-500 rounded-full" />
</div>
```

### Rating Display
```tsx
function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={star <= value ? 'starFilled' : 'star'}
          color={star <= value ? 'warning' : 'secondary'}
          size="sm"
        />
      ))}
    </div>
  );
}
```

### Loading States
```tsx
// Pulsing animation
<Icon icon="activity" className="animate-pulse" />

// Spinning animation
<Icon icon="settings" className="animate-spin" />
```

### With Tooltips
```tsx
<div className="relative group">
  <Icon icon="info" color="secondary" />
  <span className="absolute hidden group-hover:block ...">
    Additional information
  </span>
</div>
```

### Custom Colors
```tsx
// Using Tailwind utilities
<Icon icon="star" className="text-yellow-400" />

// Using style prop
<Icon icon="heart" style={{ color: '#ff69b4' }} />
```

## Accessibility

- Use the `label` prop for icons that convey meaning
- Icons with labels get `role="img"` for screen readers
- Decorative icons should not have labels
- All icons use `currentColor` for proper contrast inheritance

## Adding New Icons

To add new icons to the library:

1. Add the icon function to the `icons` object in Icon.tsx
2. Follow the consistent SVG structure:
   - viewBox="0 0 24 24"
   - fill="none"
   - stroke="currentColor"
   - strokeWidth={2}
   - strokeLinecap="round"
   - strokeLinejoin="round"

Example:
```tsx
newIcon: (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* SVG paths here */}
  </svg>
),
```

## Best Practices

1. **Use semantic colors** - Match icon colors to their meaning
2. **Size appropriately** - Use consistent sizes throughout the UI
3. **Add labels** - Provide labels for important interactive icons
4. **Group related icons** - Keep similar icons together visually
5. **Consider context** - Choose icons that match your use case
6. **Test accessibility** - Ensure icons work with screen readers
7. **Optimize performance** - Icons are inline SVGs for best performance