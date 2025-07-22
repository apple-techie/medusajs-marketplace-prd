# FilterSidebar Component

A comprehensive filter sidebar component for e-commerce applications. Supports multiple filter types including checkboxes, radio buttons, price ranges, ratings, colors, and sizes. Features mobile modal support and applied filter management.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { FilterSidebar } from '@/components/organisms/FilterSidebar';

// Basic filter sidebar
<FilterSidebar
  sections={[
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox',
      options: [
        { label: 'Electronics', value: 'electronics', count: 123 },
        { label: 'Fashion', value: 'fashion', count: 456 }
      ]
    },
    {
      id: 'price',
      title: 'Price',
      type: 'range',
      range: { min: 0, max: 1000 }
    }
  ]}
  onFilterChange={(filters) => console.log(filters)}
/>

// With applied filters
<FilterSidebar
  sections={sections}
  appliedFilters={[
    { sectionId: 'category', value: 'electronics', label: 'Electronics' }
  ]}
  showAppliedFilters
  showClearAll
  onFilterChange={handleFilterChange}
/>
```

## Props

### FilterSidebar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `FilterSection[]` | - | **Required**. Array of filter sections |
| `appliedFilters` | `AppliedFilter[]` | `[]` | Currently applied filters |
| `variant` | `'default' \| 'compact' \| 'minimal'` | `'default'` | Sidebar variant |
| `showClearAll` | `boolean` | `true` | Show clear all button |
| `showAppliedFilters` | `boolean` | `true` | Show applied filters section |
| `showResultCount` | `boolean` | `false` | Show result count |
| `resultCount` | `number` | `0` | Number of results |
| `collapsible` | `boolean` | `true` | Allow sections to collapse |
| `defaultExpanded` | `boolean` | `true` | Default expanded state |
| `mobileAsModal` | `boolean` | `true` | Show as modal on mobile |
| `mobileBreakpoint` | `'sm' \| 'md' \| 'lg'` | `'lg'` | Mobile breakpoint |
| `onFilterChange` | `(filters: AppliedFilter[]) => void` | - | Filter change handler |
| `onClearAll` | `() => void` | - | Clear all handler |
| `onApplyFilters` | `() => void` | - | Apply filters handler |
| `className` | `string` | - | Sidebar CSS classes |
| `sectionClassName` | `string` | - | Section CSS classes |
| `aria-label` | `string` | - | Accessibility label |

## Types

### FilterSection

```typescript
interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range' | 'rating' | 'color' | 'size';
  options?: FilterOption[];
  range?: PriceRange;
  expanded?: boolean;
  icon?: string;
}
```

### FilterOption

```typescript
interface FilterOption {
  label: string;
  value: string;
  count?: number;
}
```

### AppliedFilter

```typescript
interface AppliedFilter {
  sectionId: string;
  value: string | number | PriceRange;
  label?: string;
}
```

### PriceRange

```typescript
interface PriceRange {
  min: number;
  max: number;
}
```

## Filter Types

### Checkbox Filters

Multiple selection filters for categories, brands, etc.

```tsx
{
  id: 'category',
  title: 'Category',
  type: 'checkbox',
  options: [
    { label: 'Electronics', value: 'electronics', count: 123 },
    { label: 'Fashion', value: 'fashion', count: 456 }
  ]
}
```

### Radio Filters

Single selection filters for sorting or exclusive options.

```tsx
{
  id: 'sort',
  title: 'Sort By',
  type: 'radio',
  options: [
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' }
  ]
}
```

### Price Range Filter

Dual input range filter for price selection.

```tsx
{
  id: 'price',
  title: 'Price Range',
  type: 'range',
  range: { min: 0, max: 1000 }
}
```

### Rating Filter

Star rating filter for customer ratings.

```tsx
{
  id: 'rating',
  title: 'Customer Rating',
  type: 'rating'
}
```

### Color Filter

Visual color selection filter.

```tsx
{
  id: 'color',
  title: 'Color',
  type: 'color',
  options: [
    { label: 'Red', value: '#FF0000' },
    { label: 'Blue', value: '#0000FF' },
    { label: 'Green', value: '#00FF00' }
  ]
}
```

### Size Filter

Size selection grid filter.

```tsx
{
  id: 'size',
  title: 'Size',
  type: 'size',
  options: [
    { label: 'S', value: 'small' },
    { label: 'M', value: 'medium' },
    { label: 'L', value: 'large' }
  ]
}
```

## Examples

### Basic E-commerce Filters

```tsx
function ProductFilters() {
  const [filters, setFilters] = useState([]);
  
  const sections = [
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox' as const,
      icon: 'grid',
      options: [
        { label: 'Electronics', value: 'electronics', count: 1234 },
        { label: 'Fashion', value: 'fashion', count: 567 },
        { label: 'Home', value: 'home', count: 890 }
      ]
    },
    {
      id: 'price',
      title: 'Price',
      type: 'range' as const,
      icon: 'dollar-sign',
      range: { min: 0, max: 500 }
    },
    {
      id: 'brand',
      title: 'Brand',
      type: 'checkbox' as const,
      icon: 'tag',
      options: [
        { label: 'Nike', value: 'nike', count: 234 },
        { label: 'Adidas', value: 'adidas', count: 178 }
      ]
    },
    {
      id: 'rating',
      title: 'Rating',
      type: 'rating' as const,
      icon: 'star'
    }
  ];

  return (
    <FilterSidebar
      sections={sections}
      appliedFilters={filters}
      onFilterChange={setFilters}
      showAppliedFilters
      showClearAll
      showResultCount
      resultCount={1234}
    />
  );
}
```

### Fashion Filters with Colors and Sizes

```tsx
function FashionFilters() {
  const sections = [
    {
      id: 'size',
      title: 'Size',
      type: 'size' as const,
      options: [
        { label: 'XS', value: 'xs' },
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' }
      ]
    },
    {
      id: 'color',
      title: 'Color',
      type: 'color' as const,
      options: [
        { label: 'Black', value: '#000000' },
        { label: 'White', value: '#FFFFFF' },
        { label: 'Red', value: '#FF0000' },
        { label: 'Blue', value: '#0000FF' }
      ]
    },
    {
      id: 'material',
      title: 'Material',
      type: 'checkbox' as const,
      options: [
        { label: 'Cotton', value: 'cotton', count: 456 },
        { label: 'Polyester', value: 'polyester', count: 234 },
        { label: 'Wool', value: 'wool', count: 89 }
      ]
    }
  ];

  return <FilterSidebar sections={sections} />;
}
```

### With Apply Button

```tsx
function FiltersWithApply() {
  const [tempFilters, setTempFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    // Fetch filtered products
    fetchProducts(tempFilters);
  };

  return (
    <FilterSidebar
      sections={sections}
      appliedFilters={appliedFilters}
      onFilterChange={setTempFilters}
      onApplyFilters={handleApplyFilters}
      showResultCount
      resultCount={products.length}
    />
  );
}
```

### Mobile Modal Implementation

```tsx
function MobileFilters() {
  return (
    <FilterSidebar
      sections={sections}
      mobileAsModal
      mobileBreakpoint="lg"
      appliedFilters={filters}
      onFilterChange={handleFilterChange}
    />
  );
}
```

### Controlled Sections

```tsx
function ControlledFilters() {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    brand: false
  });

  const sections = [
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox' as const,
      expanded: expandedSections.category,
      // ... options
    },
    // ... more sections
  ];

  return (
    <FilterSidebar
      sections={sections}
      collapsible
      defaultExpanded={false}
    />
  );
}
```

### With Custom Icons

```tsx
const sectionsWithIcons = [
  {
    id: 'category',
    title: 'Category',
    type: 'checkbox' as const,
    icon: 'grid',
    options: [/* ... */]
  },
  {
    id: 'price',
    title: 'Price Range',
    type: 'range' as const,
    icon: 'dollar-sign',
    range: { min: 0, max: 1000 }
  },
  {
    id: 'shipping',
    title: 'Shipping',
    type: 'checkbox' as const,
    icon: 'truck',
    options: [/* ... */]
  }
];
```

### Dynamic Filter Loading

```tsx
function DynamicFilters() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions().then(data => {
      setSections(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading filters...</div>;
  }

  return (
    <FilterSidebar
      sections={sections}
      onFilterChange={handleFilterChange}
    />
  );
}
```

## Mobile Behavior

The component supports mobile-friendly behavior:

1. **Modal Mode**: On mobile, filters appear as a full-screen modal
2. **Trigger Button**: Fixed button shows filter count badge
3. **Responsive Breakpoints**: Configurable breakpoint for mobile behavior

## Accessibility

- Keyboard navigation support
- ARIA labels and expanded states
- Screen reader friendly
- Focus management in modal mode
- Clear button labels for actions

## Best Practices

1. **Group Related Filters**: Organize filters logically
2. **Show Counts**: Display result counts for each option
3. **Clear Actions**: Always provide clear all functionality
4. **Mobile First**: Test mobile modal behavior thoroughly
5. **Performance**: Debounce filter changes for API calls
6. **Loading States**: Show loading indicators during updates
7. **Persistence**: Consider saving filter preferences
8. **URLs**: Sync filters with URL parameters
9. **Defaults**: Provide sensible default filters
10. **Feedback**: Show immediate visual feedback for selections