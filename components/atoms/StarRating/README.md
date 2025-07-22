# StarRating Component

A flexible star rating component that supports both display and interactive modes. Features half-star precision, customizable icons and colors, keyboard navigation, and various display options. Perfect for product ratings, reviews, and feedback forms.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { StarRating, StarRatingDisplay } from '@/components/atoms/StarRating';

// Basic display rating
<StarRating rating={4.5} />

// Interactive rating
<StarRating 
  rating={3}
  readOnly={false}
  onChange={(rating) => console.log('New rating:', rating)}
/>

// Simple display variant
<StarRatingDisplay rating={4.2} count={156} showCount />
```

## Component Props

### StarRatingProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | `number` | - | **Required**. Current rating value |
| `maxRating` | `number` | `5` | Maximum possible rating |
| `precision` | `0.5 \| 1` | `1` | Rating increment precision |
| `readOnly` | `boolean` | `true` | Whether rating is interactive |
| `disabled` | `boolean` | `false` | Disable interaction |
| `onChange` | `(rating: number) => void` | - | Called when rating changes |
| `onHover` | `(rating: number \| null) => void` | - | Called on hover |
| `showValue` | `boolean` | `false` | Show numeric rating value |
| `valuePosition` | `'left' \| 'right' \| 'none'` | `'right'` | Position of value display |
| `emptyIcon` | `string` | `'star'` | Icon for empty stars |
| `filledIcon` | `string` | `'star'` | Icon for filled stars |
| `halfFilledIcon` | `string` | `'star'` | Icon for half-filled stars |
| `emptyColor` | `string` | `'text-neutral-300'` | Color class for empty stars |
| `filledColor` | `string` | `'text-yellow-400'` | Color class for filled stars |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Star size |
| `className` | `string` | - | Additional CSS classes |
| `starClassName` | `string` | - | CSS classes for individual stars |
| `valueClassName` | `string` | - | CSS classes for value text |
| `aria-label` | `string` | - | Accessibility label |

### StarRatingDisplay Props

Simplified variant for common display use cases:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | `number` | - | **Required**. Rating value |
| `maxRating` | `number` | `5` | Maximum possible rating |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Star size |
| `showValue` | `boolean` | `true` | Show rating value |
| `count` | `number` | - | Number of reviews |
| `showCount` | `boolean` | `false` | Show review count |
| `className` | `string` | - | Additional CSS classes |

## Examples

### Basic Display

```tsx
// Simple rating display
<StarRating rating={4.5} />

// With value shown
<StarRating rating={4.2} showValue valuePosition="right" />

// Different size
<StarRating rating={3.8} size="lg" />
```

### Interactive Rating

```tsx
function ProductReview() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <h3>Rate this product</h3>
      <StarRating
        rating={rating}
        readOnly={false}
        onChange={setRating}
        size="lg"
      />
      <p>Your rating: {rating}</p>
    </div>
  );
}
```

### With Half Stars

```tsx
// Display with half stars
<StarRating rating={3.5} precision={0.5} />

// Interactive with half-star precision
<StarRating
  rating={rating}
  precision={0.5}
  readOnly={false}
  onChange={setRating}
/>
```

### Product Card Integration

```tsx
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <StarRatingDisplay 
        rating={product.rating} 
        count={product.reviewCount}
        showCount
      />
      <p className="price">${product.price}</p>
    </div>
  );
}
```

### Review Form

```tsx
function ReviewForm() {
  const [ratings, setRatings] = useState({
    overall: 0,
    quality: 0,
    value: 0,
    shipping: 0
  });

  const updateRating = (field: string, value: number) => {
    setRatings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form className="space-y-4">
      <div className="flex justify-between items-center">
        <label>Overall Rating</label>
        <StarRating
          rating={ratings.overall}
          readOnly={false}
          onChange={(value) => updateRating('overall', value)}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <label>Quality</label>
        <StarRating
          rating={ratings.quality}
          readOnly={false}
          onChange={(value) => updateRating('quality', value)}
          size="sm"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <label>Value for Money</label>
        <StarRating
          rating={ratings.value}
          readOnly={false}
          onChange={(value) => updateRating('value', value)}
          size="sm"
        />
      </div>
    </form>
  );
}
```

### With Hover Feedback

```tsx
function InteractiveRating() {
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div>
      <StarRating
        rating={rating}
        readOnly={false}
        onChange={setRating}
        onHover={setHoverRating}
        size="lg"
      />
      <p className="text-sm mt-2">
        {hoverRating !== null 
          ? `Rate: ${hoverRating} stars`
          : `Current: ${rating} stars`
        }
      </p>
    </div>
  );
}
```

### Custom Colors

```tsx
// Brand colors
<StarRating 
  rating={4}
  filledColor="text-primary-500"
  emptyColor="text-primary-200"
/>

// Success theme
<StarRating 
  rating={4.5}
  filledColor="text-green-500"
  emptyColor="text-green-200"
/>

// Dark theme
<div className="bg-gray-900 p-4">
  <StarRating 
    rating={4.2}
    filledColor="text-yellow-300"
    emptyColor="text-gray-600"
    showValue
    valueClassName="text-gray-300"
  />
</div>
```

### Different Max Ratings

```tsx
// 3-star system
<StarRating rating={2} maxRating={3} showValue />

// 10-star system
<StarRating rating={7.5} maxRating={10} showValue />

// Custom movie rating (4 stars)
<StarRating rating={3.5} maxRating={4} precision={0.5} />
```

### Comparison Table

```tsx
function ProductComparison({ products }) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Product</th>
          <th>Rating</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>
              <StarRatingDisplay 
                rating={product.rating}
                count={product.reviews}
                showCount
              />
            </td>
            <td>${product.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Features

### Display Features
- Show rating with customizable precision
- Optional numeric value display
- Review count display
- Multiple size options
- Custom colors and icons

### Interactive Features
- Click to set rating
- Hover preview
- Half-star precision support
- Keyboard navigation (arrows, Home, End)
- Disabled state

### Styling Options
- 5 size variants (xs to xl)
- Customizable filled/empty colors
- Position value left or right
- Custom icons support
- Dark mode compatible

## Keyboard Navigation

When `readOnly={false}`:
- **Arrow Left**: Decrease rating
- **Arrow Right**: Increase rating  
- **Home**: Set to minimum rating
- **End**: Set to maximum rating

## Accessibility

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly
- Radio group pattern for interactive mode
- Custom aria-label support

## Best Practices

1. **Use StarRatingDisplay for simple cases**: It's optimized for common display scenarios
2. **Choose appropriate size**: Use smaller sizes in dense layouts
3. **Show review count**: Provides social proof
4. **Enable half stars**: More accurate ratings with `precision={0.5}`
5. **Provide hover feedback**: Shows preview before committing
6. **Custom colors**: Match your brand colors
7. **Keyboard support**: Always works for interactive ratings
8. **Loading states**: Disable during form submission
9. **Validation**: Ensure rating is set before form submission
10. **Responsive**: Adjust size based on screen size