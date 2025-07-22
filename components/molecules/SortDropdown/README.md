# SortDropdown Component

A versatile dropdown component for sorting and ordering lists, tables, and grids. Supports icons, badges, direction indicators, and multiple visual variants.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { SortDropdown } from '@/components/molecules/SortDropdown';

// Basic usage
<SortDropdown
  options={[
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High', direction: 'asc' },
    { value: 'price-high', label: 'Price: High to Low', direction: 'desc' }
  ]}
  value={sortValue}
  onChange={setSortValue}
/>

// With icons and badges
<SortDropdown
  options={[
    { value: 'popular', label: 'Most Popular', icon: 'trending-up', badge: 'Hot' },
    { value: 'rating', label: 'Top Rated', icon: 'star' }
  ]}
  value={sortBy}
  onChange={setSortBy}
  showDirection
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SortOption[]` | - | **Required**. Array of sort options |
| `value` | `string` | - | Selected option value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `label` | `string` | `'Sort by'` | Dropdown label |
| `placeholder` | `string` | `'Select sort order'` | Placeholder text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | Visual variant |
| `showDirection` | `boolean` | `true` | Show direction arrows |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `className` | `string` | - | Container CSS classes |
| `dropdownClassName` | `string` | - | Dropdown menu CSS classes |
| `fullWidth` | `boolean` | `false` | Full width button |
| `align` | `'start' \| 'end'` | `'end'` | Dropdown alignment |
| `aria-label` | `string` | - | Custom ARIA label |

### SortOption Type

```tsx
interface SortOption {
  value: string;
  label: string;
  icon?: string;
  direction?: 'asc' | 'desc';
  badge?: string;
}
```

## Common Patterns

### Product Listing Sort

```tsx
const productSortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'popular', label: 'Best Sellers', badge: 'Popular' },
  { value: 'rating', label: 'Customer Rating', icon: 'star' },
  { value: 'newest', label: 'New Arrivals', icon: 'calendar' },
  { value: 'price-low', label: 'Price: Low to High', direction: 'asc' },
  { value: 'price-high', label: 'Price: High to Low', direction: 'desc' }
];

<SortDropdown
  options={productSortOptions}
  value={sortBy}
  onChange={handleSortChange}
  showDirection
/>
```

### Table Sorting

```tsx
const tableSortOptions = [
  { value: 'date-desc', label: 'Date (Newest)', icon: 'calendar', direction: 'desc' },
  { value: 'date-asc', label: 'Date (Oldest)', icon: 'calendar', direction: 'asc' },
  { value: 'amount-desc', label: 'Amount (High)', icon: 'dollar-sign', direction: 'desc' },
  { value: 'amount-asc', label: 'Amount (Low)', icon: 'dollar-sign', direction: 'asc' }
];

<SortDropdown
  options={tableSortOptions}
  value={tableSort}
  onChange={setTableSort}
  size="sm"
  variant="outline"
/>
```

### Name Sorting

```tsx
const nameSortOptions = [
  { value: 'name-asc', label: 'Name (A-Z)', icon: 'type', direction: 'asc' },
  { value: 'name-desc', label: 'Name (Z-A)', icon: 'type', direction: 'desc' }
];

<SortDropdown
  options={nameSortOptions}
  value={nameSort}
  onChange={setNameSort}
  showDirection
/>
```

### With Custom Label

```tsx
<SortDropdown
  options={options}
  value={orderBy}
  onChange={setOrderBy}
  label="Order by"
  placeholder="Choose order"
/>
```

### No Label (Icon Only)

```tsx
<SortDropdown
  options={options}
  value={sortValue}
  onChange={setSortValue}
  label=""
  variant="ghost"
  size="sm"
/>
```

## Variants

### Default
Solid background with shadow:
```tsx
<SortDropdown variant="default" options={options} />
```

### Outline
Border only, transparent background:
```tsx
<SortDropdown variant="outline" options={options} />
```

### Ghost
No border or background until hover:
```tsx
<SortDropdown variant="ghost" options={options} />
```

## Sizes

```tsx
// Small
<SortDropdown size="sm" options={options} />

// Medium (default)
<SortDropdown size="md" options={options} />

// Large
<SortDropdown size="lg" options={options} />
```

## States

### Loading State

```tsx
<SortDropdown
  options={options}
  loading
/>
```

### Disabled State

```tsx
<SortDropdown
  options={options}
  value={sortValue}
  disabled
/>
```

## Layout Options

### Full Width

```tsx
<SortDropdown
  options={options}
  value={sortValue}
  onChange={setSortValue}
  fullWidth
/>
```

### Dropdown Alignment

```tsx
// Align to start
<SortDropdown
  options={options}
  align="start"
/>

// Align to end (default)
<SortDropdown
  options={options}
  align="end"
/>
```

## Advanced Examples

### Multiple Sort Dropdowns

```tsx
<div className="flex gap-4">
  <SortDropdown
    options={sortOptions}
    value={sortBy}
    onChange={setSortBy}
    label="Sort"
  />
  <SortDropdown
    options={groupOptions}
    value={groupBy}
    onChange={setGroupBy}
    label="Group"
  />
</div>
```

### With State Management

```tsx
function ProductList() {
  const [sortBy, setSortBy] = useState('relevance');
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Trigger data refetch with new sort
    fetchProducts({ sortBy: value });
  };
  
  return (
    <>
      <SortDropdown
        options={productSortOptions}
        value={sortBy}
        onChange={handleSortChange}
      />
      {/* Product grid */}
    </>
  );
}
```

### Custom Styling

```tsx
<SortDropdown
  options={options}
  value={sortValue}
  onChange={setSortValue}
  className="min-w-[200px]"
  dropdownClassName="max-h-64 overflow-y-auto"
/>
```

## Keyboard Navigation

- **Space/Enter**: Open/close dropdown
- **Escape**: Close dropdown and return focus
- **Arrow Up/Down**: Open dropdown when closed
- **Tab**: Navigate away from dropdown

## Accessibility

- Proper ARIA labels and roles (`listbox`, `option`)
- Keyboard navigation support
- Focus management
- Selected state indication
- Screen reader friendly

## Best Practices

1. **Clear Labels**: Use descriptive labels that clearly indicate the sort order
2. **Direction Indicators**: Show direction arrows for ascending/descending sorts
3. **Default Sort**: Set a sensible default sort option
4. **Icons**: Use icons to enhance recognition of sort types
5. **Badges**: Use badges to highlight popular or recommended sort options
6. **Loading State**: Show loading state when sort triggers data fetch
7. **Persistence**: Consider persisting user's sort preference
8. **Mobile**: Ensure dropdown works well on touch devices