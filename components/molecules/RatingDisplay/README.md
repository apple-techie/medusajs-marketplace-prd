# RatingDisplay Component

A comprehensive rating display component family for showing product ratings, review counts, rating distributions, and review statistics. Perfect for e-commerce product pages, review sections, and comparison tables.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { 
  RatingDisplay, 
  RatingSummary, 
  ReviewStats 
} from '@/components/molecules/RatingDisplay';

// Basic rating display
<RatingDisplay rating={4.5} reviewCount={234} />

// Compact variant
<RatingDisplay rating={4.5} reviewCount={234} variant="compact" />

// With distribution
<RatingDisplay 
  rating={4.3}
  variant="detailed"
  showDistribution
  distribution={{ 5: 156, 4: 89, 3: 23, 2: 8, 1: 4 }}
/>

// Rating summary
<RatingSummary
  ratings={[
    { label: 'Quality', rating: 4.7 },
    { label: 'Value', rating: 4.2 },
  ]}
/>

// Review statistics
<ReviewStats
  averageRating={4.5}
  totalReviews={1234}
  recommendationRate={92}
/>
```

## Components

### RatingDisplay

The main component for displaying ratings with various layouts and options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | `number` | - | **Required**. Rating value |
| `maxRating` | `number` | `5` | Maximum rating value |
| `reviewCount` | `number` | - | Number of reviews |
| `variant` | `'default' \| 'compact' \| 'detailed' \| 'inline'` | `'default'` | Display variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `showAverage` | `boolean` | `true` | Show average rating number |
| `showReviewCount` | `boolean` | `true` | Show review count |
| `showStars` | `boolean` | `true` | Show star rating |
| `distribution` | `{ 5: number; 4: number; 3: number; 2: number; 1: number }` | - | Rating distribution |
| `showDistribution` | `boolean` | `false` | Show rating distribution |
| `onReviewClick` | `() => void` | - | Review click handler |
| `reviewLinkText` | `string` | `'reviews'` | Review link text |
| `className` | `string` | - | Container CSS classes |
| `ratingClassName` | `string` | - | Rating number CSS classes |
| `reviewCountClassName` | `string` | - | Review count CSS classes |
| `distributionClassName` | `string` | - | Distribution CSS classes |
| `aria-label` | `string` | - | Accessibility label |

### RatingSummary

Display multiple rating categories with optional progress bars.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ratings` | `Array<{ label: string; rating: number; maxRating?: number }>` | - | **Required**. Rating categories |
| `overallRating` | `number` | - | Overall rating to display |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `showBars` | `boolean` | `true` | Show progress bars |
| `className` | `string` | - | Container CSS classes |

### ReviewStats

Display review statistics and metrics.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `averageRating` | `number` | - | **Required**. Average rating |
| `totalReviews` | `number` | - | **Required**. Total number of reviews |
| `recommendationRate` | `number` | - | Percentage who recommend |
| `verifiedPurchases` | `number` | - | Number of verified purchases |
| `helpfulVotes` | `number` | - | Number of helpful votes |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `className` | `string` | - | Container CSS classes |

## Variants

### Default
Standard vertical layout with stars, rating, and review count.

```tsx
<RatingDisplay rating={4.5} reviewCount={234} />
```

### Compact
Minimal horizontal layout with star icon and numbers.

```tsx
<RatingDisplay rating={4.5} reviewCount={234} variant="compact" />
```

### Inline
Horizontal layout ideal for product cards.

```tsx
<RatingDisplay rating={4.5} reviewCount={234} variant="inline" />
```

### Detailed
Full layout with rating distribution bars.

```tsx
<RatingDisplay 
  rating={4.3}
  variant="detailed"
  showDistribution
  distribution={{
    5: 156,
    4: 89,
    3: 23,
    2: 8,
    1: 4,
  }}
/>
```

## Examples

### Product Card

```tsx
function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      
      <RatingDisplay 
        rating={product.rating} 
        reviewCount={product.reviewCount}
        variant="inline"
        size="sm"
        onReviewClick={() => navigate('/reviews')}
      />
      
      <div className="text-2xl font-bold">${product.price}</div>
    </div>
  );
}
```

### Product Page Reviews

```tsx
function ProductReviews({ product }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>
      
      <RatingDisplay 
        rating={product.rating}
        variant="detailed"
        showDistribution
        distribution={product.ratingDistribution}
        onReviewClick={(stars) => filterByRating(stars)}
      />
      
      <RatingSummary
        overallRating={product.rating}
        ratings={[
          { label: 'Quality', rating: 4.7 },
          { label: 'Value', rating: 4.2 },
          { label: 'Comfort', rating: 4.8 },
          { label: 'Design', rating: 4.6 },
        ]}
      />
      
      <ReviewStats
        averageRating={product.rating}
        totalReviews={product.reviewCount}
        recommendationRate={88}
        verifiedPurchases={523}
        helpfulVotes={1847}
      />
    </div>
  );
}
```

### Comparison Table

```tsx
function ProductComparison({ products }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="text-center">
          <h4>{product.name}</h4>
          <RatingDisplay 
            rating={product.rating} 
            reviewCount={product.reviewCount}
            variant="compact"
            size="sm"
          />
          <div>${product.price}</div>
        </div>
      ))}
    </div>
  );
}
```

### Review Summary Card

```tsx
function ReviewSummaryCard({ data }) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Rating Summary</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-4xl font-bold">{data.rating}</div>
          <RatingDisplay 
            rating={data.rating}
            reviewCount={data.reviewCount}
            showAverage={false}
          />
        </div>
        
        <RatingSummary
          ratings={data.categories}
          size="sm"
        />
      </div>
    </div>
  );
}
```

### Interactive Reviews

```tsx
function InteractiveReviews() {
  const [filterRating, setFilterRating] = useState(null);
  
  return (
    <RatingDisplay 
      rating={4.3}
      variant="detailed"
      showDistribution
      distribution={distribution}
      onReviewClick={(rating) => {
        setFilterRating(rating);
        // Filter reviews by rating
      }}
    />
  );
}
```

## Formatting

### Review Count Formatting
- Numbers < 1,000: Display as-is (e.g., "234")
- Numbers ≥ 1,000: Display as "1.2K"
- Numbers ≥ 1,000,000: Display as "1.2M"

### Rating Display
- Always shows one decimal place (e.g., "4.5")
- Rounds to nearest tenth

## Styling

### Size Variants
- **xs**: Extra small for tight spaces
- **sm**: Small for lists and tables
- **md**: Default size for most use cases
- **lg**: Large for prominent displays

### Custom Styling

```tsx
<RatingDisplay 
  rating={4.5}
  reviewCount={234}
  className="bg-gray-50 p-4 rounded"
  ratingClassName="text-primary-600"
  reviewCountClassName="text-blue-600"
/>
```

## Accessibility

- Proper ARIA labels for screen readers
- Semantic HTML structure
- Keyboard accessible review links
- Clear visual hierarchy
- Sufficient color contrast

## Best Practices

1. **Always show review count**: Helps build trust with users
2. **Use appropriate variant**: Compact for lists, detailed for review sections
3. **Make reviews clickable**: Link to full review section when possible
4. **Show distribution**: For products with many reviews, show the breakdown
5. **Format large numbers**: Use K/M notation for better readability
6. **Consistent sizing**: Use the same size variant within a section
7. **Loading states**: Show skeletons while data loads
8. **Empty states**: Handle products with no reviews gracefully
9. **Mobile optimization**: Test compact variants on small screens
10. **Real-time updates**: Consider updating counts/ratings dynamically