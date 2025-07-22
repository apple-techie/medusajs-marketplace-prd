# ProductCard Component

A versatile and feature-rich product card component for e-commerce applications. Includes support for product images, pricing, ratings, badges, favorites, quick view, and add to cart functionality. Also includes a ProductGrid component for responsive layouts.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { ProductCard, ProductGrid } from '@/components/organisms/ProductCard';

// Basic usage
<ProductCard
  image="https://example.com/product.jpg"
  name="Wireless Headphones"
  price={79.99}
  rating={4.5}
  reviewCount={128}
/>

// Sale product
<ProductCard
  image="https://example.com/product.jpg"
  name="Premium Headphones"
  price={59.99}
  originalPrice={99.99}
  isSale={true}
  rating={4.8}
  reviewCount={245}
/>

// With grid layout
<ProductGrid columns={4} gap="md">
  <ProductCard {...product1} />
  <ProductCard {...product2} />
  <ProductCard {...product3} />
  <ProductCard {...product4} />
</ProductGrid>
```

## Component Props

### ProductCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | - | **Required**. Product image URL |
| `imageAlt` | `string` | - | Alternative text for image |
| `name` | `string` | - | **Required**. Product name |
| `price` | `number \| string` | - | **Required**. Current price |
| `originalPrice` | `number \| string` | - | Original price (for sales) |
| `currency` | `string` | `'$'` | Currency symbol |
| `rating` | `number` | - | Product rating (0-5) |
| `reviewCount` | `number` | - | Number of reviews |
| `badge` | `string` | - | Custom badge text |
| `badgeVariant` | `'primary' \| 'success' \| 'danger' \| 'warning' \| 'info'` | `'primary'` | Badge color variant |
| `isNew` | `boolean` | `false` | Show "New" badge |
| `isSale` | `boolean` | `false` | Show sale badge with discount |
| `isOutOfStock` | `boolean` | `false` | Show out of stock overlay |
| `isFavorite` | `boolean` | - | Controlled favorite state |
| `onFavoriteClick` | `() => void` | - | Favorite button click handler |
| `showQuickView` | `boolean` | `true` | Show quick view button |
| `onQuickViewClick` | `() => void` | - | Quick view click handler |
| `showAddToCart` | `boolean` | `true` | Show add to cart button |
| `onAddToCartClick` | `() => void` | - | Add to cart click handler |
| `href` | `string` | - | Link URL (wraps card in anchor) |
| `onClick` | `(e: MouseEvent) => void` | - | Card click handler |
| `variant` | `'default' \| 'outlined' \| 'elevated' \| 'minimal'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Card size |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Custom content before add to cart |

### ProductGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required**. Product cards to display |
| `columns` | `2 \| 3 \| 4 \| 5 \| 6` | `4` | Number of columns |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between cards |
| `className` | `string` | - | Additional CSS classes |

## Examples

### E-commerce Listing Page

```tsx
function ProductListing() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cartItems, setCartItems] = useState<string[]>([]);
  
  const products = [
    {
      id: '1',
      image: '/product1.jpg',
      name: 'Wireless Bluetooth Headphones',
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.5,
      reviewCount: 234,
      isSale: true,
    },
    // ... more products
  ];
  
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };
  
  const addToCart = (productId: string) => {
    setCartItems([...cartItems, productId]);
    toast.success('Added to cart!');
  };
  
  return (
    <ProductGrid columns={4} gap="lg">
      {products.map(product => (
        <ProductCard
          key={product.id}
          {...product}
          isFavorite={favorites.has(product.id)}
          onFavoriteClick={() => toggleFavorite(product.id)}
          onAddToCartClick={() => addToCart(product.id)}
          href={`/products/${product.id}`}
        />
      ))}
    </ProductGrid>
  );
}
```

### Featured Products Section

