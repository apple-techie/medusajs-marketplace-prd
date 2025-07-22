# SellerDashboardSidebar Component

A comprehensive sidebar navigation component designed for seller/vendor dashboards in e-commerce marketplaces. Features include store information display, collapsible navigation, nested menu items, badges, and responsive design.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { SellerDashboardSidebar, useSellerSidebar } from '@/components/organisms/SellerDashboardSidebar';

// Basic usage
<SellerDashboardSidebar
  storeInfo={{
    name: 'Tech Store Pro',
    logo: 'https://example.com/logo.png',
    openTime: '24 hours',
    totalTransactions: '192.4k',
    followers: '82k',
  }}
  menuItems={[
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'inbox', label: 'Inbox', icon: 'mail', badge: '5' },
    {
      id: 'products',
      label: 'Products',
      icon: 'package',
      items: [
        { id: 'add', label: 'Add Product', icon: 'plus' },
        { id: 'list', label: 'Product List', icon: 'list' },
      ],
    },
  ]}
  activeItemId="home"
/>

// With hook for state management
function SellerDashboard() {
  const { collapsed, activeItemId, toggleCollapsed, setActiveItem } = useSellerSidebar();
  
  const handleItemClick = (item) => {
    if (!item.items) {
      setActiveItem(item.id);
      // Navigate to item.href
    }
  };
  
  return (
    <SellerDashboardSidebar
      menuItems={menuItems}
      activeItemId={activeItemId}
      onItemClick={handleItemClick}
      collapsed={collapsed}
      onCollapsedChange={toggleCollapsed}
    />
  );
}
```

## Component Props

### SellerDashboardSidebar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storeInfo` | `StoreInfo` | - | Store information to display in header |
| `menuItems` | `MenuItem[]` | `[]` | Navigation menu items |
| `activeItemId` | `string` | - | ID of the currently active menu item |
| `onItemClick` | `(item: MenuItem) => void` | - | Callback when menu item is clicked |
| `collapsible` | `boolean` | `true` | Whether sidebar can be collapsed |
| `collapsed` | `boolean` | - | Controlled collapsed state |
| `onCollapsedChange` | `(collapsed: boolean) => void` | - | Callback when collapsed state changes |
| `showStoreStats` | `boolean` | `true` | Whether to show store statistics |
| `size` | `'collapsed' \| 'default' \| 'expanded'` | `'default'` | Sidebar width variant |
| `className` | `string` | - | Additional CSS classes |

### StoreInfo Interface

```tsx
interface StoreInfo {
  logo?: string;           // Store logo URL
  name: string;           // Store name
  openTime?: string;      // Operating hours
  totalTransactions?: string; // Transaction count
  followers?: string;     // Follower count
}
```

### MenuItem Interface

```tsx
interface MenuItem {
  id: string;             // Unique identifier
  label: string;          // Display label
  icon: string;           // Icon name
  href?: string;          // Navigation URL
  badge?: string | number; // Badge content
  items?: MenuItem[];     // Nested sub-items
  disabled?: boolean;     // Disabled state
}
```

### useSellerSidebar Hook

```tsx
const {
  collapsed,        // Current collapsed state
  activeItemId,     // Current active menu item ID
  setCollapsed,     // Set collapsed state
  toggleCollapsed,  // Toggle collapsed state
  setActiveItem,    // Set active menu item
} = useSellerSidebar();
```

## Examples

### Complete Seller Dashboard

```tsx
function CompleteDashboard() {
  const { collapsed, activeItemId, toggleCollapsed, setActiveItem } = useSellerSidebar();
  
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'inbox', label: 'Inbox', icon: 'mail', badge: '12' },
    { id: 'orders', label: 'Orders', icon: 'shoppingBag', badge: 'New' },
    {
      id: 'products',
      label: 'Products',
      icon: 'package',
      items: [
        { id: 'add-product', label: 'Add Product', icon: 'plus' },
        { id: 'product-list', label: 'Product List', icon: 'list' },
        { id: 'categories', label: 'Categories', icon: 'folder' },
        { id: 'inventory', label: 'Inventory', icon: 'box' },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: 'chart',
      items: [
        { id: 'store-performance', label: 'Store Performance', icon: 'trending' },
        { id: 'product-performance', label: 'Product Performance', icon: 'activity' },
        { id: 'customer-insights', label: 'Customer Insights', icon: 'users' },
      ],
    },
    {
      id: 'payments',
      label: 'Payments & Payouts',
      icon: 'dollar',
      items: [
        { id: 'earnings', label: 'Earnings Overview', icon: 'trending' },
        { id: 'transactions', label: 'Transaction History', icon: 'clock' },
        { id: 'payout-settings', label: 'Payout Settings', icon: 'settings' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      items: [
        { id: 'store-settings', label: 'Store Settings', icon: 'store' },
        { id: 'shipping', label: 'Shipping', icon: 'truck' },
        { id: 'taxes', label: 'Taxes', icon: 'percent' },
      ],
    },
  ];
  
  const handleItemClick = (item) => {
    if (!item.items || item.href) {
      setActiveItem(item.id);
      console.log('Navigate to:', item.href || `/seller/${item.id}`);
    }
  };
  
  return (
    <div className="flex h-screen">
      <SellerDashboardSidebar
        storeInfo={{
          name: 'Electronics Hub',
          logo: 'https://example.com/store-logo.png',
          openTime: '9:00 AM - 9:00 PM',
          totalTransactions: '45.2k',
          followers: '15.3k',
        }}
        menuItems={menuItems}
        activeItemId={activeItemId}
        onItemClick={handleItemClick}
        collapsed={collapsed}
        onCollapsedChange={toggleCollapsed}
      />
      
      <main className="flex-1 bg-neutral-50 p-8">
        {/* Dashboard content */}
      </main>
    </div>
  );
}
```

