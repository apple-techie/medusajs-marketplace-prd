# HeroSection Component

A versatile hero section component for creating impactful landing pages and page headers. Includes multiple variants, background options, search integration, and specialized hero types for different use cases.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge next
```

## Usage

```tsx
import { HeroSection, SimpleHero, SearchHero, MarketplaceHero } from '@/components/organisms/HeroSection';

// Basic hero section
<HeroSection
  title="Welcome to Our Marketplace"
  subtitle="Discover Amazing Products"
  description="Browse thousands of products from trusted vendors."
  primaryAction={{
    label: 'Start Shopping',
    href: '/shop'
  }}
/>

// With background image and search
<HeroSection
  title="Find What You Need"
  backgroundImage="/hero-bg.jpg"
  showSearch
  searchPlaceholder="Search products..."
  overlay
  theme="dark"
/>

// Simple hero variant
<SimpleHero
  title="Page Title"
  subtitle="Page subtitle"
  primaryAction={{ label: 'Get Started', href: '/start' }}
/>

// Search-focused hero
<SearchHero
  title="Search Our Catalog"
  searchCategories={[
    { label: 'All', value: 'all' },
    { label: 'Electronics', value: 'electronics' }
  ]}
  onSearch={(query, category) => console.log(query, category)}
/>

// Marketplace hero with stats
<MarketplaceHero
  title="Your Trusted Marketplace"
  stats={[
    { value: '100K+', label: 'Products' },
    { value: '10K+', label: 'Vendors' }
  ]}
  trustedBy={[
    { name: 'Brand 1', logo: '/brand1.png' }
  ]}
/>
```

## Components

### HeroSection

The main hero section component with extensive customization options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| ReactNode` | - | **Required**. Hero title |
| `subtitle` | `string \| ReactNode` | - | Hero subtitle |
| `description` | `string` | - | Hero description text |
| `variant` | `'default' \| 'centered' \| 'split' \| 'minimal' \| 'fullscreen'` | `'default'` | Hero layout variant |
| `layout` | `'content-left' \| 'content-right' \| 'content-center'` | `'content-center'` | Content alignment |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'` | Hero size |
| `backgroundImage` | `string` | - | Background image URL |
| `backgroundVideo` | `string` | - | Background video URL |
| `backgroundGradient` | `boolean` | `false` | Show gradient background |
| `overlay` | `boolean` | `true` | Show overlay on background |
| `overlayOpacity` | `number` | `0.5` | Overlay opacity (0-1) |
| `primaryAction` | `{ label: string; href?: string; onClick?: () => void; variant?: string }` | - | Primary CTA |
| `secondaryAction` | `{ label: string; href?: string; onClick?: () => void; variant?: string }` | - | Secondary CTA |
| `showSearch` | `boolean` | `false` | Show search bar |
| `searchPlaceholder` | `string` | `'Search products...'` | Search placeholder |
| `searchCategories` | `Array<{ label: string; value: string }>` | - | Search categories |
| `onSearch` | `(query: string, category?: string) => void` | - | Search handler |
| `badges` | `Array<{ text: string; variant?: string }>` | - | Badge elements |
| `features` | `Array<{ icon: string; text: string }>` | - | Feature list |
| `stats` | `Array<{ value: string; label: string }>` | - | Statistics |
| `trustedBy` | `Array<{ name: string; logo: string }>` | - | Company logos |
| `contentWidth` | `'narrow' \| 'medium' \| 'wide' \| 'full'` | `'medium'` | Content max width |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'center'` | Text alignment |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color theme |
| `className` | `string` | - | Section CSS classes |
| `contentClassName` | `string` | - | Content CSS classes |
| `titleClassName` | `string` | - | Title CSS classes |
| `aria-label` | `string` | - | Accessibility label |

### SimpleHero

Minimal hero variant for simple page headers.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required**. Hero title |
| `subtitle` | `string` | - | Hero subtitle |
| `primaryAction` | `object` | - | Primary action button |
| `secondaryAction` | `object` | - | Secondary action button |
| `className` | `string` | - | Custom CSS classes |

### SearchHero

Search-focused hero variant with prominent search functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required**. Hero title |
| `subtitle` | `string` | - | Hero subtitle |
| `searchPlaceholder` | `string` | - | Search placeholder text |
| `searchCategories` | `Array` | - | Category options |
| `onSearch` | `function` | - | Search handler |
| `backgroundImage` | `string` | - | Background image URL |
| `className` | `string` | - | Custom CSS classes |

### MarketplaceHero

Marketplace-specific hero with stats and trust indicators.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required**. Hero title |
| `subtitle` | `string` | - | Hero subtitle |
| `description` | `string` | - | Hero description |
| `stats` | `Array` | - | Statistics to display |
| `primaryAction` | `object` | - | Primary action button |
| `trustedBy` | `Array` | - | Company logos |
| `className` | `string` | - | Custom CSS classes |

## Variants

### Default
Standard hero with all features available.

```tsx
<HeroSection
  title="Welcome to Our Store"
  subtitle="Quality Products, Great Prices"
  description="Shop from thousands of products"
  variant="default"
/>
```

### Centered
Everything centered for maximum impact.

```tsx
<HeroSection
  title="Big Announcement"
  description="Something amazing is coming"
  variant="centered"
  size="xl"
/>
```

### Split
Content on one side, image/video on the other.

```tsx
<HeroSection
  title="Split Layout Hero"
  variant="split"
  layout="content-left"
  backgroundImage="/product-hero.jpg"
/>
```

### Minimal
Clean and simple with minimal styling.

```tsx
<HeroSection
  title="Simple Hero"
  variant="minimal"
  size="sm"
