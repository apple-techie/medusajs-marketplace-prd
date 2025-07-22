# CartItem Component

A comprehensive cart item component for e-commerce shopping carts with quantity management, stock status, pricing display, and multiple layout options.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { CartItem } from '@/components/molecules/CartItem';

// Basic usage
<CartItem
  id="123"
  name="Wireless Headphones"
  price={79.99}
  quantity={2}
  image={{
    src: "/product.jpg",
    alt: "Wireless headphones"
  }}
  onQuantityChange={(quantity) => updateQuantity(quantity)}
  onRemove={() => removeFromCart()}
/>

// With all features
<CartItem
  id="456"
  name="Premium T-Shirt"
  description="100% organic cotton"
  variant="Size: L, Color: Blue"
  price={29.99}
  originalPrice={39.99}
  quantity={1}
  stockCount={5}
  showStock
  showSavings
  showVendor
  vendorName="Fashion Store"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | **Required**. Unique item identifier |
| `name` | `string` | - | **Required**. Product name |
| `description` | `string` | - | Product description |
| `variant` | `string` | - | Selected variant details |
| `sku` | `string` | - | Product SKU |
| `image` | `object` | - | Product image |
| `image.src` | `string` | - | Image URL |
| `image.alt` | `string` | - | Image alt text |
| `price` | `number` | - | **Required**. Current price |
| `originalPrice` | `number` | - | Original price for savings |
| `currency` | `string` | `'USD'` | Currency code |
| `quantity` | `number` | - | **Required**. Item quantity |
| `maxQuantity` | `number` | - | Maximum order quantity |
| `quantityStep` | `number` | `1` | Quantity increment step |
| `inStock` | `boolean` | `true` | Stock availability |
| `stockCount` | `number` | - | Available stock |
| `lowStockThreshold` | `number` | `5` | Low stock warning threshold |
| `status` | `string` | `'available'` | Item status |
| `vendorName` | `string` | - | Vendor/seller name |
| `vendorId` | `string` | - | Vendor identifier |
| `fulfillmentTime` | `string` | - | Delivery estimate |
| `shippingMethod` | `string` | - | Shipping method |
| `editable` | `boolean` | `true` | Allow quantity editing |
| `removable` | `boolean` | `true` | Show remove button |
| `selectable` | `boolean` | `false` | Show selection checkbox |
| `selected` | `boolean` | `false` | Selection state |
| `layout` | `'horizontal' \| 'vertical' \| 'compact'` | `'horizontal'` | Layout style |
| `showSavings` | `boolean` | `true` | Show savings amount |
| `showVendor` | `boolean` | `false` | Show vendor info |
| `showSku` | `boolean` | `false` | Show SKU |
| `showStock` | `boolean` | `false` | Show stock status |
| `onQuantityChange` | `(quantity: number) => void` | - | Quantity change handler |
| `onRemove` | `() => void` | - | Remove handler |
| `onSelect` | `(selected: boolean) => void` | - | Selection handler |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Container CSS classes |
| `imageClassName` | `string` | - | Image CSS classes |
| `contentClassName` | `string` | - | Content CSS classes |
| `updating` | `boolean` | `false` | Updating state |
| `removing` | `boolean` | `false` | Removing state |
| `removeLabel` | `string` | `'Remove'` | Remove button label |
| `updateLabel` | `string` | `'Update'` | Update label |
| `outOfStockLabel` | `string` | `'Out of Stock'` | Out of stock label |
| `limitedStockLabel` | `string` | `'Limited Stock'` | Low stock label |
| `aria-label` | `string` | - | Accessibility label |

## Layout Variants

### Horizontal (Default)
Standard cart layout with image on left, details in center, actions on right.

```tsx
<CartItem
  id="1"
  name="Product Name"
  price={49.99}
  quantity={1}
  layout="horizontal"
/>
```

### Vertical
Stacked layout ideal for mobile or narrow containers.

```tsx
<CartItem
  id="2"
  name="Product Name"
  price={49.99}
  quantity={1}
  layout="vertical"
/>
```

