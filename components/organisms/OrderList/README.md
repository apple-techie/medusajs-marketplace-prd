# OrderList Component

An order history organism for e-commerce applications. Displays customer orders with status tracking, shipping information, and action buttons. Supports loading states, empty states, and pagination.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { OrderList } from '@/components/organisms/OrderList';

// Basic usage
<OrderList
  orders={orders}
  onViewOrder={(orderId) => navigateToOrder(orderId)}
  onTrackOrder={(orderId) => trackOrder(orderId)}
/>

// With load more
<OrderList
  orders={orders}
  hasMore={hasNextPage}
  onLoadMore={loadNextPage}
  loadingMore={isLoadingMore}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orders` | `Order[]` | - | **Required**. Array of orders to display |
| `layout` | `'default' \| 'compact'` | `'default'` | Display layout |
| `showImages` | `boolean` | `true` | Show product images |
| `showShipping` | `boolean` | `true` | Show shipping information |
| `imageSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Product image size |
| `loading` | `boolean` | `false` | Show loading skeletons |
| `loadingCount` | `number` | `3` | Number of loading skeletons |
| `emptyMessage` | `string` | `'No orders found'` | Empty state message |
| `emptyIcon` | `string` | `'package'` | Empty state icon |
| `emptyAction` | `object` | - | Empty state action button |
| `hasMore` | `boolean` | `false` | Show load more button |
| `onLoadMore` | `() => void` | - | Load more handler |
| `loadingMore` | `boolean` | `false` | Loading more state |
| `loadMoreLabel` | `string` | `'Load more orders'` | Load more button label |
| `onViewOrder` | `(orderId: string) => void` | - | View order handler |
| `onTrackOrder` | `(orderId: string) => void` | - | Track order handler |
| `onReorder` | `(orderId: string) => void` | - | Reorder handler |
| `onCancelOrder` | `(orderId: string) => void` | - | Cancel order handler |
| `showViewButton` | `boolean` | `true` | Show view details button |
| `showTrackButton` | `boolean` | `true` | Show track button |
| `showReorderButton` | `boolean` | `true` | Show reorder button |
| `showCancelButton` | `boolean` | `true` | Show cancel button |
| `viewLabel` | `string` | `'View details'` | View button label |
| `trackLabel` | `string` | `'Track'` | Track button label |
| `reorderLabel` | `string` | `'Buy again'` | Reorder button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `className` | `string` | - | Container CSS classes |
| `orderClassName` | `string` | - | Order card CSS classes |
| `aria-label` | `string` | - | Custom ARIA label |

### Order Type

```tsx
interface Order {
  id: string;
  orderNumber: string;
  date: string | Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  total: number;
  currency?: string;
  trackingNumber?: string;
  estimatedDelivery?: string | Date;
  shippingAddress?: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  variant?: string;
}
```

## Common Patterns

### Basic Order List

```tsx
<OrderList
  orders={customerOrders}
  onViewOrder={(id) => router.push(`/orders/${id}`)}
  onTrackOrder={(id) => openTrackingModal(id)}
  onReorder={(id) => reorderItems(id)}
  onCancelOrder={(id) => cancelOrder(id)}
/>
```

### Customer Dashboard

```tsx
function CustomerDashboard() {
  const { data: orders, isLoading } = useOrders();
  
  return (
    <OrderList
      orders={orders || []}
      loading={isLoading}
      emptyMessage="You haven't placed any orders yet"
      emptyIcon="shopping-bag"
      emptyAction={{
        label: "Start shopping",
        onClick: () => router.push('/shop')
      }}
    />
  );
}
```

### With Pagination

```tsx
function OrderHistory() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useInfiniteQuery(/* ... */);
  
  const orders = data?.pages.flatMap(page => page.orders) || [];
  
  return (
    <OrderList
      orders={orders}
      hasMore={hasNextPage}
      onLoadMore={fetchNextPage}
      loadingMore={isFetchingNextPage}
      loadMoreLabel="Load more orders"
    />
  );
}
```

### Compact Layout

