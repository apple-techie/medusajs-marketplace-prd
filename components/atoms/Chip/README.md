# Chip Component

A versatile chip component for displaying tags, categories, filters, and removable items. Supports icons, selection states, and group layouts.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Chip, ChipGroup, ChipIcons } from '@/components/atoms/Chip';

// Basic chip
<Chip>Tag Name</Chip>

// With left icon
<Chip leftIcon={<ChipIcons.Plus />}>
  Add Item
</Chip>

// Removable chip
<Chip onRemove={() => handleRemove()}>
  Removable Tag
</Chip>

// Selected state
<Chip selected>
  Selected Item
</Chip>

// Chip group
<ChipGroup>
  <Chip>React</Chip>
  <Chip>TypeScript</Chip>
  <Chip>Next.js</Chip>
</ChipGroup>
```

## Chip Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'filled' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Chip size |
| `leftIcon` | `ReactNode` | - | Icon to display on the left |
| `rightIcon` | `ReactNode` | - | Icon to display on the right |
| `children` | `ReactNode` | - | Chip content |
| `onRemove` | `() => void` | - | Callback for remove button |
| `selected` | `boolean` | `false` | Selected state |
| `disabled` | `boolean` | `false` | Disabled state |
| `onClick` | `(e: MouseEvent) => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |

## ChipGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | `'tight' \| 'normal' \| 'loose'` | `'normal'` | Gap between chips |
| `children` | `ReactNode` | - | Chip components |
| `className` | `string` | - | Additional CSS classes |

## Examples

### E-commerce Use Cases

#### Product Tags
```tsx
function ProductTags() {
  return (
    <ChipGroup>
      <Chip variant="primary" leftIcon={<ChipIcons.Tag />}>
        New Arrival
      </Chip>
      <Chip variant="success">In Stock</Chip>
      <Chip variant="warning">Limited Edition</Chip>
      <Chip variant="danger">Sale</Chip>
    </ChipGroup>
  );
}
```

#### Filter Management
```tsx
function FilterChips({ filters, onRemoveFilter }) {
  return (
    <ChipGroup>
      {filters.map((filter) => (
        <Chip 
          key={filter.id}
          onRemove={() => onRemoveFilter(filter.id)}
        >
          {filter.label}
        </Chip>
      ))}
    </ChipGroup>
  );
}
```

#### Category Selection
```tsx
function CategorySelector() {
  const [selected, setSelected] = useState<string[]>([]);
  const categories = ['Electronics', 'Clothing', 'Home', 'Sports'];
  
  const toggleCategory = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  return (
    <ChipGroup>
      {categories.map((category) => (
        <Chip
          key={category}
          selected={selected.includes(category)}
          onClick={() => toggleCategory(category)}
        >
          {category}
        </Chip>
      ))}
    </ChipGroup>
  );
}
```

#### Order Status
```tsx
function OrderStatus({ status }) {
  const statusConfig = {
    pending: { variant: 'secondary', label: 'Pending' },
    processing: { variant: 'primary', label: 'Processing' },
    shipped: { variant: 'success', label: 'Shipped' },
    delivered: { variant: 'success', label: 'Delivered' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
  };
  
  const config = statusConfig[status];
  
  return (
    <Chip variant={config.variant}>
      {config.label}
    </Chip>
  );
}
```

#### Vendor Badges
```tsx
function VendorBadges({ vendor }) {
  return (
    <ChipGroup>
      {vendor.verified && (
        <Chip variant="filled" leftIcon={<ChipIcons.Check />}>
          Verified Vendor
        </Chip>
      )}
      {vendor.tier && (
        <Chip variant="primary">
          {vendor.tier} Tier
        </Chip>
      )}
      {vendor.type && (
        <Chip variant="secondary">
          {vendor.type} Partner
        </Chip>
      )}
      {vendor.rating && (
        <Chip>
          {vendor.rating}★ Rating
        </Chip>
      )}
    </ChipGroup>
  );
}
```

### Advanced Examples

