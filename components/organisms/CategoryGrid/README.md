# CategoryGrid Component

A flexible organism component for displaying product categories in a grid layout. Features filtering, sorting, pagination, featured sections, and multiple display variants.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { CategoryGrid, QuickCategoryGrid } from '@/components/organisms/CategoryGrid';

// Basic category grid
<CategoryGrid
  categories={[
    {
      id: 1,
      title: 'Electronics',
      description: 'Latest gadgets',
      href: '/categories/electronics',
      icon: 'desktop',
      productCount: 1234
    }
  ]}
/>

// With filtering and sorting
<CategoryGrid
  categories={categories}
  title="Shop by Category"
  showFilter
  filterOptions={[
    { label: 'Popular', value: 'popular' },
    { label: 'New', value: 'new' }
  ]}
  sortOptions={[
    { label: 'Name A-Z', value: 'name' },
    { label: 'Most Products', value: 'products' }
  ]}
/>

// Quick category grid
<QuickCategoryGrid
  categories={[
    { id: 1, title: 'Electronics', icon: 'desktop', href: '/electronics' }
  ]}
  columns={6}
/>
```

## Components

### CategoryGrid

The main category grid component with full features.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `categories` | `Category[]` | - | **Required**. Array of categories |
| `variant` | `'default' \| 'compact' \| 'featured' \| 'mixed'` | `'default'` | Grid variant |
| `columns` | `2 \| 3 \| 4 \| 5 \| 6` | `4` | Number of columns |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Grid gap size |
| `title` | `string` | - | Grid title |
| `subtitle` | `string` | - | Grid subtitle |
| `showViewAll` | `boolean` | `false` | Show view all button |
| `viewAllHref` | `string` | - | View all link URL |
| `viewAllText` | `string` | `'View All Categories'` | View all button text |
| `showFilter` | `boolean` | `false` | Show filter dropdown |
| `filterOptions` | `Array<{ label: string; value: string }>` | `[]` | Filter options |
| `defaultFilter` | `string` | `'all'` | Default filter value |
| `sortOptions` | `Array<{ label: string; value: string }>` | `[]` | Sort options |
| `defaultSort` | `string` | `'name'` | Default sort value |
| `itemsPerPage` | `number` | `12` | Items per page |
| `showPagination` | `boolean` | `false` | Enable pagination |
| `featuredTitle` | `string` | `'Featured Categories'` | Featured section title |
| `featuredSubtitle` | `string` | - | Featured section subtitle |
| `showFeaturedSeparately` | `boolean` | `false` | Show featured items separately |
| `loading` | `boolean` | `false` | Show loading state |
| `skeletonCount` | `number` | `8` | Number of skeletons |
| `onCategoryClick` | `(category: Category) => void` | - | Category click handler |
| `onFilterChange` | `(filter: string) => void` | - | Filter change handler |
| `onSortChange` | `(sort: string) => void` | - | Sort change handler |
| `onViewAll` | `() => void` | - | View all click handler |
| `className` | `string` | - | Section CSS classes |
| `headerClassName` | `string` | - | Header CSS classes |
| `gridClassName` | `string` | - | Grid CSS classes |
| `aria-label` | `string` | - | Accessibility label |

#### Category Type

```typescript
interface Category {
  id: string | number;
  title: string;
  description?: string;
  href: string;
  image?: string;
  icon?: string;
  productCount?: number;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  subcategories?: string[];
  featured?: boolean;
}
```

### QuickCategoryGrid

Simplified category grid for compact displays.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `categories` | `Array` | - | **Required**. Array of categories |
| `columns` | `4 \| 6 \| 8` | `6` | Number of columns |
| `className` | `string` | - | Grid CSS classes |

## Variants

### Default
Standard grid layout with cards.

```tsx
<CategoryGrid
  categories={categories}
  variant="default"
  columns={4}
/>
```

### Compact
Space-efficient layout for many categories.

```tsx
<CategoryGrid
  categories={categories}
  variant="compact"
  columns={6}
/>
```

### Featured
Larger cards with more details.

```tsx
<CategoryGrid
  categories={categories}
  variant="featured"
  columns={3}
/>
```

### Mixed
Combination of featured and regular cards.

```tsx
<CategoryGrid
  categories={categories}
  variant="mixed"
  columns={4}
