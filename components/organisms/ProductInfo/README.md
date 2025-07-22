# ProductInfo Component

A comprehensive product information organism for e-commerce product detail pages. Displays product details including pricing, stock status, vendor information, features, and more.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { ProductInfo } from '@/components/organisms/ProductInfo';

// Basic usage
<ProductInfo
  name="Wireless Headphones"
  brand="AudioTech"
  price={199.99}
  inStock={true}
/>

// With full details
<ProductInfo
  name="Gaming Laptop"
  brand="TechPro"
  sku="TP-001"
  price={1299.99}
  originalPrice={1599.99}
  shortDescription="High-performance gaming laptop"
  rating={4.5}
  reviewCount={128}
  vendorName="Tech Store"
  highlights={['RTX Graphics', '144Hz Display']}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | **Required**. Product name |
| `brand` | `string` | - | Product brand |
| `sku` | `string` | - | Product SKU |
| `price` | `number` | - | **Required**. Current price |
| `originalPrice` | `number` | - | Original price (for sales) |
| `currency` | `string` | `'USD'` | Currency code |
| `shortDescription` | `string` | - | Brief product description |
| `longDescription` | `string` | - | HTML product description |
| `features` | `ProductFeature[]` | `[]` | Product features list |
| `highlights` | `string[]` | `[]` | Product highlights |
| `rating` | `number` | - | Average rating (0-5) |
| `reviewCount` | `number` | `0` | Number of reviews |
| `onReviewClick` | `() => void` | - | Review click handler |
| `vendorName` | `string` | - | Vendor/seller name |
| `vendorId` | `string` | - | Vendor ID |
| `vendorRating` | `number` | - | Vendor rating |
| `onVendorClick` | `() => void` | - | Vendor click handler |
| `inStock` | `boolean` | `true` | Stock availability |
| `stockCount` | `number` | - | Available stock quantity |
| `lowStockThreshold` | `number` | `10` | Low stock warning threshold |
| `availability` | `string` | - | Custom availability text |
| `shippingInfo` | `object` | - | Shipping information |
| `badges` | `Badge[]` | `[]` | Product badges |
| `ageRestriction` | `number` | - | Age restriction (18, 21, etc) |
| `layout` | `'default' \| 'compact' \| 'detailed'` | `'default'` | Layout style |
| `showSku` | `boolean` | `true` | Show SKU |
| `showVendor` | `boolean` | `true` | Show vendor info |
| `showShipping` | `boolean` | `true` | Show shipping info |
| `onShare` | `() => void` | - | Share button handler |
| `onWishlist` | `() => void` | - | Wishlist button handler |
| `isWishlisted` | `boolean` | `false` | Wishlist state |
| `className` | `string` | - | Container CSS classes |

### Type Definitions

```tsx
interface ProductFeature {
  icon?: string;
  label: string;
  value: string;
}

interface ShippingInfo {
  freeShipping?: boolean;
  estimatedDays?: string;
  cost?: number;
}

interface Badge {
  text: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'success';
}
```

## Common Patterns

### Basic Product Display

```tsx
<ProductInfo
  name="Smartphone"
  brand="TechBrand"
  price={699.99}
  inStock={true}
  rating={4.3}
  reviewCount={234}
/>
```

### Sale Product

```tsx
<ProductInfo
  name="Winter Jacket"
  brand="OutdoorGear"
  price={149.99}
  originalPrice={249.99}
  badges={[
    { text: '40% OFF', variant: 'destructive' },
    { text: 'Limited Time', variant: 'secondary' }
  ]}
  shortDescription="Waterproof winter jacket with thermal insulation"
/>
```

### Detailed Product

```tsx
<ProductInfo
  layout="detailed"
  name="Gaming PC"
  brand="GameTech"
  sku="GT-PC-001"
  price={1999.99}
  originalPrice={2499.99}
  longDescription={productHtmlDescription}
  features={[
    { icon: 'cpu', label: 'Processor', value: 'Intel i9' },
    { icon: 'zap', label: 'Graphics', value: 'RTX 4080' },
    { icon: 'database', label: 'Memory', value: '32GB DDR5' }
  ]}
  highlights={[
    'VR Ready',
    '4K Gaming',
    'RGB Lighting',
    '3 Year Warranty'
  ]}
/>
```

### Low Stock Warning

```tsx
<ProductInfo
  name="Limited Edition Watch"
  price={299.99}
  inStock={true}
  stockCount={3}
  lowStockThreshold={5}
  badges={[
    { text: 'Limited Stock', variant: 'destructive' }
  ]}
/>
```

### With Vendor Info

```tsx
<ProductInfo
  name="Handmade Jewelry"
  price={79.99}
  vendorName="Artisan Crafts"
  vendorRating={4.8}
  onVendorClick={() => navigateToVendor()}
  showVendor={true}
/>
```

### Age Restricted Product

```tsx
<ProductInfo
  name="Premium Wine"
  brand="Vintage Cellars"
  price={89.99}
  ageRestriction={21}
  shortDescription="Award-winning red wine from Napa Valley"
/>
```

### Custom Availability

```tsx
<ProductInfo
  name="Custom Furniture"
  price={899.99}
  availability="Made to order - Ships in 2-3 weeks"
  inStock={true}
/>
```

### With Shipping Info

```tsx
<ProductInfo
  name="Electronics Bundle"
  price={499.99}
  shippingInfo={{
    freeShipping: true,
    estimatedDays: 'Next day delivery'
  }}
  showShipping={true}
/>
```

## Interactive Example

```tsx
function ProductDetailPage() {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href
      });
    } catch (err) {
      // Fallback to copy link
      copyToClipboard(window.location.href);
    }
  };
  
  return (
    <ProductInfo
      {...product}
      isWishlisted={isWishlisted}
      onWishlist={() => setIsWishlisted(!isWishlisted)}
      onShare={handleShare}
      onReviewClick={() => scrollToReviews()}
      onVendorClick={() => navigateToVendor(product.vendorId)}
    />
  );
}
```

## Layout Variants

### Compact Layout

```tsx
// Minimal space, essential info only
<ProductInfo
  layout="compact"
  name="USB Cable"
  price={9.99}
  inStock={true}
/>
```

### Default Layout

```tsx
// Standard product display
<ProductInfo
  layout="default"
  name="Laptop"
  brand="TechBrand"
  price={999.99}
  shortDescription="Powerful laptop for work and play"
  highlights={['Fast processor', 'All-day battery']}
/>
```

### Detailed Layout

```tsx
// Full product information with features
<ProductInfo
  layout="detailed"
  name="Professional Camera"
  brand="PhotoPro"
  price={2499.99}
  longDescription={detailedHtml}
  features={cameraFeatures}
  highlights={cameraHighlights}
/>
```

## Accessibility

- Semantic HTML structure with proper headings
- ARIA labels for interactive elements
- Keyboard accessible action buttons
- Screen reader friendly price and savings announcements
- Proper color contrast for all text
- Focus indicators on interactive elements

## Best Practices

1. **Required Props**: Always provide `name` and `price` at minimum
2. **Stock Status**: Use `stockCount` with `lowStockThreshold` for urgency
3. **Pricing**: Show `originalPrice` with `price` for sales
4. **Reviews**: Implement `onReviewClick` to scroll to reviews section
5. **Vendor**: Link to vendor pages for marketplace sites
6. **Images**: This component doesn't handle images - use with ImageGallery
7. **SEO**: Ensure proper meta tags on the page level
8. **Loading**: Show skeleton state while fetching product data