# ProductGrid Component

A flexible product grid organism for e-commerce applications. Supports both grid and list layouts, infinite scrolling, loading states, and empty states. Built with responsive design and accessibility in mind.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { ProductGrid } from '@/components/organisms/ProductGrid';

// Basic usage
<ProductGrid
  products={products}
  onProductClick={(productId) => navigateToProduct(productId)}
  onAddToCart={(productId) => addToCart(productId)}
/>

// With load more
<ProductGrid
  products={products}
  hasMore={hasNextPage}
  onLoadMore={loadNextPage}
  loadingMore={isLoadingMore}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | - | **Required**. Array of products to display |
| `viewMode` | `'grid' \| 'list'` | `'grid'` | Display mode |
| `columns` | `object` | See below | Grid column configuration |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between products |
| `loading` | `boolean` | `false` | Show loading skeletons |
| `loadingCount` | `number` | `8` | Number of loading skeletons |
| `emptyMessage` | `string` | `'No products found'` | Empty state message |
| `emptyIcon` | `string` | `'package'` | Empty state icon |
| `emptyAction` | `object` | - | Empty state action button |
| `hasMore` | `boolean` | `false` | Show load more button |
| `onLoadMore` | `() => void` | - | Load more handler |
| `loadingMore` | `boolean` | `false` | Loading more state |
| `loadMoreLabel` | `string` | `'Load more'` | Load more button label |
| `onProductClick` | `(productId: string) => void` | - | Product click handler |
| `onAddToCart` | `(productId: string) => void` | - | Add to cart handler |
| `onToggleWishlist` | `(productId: string) => void` | - | Wishlist toggle handler |
| `showVendor` | `boolean` | `true` | Show vendor info |
| `showRating` | `boolean` | `true` | Show product rating |
| `showAddToCart` | `boolean` | `true` | Show add to cart button |
| `showWishlist` | `boolean` | `true` | Show wishlist button |
| `imageAspectRatio` | `'1:1' \| '4:3' \| '16:9'` | `'1:1'` | Product image aspect ratio |
| `className` | `string` | - | Container CSS classes |
| `productClassName` | `string` | - | Product card CSS classes |
| `aria-label` | `string` | - | Custom ARIA label |

### Product Type

```tsx
interface Product extends ProductCardProps {
  id: string;
}
```

### Column Configuration

```tsx
columns?: {
  mobile?: 1 | 2;      // Default: 2
  tablet?: 2 | 3 | 4;  // Default: 3
  desktop?: 3 | 4 | 5 | 6; // Default: 4
}
```

## Common Patterns

### Basic Product Grid

```tsx
<ProductGrid
  products={products}
  onProductClick={(id) => router.push(`/products/${id}`)}
  onAddToCart={(id) => addToCart(id)}
  onToggleWishlist={(id) => toggleWishlist(id)}
/>
```

### List View

```tsx
<ProductGrid
  products={products}
  viewMode="list"
  columns={{ mobile: 1, tablet: 1, desktop: 1 }}
/>
```

### With Infinite Scrolling

```tsx
function ProductListing() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useInfiniteQuery(/* ... */);
  
  const products = data?.pages.flatMap(page => page.products) || [];
  
  return (
    <ProductGrid
      products={products}
      hasMore={hasNextPage}
      onLoadMore={fetchNextPage}
      loadingMore={isFetchingNextPage}
    />
  );
}
```

### Loading State

```tsx
<ProductGrid
  products={[]}
  loading={isLoading}
  loadingCount={12}
/>
```

### Empty State with Action

```tsx
<ProductGrid
  products={[]}
  emptyMessage="No products match your filters"
  emptyIcon="search"
  emptyAction={{
    label: "Clear all filters",
    onClick: () => clearFilters()
  }}
/>
```

### Custom Column Layout

```tsx
// 6 columns on desktop for category pages
<ProductGrid
  products={products}
  columns={{
    mobile: 2,
    tablet: 4,
    desktop: 6
  }}
  gap="sm"
/>

// Single column list on all breakpoints
<ProductGrid
  products={products}
  viewMode="list"
  columns={{
    mobile: 1,
    tablet: 1,
    desktop: 1
  }}
/>
```

## E-commerce Page Integration

```tsx
function ShopPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const { products, loading, hasMore, loadMore } = useProducts({ sortBy });
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shop</h1>
        <div className="flex items-center gap-4">
          <SortDropdown value={sortBy} onChange={setSortBy} />
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>
      
      <ProductGrid
        products={products}
        viewMode={viewMode}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onProductClick={(id) => router.push(`/products/${id}`)}
        onAddToCart={async (id) => {
          await addToCart(id);
          toast.success('Added to cart');
        }}
        onToggleWishlist={async (id) => {
          await toggleWishlist(id);
        }}
      />
    </div>
  );
}
```

## With Filters

```tsx
function FilteredProducts() {
  const [filters, setFilters] = useState({});
  const { products, loading } = useFilteredProducts(filters);
  
  return (
    <div className="grid grid-cols-4 gap-8">
      <aside className="col-span-1">
        <ProductFilters 
          filters={filters}
          onChange={setFilters}
        />
      </aside>
      
      <main className="col-span-3">
        <ActiveFilters 
          filters={filters}
          onRemove={(filterId) => removeFilter(filterId)}
        />
        
        <ProductGrid
          products={products}
          loading={loading}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          emptyMessage="No products match your filters"
          emptyAction={{
            label: "Clear filters",
            onClick: () => setFilters({})
          }}
        />
      </main>
    </div>
  );
}
```

## Different Layouts

### Minimal Cards

```tsx
// Hide all interactive elements for catalog view
<ProductGrid
  products={products}
  showVendor={false}
  showRating={false}
  showAddToCart={false}
  showWishlist={false}
/>
```

### Category Landing Page

```tsx
// More columns with smaller gap
<ProductGrid
  products={categoryProducts}
  columns={{ mobile: 2, tablet: 3, desktop: 5 }}
  gap="sm"
  imageAspectRatio="4:3"
/>
```

### Search Results

```tsx
// List view for detailed search results
<ProductGrid
  products={searchResults}
  viewMode="list"
  showVendor={true}
  emptyMessage={`No results for "${searchQuery}"`}
  emptyIcon="search"
/>
```

## Responsive Design

The grid automatically adjusts columns based on screen size:

```tsx
// Default responsive behavior
<ProductGrid products={products} />
// Mobile: 2 columns
// Tablet: 3 columns  
// Desktop: 4 columns

// Custom responsive columns
<ProductGrid 
  products={products}
  columns={{
    mobile: 1,  // Single column on mobile
    tablet: 2,  // 2 columns on tablet
    desktop: 6  // 6 columns on desktop
  }}
/>
```

## Accessibility

- Semantic HTML with proper ARIA labels
- Loading states announced to screen readers
- Keyboard navigation support for interactive elements
- Focus management for load more functionality
- Empty state with clear messaging

## Performance

- Lazy loading compatible with image components
- Efficient re-rendering with React.memo on ProductCard
- Loading skeletons prevent layout shift
- Supports virtual scrolling integration

## Best Practices

1. **Image Optimization**: Use optimized images with proper dimensions
2. **Loading States**: Always show loading skeletons for better UX
3. **Empty States**: Provide helpful messages and actions
4. **Error Handling**: Implement error boundaries for failed products
5. **Performance**: Use pagination or infinite scroll for large datasets
6. **Mobile First**: Test on mobile devices and adjust columns accordingly
7. **Accessibility**: Ensure all interactive elements are keyboard accessible
8. **SEO**: Use semantic HTML and proper meta tags on product pages