/>
```

## Examples

### Basic Category Grid

```tsx
function BasicCategories() {
  const categories = [
    {
      id: 1,
      title: 'Electronics',
      description: 'Phones, tablets, computers',
      href: '/categories/electronics',
      icon: 'desktop',
      productCount: 1234
    },
    // ... more categories
  ];

  return <CategoryGrid categories={categories} />;
}
```

### With Header and Actions

```tsx
function CategoriesWithHeader() {
  return (
    <CategoryGrid
      categories={categories}
      title="Shop by Category"
      subtitle="Browse our wide selection"
      showViewAll
      viewAllHref="/categories"
      viewAllText="See All Categories"
    />
  );
}
```

### Filterable and Sortable

```tsx
function FilterableCategories() {
  const handleFilterChange = (filter: string) => {
    console.log('Filter:', filter);
    // Apply filter logic
  };

  const handleSortChange = (sort: string) => {
    console.log('Sort:', sort);
    // Apply sort logic
  };

  return (
    <CategoryGrid
      categories={categories}
      title="All Categories"
      showFilter
      filterOptions={[
        { label: 'Popular', value: 'popular' },
        { label: 'New', value: 'new' },
        { label: 'On Sale', value: 'sale' }
      ]}
      sortOptions={[
        { label: 'Name A-Z', value: 'name' },
        { label: 'Name Z-A', value: 'name-desc' },
        { label: 'Most Products', value: 'products' }
      ]}
      onFilterChange={handleFilterChange}
      onSortChange={handleSortChange}
    />
  );
}
```

### With Pagination

```tsx
function PaginatedCategories() {
  const manyCategories = generateCategories(50); // Large dataset

  return (
    <CategoryGrid
      categories={manyCategories}
      title="Browse All Categories"
      showPagination
      itemsPerPage={12}
      columns={4}
    />
  );
}
```

### Featured Categories Section

```tsx
function FeaturedCategories() {
  const categoriesWithFeatured = categories.map((cat, index) => ({
    ...cat,
    featured: index < 2 // First 2 are featured
  }));

  return (
    <CategoryGrid
      categories={categoriesWithFeatured}
      showFeaturedSeparately
      featuredTitle="Trending Categories"
      featuredSubtitle="Most popular this week"
      title="All Categories"
    />
  );
}
```

### Quick Category Navigation

```tsx
function QuickNavigation() {
  const quickCategories = [
    { id: 1, title: 'Electronics', icon: 'desktop', href: '/electronics', productCount: 1234 },
    { id: 2, title: 'Fashion', icon: 'shopping-bag', href: '/fashion', productCount: 567 },
    { id: 3, title: 'Home', icon: 'home', href: '/home', productCount: 890 },
    { id: 4, title: 'Sports', icon: 'activity', href: '/sports', productCount: 345 },
    { id: 5, title: 'Beauty', icon: 'heart', href: '/beauty', productCount: 678 },
    { id: 6, title: 'Toys', icon: 'gift', href: '/toys', productCount: 234 }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Categories</h3>
      <QuickCategoryGrid
        categories={quickCategories}
        columns={6}
      />
    </div>
  );
}
```

### Loading State

```tsx
function LoadingCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(data => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <CategoryGrid
      categories={categories}
      loading={loading}
      skeletonCount={8}
      title="Loading Categories..."
    />
  );
}
```

### Interactive Categories

```tsx
function InteractiveCategories() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    // Navigate or show products
    router.push(category.href);
  };

  return (
    <CategoryGrid
      categories={categories}
      title="Select a Category"
      onCategoryClick={handleCategoryClick}
      columns={4}
      gap="lg"
    />
  );
}
```

### Marketplace Homepage Categories

```tsx
function MarketplaceCategories() {
  const marketplaceCategories = [
    {
      id: 1,
      title: 'Electronics & Tech',
      description: 'Latest gadgets and devices',
      href: '/categories/electronics',
      image: '/category-electronics.jpg',
      productCount: 5678,
      badge: 'Hot',
      badgeVariant: 'danger' as const,
      featured: true
    },
    // ... more categories
  ];

  return (
    <CategoryGrid
      categories={marketplaceCategories}
      title="Shop by Category"
      subtitle="Over 100,000 products from verified vendors"
      showViewAll
      viewAllHref="/categories"
      showFeaturedSeparately
      featuredTitle="Trending Now"
      showFilter
      filterOptions={[
        { label: 'Most Popular', value: 'popular' },
        { label: 'New Categories', value: 'new' }
      ]}
      columns={4}
      gap="lg"
    />
  );
}
```

## Column Layouts

### 2 Columns
Best for mobile-first or sidebar layouts.

### 3 Columns
Good balance for medium-sized screens.

### 4 Columns (Default)
Standard layout for most use cases.

### 5 Columns
For wider screens with many categories.

### 6 Columns
Maximum density for comprehensive views.

## Styling

### Gap Sizes
- **Small**: Compact spacing (gap-4)
- **Medium**: Default spacing (gap-6)
- **Large**: Generous spacing (gap-8)

### Custom Styling

```tsx
<CategoryGrid
  categories={categories}
  className="bg-gray-50 rounded-lg p-8"
  headerClassName="border-b pb-4 mb-6"
  gridClassName="custom-grid-styles"
/>
```

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for interactive elements
- Screen reader friendly
- Focus states for all interactive elements

## Best Practices

1. **Optimize images**: Use appropriately sized images for category cards
2. **Limit initial load**: Use pagination for large category sets
3. **Clear hierarchy**: Use featured sections for important categories
4. **Consistent sizing**: Keep category cards uniform within a grid
5. **Mobile responsive**: Test column layouts on different screen sizes
6. **Loading states**: Always show loading indicators for async data
7. **Empty states**: Provide helpful messages when no categories exist
8. **Sorting logic**: Implement meaningful sort options
9. **Filter relevance**: Only show filters that make sense for your data
10. **Performance**: Consider virtualization for very large category lists