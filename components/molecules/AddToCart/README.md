# AddToCart Component

A comprehensive add to cart component with quantity selector, stock status, pricing information, and multiple display variants. Perfect for e-commerce product pages and quick add functionality.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { AddToCart } from '@/components/molecules/AddToCart';

// Basic usage
<AddToCart
  productId="123"
  productName="Wireless Headphones"
  price={79.99}
  onAddToCart={(quantity) => {
    console.log(`Adding ${quantity} items to cart`);
  }}
/>

// With stock and pricing info
<AddToCart
  productId="123"
  productName="Premium Product"
  price={149.99}
  originalPrice={199.99}
  stockCount={5}
  showStock
  showSavings
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `productId` | `string` | - | **Required**. Product identifier |
| `productName` | `string` | - | Product name for accessibility |
| `price` | `number` | - | **Required**. Current price |
| `originalPrice` | `number` | - | Original price for savings |
| `currency` | `string` | `'USD'` | Currency code |
| `available` | `boolean` | `true` | Product availability |
| `inStock` | `boolean` | `true` | Stock status |
| `stockCount` | `number` | - | Available stock quantity |
| `maxQuantity` | `number` | - | Maximum order quantity |
| `showQuantity` | `boolean` | `true` | Show quantity selector |
| `defaultQuantity` | `number` | `1` | Initial quantity |
| `quantityStep` | `number` | `1` | Quantity increment step |
| `variant` | `'default' \| 'compact' \| 'minimal' \| 'full'` | `'default'` | Display variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `fullWidth` | `boolean` | `false` | Full width button |
| `showPrice` | `boolean` | `true` | Show price in full variant |
| `showStock` | `boolean` | `false` | Show stock status |
| `showSavings` | `boolean` | `true` | Show savings amount |
| `quickAdd` | `boolean` | `false` | Quick add mode |
| `addToCartLabel` | `string` | `'Add to Cart'` | Button label |
| `addingLabel` | `string` | `'Adding...'` | Loading label |
| `addedLabel` | `string` | `'Added!'` | Success label |
| `outOfStockLabel` | `string` | `'Out of Stock'` | Out of stock label |
| `limitedStockLabel` | `string` | `'Limited Stock'` | Low stock label |
| `quantityLabel` | `string` | `'Quantity'` | Quantity label |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |
| `onAddToCart` | `(quantity: number) => void` | - | Add to cart handler |
| `onQuantityChange` | `(quantity: number) => void` | - | Quantity change handler |
| `className` | `string` | - | Container CSS classes |
| `buttonClassName` | `string` | - | Button CSS classes |
| `quantityClassName` | `string` | - | Quantity selector CSS classes |
| `aria-label` | `string` | - | Accessibility label |

## Variants

### Default
Standard add to cart with quantity selector.

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={29.99}
  variant="default"
/>
```

### Compact
Inline quantity selector with compact button.

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={29.99}
  variant="compact"
/>
```

### Minimal
Button only, no quantity selector. Perfect for quick add.

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={29.99}
  variant="minimal"
/>
```

### Full
Complete add to cart section with price, stock, and additional info.

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={149.99}
  originalPrice={199.99}
  variant="full"
  showPrice
  showStock
  showSavings
/>
```

## Stock Management

### Out of Stock

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={49.99}
  inStock={false}
  showStock
/>
```

### Limited Stock Warning

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={79.99}
  stockCount={3}
  showStock
/>
```

### Maximum Quantity

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={29.99}
  maxQuantity={5}
  stockCount={10}
/>
```

## Pricing Display

### With Savings

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={79.99}
  originalPrice={129.99}
  showSavings
/>
```

### Full Price Display

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={149.99}
  originalPrice={199.99}
  variant="full"
  showPrice
  showSavings
/>
```

## Quantity Options

### Custom Step

```tsx
// Pack of 6
<AddToCart
  productId="123"
  productName="6-Pack"
  price={59.99}
  quantityStep={6}
  defaultQuantity={6}
/>

// Dozen
<AddToCart
  productId="456"
  productName="Dozen"
  price={119.99}
  quantityStep={12}
  defaultQuantity={12}
/>
```

### No Quantity Selector

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={29.99}
  showQuantity={false}
/>
```

## Event Handling

### Add to Cart Handler

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={49.99}
  onAddToCart={async (quantity) => {
    await addToCart(productId, quantity);
    showNotification('Added to cart!');
  }}
/>
```

### Quantity Change Handler

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={49.99}
  onQuantityChange={(quantity) => {
    updateSelectedQuantity(quantity);
    recalculateShipping(quantity);
  }}
/>
```

## Loading States

```tsx
const [isAdding, setIsAdding] = useState(false);

<AddToCart
  productId="123"
  productName="Product"
  price={49.99}
  loading={isAdding}
  onAddToCart={async (quantity) => {
    setIsAdding(true);
    await addToCart(productId, quantity);
    setIsAdding(false);
  }}
/>
```

## Integration Examples

### Product Card

```tsx
<div className="product-card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p>${product.price}</p>
  <AddToCart
    productId={product.id}
    productName={product.name}
    price={product.price}
    variant="compact"
    fullWidth
  />
</div>
```

### Product Detail Page

```tsx
<div className="product-detail">
  <h1>{product.name}</h1>
  <div className="price-section">
    <Price amount={product.price} size="lg" />
    {product.originalPrice && (
      <Price 
        amount={product.originalPrice} 
        className="line-through" 
      />
    )}
  </div>
  
  <VariantSelector
    groups={product.variants}
    onChange={handleVariantChange}
  />
  
  <AddToCart
    productId={product.id}
    productName={product.name}
    price={selectedVariant.price}
    originalPrice={selectedVariant.originalPrice}
    stockCount={selectedVariant.stock}
    variant="full"
    showPrice
    showStock
    showSavings
    size="lg"
  />
</div>
```

### Quick Add Grid

```tsx
<div className="products-grid">
  {products.map(product => (
    <div key={product.id} className="product-item">
      <img src={product.thumbnail} alt={product.name} />
      <h4>{product.name}</h4>
      <p>${product.price}</p>
      <AddToCart
        productId={product.id}
        productName={product.name}
        price={product.price}
        variant="minimal"
        size="sm"
        quickAdd
        fullWidth
      />
    </div>
  ))}
</div>
```

## Custom Labels

```tsx
<AddToCart
  productId="123"
  productName="Product"
  price={49.99}
  addToCartLabel="Buy Now"
  addingLabel="Processing..."
  addedLabel="Success!"
  outOfStockLabel="Sold Out"
  limitedStockLabel="Only Few Left"
  quantityLabel="Qty"
/>
```

## Accessibility

- Keyboard navigation for quantity controls
- ARIA labels for all interactive elements
- Screen reader announcements
- Focus management
- Disabled state handling
- Loading state announcements

## Best Practices

1. **Product Name**: Always provide for accessibility
2. **Stock Display**: Show for limited quantities (<10)
3. **Price Display**: Show savings percentage when applicable
4. **Loading States**: Provide feedback during async operations
5. **Error Handling**: Catch and handle add to cart errors
6. **Quantity Limits**: Set reasonable max quantities
7. **Mobile**: Test touch targets on mobile devices
8. **Quick Add**: Use minimal variant for product grids