```tsx
// For sidebar or limited space
<OrderList
  orders={recentOrders}
  layout="compact"
  imageSize="sm"
  showShipping={false}
/>
```

### Loading State

```tsx
<OrderList
  orders={[]}
  loading={isLoading}
  loadingCount={5}
/>
```

### Empty State with Action

```tsx
<OrderList
  orders={[]}
  emptyMessage="No orders match your filters"
  emptyIcon="filter"
  emptyAction={{
    label: "Clear all filters",
    onClick: () => clearFilters()
  }}
/>
```

## Order Status Display

The component automatically displays appropriate status badges and icons:

- **Pending**: Secondary badge with clock icon
- **Processing**: Secondary badge with loader icon
- **Shipped**: Default badge with truck icon
- **Delivered**: Success badge with check-circle icon
- **Cancelled**: Destructive badge with x-circle icon
- **Refunded**: Outline badge with rotate-ccw icon

Action buttons are shown based on order status:
- Track button: Only for shipped/delivered orders
- Cancel button: Only for pending/processing orders
- Reorder & View: Always available (if handlers provided)

## Full Customer Account Page

```tsx
function AccountPage() {
  const { data: orders, isLoading } = useOrders();
  const [filter, setFilter] = useState('all');
  
  const filteredOrders = orders?.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {/* Order stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value={orders?.length || 0} />
        <StatCard label="Delivered" value={deliveredCount} />
        <StatCard label="In Progress" value={inProgressCount} />
        <StatCard label="Total Spent" value={`$${totalSpent}`} />
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Orders
        </Button>
        <Button 
          variant={filter === 'delivered' ? 'default' : 'outline'}
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </Button>
        <Button 
          variant={filter === 'processing' ? 'default' : 'outline'}
          onClick={() => setFilter('processing')}
        >
          In Progress
        </Button>
      </div>
      
      {/* Order list */}
      <OrderList
        orders={filteredOrders || []}
        loading={isLoading}
        onViewOrder={(id) => router.push(`/account/orders/${id}`)}
        onTrackOrder={(id) => openTrackingModal(id)}
        onReorder={async (id) => {
          await reorderItems(id);
          toast.success('Items added to cart');
        }}
        onCancelOrder={async (id) => {
          if (confirm('Are you sure you want to cancel this order?')) {
            await cancelOrder(id);
            toast.success('Order cancelled');
          }
        }}
      />
    </div>
  );
}
```

## Different Views

### Minimal Display

```tsx
// Hide images and shipping for condensed view
<OrderList
  orders={orders}
  showImages={false}
  showShipping={false}
  layout="compact"
/>
```

### Admin View

```tsx
// Show all information with custom actions
<OrderList
  orders={orders}
  showViewButton={true}
  showTrackButton={false}
  showReorderButton={false}
  showCancelButton={false}
  viewLabel="Manage order"
  onViewOrder={(id) => router.push(`/admin/orders/${id}`)}
/>
```

### Mobile Optimized

```tsx
// Smaller images and compact layout for mobile
<OrderList
  orders={orders}
  imageSize="sm"
  layout="compact"
  showShipping={isMobile ? false : true}
/>
```

## Responsive Design

The component is fully responsive:
- Stacks order header on mobile
- Adjusts image sizes based on viewport
- Wraps action buttons on smaller screens
- Optimizes spacing for touch devices

## Accessibility

- Semantic HTML with proper heading hierarchy
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for status changes
- Focus management for load more functionality

## Performance

- Efficient rendering with minimal re-renders
- Loading skeletons prevent layout shift
- Lazy loading compatible
- Optimized for large order lists
- Conditional rendering of optional elements

## Best Practices

1. **Error Handling**: Wrap handlers in try-catch for better UX
2. **Confirmation**: Use confirmation dialogs for destructive actions
3. **Feedback**: Show toast notifications after actions
4. **Loading States**: Always show loading state during data fetching
5. **Empty States**: Provide helpful messages and next actions
6. **Mobile First**: Test on mobile devices and adjust layout
7. **Accessibility**: Ensure all actions are keyboard accessible
8. **Performance**: Use pagination for large order histories