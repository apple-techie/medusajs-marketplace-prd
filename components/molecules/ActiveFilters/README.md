# ActiveFilters Component

A component for displaying and managing active filters in search interfaces, product listings, and data tables. Supports collapsible filters, batch removal, and various display options.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { ActiveFilters } from '@/components/molecules/ActiveFilters';

// Basic usage
<ActiveFilters
  filters={[
    { id: '1', type: 'category', label: 'Category', value: 'Electronics' },
    { id: '2', type: 'price', label: 'Price', value: '$100-$500' }
  ]}
  onRemove={(filterId) => removeFilter(filterId)}
  onClearAll={() => clearAllFilters()}
/>

// With array values and display formatting
<ActiveFilters
  filters={[
    { 
      id: '1', 
      type: 'colors', 
      label: 'Colors', 
      value: ['Red', 'Blue', 'Green'] 
    },
    { 
      id: '2', 
      type: 'price', 
      label: 'Price', 
      value: 'price_100_500',
      displayValue: '$100 - $500'
    }
  ]}
  onRemove={handleRemove}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `Filter[]` | - | **Required**. Array of active filters |
| `onRemove` | `(filterId: string) => void` | - | Filter removal handler |
| `onClearAll` | `() => void` | - | Clear all filters handler |
| `showClearAll` | `boolean` | `true` | Show clear all button |
| `showCount` | `boolean` | `true` | Show filter count |
| `collapsible` | `boolean` | `true` | Allow collapse/expand |
| `maxVisible` | `number` | `5` | Max filters before collapse |
| `clearAllLabel` | `string` | `'Clear all'` | Clear all button label |
| `showMoreLabel` | `string` | `'Show more'` | Show more button label |
| `showLessLabel` | `string` | `'Show less'` | Show less button label |
| `countLabel` | `string` | `'filters'` | Plural label for count |
| `className` | `string` | - | Container CSS classes |
| `filterClassName` | `string` | - | Individual filter CSS classes |
| `variant` | `'default' \| 'compact'` | `'default'` | Display variant |
| `aria-label` | `string` | - | Custom ARIA label |

### Filter Type

```tsx
interface Filter {
  id: string;
  type: string;
  label: string;
  value: string | string[];
  displayValue?: string;
}
```

## Common Patterns

### E-commerce Filters

```tsx
const ecommerceFilters = [
  { 
    id: '1', 
    type: 'category', 
    label: 'Category', 
    value: 'Electronics' 
  },
  { 
    id: '2', 
    type: 'brand', 
    label: 'Brand', 
    value: ['Apple', 'Samsung', 'Sony'] 
  },
  { 
    id: '3', 
    type: 'price', 
    label: 'Price', 
    value: 'price_100_500',
    displayValue: '$100 - $500'
  },
  { 
    id: '4', 
    type: 'rating', 
    label: 'Rating', 
    value: 'rating_4',
    displayValue: '★★★★☆ & up'
  }
];

<ActiveFilters
  filters={ecommerceFilters}
  onRemove={handleRemoveFilter}
  onClearAll={handleClearAll}
/>
```

### Search Results with Filters

```tsx
function SearchResults() {
  const [filters, setFilters] = useState<Filter[]>([...]);
  
  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
    // Trigger new search
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Search Results ({resultCount})</h2>
        <ActiveFilters
          filters={filters}
          onRemove={removeFilter}
          onClearAll={() => setFilters([])}
        />
      </div>
      {/* Results list */}
    </div>
  );
}
```

### Collapsible Filters

```tsx
// Many filters with collapse functionality
<ActiveFilters
  filters={manyFilters}
  collapsible
  maxVisible={5}
  onRemove={handleRemove}
  onClearAll={handleClearAll}
/>

// Always show all filters
<ActiveFilters
  filters={manyFilters}
  collapsible={false}
  onRemove={handleRemove}
/>
```

### Compact Variant

```tsx
// Smaller size for limited space
<ActiveFilters
  filters={filters}
  variant="compact"
  onRemove={handleRemove}
/>
```

### Without Controls

```tsx
// Read-only filter display
<ActiveFilters
  filters={filters}
  showClearAll={false}
  // No onRemove prop - removes individual X buttons
/>
```

### Custom Labels

```tsx
<ActiveFilters
  filters={filters}
  clearAllLabel="Remove all"
  showMoreLabel="View all filters"
  showLessLabel="Collapse"
  countLabel="active filters"
  onRemove={handleRemove}
  onClearAll={handleClearAll}
/>
```

## Advanced Usage

### Job Search Filters

```tsx
const jobFilters = [
  { 
    id: '1', 
    type: 'location', 
    label: 'Location', 
    value: 'San Francisco, CA' 
  },
  { 
    id: '2', 
    type: 'jobType', 
    label: 'Job Type', 
    value: ['Full-time', 'Remote'] 
  },
  { 
    id: '3', 
    type: 'salary', 
    label: 'Salary', 
    value: 'salary_100k_150k',
    displayValue: '$100k - $150k'
  }
];
```

### Real Estate Filters

```tsx
const propertyFilters = [
  { 
    id: '1', 
    type: 'propertyType', 
    label: 'Type', 
    value: 'House' 
  },
  { 
    id: '2', 
    type: 'bedrooms', 
    label: 'Bedrooms', 
    value: '3+' 
  },
  { 
    id: '3', 
    type: 'features', 
    label: 'Features', 
    value: ['Pool', 'Garage', 'Garden'] 
  }
];
```

### With Filter Management

```tsx
function FilterManager() {
  const [filters, setFilters] = useState<Filter[]>([]);
  
  // Add filter from sidebar/modal
  const addFilter = (filter: Filter) => {
    setFilters([...filters, filter]);
  };
  
  // Remove individual filter
  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };
  
  // Update filter value
  const updateFilter = (filterId: string, newValue: any) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, value: newValue } : f
    ));
  };
  
  return (
    <ActiveFilters
      filters={filters}
      onRemove={removeFilter}
      onClearAll={() => setFilters([])}
    />
  );
}
```

## Display Formatting

### Using displayValue

```tsx
// Format complex values for display
const filter = {
  id: '1',
  type: 'date',
  label: 'Date Range',
  value: '2024-01-01_2024-12-31', // Internal value
  displayValue: 'Jan 1 - Dec 31, 2024' // User-friendly display
};
```

### Array Value Display

```tsx
// Arrays are automatically joined with commas
const filter = {
  id: '1',
  type: 'tags',
  label: 'Tags',
  value: ['JavaScript', 'React', 'TypeScript']
  // Displays as: "JavaScript, React, TypeScript"
};
```

## Styling

### Container Styling

```tsx
<ActiveFilters
  filters={filters}
  className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg"
  onRemove={handleRemove}
/>
```

### Individual Filter Styling

```tsx
<ActiveFilters
  filters={filters}
  filterClassName="bg-white dark:bg-neutral-900 shadow-sm"
  onRemove={handleRemove}
/>
```

## Accessibility

- Proper ARIA labels for the filter container
- Individual remove buttons have descriptive labels
- Keyboard accessible controls
- Screen reader friendly filter announcements
- Focus management for expand/collapse

## Best Practices

1. **Unique IDs**: Ensure each filter has a unique ID
2. **Clear Labels**: Use descriptive, user-friendly labels
3. **Display Values**: Format technical values for user display
4. **Persistence**: Consider saving filter state in URL or localStorage
5. **Performance**: Debounce filter changes to avoid excessive API calls
6. **Empty State**: Component renders nothing when no filters active
7. **Responsive**: Consider using compact variant on mobile
8. **Feedback**: Show loading state when filters are being applied