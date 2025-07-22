# ProductCarousel Component

A responsive carousel component for displaying products with navigation, autoplay, and multiple layout options. Includes specialized variants for recommended and related products.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { ProductCarousel, RecommendedProducts, RelatedProducts } from '@/components/organisms/ProductCarousel';

// Basic product carousel
<ProductCarousel
  products={[
    {
      id: 1,
      title: 'Product Name',
      price: 99.99,
      image: '/product.jpg',
      href: '/products/1'
    }
  ]}
/>

// With navigation and autoplay
<ProductCarousel
  products={products}
  title="Featured Products"
  itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
  autoplay
  loop
  showDots
/>

// Recommended products
<RecommendedProducts
  products={products}
  onProductClick={(product) => console.log(product)}
/>

// Related products
<RelatedProducts
  products={products}
  title="You might also like"
/>
```

## Components

### ProductCarousel

The main carousel component with full customization options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | - | **Required**. Array of products |
| `variant` | `'default' \| 'compact' \| 'featured' \| 'minimal'` | `'default'` | Carousel variant |
| `itemsPerView` | `number \| { mobile: number; tablet: number; desktop: number }` | `{ mobile: 1, tablet: 2, desktop: 4 }` | Items visible |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between items |
| `title` | `string` | - | Carousel title |
| `subtitle` | `string` | - | Carousel subtitle |
| `showViewAll` | `boolean` | `false` | Show view all button |
| `viewAllHref` | `string` | - | View all link URL |
| `viewAllText` | `string` | `'View All'` | View all button text |
| `showNavigation` | `boolean` | `true` | Show navigation arrows |
| `navigationPosition` | `'sides' \| 'bottom' \| 'top-right'` | `'sides'` | Navigation position |
| `showDots` | `boolean` | `false` | Show dot indicators |
| `autoplay` | `boolean` | `false` | Enable autoplay |
| `autoplayInterval` | `number` | `5000` | Autoplay interval (ms) |
| `loop` | `boolean` | `false` | Enable infinite loop |
| `loading` | `boolean` | `false` | Show loading state |
| `skeletonCount` | `number` | `4` | Number of skeletons |
| `onProductClick` | `(product: Product) => void` | - | Product click handler |
| `onViewAll` | `() => void` | - | View all click handler |
| `onSlideChange` | `(index: number) => void` | - | Slide change handler |
| `className` | `string` | - | Section CSS classes |
| `headerClassName` | `string` | - | Header CSS classes |
| `carouselClassName` | `string` | - | Carousel CSS classes |
| `navigationClassName` | `string` | - | Navigation CSS classes |
| `aria-label` | `string` | - | Accessibility label |

#### Product Type

```typescript
interface Product {
  id: string | number;
  title: string;
  price: string | number;
  originalPrice?: string | number;
  image: string;
  images?: string[];
  href: string;
  vendor?: {
    name: string;
    href?: string;
  };
  rating?: number;
  reviewCount?: number;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}
