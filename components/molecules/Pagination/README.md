# Pagination Component

A flexible pagination component for navigating through large datasets. Includes smart page number generation with ellipsis, customizable navigation controls, and a hook for managing pagination state. Perfect for product listings, search results, data tables, and order history.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Pagination, SimplePagination, usePagination } from '@/components/molecules/Pagination';

// Basic pagination
<Pagination 
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log(`Go to page ${page}`)}
/>

// With first/last buttons
<Pagination 
  currentPage={5}
  totalPages={20}
  onPageChange={handlePageChange}
  showFirstLast={true}
/>

// Simple pagination (prev/next only)
<SimplePagination 
  currentPage={3}
  totalPages={10}
  onPageChange={handlePageChange}
/>

// Using the hook
function ProductList() {
  const { 
    currentPage, 
    totalPages, 
    startIndex, 
    endIndex, 
    goToPage,
    nextPage,
    previousPage
  } = usePagination(totalItems, itemsPerPage);
  
  const currentProducts = products.slice(startIndex, endIndex);
  
  return (
    <>
      {/* Render products */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </>
  );
}
```

## Component Props

### Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | - | Current active page (1-indexed) |
| `totalPages` | `number` | - | Total number of pages |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes |
| `siblingCount` | `number` | `1` | Pages to show on each side of current |
| `boundaryCount` | `number` | `1` | Pages to show at start/end |
| `showFirstLast` | `boolean` | `false` | Show first/last page buttons |
| `showPrevNext` | `boolean` | `true` | Show previous/next buttons |
| `previousLabel` | `string` | `'Previous'` | Previous button text |
| `nextLabel` | `string` | `'Next'` | Next button text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | `'Pagination Navigation'` | Accessibility label |

### SimplePagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | - | Current active page |
| `totalPages` | `number` | - | Total number of pages |
| `onPageChange` | `(page: number) => void` | - | Page change callback |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `className` | `string` | - | Additional CSS classes |

### usePagination Hook

```tsx
const {
  currentPage,      // Current page number
  totalPages,       // Total pages
  startIndex,       // First item index for current page
  endIndex,         // Last item index for current page
  goToPage,         // Navigate to specific page
  nextPage,         // Go to next page
  previousPage,     // Go to previous page
  firstPage,        // Go to first page
  lastPage,         // Go to last page
  hasNextPage,      // Boolean flag
  hasPreviousPage,  // Boolean flag
} = usePagination(totalItems, itemsPerPage, initialPage);
```

## Examples

### E-commerce Use Cases

#### Product Listing with Pagination
```tsx
function ProductGrid() {
  const products = useProducts(); // Your product data
  const itemsPerPage = 12;
  
  const { 
    currentPage, 
    totalPages, 
    startIndex, 
    endIndex, 
    goToPage 
  } = usePagination(products.length, itemsPerPage);
  
  const currentProducts = products.slice(startIndex, endIndex);
  
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <p className="text-neutral-600">
          Showing {startIndex + 1}-{endIndex} of {products.length}
        </p>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        {currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        showFirstLast={true}
      />
    </div>
  );
}
```

#### Search Results
```tsx
function SearchResults({ results }) {
  const resultsPerPage = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(results.length / resultsPerPage);
  
  const startIndex = (page - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, results.length);
  const currentResults = results.slice(startIndex, endIndex);
  
  return (
    <div>
      <p className="mb-4 text-sm text-neutral-600">
        Found {results.length} results
      </p>
      
      <div className="space-y-4 mb-8">
        {currentResults.map(result => (
          <SearchResult key={result.id} {...result} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          siblingCount={2}
        />
      )}
    </div>
  );
}
```

#### Order History
```tsx
function OrderHistory() {
  const orders = useOrders();
  const [page, setPage] = useState(1);
  const ordersPerPage = 10;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Order History</h2>
      
      <OrderList 
        orders={orders}
        page={page}
        itemsPerPage={ordersPerPage}
      />
      
      <div className="mt-6 flex justify-center">
        <SimplePagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
```

### Advanced Examples

#### Data Table with Pagination
```tsx
function UserTable() {
  const { users, totalCount } = useUsers();
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Users ({totalCount})</h3>
        <select 
          value={pageSize} 
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="px-3 py-1 border rounded"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>
      
      <Table data={users} />
      
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-neutral-600">
          Page {page} of {totalPages}
        </p>
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          size="sm"
        />
      </div>
    </div>
  );
}
```

#### Server-Side Pagination
```tsx
function ServerPaginatedList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ['items', page],
    queryFn: () => fetchItems({ page, limit: 20 }),
  });
  
  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  
  return (
    <div>
      <ItemList items={data.items} />
      
      <Pagination 
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
        showFirstLast={true}
      />
    </div>
  );
}
```

#### Load More Pattern
```tsx
function InfiniteList() {
  const itemsPerPage = 20;
  const [loadedPages, setLoadedPages] = useState(1);
  const { data, hasMore } = useInfiniteData();
  
  const loadMore = () => {
    setLoadedPages(prev => prev + 1);
  };
  
  return (
    <div>
      <div className="space-y-4">
        {data.map(item => (
          <Item key={item.id} {...item} />
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-6 w-full py-2 border rounded-lg hover:bg-neutral-50"
        >
          Load More ({loadedPages * itemsPerPage} of {data.totalCount})
        </button>
      )}
    </div>
  );
}
```

### Mobile-Optimized Pagination
```tsx
function MobileProductList() {
  const { products, page, totalPages, setPage } = useProducts();
  
  return (
    <div>
      <ProductGrid products={products} />
      
      {/* Simple pagination for mobile */}
      <div className="md:hidden mt-6">
        <SimplePagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          size="sm"
        />
      </div>
      
      {/* Full pagination for desktop */}
      <div className="hidden md:block mt-6">
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          showFirstLast={true}
        />
      </div>
    </div>
  );
}
```

## Styling

### Sizes
```tsx
// Small - compact for limited space
<Pagination size="sm" currentPage={1} totalPages={10} onPageChange={handleChange} />

// Medium - default size
<Pagination size="md" currentPage={1} totalPages={10} onPageChange={handleChange} />

// Large - more prominent
<Pagination size="lg" currentPage={1} totalPages={10} onPageChange={handleChange} />
```

### Custom Styling
```tsx
// Custom colors via className
<Pagination 
  className="[&_.bg-primary-600]:bg-custom-color"
  currentPage={1}
  totalPages={10}
  onPageChange={handleChange}
/>

// Custom layout
<div className="flex justify-between items-center">
  <span>Results: 1-20 of 200</span>
  <Pagination 
    currentPage={1}
    totalPages={10}
    onPageChange={handleChange}
  />
</div>
```

## Configuration Options

### Sibling and Boundary Count
```tsx
// Show more page numbers around current (siblingCount)
<Pagination 
  currentPage={10}
  totalPages={20}
  onPageChange={handleChange}
  siblingCount={2} // Shows: 1 ... 8 9 10 11 12 ... 20
/>

// Show more pages at start/end (boundaryCount)
<Pagination 
  currentPage={10}
  totalPages={20}
  onPageChange={handleChange}
  boundaryCount={2} // Shows: 1 2 ... 9 10 11 ... 19 20
/>
```

## Accessibility

- Proper ARIA labels for navigation
- Keyboard navigation support
- Current page indication with `aria-current`
- Disabled state for unavailable navigation
- Screen reader friendly page announcements

## Performance Considerations

1. **Large datasets**: Use server-side pagination for better performance
2. **State management**: Consider URL params for shareable pages
3. **Caching**: Cache pages when using API calls
4. **Prefetching**: Prefetch adjacent pages for faster navigation

## Best Practices

1. **Show total count**: Display "Showing X-Y of Z" for context
2. **Persistent state**: Save page in URL for back button support
3. **Reset on filter**: Reset to page 1 when filters change
4. **Loading states**: Show loading indicator during page transitions
5. **Error handling**: Handle edge cases gracefully
6. **Mobile optimization**: Use SimplePagination on small screens
7. **Keyboard shortcuts**: Consider adding keyboard navigation