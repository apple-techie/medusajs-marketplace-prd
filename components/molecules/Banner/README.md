# Banner Component

A prominent UI element for displaying important messages, announcements, promotions, or alerts. Positioned at the top or within key sections of a page, it captures attention without interrupting the user experience. Perfect for e-commerce notifications, vendor alerts, and system messages.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Banner, PersistentBanner, useBanner } from '@/components/molecules/Banner';

// Basic banner
<Banner 
  heading="Important Notice"
  subheading="Please read this information carefully"
/>

// With action button
<Banner 
  heading="New Feature Available"
  subheading="Check out our latest updates"
  action={{
    label: 'Learn More',
    onClick: () => console.log('Learn more clicked')
  }}
/>

// Persistent banner (remembers dismissal)
<PersistentBanner
  storageKey="welcome-banner"
  heading="Welcome to Our Store!"
  subheading="Get 10% off your first purchase"
/>

// Using the hook
function NotificationArea() {
  const { isVisible, message, show, hide } = useBanner();
  
  const showSuccess = () => {
    show('Order Placed!', 'Your order has been confirmed', 'success');
  };
  
  return (
    <>
      {isVisible && <Banner {...message} onDismiss={hide} />}
      <button onClick={showSuccess}>Place Order</button>
    </>
  );
}
```

## Component Props

### Banner Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | - | Main banner text |
| `subheading` | `string` | - | Supporting text |
| `variant` | `'default' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'default'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Banner size |
| `icon` | `ReactNode` | - | Custom icon element |
| `showIcon` | `boolean` | `true` | Show/hide icon |
| `dismissible` | `boolean` | `true` | Allow dismissal |
| `onDismiss` | `() => void` | - | Dismiss callback |
| `action` | `{ label: string; onClick: () => void }` | - | Action button |
| `children` | `ReactNode` | - | Custom content |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | - | Accessibility label |
| `aria-live` | `'polite' \| 'assertive' \| 'off'` | `'polite'` | Screen reader priority |

### PersistentBanner Props

Extends all Banner props except `dismissible` and `onDismiss`, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | - | localStorage key for persistence |

### useBanner Hook

```tsx
const {
  isVisible,    // Current visibility state
  message,      // Current message object
  show,         // Show banner with message
  hide,         // Hide banner
  toggle,       // Toggle visibility
  setMessage,   // Update message directly
} = useBanner(initialVisible);
```

## Examples

### E-commerce Use Cases

#### Promotional Banner
```tsx
function FlashSale() {
  return (
    <Banner 
      variant="default"
      heading="🎉 Flash Sale - 30% Off Everything!"
      subheading="Use code FLASH30 at checkout. Ends midnight tonight."
      icon={<Icon icon="sparkles" size="md" />}
      action={{
        label: 'Shop Now',
        onClick: () => navigateToShop()
      }}
    />
  );
}
```

#### Shipping Notice
```tsx
function ShippingAlert() {
  return (
    <Banner 
      variant="warning"
      heading="Shipping Delays"
      subheading="Due to high demand, orders may take 3-5 extra business days."
      action={{
        label: 'Track Your Order',
        onClick: () => navigateToTracking()
      }}
    />
  );
}
```

#### Vendor Notifications
```tsx
function VendorDashboard() {
  const { vendor } = useVendor();
  
  return (
    <div>
      {!vendor.profileComplete && (
        <Banner 
          variant="info"
          heading="Complete Your Profile"
          subheading="Add business documents to start selling."
          action={{
            label: 'Complete Profile',
            onClick: () => navigateToProfile()
          }}
          dismissible={false}
        />
      )}
      
      {vendor.ordersToShip > 0 && (
        <Banner 
          variant="warning"
          heading={`${vendor.ordersToShip} Orders Awaiting Shipment`}
          subheading="Process these orders within 24 hours"
          action={{
            label: 'View Orders',
            onClick: () => navigateToOrders()
          }}
        />
      )}
    </div>
  );
}
```

#### Cart Notifications
```tsx
function ShoppingCart() {
  const { items, appliedCoupon } = useCart();
  const lowStockItems = items.filter(item => item.stock < 3);
  
  return (
    <div className="space-y-2">
      {appliedCoupon && (
        <Banner 
          variant="success"
          heading={`Coupon Applied: ${appliedCoupon.code}`}
          subheading={`You saved $${appliedCoupon.discount}`}
          size="sm"
        />
      )}
      
      {lowStockItems.length > 0 && (
        <Banner 
          variant="warning"
          heading="Low Stock Alert"
          subheading={`${lowStockItems.length} items in your cart are running low`}
          size="sm"
        />
      )}
    </div>
  );
}
```

