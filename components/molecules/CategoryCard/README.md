# CategoryCard Component

A versatile category card component for displaying product categories with images, icons, descriptions, and product counts. Includes multiple variants, layouts, and a grid wrapper for easy category layouts.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge next
```

## Usage

```tsx
import { CategoryCard, CategoryCardGrid } from '@/components/molecules/CategoryCard';

// Basic category card
<CategoryCard
  title="Electronics"
  description="Latest gadgets and devices"
  href="/categories/electronics"
  productCount={1234}
/>

// With image
<CategoryCard
  title="Fashion"
  description="Trending styles"
  image="/fashion-category.jpg"
  href="/categories/fashion"
  productCount={567}
/>

// Category grid
<CategoryCardGrid
  categories={[
    { id: 1, title: 'Electronics', href: '/electronics', icon: 'desktop' },
    { id: 2, title: 'Fashion', href: '/fashion', icon: 'shopping-bag' },
  ]}
  columns={4}
/>
```

## Components

### CategoryCard

The main category card component with multiple display options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required**. Category name |
| `href` | `string` | - | **Required**. Category link URL |
| `description` | `string` | - | Category description |
| `image` | `string` | - | Category image URL |
| `icon` | `string` | - | Icon name (when no image) |
| `variant` | `'default' \| 'compact' \| 'featured' \| 'minimal'` | `'default'` | Card variant |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size |
| `productCount` | `number` | - | Number of products |
| `badge` | `string` | - | Badge text |
| `badgeVariant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Badge style |
| `subcategories` | `string[]` | - | List of subcategories |
| `imageAspectRatio` | `'square' \| '4:3' \| '16:9' \| '3:2'` | `'square'` | Image aspect ratio |
| `overlay` | `boolean` | `false` | Show overlay on image |
| `overlayGradient` | `boolean` | `true` | Use gradient overlay |
| `hoverEffect` | `'none' \| 'lift' \| 'zoom' \| 'darken'` | `'lift'` | Hover animation |
| `className` | `string` | - | Container CSS classes |
| `imageClassName` | `string` | - | Image CSS classes |
| `contentClassName` | `string` | - | Content CSS classes |
| `onClick` | `(e: MouseEvent) => void` | - | Click handler |
| `aria-label` | `string` | - | Accessibility label |

### CategoryCardGrid

Grid wrapper for displaying multiple category cards.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `categories` | `Array<CategoryCardProps & { id: string \| number }>` | - | **Required**. Array of categories |
| `columns` | `2 \| 3 \| 4 \| 5 \| 6` | `4` | Number of columns |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Grid gap size |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size |
| `className` | `string` | - | Grid CSS classes |

## Variants

### Default
Standard card with optional image, title, description, and product count.

```tsx
<CategoryCard
  title="Electronics"
  description="Latest technology"
  icon="desktop"
  href="/electronics"
  productCount={1234}
/>
```

### Compact
Condensed horizontal layout with icon and minimal information.

```tsx
<CategoryCard
  title="Quick Shop"
  icon="shopping-cart"
  href="/quick-shop"
  productCount={123}
  variant="compact"
/>
```

### Featured
Expanded card with subcategories and more details.

```tsx
<CategoryCard
  title="Best Sellers"
  description="Top rated products"
  icon="trending-up"
  href="/best-sellers"
  productCount={456}
  subcategories={['Electronics', 'Fashion', 'Home', 'Sports']}
  variant="featured"
/>
```

### Minimal
Simple card with just title and optional product count.

```tsx
<CategoryCard
  title="Sale Items"
  href="/sale"
  productCount={789}
  variant="minimal"
/>
```

## Layouts

### Vertical Layout (Default)

```tsx
<CategoryCard
  title="Fashion"
  image="/fashion.jpg"
  href="/fashion"
  layout="vertical"
/>
```

### Horizontal Layout

```tsx
<CategoryCard
  title="Electronics"
  description="Gadgets and devices"
  image="/electronics.jpg"
  href="/electronics"
  layout="horizontal"
/>
```

## Examples

### With Image Overlay

```tsx
<CategoryCard
  title="Outdoor Adventure"
  description="Gear for every journey"
  image="/outdoor.jpg"
  href="/outdoor"
  overlay
  overlayGradient
  productCount={345}
/>
```

### With Badge