/>
```

### Fullscreen
Full viewport height for landing pages.

```tsx
<HeroSection
  title="Immersive Experience"
  variant="fullscreen"
  backgroundVideo="/hero-video.mp4"
  overlay
/>
```

## Examples

### E-commerce Landing Page

```tsx
function LandingPageHero() {
  return (
    <HeroSection
      title={
        <>
          Summer Sale
          <span className="text-primary-600"> 50% Off</span>
        </>
      }
      subtitle="Limited Time Only"
      description="Shop the hottest deals on summer essentials"
      backgroundImage="/summer-hero.jpg"
      overlay
      overlayOpacity={0.3}
      theme="dark"
      badges={[
        { text: '🔥 Hot Deal', variant: 'danger' },
        { text: 'Free Shipping', variant: 'success' }
      ]}
      primaryAction={{
        label: 'Shop Now',
        href: '/summer-sale'
      }}
      secondaryAction={{
        label: 'View Catalog',
        href: '/catalog',
        variant: 'ghost'
      }}
      features={[
        { icon: 'truck', text: 'Free Delivery' },
        { icon: 'refresh-cw', text: 'Easy Returns' },
        { icon: 'shield', text: 'Secure Payment' }
      ]}
    />
  );
}
```

### Search-Focused Hero

```tsx
function SearchPageHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = (query: string, cat?: string) => {
    setSearchQuery(query);
    setCategory(cat || 'all');
    // Perform search
  };

  return (
    <HeroSection
      title="What are you looking for?"
      subtitle="Search over 100,000 products"
      variant="centered"
      size="lg"
      showSearch
      searchPlaceholder="Search products, brands, categories..."
      searchCategories={[
        { label: 'All Categories', value: 'all' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Fashion', value: 'fashion' },
        { label: 'Home & Garden', value: 'home' },
        { label: 'Sports', value: 'sports' }
      ]}
      onSearch={handleSearch}
      backgroundGradient
      theme="dark"
    />
  );
}
```

### Marketplace Homepage

```tsx
function MarketplaceHomepage() {
  return (
    <MarketplaceHero
      title="Your Trusted Online Marketplace"
      subtitle="Where Quality Meets Convenience"
      description="Shop from verified vendors with guaranteed quality and fast delivery"
      stats={[
        { value: '100K+', label: 'Products' },
        { value: '10K+', label: 'Vendors' },
        { value: '1M+', label: 'Happy Customers' },
        { value: '4.9/5', label: 'Average Rating' }
      ]}
      primaryAction={{
        label: 'Start Shopping',
        href: '/shop'
      }}
      trustedBy={[
        { name: 'Nike', logo: '/logos/nike.svg' },
        { name: 'Apple', logo: '/logos/apple.svg' },
        { name: 'Samsung', logo: '/logos/samsung.svg' },
        { name: 'Sony', logo: '/logos/sony.svg' }
      ]}
    />
  );
}
```

### Category Page Hero

```tsx
function CategoryHero({ category }: { category: Category }) {
  return (
    <HeroSection
      title={category.name}
      description={category.description}
      variant="minimal"
      size="md"
      layout="content-left"
      badges={[
        { text: `${category.productCount} Products`, variant: 'default' }
      ]}
      primaryAction={{
        label: 'Filter Products',
        onClick: () => openFilterModal()
      }}
    />
  );
}
```

### Promotional Hero

```tsx
function PromoHero() {
  return (
    <HeroSection
      title="Black Friday Mega Sale"
      subtitle="November 24-27 Only"
      description="The biggest sale of the year is here!"
      backgroundImage="/black-friday-bg.jpg"
      overlay
      overlayOpacity={0.6}
      theme="dark"
      size="xl"
      badges={[
        { text: 'Up to 70% Off', variant: 'danger' },
        { text: 'Free Shipping', variant: 'success' },
        { text: 'Extended Returns', variant: 'primary' }
      ]}
      primaryAction={{
        label: 'Shop Black Friday',
        href: '/black-friday'
      }}
      stats={[
        { value: '70%', label: 'Max Discount' },
        { value: '10K+', label: 'Deals' },
        { value: '72hrs', label: 'Sale Duration' },
        { value: '$0', label: 'Shipping' }
      ]}
    />
  );
}
```

## Background Options

### Image Background

```tsx
<HeroSection
  title="Beautiful Background"
  backgroundImage="/hero-bg.jpg"
  overlay
  overlayOpacity={0.4}
  theme="dark"
/>
```

### Video Background

```tsx
<HeroSection
  title="Dynamic Video Background"
  backgroundVideo="/hero-video.mp4"
  overlay
  overlayOpacity={0.5}
  theme="dark"
/>
```

### Gradient Background

```tsx
<HeroSection
  title="Gradient Background"
  backgroundGradient
  theme="dark"
/>
```

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Background videos include autoplay, muted, and loop attributes
- Overlay ensures text contrast on image/video backgrounds
- All interactive elements are keyboard navigable
- Proper ARIA labels for screen readers
- Focus states for all interactive elements

## Best Practices

1. **Choose appropriate variant**: Match the variant to your page purpose
2. **Size matters**: Use larger sizes for landing pages, smaller for internal pages
3. **Background contrast**: Ensure text is readable over backgrounds
4. **Mobile optimization**: Test responsive behavior on all screen sizes
5. **Loading performance**: Optimize images and videos for web
6. **Clear CTAs**: Make action buttons stand out and be descriptive
7. **Search integration**: Only show search when it adds value
8. **Trust indicators**: Use stats and logos to build credibility
9. **Keep it focused**: Don't overload with too many elements
10. **Test overlays**: Adjust opacity for optimal readability