### Advanced Examples

#### Dynamic Banner System
```tsx
function BannerSystem() {
  const [banners, setBanners] = useState<Array<{
    id: string;
    type: 'promo' | 'alert' | 'info';
    content: BannerProps;
  }>>([]);
  
  useEffect(() => {
    // Fetch active banners from API
    fetchActiveBanners().then(setBanners);
  }, []);
  
  const dismissBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    // Report dismissal to analytics
    trackBannerDismissal(id);
  };
  
  return (
    <div className="space-y-2">
      {banners.map(banner => (
        <Banner
          key={banner.id}
          {...banner.content}
          onDismiss={() => dismissBanner(banner.id)}
        />
      ))}
    </div>
  );
}
```

#### Contextual Banners
```tsx
function ProductPage({ product }) {
  return (
    <div>
      {product.isNew && (
        <Banner 
          variant="info"
          heading="New Arrival"
          subheading="Be among the first to own this product"
          size="sm"
        />
      )}
      
      {product.stock < 10 && (
        <Banner 
          variant="warning"
          heading={`Only ${product.stock} left in stock`}
          subheading="Order soon to avoid disappointment"
          size="sm"
        />
      )}
      
      {product.discount > 0 && (
        <Banner 
          variant="success"
          heading={`Save ${product.discount}%`}
          subheading="Limited time offer"
          size="sm"
        />
      )}
    </div>
  );
}
```

#### Persistent Welcome Banner
```tsx
function AppLayout() {
  const { user } = useAuth();
  
  return (
    <>
      {user.isNew && (
        <PersistentBanner
          storageKey={`welcome-${user.id}`}
          variant="default"
          heading={`Welcome ${user.name}!`}
          subheading="Here's a quick guide to get you started"
          action={{
            label: 'Take Tour',
            onClick: () => startOnboardingTour()
          }}
        />
      )}
      
      {/* Rest of layout */}
    </>
  );
}
```

#### Multi-Step Banner Flow
```tsx
function OnboardingBanners() {
  const [step, setStep] = useState(0);
  const steps = [
    {
      heading: 'Step 1: Verify Your Email',
      subheading: 'Check your inbox for a verification link',
      action: { label: 'Resend Email', onClick: resendEmail },
    },
    {
      heading: 'Step 2: Complete Your Profile',
      subheading: 'Add your business information',
      action: { label: 'Go to Profile', onClick: goToProfile },
    },
    {
      heading: 'Step 3: Add Your First Product',
      subheading: 'Start selling on our marketplace',
      action: { label: 'Add Product', onClick: addProduct },
    },
  ];
  
  const currentStep = steps[step];
  
  return currentStep ? (
    <Banner
      variant="info"
      {...currentStep}
      onDismiss={() => setStep(prev => prev + 1)}
    />
  ) : null;
}
```

## Styling

### Variants
- **default/info**: Primary blue theme for general information
- **success**: Green theme for positive messages
- **warning**: Yellow/orange theme for cautions
- **danger**: Red theme for errors or urgent alerts
- **neutral**: Gray theme for less prominent messages

### Sizes
```tsx
// Small - compact for inline messages
<Banner size="sm" heading="Quick tip" />

// Medium - default for most uses
<Banner size="md" heading="Standard banner" />

// Large - prominent announcements
<Banner size="lg" heading="Important announcement" />
```

### Custom Styling
```tsx
// Custom colors
<Banner 
  className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white"
  heading="Custom styled banner"
/>

// Custom icon
<Banner 
  icon={<YourCustomIcon />}
  heading="With custom icon"
/>
```

## Accessibility

- Role="alert" for screen reader announcement
- Configurable aria-live for priority control
- Keyboard accessible dismiss button
- High contrast borders and backgrounds
- Clear focus indicators

### Priority Levels
```tsx
// Urgent alerts (immediately announced)
<Banner 
  variant="danger"
  aria-live="assertive"
  heading="Critical error"
/>

// Normal updates (announced when idle)
<Banner 
  variant="info"
  aria-live="polite"
  heading="New feature"
/>
```

## Best Practices

1. **Placement**: Position at the top of the page or relevant section
2. **Brevity**: Keep messages concise and actionable
3. **Persistence**: Use PersistentBanner for important one-time messages
4. **Stacking**: Limit to 2-3 simultaneous banners maximum
5. **Context**: Show relevant banners based on user state/actions
6. **Dismissal**: Allow dismissal unless action is required
7. **Animation**: Consider slide-in animations for dynamic banners