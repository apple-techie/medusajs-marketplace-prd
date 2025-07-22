# Badge Component

A versatile badge component for displaying status indicators, notification counts, labels, and tags. Supports multiple variants, sizes, icons, and removable functionality.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Badge, BadgeIcons } from '@/components/atoms/Badge';

// Basic badge
<Badge>Default</Badge>

// With variant
<Badge variant="primary">Primary</Badge>

// With icons
<Badge leftIcon={<BadgeIcons.Plus />}>Add Item</Badge>
<Badge rightIcon={<BadgeIcons.Check />}>Completed</Badge>

// Removable badge
<Badge removable onRemove={() => console.log('Removed')}>
  Removable Tag
</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'outline'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `leftIcon` | `ReactNode` | - | Icon on the left side |
| `rightIcon` | `ReactNode` | - | Icon on the right side |
| `children` | `ReactNode` | - | Badge content |
| `removable` | `boolean` | `false` | Show remove button |
| `onRemove` | `() => void` | - | Remove button click handler |
| `className` | `string` | - | Additional CSS classes |

## Variants

### Default
```tsx
<Badge>Default</Badge>
```

### Primary
```tsx
<Badge variant="primary">Primary</Badge>
```

### Secondary
```tsx
<Badge variant="secondary">Secondary</Badge>
```

### Success
```tsx
<Badge variant="success">Success</Badge>
```

### Warning
```tsx
<Badge variant="warning">Warning</Badge>
```

### Danger
```tsx
<Badge variant="danger">Danger</Badge>
```

### Outline
```tsx
<Badge variant="outline">Outline</Badge>
```

## E-commerce Examples

### Product Status
```tsx
function ProductStatusBadges() {
  return (
    <div className="flex gap-2">
      <Badge variant="success" leftIcon={<BadgeIcons.Check />}>
        In Stock
      </Badge>
      <Badge variant="danger" leftIcon={<BadgeIcons.Alert />}>
        Out of Stock
      </Badge>
      <Badge variant="warning" leftIcon={<BadgeIcons.Info />}>
        Low Stock
      </Badge>
      <Badge variant="secondary">Pre-order</Badge>
    </div>
  );
}
```

### Order Status
```tsx
function OrderStatusBadges() {
  return (
    <div className="flex gap-2">
      <Badge variant="warning" leftIcon={<BadgeIcons.Dot />}>
        Pending
      </Badge>
      <Badge variant="primary" leftIcon={<BadgeIcons.Dot />}>
        Processing
      </Badge>
      <Badge variant="secondary" leftIcon={<BadgeIcons.Dot />}>
        Shipped
      </Badge>
      <Badge variant="success" leftIcon={<BadgeIcons.Dot />}>
        Delivered
      </Badge>
    </div>
  );
}
```

### User Roles & Tiers
```tsx
function UserRoles() {
  return (
    <div className="flex gap-2">
      <Badge variant="default">Customer</Badge>
      <Badge variant="primary">Shop Partner</Badge>
      <Badge variant="secondary">Brand Partner</Badge>
      <Badge variant="warning">Distributor</Badge>
      <Badge variant="success" leftIcon={<BadgeIcons.Star />}>
        Gold Tier
      </Badge>
    </div>
  );
}
```

### Commission Tiers
```tsx
function CommissionTiers() {
  return (
    <div className="flex gap-2">
      <Badge variant="outline">Bronze • 15%</Badge>
      <Badge variant="secondary">Silver • 20%</Badge>
      <Badge variant="warning" leftIcon={<BadgeIcons.Star />}>
        Gold • 25%
      </Badge>
    </div>
  );
}
```

### Product Categories (Removable)
```tsx
function ProductCategories() {
  const [categories, setCategories] = useState([
    'Electronics',
    'Home & Garden',
    'Fashion',
    'Sports',
  ]);

  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge
          key={category}
          size="sm"
          removable
          onRemove={() => removeCategory(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
```

### Notification Count
```tsx
function NotificationBadge() {
  return (
    <div className="relative">
      <button className="p-2 rounded-lg bg-neutral-100">
        <BellIcon className="w-6 h-6" />
      </button>
      <Badge 
        variant="danger" 
        size="sm" 
        className="absolute -top-1 -right-1"
      >
        3
      </Badge>
    </div>
  );
}
```

### Promotional Badges
```tsx
function PromotionalBadges() {
  return (
    <div className="flex gap-2">
      <Badge variant="danger">Sale</Badge>
      <Badge variant="warning">Limited Time</Badge>
      <Badge variant="success">Free Shipping</Badge>
      <Badge variant="primary">New Arrival</Badge>
      <Badge variant="secondary">Bestseller</Badge>
    </div>
  );
}
```

### Age Restrictions
```tsx
function AgeRestrictions() {
  return (
    <div className="flex gap-2">
      <Badge variant="danger" size="sm">18+</Badge>
      <Badge variant="danger" size="sm">21+</Badge>
      <Badge variant="warning" size="sm">ID Required</Badge>
    </div>
  );
}
```

### Filter Tags
```tsx
function ActiveFilters() {
  const [filters, setFilters] = useState([
    { id: '1', label: 'Under $50' },
    { id: '2', label: 'Free Shipping' },
    { id: '3', label: '4+ Stars' },
  ]);

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-600">Filters:</span>
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          size="sm"
          variant="secondary"
          removable
          onRemove={() => removeFilter(filter.id)}
        >
          {filter.label}
        </Badge>
      ))}
    </div>
  );
}
```

## Built-in Icons

The component includes commonly used icons:

```tsx
import { BadgeIcons } from '@/components/atoms/Badge';

// Available icons
<BadgeIcons.Plus />
<BadgeIcons.Check />
<BadgeIcons.Info />
<BadgeIcons.Alert />
<BadgeIcons.Star />
<BadgeIcons.Dot />
```

## Styling

- Rounded pill shape with 20px border radius
- Smooth color transitions
- Proper contrast ratios for accessibility
- Focus states for keyboard navigation
- Hover states for interactive elements

## Best Practices

1. **Choose appropriate variants** - Use semantic colors (success for positive, danger for negative)
2. **Keep text concise** - Badges should contain short labels
3. **Use icons meaningfully** - Icons should enhance understanding, not clutter
4. **Group related badges** - Keep similar badges together for better scanning
5. **Consider size hierarchy** - Use different sizes to show importance
6. **Removable tags** - Use for user-controlled filters and selections
7. **Accessibility** - Ensure sufficient color contrast and keyboard support

## Accessibility

- Proper color contrast ratios
- Keyboard accessible remove buttons
- Screen reader friendly
- Focus indicators
- Semantic HTML structure