```tsx
function FeaturedProducts() {
  const featuredProducts = [
    {
      image: '/luxury-watch.jpg',
      name: 'Luxury Automatic Watch',
      price: 599.99,
      rating: 4.8,
      reviewCount: 156,
      badge: 'Editor\'s Choice',
      badgeVariant: 'success',
    },
    // ... more products
  ];
  
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
      <ProductGrid columns={3} gap="lg">
        {featuredProducts.map((product, index) => (
          <ProductCard
            key={index}
            {...product}
            variant="elevated"
            size="lg"
          />
        ))}
      </ProductGrid>
    </section>
  );
}
```

### New Arrivals with Custom Content

```tsx
<ProductCard
  image="/new-arrival.jpg"
  name="Smart Fitness Tracker"
  price={149.99}
  rating={4.3}
  reviewCount={89}
  isNew={true}
>
  <div className="space-y-2 mb-3">
    <div className="flex gap-2">
      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
        Free Shipping
      </span>
      <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded">
        30 Day Returns
      </span>
    </div>
    <p className="text-xs text-neutral-600">
      Expected delivery: 2-3 business days
    </p>
  </div>
</ProductCard>
```

### Minimal Product Card

```tsx
<ProductCard
  image="/minimal-product.jpg"
  name="Minimalist Watch"
  price={299.99}
  variant="minimal"
  size="sm"
  showAddToCart={false}
  showQuickView={false}
/>
```

### With Quick View Modal

```tsx
function ProductsWithQuickView() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  return (
    <>
      <ProductGrid>
        {products.map(product => (
          <ProductCard
            key={product.id}
            {...product}
            onQuickViewClick={() => setSelectedProduct(product)}
          />
        ))}
      </ProductGrid>
      
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
```

### Responsive Grid Layouts

```tsx
// 2-column grid for small catalogs
<ProductGrid columns={2} gap="lg">
  {products.map(product => <ProductCard key={product.id} {...product} />)}
</ProductGrid>

// 6-column grid for compact view
<ProductGrid columns={6} gap="sm">
  {products.map(product => (
    <ProductCard key={product.id} {...product} size="sm" />
  ))}
</ProductGrid>
```

## Styling

### Variants

```tsx
// Default - with border
<ProductCard variant="default" />

// Outlined - thicker border
<ProductCard variant="outlined" />

// Elevated - with shadow
<ProductCard variant="elevated" />

// Minimal - no border or shadow
<ProductCard variant="minimal" />
```

### Sizes

```tsx
// Small - 200px max width
<ProductCard size="sm" />

// Medium - 280px max width (default)
<ProductCard size="md" />

// Large - 360px max width
<ProductCard size="lg" />

// Full - 100% width
<ProductCard size="full" />
```

### Custom Styling

```tsx
// Custom colors
<ProductCard 
  className="border-primary-200 hover:border-primary-400"
/>

// Dark theme
<ProductCard 
  className="bg-neutral-800 text-white border-neutral-700"
/>
```

## Features

### Price Display
- Automatic formatting with currency symbol
- Strike-through original price for sales
- Automatic discount percentage calculation

### Rating System
- 5-star rating display with half-star support
- Review count display
- Accessible rating information

### Interactive Elements
- Favorite toggle with heart icon
- Quick view on hover
- Add to cart with loading states
- Prevents event bubbling on actions

### Badges
- Automatic "New" badge
- Sale discount percentage
- Custom badges with variants
- Multiple badge support

### Image Handling
- Loading state with skeleton
- Error state with fallback icon
- Smooth hover zoom effect
- Responsive aspect ratio

## Accessibility

- Semantic HTML structure
- Proper ARIA labels for actions
- Keyboard navigation support
- Focus indicators
- Alt text for images
- Screen reader friendly

## Best Practices

1. **Image Optimization** - Use appropriately sized images (400x400px recommended)
2. **Consistent Sizing** - Use the same card size within a grid
3. **Meaningful Names** - Keep product names concise (2 lines max)
4. **Price Clarity** - Always show current price prominently
5. **Action Feedback** - Provide visual feedback for user actions
6. **Loading States** - Show skeletons while loading product data
7. **Error Handling** - Gracefully handle missing images
8. **Mobile First** - Ensure cards work well on mobile devices