#### Dynamic Tag Input
```tsx
function TagInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };
  
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder="Add a tag..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          onClick={() => addTag(input)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg"
        >
          Add
        </button>
      </div>
      <ChipGroup>
        {tags.map((tag) => (
          <Chip key={tag} onRemove={() => removeTag(tag)}>
            {tag}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}
```

#### Multi-Select Filter
```tsx
function MultiSelectFilter({ options, onChange }) {
  const [selected, setSelected] = useState<string[]>([]);
  
  const toggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    
    setSelected(newSelected);
    onChange(newSelected);
  };
  
  return (
    <ChipGroup>
      {options.map((option) => (
        <Chip
          key={option.value}
          selected={selected.includes(option.value)}
          onClick={() => toggle(option.value)}
          leftIcon={option.icon}
        >
          {option.label}
        </Chip>
      ))}
    </ChipGroup>
  );
}
```

### Styling Examples

#### Size Variations
```tsx
<ChipGroup>
  <Chip size="sm">Small</Chip>
  <Chip size="md">Medium</Chip>
  <Chip size="lg">Large</Chip>
</ChipGroup>
```

#### Variant Showcase
```tsx
<ChipGroup>
  <Chip variant="default">Default</Chip>
  <Chip variant="filled">Filled</Chip>
  <Chip variant="primary">Primary</Chip>
  <Chip variant="secondary">Secondary</Chip>
  <Chip variant="success">Success</Chip>
  <Chip variant="warning">Warning</Chip>
  <Chip variant="danger">Danger</Chip>
</ChipGroup>
```

#### With Icons
```tsx
<ChipGroup>
  <Chip leftIcon={<ChipIcons.Plus />}>Add</Chip>
  <Chip rightIcon={<ChipIcons.Filter />}>Filter</Chip>
  <Chip 
    leftIcon={<ChipIcons.Tag />} 
    rightIcon={<ChipIcons.Check />}
  >
    Tagged & Verified
  </Chip>
</ChipGroup>
```

## ChipIcons

The component includes commonly used icons:

```tsx
// Available icons
<ChipIcons.Plus />
<ChipIcons.Filter />
<ChipIcons.Tag />
<ChipIcons.Check />

// Custom icon
<Chip leftIcon={<CustomIcon />}>
  Custom Icon
</Chip>
```

## Accessibility

- Chips with onClick or onRemove are keyboard accessible
- Remove buttons have proper aria-labels
- Selected state is communicated via aria-selected
- Disabled state prevents all interactions
- Focus indicators for keyboard navigation

## Best Practices

1. **Use appropriate variants** - Match chip colors to their semantic meaning
2. **Keep text concise** - Chips should contain short, scannable text
3. **Group related chips** - Use ChipGroup for better layout and spacing
4. **Provide remove functionality** - For user-generated or removable items
5. **Indicate selection** - Use selected state for multi-select scenarios
6. **Consider mobile** - Ensure chips are touch-friendly on mobile devices
7. **Limit chip count** - Too many chips can overwhelm users

## Common Patterns

### Filter Bar
```tsx
function FilterBar() {
  return (
    <div className="p-4 border-b">
      <ChipGroup>
        <Chip leftIcon={<ChipIcons.Filter />}>
          All Filters
        </Chip>
        <Chip onRemove={() => {}}>Price: Under $50</Chip>
        <Chip onRemove={() => {}}>Brand: Nike</Chip>
        <Chip onRemove={() => {}}>Size: Medium</Chip>
        <button className="text-sm text-primary-600">
          Clear all
        </button>
      </ChipGroup>
    </div>
  );
}
```

### Search Suggestions
```tsx
function SearchSuggestions({ suggestions, onSelect }) {
  return (
    <ChipGroup spacing="tight">
      {suggestions.map((suggestion) => (
        <Chip
          key={suggestion}
          size="sm"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Chip>
      ))}
    </ChipGroup>
  );
}
```

### Product Attributes
```tsx
function ProductAttributes({ attributes }) {
  return (
    <ChipGroup>
      {attributes.map((attr) => (
        <Chip key={attr.name} variant="secondary" size="sm">
          {attr.name}: {attr.value}
        </Chip>
      ))}
    </ChipGroup>
  );
}
```