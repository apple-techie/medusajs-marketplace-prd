# TopNavigationBar Component

A comprehensive navigation bar component designed for e-commerce marketplaces. Features include logo/branding, navigation links, search functionality, shopping cart, notifications, and user menu. Fully responsive with mobile menu support and multiple visual variants.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { TopNavigationBar, useTopNavigation } from '@/components/organisms/TopNavigationBar';

// Basic usage
<TopNavigationBar
  navItems={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'shop', label: 'Shop', href: '/shop' },
    { id: 'deals', label: 'Deals', href: '/deals', badge: 'Hot' },
  ]}
  cartCount={3}
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  }}
/>

// With search and notifications
<TopNavigationBar
  showSearch={true}
  searchPlaceholder="Search products..."
  onSearch={(query) => console.log('Searching:', query)}
  showNotifications={true}
  notificationCount={5}
  onNotificationClick={() => console.log('Show notifications')}
/>

// Using the hook
function MarketplaceHeader() {
  const { 
    cartCount, 
    notificationCount, 
    updateCartCount, 
    updateNotificationCount 
  } = useTopNavigation();
  
  return (
    <TopNavigationBar
      cartCount={cartCount}
      notificationCount={notificationCount}
      onCartClick={() => navigateToCart()}
      onNotificationClick={() => updateNotificationCount(0)}
    />
  );
}
```

## Component Props

### TopNavigationBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logo` | `ReactNode` | NeoMart text | Custom logo element |
| `logoHref` | `string` | `'/'` | Logo link destination |
| `navItems` | `NavItem[]` | `[]` | Navigation menu items |
| `showSearch` | `boolean` | `true` | Show search input |
| `searchPlaceholder` | `string` | `'Search products or brands'` | Search placeholder text |
| `onSearch` | `(query: string) => void` | - | Search submit handler |
| `showCart` | `boolean` | `true` | Show cart button |
| `cartCount` | `number` | `0` | Cart item count |
| `onCartClick` | `() => void` | - | Cart button click handler |
| `showNotifications` | `boolean` | `false` | Show notifications bell |
| `notificationCount` | `number` | `0` | Notification count |
| `onNotificationClick` | `() => void` | - | Notification click handler |
| `user` | `User` | - | User information |
| `onUserMenuClick` | `() => void` | - | User menu click handler |
| `userMenuItems` | `NavItem[]` | Default items | Custom user menu items |
| `rightActions` | `ReactNode` | - | Custom right-side actions |
| `mobileMenuItems` | `NavItem[]` | `[]` | Additional mobile menu items |
| `variant` | `'default' \| 'transparent' \| 'dark'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Navigation bar height |
| `sticky` | `boolean` | `true` | Sticky positioning |
| `className` | `string` | - | Additional CSS classes |

### NavItem Interface

```tsx
interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
}
```

### User Interface

```tsx
interface User {
  name: string;
  email?: string;
  avatar?: string;
}
```

### useTopNavigation Hook

```tsx
const {
  searchQuery,          // Current search query
  cartCount,           // Current cart count
  notificationCount,   // Current notification count
  updateCartCount,     // Update cart count
  updateNotificationCount, // Update notification count
  search,              // Perform search
} = useTopNavigation();
```

## Examples

### E-commerce Marketplace

```tsx
function MarketplaceNavigation() {
  const navItems = [
    { id: 'categories', label: 'Categories', href: '/categories' },
    { id: 'vendors', label: 'Vendors', href: '/vendors' },
    { id: 'deals', label: 'Daily Deals', href: '/deals', badge: '30% OFF' },
    { id: 'new', label: 'New Arrivals', href: '/new', badge: 'New' },
  ];

  return (
    <TopNavigationBar
      logo={<Logo />}
      navItems={navItems}
      showSearch={true}
      searchPlaceholder="Search products, brands, or vendors..."
      showCart={true}
      cartCount={5}
      showNotifications={true}
      notificationCount={2}
      user={{
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://example.com/avatar.jpg',
      }}
      rightActions={
        <Button variant="outline" size="sm">
          Sell on Market
        </Button>
      }
    />
  );
}
```

### Vendor Dashboard

```tsx
function VendorNavigation() {
  const vendorNavItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/vendor/dashboard' },
    { id: 'products', label: 'Products', href: '/vendor/products' },
    { id: 'orders', label: 'Orders', href: '/vendor/orders', badge: '12' },
    { id: 'analytics', label: 'Analytics', href: '/vendor/analytics' },
    { id: 'settings', label: 'Settings', href: '/vendor/settings' },
  ];

  const vendorMenuItems = [
    { id: 'profile', label: 'Vendor Profile', href: '/vendor/profile', icon: 'store' },
    { id: 'billing', label: 'Billing', href: '/vendor/billing', icon: 'creditCard' },
    { id: 'help', label: 'Help Center', href: '/help', icon: 'helpCircle' },
    { id: 'logout', label: 'Sign Out', href: '/logout', icon: 'logout' },
  ];

  return (
    <TopNavigationBar
      logo={
        <div className="flex items-center gap-2">
          <Icon icon="store" size="md" className="text-primary-600" />
          <span className="text-xl font-semibold">Vendor Portal</span>
        </div>
      }
      navItems={vendorNavItems}
      showSearch={false}
      showCart={false}
      showNotifications={true}
      notificationCount={8}
      user={{
        name: 'TechStore Pro',
        email: 'admin@techstore.com',
      }}
      userMenuItems={vendorMenuItems}
      rightActions={
        <Button variant="primary" size="sm">
          Add Product
        </Button>
      }
    />
  );
}
```

### Dynamic Navigation

```tsx
function DynamicNavigation() {
  const { user } = useAuth();
  const { cart } = useCart();
  const { notifications } = useNotifications();
  
  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'shop', label: 'Shop', href: '/shop' },
    user?.isVendor && { id: 'vendor', label: 'Vendor Portal', href: '/vendor' },
    user?.isAdmin && { id: 'admin', label: 'Admin', href: '/admin' },
  ].filter(Boolean);

  return (
    <TopNavigationBar
      navItems={navItems}
      cartCount={cart.itemCount}
      notificationCount={notifications.unreadCount}
      user={user ? {
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl,
      } : undefined}
      onSearch={(query) => navigate(`/search?q=${query}`)}
      onCartClick={() => navigate('/cart')}
      onNotificationClick={() => navigate('/notifications')}
    />
  );
}
```

### Multi-language Support

```tsx
function InternationalNavigation() {
  const { t, locale } = useTranslation();
  
  const navItems = [
    { id: 'home', label: t('nav.home'), href: '/' },
    { id: 'shop', label: t('nav.shop'), href: '/shop' },
    { id: 'about', label: t('nav.about'), href: '/about' },
  ];

  return (
    <TopNavigationBar
      navItems={navItems}
      searchPlaceholder={t('search.placeholder')}
      rightActions={
        <select 
          value={locale} 
          onChange={(e) => changeLocale(e.target.value)}
          className="px-3 py-1 border rounded-lg text-sm"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      }
    />
  );
}
```

### With Mega Menu

```tsx
function NavigationWithMegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  return (
    <>
      <TopNavigationBar
        navItems={[
          { 
            id: 'categories', 
            label: 'Categories', 
            href: '#',
            onClick: () => setActiveMenu('categories')
          },
          { id: 'brands', label: 'Brands', href: '/brands' },
          { id: 'deals', label: 'Deals', href: '/deals' },
        ]}
      />
      
      {activeMenu === 'categories' && (
        <MegaMenu onClose={() => setActiveMenu(null)}>
          {/* Mega menu content */}
        </MegaMenu>
      )}
    </>
  );
}
```

## Styling

### Variants

```tsx
// Default - white background
<TopNavigationBar variant="default" />

