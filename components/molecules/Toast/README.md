# Toast Component

A flexible notification component that displays temporary messages to users. Supports multiple variants, positions, auto-dismiss, and actions. Perfect for providing feedback about user actions, system status, and important updates.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Toast, ToastContainer, useToast } from '@/components/molecules/Toast';

// Basic toast
<Toast 
  message="Operation successful"
  onClose={() => console.log('Closed')}
/>

// With description and action
<Toast 
  variant="success"
  message="Order placed!"
  description="Your order will arrive tomorrow."
  action={{
    label: 'Track Order',
    onClick: () => window.location.href = '/orders'
  }}
  onClose={() => {}}
/>

// Using the toast hook
function MyComponent() {
  const { toasts, addToast, removeToast } = useToast();
  
  const showSuccess = () => {
    addToast({
      variant: 'success',
      message: 'Saved successfully!',
    });
  };
  
  return (
    <>
      <button onClick={showSuccess}>Save</button>
      <ToastContainer>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </>
  );
}
```

## Toast Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | - | Main notification message (required) |
| `description` | `string` | - | Additional details or context |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Visual style variant |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-right'` | Screen position |
| `icon` | `ReactNode` | - | Custom icon to display |
| `showIcon` | `boolean` | `true` | Show variant icon |
| `duration` | `number` | `5000` | Auto-dismiss time in ms |
| `persistent` | `boolean` | `false` | Prevent auto-dismiss |
| `onClose` | `() => void` | - | Close button callback |
| `action` | `{ label: string; onClick: () => void }` | - | Action button config |

## ToastContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `Position` | `'top-right'` | Container position |
| `children` | `ReactNode` | - | Toast components |

## Examples

### E-commerce Use Cases

#### Order Notifications
```tsx
function OrderNotifications() {
  const { addToast } = useToast();
  
  const placeOrder = async () => {
    try {
      const order = await api.placeOrder();
      
      addToast({
        variant: 'success',
        message: 'Order placed successfully!',
        description: `Order #${order.id} will be delivered by ${order.deliveryDate}`,
        action: {
          label: 'View Order',
          onClick: () => navigate(`/orders/${order.id}`)
        }
      });
    } catch (error) {
      addToast({
        variant: 'danger',
        message: 'Order failed',
        description: error.message,
      });
    }
  };
  
  return <button onClick={placeOrder}>Place Order</button>;
}
```

#### Cart Updates
```tsx
function ProductCard({ product }) {
  const { addToast } = useToast();
  
  const addToCart = () => {
    cart.add(product);
    
    addToast({
      variant: 'info',
      message: 'Added to cart',
      description: product.name,
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart')
      },
      duration: 3000
    });
  };
  
  return (
    <button onClick={addToCart}>
      Add to Cart
    </button>
  );
}
```

#### Inventory Alerts
```tsx
function InventoryManager() {
  const { addToast } = useToast();
  
  useEffect(() => {
    const checkInventory = () => {
      const lowStockItems = inventory.getLowStock();
      
      if (lowStockItems.length > 0) {
        addToast({
          variant: 'warning',
          message: 'Low stock alert',
          description: `${lowStockItems.length} items need restocking`,
          persistent: true,
          action: {
            label: 'View Items',
            onClick: () => navigate('/inventory/low-stock')
          }
        });
      }
    };
    
    checkInventory();
  }, []);
}
```

#### Payment Feedback
```tsx
function Checkout() {
  const { addToast } = useToast();
  
  const processPayment = async (paymentData) => {
    try {
      await api.processPayment(paymentData);
      
      addToast({
        variant: 'success',
        message: 'Payment successful',
        description: 'Thank you for your purchase!',
      });
    } catch (error) {
      addToast({
        variant: 'danger',
        message: 'Payment failed',
        description: error.message,
        action: {
          label: 'Try Again',
          onClick: () => retryPayment()
        },
        persistent: true
      });
    }
  };
}
```

### Advanced Examples

#### Multi-Step Process
```tsx
function BulkUpload() {
  const { addToast, clearToasts } = useToast();
  
  const uploadProducts = async (files) => {
    clearToasts();
    
    // Step 1: Validation
    addToast({
      variant: 'info',
      message: 'Validating files...',
      persistent: true
    });
    
    const valid = await validateFiles(files);
    if (!valid) {
      addToast({
        variant: 'danger',
        message: 'Validation failed',
        description: 'Please check file format'
      });
      return;
    }
    
    // Step 2: Upload
    addToast({
      variant: 'info',
      message: 'Uploading products...',
      description: `0 of ${files.length} complete`,
      persistent: true
    });
    
    // ... upload logic with progress updates
    
    // Step 3: Success
    addToast({
      variant: 'success',
      message: 'Upload complete!',
      description: `${files.length} products added`,
      action: {
        label: 'View Products',
        onClick: () => navigate('/products')
      }
    });
  };
}
```

#### Vendor Dashboard Notifications
```tsx
function VendorDashboard() {
  const { toasts, addToast, removeToast } = useToast();
  
  // Real-time order notifications
  useWebSocket('orders', (order) => {
    addToast({
      variant: 'success',
      message: 'New order received!',
      description: `Order #${order.id} - $${order.total}`,
      action: {
        label: 'View Order',
        onClick: () => navigate(`/orders/${order.id}`)
      }
    });
  });
  
  // Commission tier updates
  useEffect(() => {
    if (nearTierThreshold) {
      addToast({
        variant: 'info',
        message: 'Almost at Gold tier!',
        description: `Only $${remaining} in sales needed`,
        persistent: true
      });
    }
  }, [revenue]);
  
  return (
    <ToastContainer position="bottom-right">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContainer>
  );
}
```

### Styling Examples

#### All Variants
```tsx
<div className="space-y-4">
  <Toast 
    message="Default notification" 
    onClose={() => {}}
  />
  <Toast 
    variant="success"
    message="Success notification" 
    onClose={() => {}}
  />
  <Toast 
    variant="warning"
    message="Warning notification" 
    onClose={() => {}}
  />
  <Toast 
    variant="danger"
    message="Error notification" 
    onClose={() => {}}
  />
  <Toast 
    variant="info"
    message="Info notification" 
    onClose={() => {}}
  />