### Minimal Configuration

```tsx
<SellerDashboardSidebar
  storeInfo={{ name: 'My Store' }}
  menuItems={[
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'products', label: 'Products', icon: 'package' },
    { id: 'orders', label: 'Orders', icon: 'shoppingBag' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]}
/>
```

### With Disabled Items

```tsx
<SellerDashboardSidebar
  menuItems={[
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'analytics', label: 'Analytics', icon: 'chart', disabled: true },
    { id: 'premium', label: 'Premium Features', icon: 'star', disabled: true },
  ]}
/>
```

### Controlled Collapse State

```tsx
function ControlledSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsCollapsed(!isCollapsed)}>
        Toggle Sidebar
      </Button>
      
      <SellerDashboardSidebar
        collapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
        menuItems={menuItems}
      />
    </>
  );
}
```

### With Router Integration

```tsx
import { useRouter, usePathname } from 'next/navigation';

function RouterIntegratedSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Derive active item from current path
  const activeItemId = pathname.split('/').pop() || 'home';
  
  const handleItemClick = (item) => {
    if (!item.items || item.href) {
      router.push(item.href || `/seller/${item.id}`);
    }
  };
  
  return (
    <SellerDashboardSidebar
      menuItems={menuItems}
      activeItemId={activeItemId}
      onItemClick={handleItemClick}
    />
  );
}
```

### Multi-language Support

```tsx
function InternationalSidebar() {
  const { t } = useTranslation();
  
  const menuItems = [
    { id: 'home', label: t('nav.home'), icon: 'home' },
    { id: 'products', label: t('nav.products'), icon: 'package' },
    {
      id: 'reports',
      label: t('nav.reports'),
      icon: 'chart',
      items: [
        { id: 'sales', label: t('nav.salesReport'), icon: 'trending' },
        { id: 'inventory', label: t('nav.inventoryReport'), icon: 'box' },
      ],
    },
  ];
  
  return (
    <SellerDashboardSidebar
      storeInfo={{
        name: t('store.name'),
        openTime: t('store.openTime'),
        totalTransactions: formatNumber(transactions, locale),
        followers: formatNumber(followers, locale),
      }}
      menuItems={menuItems}
    />
  );
}
```

## Styling

### Size Variants

```tsx
// Collapsed - 64px width
<SellerDashboardSidebar size="collapsed" />

// Default - 256px width
<SellerDashboardSidebar size="default" />

// Expanded - 320px width
<SellerDashboardSidebar size="expanded" />
```

### Custom Styling

```tsx
// Custom background
<SellerDashboardSidebar 
  className="bg-primary-50 border-primary-200"
/>

// Dark theme
<SellerDashboardSidebar 
  className="bg-neutral-900 text-white border-neutral-800 [&_.hover\\:bg-neutral-50:hover]:bg-neutral-800"
/>
```

## Features

### Auto-expanding Navigation
- Parent items automatically expand when a child item is active
- Smooth expand/collapse animations
- Keyboard navigation support

### Collapsible Sidebar
- Toggle between collapsed and expanded states
- Tooltips show on hover when collapsed
- Maintains all functionality in collapsed state

### Badge Support
- Display counts or status indicators on menu items
- Works in both expanded and collapsed states
- Supports string or numeric values

### Responsive Design
- Adapts to different screen sizes
- Mobile-optimized with collapsed state by default
- Touch-friendly interaction areas

## Accessibility

- Semantic HTML structure with proper ARIA labels
- Keyboard navigation support
- Focus indicators for interactive elements
- Screen reader friendly
- Proper heading hierarchy
- Color contrast compliance

## Best Practices

1. **Keep menu structure shallow** - Limit nesting to 2-3 levels maximum
2. **Use clear icons** - Choose icons that clearly represent each section
3. **Logical grouping** - Group related items together
4. **Progressive disclosure** - Use nested items for advanced features
5. **Active state clarity** - Ensure active items are clearly distinguished
6. **Responsive behavior** - Start collapsed on mobile devices
7. **Consistent navigation** - Keep menu structure consistent across sessions
8. **Performance** - Lazy load content for menu sections if needed