// Dark - for dark themes
<TopNavigationBar variant="dark" />

// Transparent - for hero sections
<TopNavigationBar variant="transparent" />
```

### Sizes

```tsx
// Small - compact navigation
<TopNavigationBar size="sm" />

// Medium - default size
<TopNavigationBar size="md" />

// Large - more prominent
<TopNavigationBar size="lg" />
```

### Custom Styling

```tsx
// Custom background
<TopNavigationBar 
  className="bg-gradient-to-r from-primary-500 to-purple-600"
  variant="transparent"
/>

// Custom logo styling
<TopNavigationBar
  logo={
    <div className="flex items-center gap-2">
      <img src="/logo.svg" alt="Logo" className="h-8" />
      <span className="text-xl font-bold">MyStore</span>
    </div>
  }
/>
```

## Mobile Responsiveness

The navigation automatically adapts to mobile screens:
- Hamburger menu for mobile navigation
- Touch-friendly tap targets
- Optimized search experience
- Collapsible user menu

```tsx
// Additional mobile-only items
<TopNavigationBar
  mobileMenuItems={[
    { id: 'app', label: 'Download App', href: '/app', icon: 'download' },
    { id: 'help', label: 'Help', href: '/help', icon: 'helpCircle' },
  ]}
/>
```

## Accessibility

- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Mobile-friendly touch targets
- High contrast support with dark variant

## Best Practices

1. **Keep navigation items concise** - Use short, clear labels
2. **Limit main navigation items** - 5-7 items maximum for desktop
3. **Use badges sparingly** - Only for important updates
4. **Provide search** - Essential for e-commerce sites
5. **Make cart count visible** - Users need to see their cart status
6. **Mobile-first approach** - Ensure mobile experience is smooth
7. **Use sticky positioning** - Keep navigation accessible while scrolling
8. **Implement proper loading states** - For search and dynamic content