</div>
```

#### Custom Icons
```tsx
// With emoji
<Toast
  message="Party time!"
  icon={<span className="text-2xl">🎉</span>}
  onClose={() => {}}
/>

// With custom SVG
<Toast
  message="Download complete"
  icon={<DownloadIcon className="w-6 h-6" />}
  onClose={() => {}}
/>

// No icon
<Toast
  message="Simple notification"
  showIcon={false}
  onClose={() => {}}
/>
```

## Best Practices

1. **Use appropriate variants** - Match toast type to message intent (success, error, etc.)
2. **Keep messages concise** - Main message should be brief and scannable
3. **Provide context** - Use description for additional details when needed
4. **Include actions** - Add relevant actions for immediate user response
5. **Consider duration** - Adjust auto-dismiss time based on message importance
6. **Stack appropriately** - Use ToastContainer to manage multiple toasts
7. **Position thoughtfully** - Choose position that doesn't obstruct important UI

## Accessibility

- Uses `role="alert"` and `aria-live="polite"` for screen reader announcements
- Close button has proper aria-label
- Keyboard accessible actions
- High contrast colors for all variants
- Focus management for interactive elements

## Common Patterns

### Global Toast Provider
```tsx
// Create a toast context
const ToastContext = React.createContext<ReturnType<typeof useToast>>(null);

export function ToastProvider({ children }) {
  const toast = useToast();
  
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer position="top-right">
        {toast.toasts.map(t => (
          <Toast
            key={t.id}
            {...t}
            onClose={() => toast.removeToast(t.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

// Use in components
function MyComponent() {
  const { addToast } = useContext(ToastContext);
  // ...
}
```

### Error Boundary Integration
```tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error) {
    this.props.addToast({
      variant: 'danger',
      message: 'Something went wrong',
      description: error.message,
      persistent: true,
      action: {
        label: 'Reload',
        onClick: () => window.location.reload()
      }
    });
  }
}
```

### Form Validation Feedback
```tsx
function Form() {
  const { addToast } = useToast();
  
  const handleSubmit = async (data) => {
    const errors = validate(data);
    
    if (errors.length > 0) {
      errors.forEach(error => {
        addToast({
          variant: 'danger',
          message: error.field,
          description: error.message,
          duration: 7000
        });
      });
      return;
    }
    
    // Submit form...
  };
}
```