```

### RecommendedProducts

Pre-configured carousel for recommended products.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | - | **Required**. Array of products |
| `title` | `string` | `'Recommended for You'` | Section title |
| `loading` | `boolean` | - | Loading state |
| `onProductClick` | `(product: Product) => void` | - | Product click handler |
| `className` | `string` | - | Custom CSS classes |

### RelatedProducts

Pre-configured carousel for related products.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | - | **Required**. Array of products |
| `title` | `string` | `'Related Products'` | Section title |
| `loading` | `boolean` | - | Loading state |
| `onProductClick` | `(product: Product) => void` | - | Product click handler |
| `className` | `string` | - | Custom CSS classes |

## Examples

### Basic Carousel

```tsx
function BasicCarousel() {
  const products = [
    {
      id: 1,
      title: 'Wireless Headphones',
      price: 79.99,
      image: '/headphones.jpg',
      href: '/products/headphones',
      vendor: { name: 'TechStore' },
      rating: 4.5,
      reviewCount: 234
    },
    // ... more products
  ];

  return <ProductCarousel products={products} />;
}
```

### With Header and Actions

```tsx
function FeaturedProducts() {
  return (
    <ProductCarousel
      products={products}
      title="Featured Products"
      subtitle="Hand-picked items just for you"
      showViewAll
      viewAllHref="/featured"
      viewAllText="Shop All Featured"
      itemsPerView={{ mobile: 1, tablet: 3, desktop: 5 }}
    />
  );
}
```

### Autoplay Carousel

```tsx
function AutoplayCarousel() {
  return (
    <ProductCarousel
      products={products}
      title="Today's Deals"
      autoplay
      autoplayInterval={4000}
      loop
      showDots
      navigationPosition="bottom"
    />
  );
}
```

### Responsive Configuration

```tsx
function ResponsiveCarousel() {
  return (
    <ProductCarousel
      products={products}
      title="Best Sellers"
      itemsPerView={{
        mobile: 1,    // 1 item on mobile
        tablet: 2,    // 2 items on tablet
        desktop: 4    // 4 items on desktop
      }}
      gap="lg"
      showNavigation
    />
  );
}
```

### Interactive Carousel

```tsx
function InteractiveCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleProductClick = (product: Product) => {
    console.log('Clicked:', product.title);
    // Navigate to product page or show quick view
  };

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
    console.log('Current slide:', index);
  };

  return (
    <ProductCarousel
      products={products}
      title="Popular Products"
      onProductClick={handleProductClick}
      onSlideChange={handleSlideChange}
      showDots
      navigationPosition="top-right"
    />
  );
}
```

### Flash Sale Carousel

```tsx
function FlashSaleCarousel() {
  const flashSaleProducts = products.map(product => ({
    ...product,
    badge: '50% OFF',
    badgeVariant: 'danger' as const,
    originalPrice: product.price * 2
  }));

  return (
    <ProductCarousel
      products={flashSaleProducts}
      title="⚡ Flash Sale"
      subtitle="Ends in 24 hours"
      variant="featured"
      itemsPerView={3}
      autoplay
      loop
      showViewAll
      viewAllHref="/flash-sale"
    />
  );
}
```

### Category-Specific Carousel

```tsx
function CategoryCarousel({ category }: { category: string }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsByCategory(category).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  return (
    <ProductCarousel
      products={products}
      title={`Top ${category} Products`}
      loading={loading}
      skeletonCount={5}
      itemsPerView={5}
      gap="sm"
    />
  );
}
```

### Recommended Products Section

```tsx
function ProductRecommendations() {
  const recommendations = useRecommendations(userId);

  return (
    <RecommendedProducts
      products={recommendations}
      onProductClick={(product) => {
        trackClick('recommendation', product.id);
        router.push(product.href);
      }}
    />
  );
}
```

### Related Products Section

```tsx
function ProductPage({ productId }: { productId: string }) {
  const relatedProducts = useRelatedProducts(productId);

  return (
    <div>
      {/* Product details */}
      
      <RelatedProducts
        products={relatedProducts}
        title="Customers also bought"
        onProductClick={(product) => {
          router.push(product.href);
        }}
      />
    </div>
  );
}
```

## Navigation Options

### Side Navigation (Default)
Navigation arrows appear on hover at the sides of the carousel.

### Bottom Navigation
Navigation arrows appear below the carousel content.

### Top-Right Navigation
Navigation arrows appear in the header area, aligned to the right.

### Dot Navigation
Small dots indicate current position and allow direct navigation.

## Responsive Behavior

The carousel automatically adjusts:
- Number of visible items based on screen size
- Touch/swipe support on mobile devices
- Navigation visibility based on content
- Image sizes and spacing

## Performance Considerations

1. **Lazy Loading**: Consider implementing lazy loading for images
2. **Virtualization**: For very large product lists, consider virtualization
3. **Image Optimization**: Use appropriate image sizes and formats
4. **Autoplay**: Be mindful of autoplay performance impact
5. **Animations**: CSS transitions are optimized for smooth scrolling

## Accessibility

- Keyboard navigation support (arrow keys)
- Screen reader announcements for navigation
- Focus management for interactive elements
- ARIA labels for all controls
- Pause autoplay on hover/focus
- Skip links for keyboard users

## Best Practices

1. **Optimal Items**: Show 4-5 items on desktop, 2-3 on tablet, 1-2 on mobile
2. **Navigation**: Always show navigation for carousels with many items
3. **Autoplay**: Use sparingly and always with manual controls
4. **Loading States**: Always show skeletons while loading
5. **Touch Support**: Ensure good swipe experience on mobile
6. **Performance**: Limit number of products for better performance
7. **Accessibility**: Test with keyboard and screen readers
8. **Responsive**: Test on various screen sizes
9. **Image Quality**: Use high-quality product images
10. **Error Handling**: Handle missing images gracefully