```tsx
<CategoryCard
  title="New Arrivals"
  image="/new-arrivals.jpg"
  href="/new"
  badge="Just In"
  badgeVariant="success"
  productCount={123}
/>
```

### Category Grid

```tsx
function CategorySection() {
  const categories = [
    { id: 1, title: 'Electronics', icon: 'desktop', productCount: 1234 },
    { id: 2, title: 'Fashion', icon: 'shopping-bag', productCount: 567 },
    { id: 3, title: 'Home', icon: 'home', productCount: 890 },
    { id: 4, title: 'Sports', icon: 'activity', productCount: 345 },
  ].map(cat => ({ ...cat, href: `/categories/${cat.id}` }));

  return (
    <CategoryCardGrid
      categories={categories}
      columns={4}
      gap="md"
    />
  );
}
```

### Featured Categories

```tsx
function FeaturedCategories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CategoryCard
        title="Summer Collection"
        description="Hot deals on summer essentials"
        image="/summer.jpg"
        href="/summer"
        size="lg"
        variant="featured"
        badge="Up to 50% off"
        badgeVariant="danger"
        subcategories={['Swimwear', 'Sandals', 'Sunglasses']}
      />
      
      <CategoryCard
        title="Tech Week"
        description="Latest gadgets at best prices"
        image="/tech-week.jpg"
        href="/tech-week"
        size="lg"
        overlay
        productCount={234}
      />
    </div>
  );
}
```

### Sidebar Categories

```tsx
function SidebarCategories() {
  const categories = [
    { title: 'All Products', icon: 'grid', count: 5678 },
    { title: 'Electronics', icon: 'desktop', count: 1234 },
    { title: 'Fashion', icon: 'shopping-bag', count: 2345 },
    { title: 'Home', icon: 'home', count: 890 },
  ];

  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.title}
          title={cat.title}
          icon={cat.icon}
          href={`/categories/${cat.title.toLowerCase()}`}
          productCount={cat.count}
          variant="compact"
          size="sm"
        />
      ))}
    </div>
  );
}
```

### Interactive Categories

```tsx
function InteractiveCategories() {
  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    console.log(`Category clicked: ${category}`);
    // Custom navigation logic
  };

  return (
    <CategoryCard
      title="Special Offers"
      description="Limited time deals"
      icon="gift"
      href="/offers"
      onClick={(e) => handleCategoryClick(e, 'offers')}
      hoverEffect="zoom"
      badge="Hot"
      badgeVariant="danger"
    />
  );
}
```

## Hover Effects

### Lift Effect
Card lifts up on hover (default).

```tsx
<CategoryCard hoverEffect="lift" />
```

### Zoom Effect
Image zooms in on hover.

```tsx
<CategoryCard hoverEffect="zoom" image="/category.jpg" />
```

### Darken Effect
Image darkens on hover.

```tsx
<CategoryCard hoverEffect="darken" image="/category.jpg" />
```

### No Effect
Disable hover animations.

```tsx
<CategoryCard hoverEffect="none" />
```

## Styling

### Sizes
- **Small**: Compact cards for sidebars or dense grids
- **Medium**: Default size for most layouts
- **Large**: Prominent cards for featured categories

### Aspect Ratios
- **Square**: 1:1 ratio (default)
- **4:3**: Classic photo ratio
- **16:9**: Widescreen format
- **3:2**: Photography standard

### Custom Styling

```tsx
<CategoryCard
  title="Custom Styled"
  href="/custom"
  className="shadow-xl border-2 border-primary-500"
  contentClassName="bg-gradient-to-b from-white to-gray-50"
  imageClassName="filter brightness-110"
/>
```

## Accessibility

- Semantic link elements for navigation
- Proper ARIA labels for screen readers
- Keyboard navigable
- Focus states for keyboard users
- Alt text for images

## Best Practices

1. **Use appropriate variants**: Choose variant based on layout context
2. **Optimize images**: Use properly sized images for better performance
3. **Consistent sizing**: Use the same size within a grid
4. **Meaningful descriptions**: Help users understand category content
5. **Show product counts**: Helps users gauge category size
6. **Use icons wisely**: Icons help when images aren't available
7. **Responsive grids**: Test grid layouts on different screen sizes
8. **Loading states**: Show skeletons while images load
9. **Error handling**: Provide fallback for broken images
10. **Hover feedback**: Use appropriate hover effects for user feedback