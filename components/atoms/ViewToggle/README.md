# ViewToggle Component

A simple toggle component for switching between grid and list view modes. Commonly used in product listings, file explorers, galleries, and any interface that offers multiple viewing options.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { ViewToggle } from '@/components/atoms/ViewToggle';

// Basic usage
<ViewToggle
  value={viewMode}
  onChange={setViewMode}
/>

// With labels
<ViewToggle
  value="grid"
  onChange={handleViewChange}
  showLabels
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `'grid' \| 'list'` | - | **Required**. Current view mode |
| `onChange` | `(value: ViewMode) => void` | - | Change handler |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Toggle size |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | Visual variant |
| `showLabels` | `boolean` | `false` | Show text labels |
| `disabled` | `boolean` | `false` | Disabled state |
| `gridLabel` | `string` | `'Grid view'` | Grid button label |
| `listLabel` | `string` | `'List view'` | List button label |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | - | Custom ARIA label |

## Variants

### Default
Solid background container with active state styling:
```tsx
<ViewToggle value="grid" variant="default" />
```

### Outline
Border container with highlighted active state:
```tsx
<ViewToggle value="grid" variant="outline" />
```

### Ghost
Minimal styling with hover states:
```tsx
<ViewToggle value="grid" variant="ghost" />
```

## Sizes

```tsx
// Small
<ViewToggle size="sm" value={view} />

// Medium (default)
<ViewToggle size="md" value={view} />

// Large
<ViewToggle size="lg" value={view} />
```

## Common Patterns

### Product Listing

```tsx
function ProductListing() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Products</h2>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>
      
      {viewMode === 'grid' ? (
        <ProductGrid products={products} />
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}
```

### With Other Controls

```tsx
<div className="flex items-center gap-4">
  <SortDropdown options={sortOptions} />
  <FilterButton />
  <ViewToggle value={view} onChange={setView} size="sm" />
</div>
```

### File Explorer

```tsx
function FileExplorer() {
  const [view, setView] = useState<'grid' | 'list'>('list');
  
  return (
    <>
      <div className="toolbar">
        <ViewToggle 
          value={view} 
          onChange={setView}
          variant="outline"
          size="sm"
        />
      </div>
      
      {view === 'grid' ? (
        <FileGrid files={files} />
      ) : (
        <FileTable files={files} />
      )}
    </>
  );
}
```

### Photo Gallery

```tsx
<ViewToggle
  value={galleryView}
  onChange={setGalleryView}
  showLabels
  gridLabel="Thumbnail view"
  listLabel="Details view"
/>
```

### With Labels

```tsx
// Always show labels
<ViewToggle
  value={view}
  onChange={setView}
  showLabels
/>

// Responsive labels (show on larger screens)
<ViewToggle
  value={view}
  onChange={setView}
  showLabels
  className="hidden sm:flex"
/>
<ViewToggle
  value={view}
  onChange={setView}
  className="flex sm:hidden"
/>
```

## State Management

### Controlled Component

```tsx
const [view, setView] = useState<'grid' | 'list'>('grid');

<ViewToggle
  value={view}
  onChange={setView}
/>
```

### With Local Storage

```tsx
function PersistentViewToggle() {
  const [view, setView] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('viewMode') as 'grid' | 'list') || 'grid';
  });
  
  const handleChange = (newView: 'grid' | 'list') => {
    setView(newView);
    localStorage.setItem('viewMode', newView);
  };
  
  return <ViewToggle value={view} onChange={handleChange} />;
}
```

### With URL State

```tsx
function ViewToggleWithURL() {
  const searchParams = useSearchParams();
  const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  
  const handleChange = (newView: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams);
    params.set('view', newView);
    router.push(`?${params.toString()}`);
  };
  
  return <ViewToggle value={view} onChange={handleChange} />;
}
```

## Styling

### Custom Styling

```tsx
<ViewToggle
  value={view}
  onChange={setView}
  className="shadow-sm"
/>
```

### Dark Mode Support

All variants support dark mode automatically:

```tsx
<div className="dark:bg-neutral-900">
  <ViewToggle value="grid" variant="default" />
</div>
```

## Accessibility

- Uses radio button pattern with proper ARIA attributes
- Keyboard accessible (Tab to navigate, Space/Enter to select)
- Screen reader friendly labels
- Focus indicators
- Disabled state support

## Best Practices

1. **Persistent State**: Consider saving user's view preference
2. **Responsive Design**: Grid view often works better on larger screens
3. **Consistent Placement**: Keep toggle in same location across pages
4. **Clear Icons**: Use standard grid/list icons for recognition
5. **Loading States**: Maintain view mode during data loading
6. **Smooth Transitions**: Animate between view modes if possible
7. **Default View**: Choose sensible default based on content type
8. **Mobile Consideration**: List view often better for mobile devices