### Compact
Minimal layout for space-constrained views.

```tsx
<CartItem
  id="3"
  name="Product Name"
  price={49.99}
  quantity={1}
  layout="compact"
/>
```

## Common Patterns

### With Savings Display

```tsx
<CartItem
  id="1"
  name="Sale Item"
  price={79.99}
  originalPrice={99.99}
  quantity={1}
  showSavings
/>
```

### Stock Management

```tsx
// Out of stock
<CartItem
  id="2"
  name="Popular Item"
  price={49.99}
  quantity={1}
  inStock={false}
  showStock
  editable={false}
/>

// Limited stock warning
<CartItem
  id="3"
  name="Limited Item"
  price={39.99}
  quantity={1}
  stockCount={3}
  showStock
/>
```

### Vendor Information

```tsx
<CartItem
  id="4"
  name="Marketplace Item"
  price={29.99}
  quantity={1}
  vendorName="Vendor Store"
  fulfillmentTime="Ships in 2-3 days"
  showVendor
/>
```

### With Product Details

```tsx
<CartItem
  id="5"
  name="Detailed Product"
  description="High-quality product with premium materials"
  variant="Size: Large, Color: Blue"
  sku="PROD-123-LG-BLU"
  price={89.99}
  quantity={1}
  showSku
/>
```

## Interactive Features

### Quantity Management

```tsx
<CartItem
  id="6"
  name="Adjustable Quantity"
  price={19.99}
  quantity={2}
  maxQuantity={10}
  stockCount={15}
  onQuantityChange={async (quantity) => {
    await updateCartItem(id, quantity);
    showNotification('Quantity updated');
  }}
/>
```

### Bulk Operations

```tsx
<CartItem
  id="7"
  name="Selectable Item"
  price={39.99}
  quantity={1}
  selectable
  selected={isSelected}
  onSelect={(selected) => toggleSelection(id, selected)}
/>
```

### Custom Quantity Steps

```tsx
// Sold in packs of 6
<CartItem
  id="8"
  name="6-Pack Bundle"
  price={59.99}
  quantity={6}
  quantityStep={6}
  onQuantityChange={(quantity) => updateQuantity(quantity)}
/>
```

## Loading States

```tsx
const [isUpdating, setIsUpdating] = useState(false);

<CartItem
  id="9"
  name="Product"
  price={49.99}
  quantity={1}
  updating={isUpdating}
  onQuantityChange={async (quantity) => {
    setIsUpdating(true);
    await updateQuantity(quantity);
    setIsUpdating(false);
  }}
/>
```

## Shopping Cart Example

```tsx
function ShoppingCart({ items }) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <CartItem
          key={item.id}
          {...item}
          showSavings
          showStock
          onQuantityChange={(q) => updateQuantity(item.id, q)}
          onRemove={() => removeItem(item.id)}
        />
      ))}
    </div>
  );
}
```

## Mobile Optimization

```tsx
// Use compact layout for mobile
<CartItem
  id="mobile"
  name="Mobile Product"
  price={29.99}
  quantity={1}
  layout={isMobile ? 'compact' : 'horizontal'}
/>
```

## Custom Styling

```tsx
<CartItem
  id="styled"
  name="Custom Styled Item"
  price={99.99}
  quantity={1}
  className="border-2 border-primary-500"
  imageClassName="rounded-xl"
  contentClassName="text-lg"
/>
```

## Accessibility

- Keyboard navigation for quantity controls
- ARIA labels for all interactive elements
- Screen reader announcements for updates
- Disabled state handling
- Focus management

## Best Practices

1. **Images**: Always provide alt text for accessibility
2. **Stock Display**: Show stock warnings for low inventory
3. **Savings**: Display savings percentage when applicable
4. **Loading States**: Show visual feedback during updates
5. **Error Handling**: Handle quantity update failures gracefully
6. **Mobile**: Use compact layout on small screens
7. **Performance**: Debounce quantity changes
8. **Validation**: Enforce quantity limits based on stock