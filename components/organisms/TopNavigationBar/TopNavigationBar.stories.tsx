import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TopNavigationBar, useTopNavigation } from './TopNavigationBar';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Organisms/TopNavigationBar',
  component: TopNavigationBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'transparent', 'dark'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showSearch: {
      control: 'boolean',
    },
    showCart: {
      control: 'boolean',
    },
    showNotifications: {
      control: 'boolean',
    },
    sticky: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TopNavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example
export const Default: Story = {
  args: {
    navItems: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'shop', label: 'Shop', href: '/shop' },
      { id: 'brands', label: 'Brands', href: '/brands' },
      { id: 'deals', label: 'Deals', href: '/deals', badge: 'Hot' },
    ],
    cartCount: 3,
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
};

// E-commerce marketplace
export const Marketplace: Story = {
  args: {
    logo: <span className="text-2xl font-bold text-primary-600">🛍️ NeoMart</span>,
    navItems: [
      { id: 'categories', label: 'Categories', href: '/categories' },
      { id: 'vendors', label: 'Vendors', href: '/vendors' },
      { id: 'deals', label: 'Daily Deals', href: '/deals', badge: '30% OFF' },
      { id: 'new', label: 'New Arrivals', href: '/new', badge: 'New' },
    ],
    showSearch: true,
    searchPlaceholder: 'Search products, brands, or vendors...',
    showCart: true,
    cartCount: 5,
    showNotifications: true,
    notificationCount: 2,
    user: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  },
};

// Vendor dashboard
export const VendorDashboard: Story = {
  render: () => {
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
          <Button 
            variant="primary" 
            size="sm"
            leftIcon={<Icon icon="plus" size="xs" />}
          >
            Add Product
          </Button>
        }
      />
    );
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const { cartCount, notificationCount, updateCartCount, updateNotificationCount, search } = useTopNavigation();
    const [searchResults, setSearchResults] = useState<string>('');
    
    const handleSearch = (query: string) => {
      search(query);
      setSearchResults(query ? `Searching for: "${query}"` : '');
    };

    const navItems = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'vendors', label: 'Vendors', href: '/vendors' },
      { id: 'about', label: 'About', href: '/about' },
    ];

    return (
      <div>
        <TopNavigationBar
          navItems={navItems}
          cartCount={cartCount}
          notificationCount={notificationCount}
          onSearch={handleSearch}
          onCartClick={() => updateCartCount(cartCount + 1)}
          onNotificationClick={() => updateNotificationCount(0)}
          showNotifications={true}
          user={{
            name: 'Demo User',
            email: 'demo@example.com',
          }}
        />
        
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Interactive Navigation Demo</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={() => updateCartCount(cartCount + 1)}>
                Add to Cart
              </Button>
              <Button onClick={() => updateCartCount(Math.max(0, cartCount - 1))}>
                Remove from Cart
              </Button>
              <Button onClick={() => updateNotificationCount(notificationCount + 1)}>
                Add Notification
              </Button>
            </div>
            
            {searchResults && (
              <div className="p-4 bg-neutral-100 rounded-lg">
                {searchResults}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};

// Dark variant
export const DarkTheme: Story = {
  args: {
    variant: 'dark',
    navItems: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'explore', label: 'Explore', href: '/explore' },
      { id: 'trending', label: 'Trending', href: '/trending', badge: '🔥' },
    ],
    showSearch: true,
    searchPlaceholder: 'Search in dark mode...',
    cartCount: 2,
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-800 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

// Transparent variant
export const Transparent: Story = {
  args: {
    variant: 'transparent',
    navItems: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'features', label: 'Features', href: '/features' },
      { id: 'pricing', label: 'Pricing', href: '/pricing' },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ],
    showSearch: false,
    showCart: false,
    showNotifications: false,
  },
  decorators: [
    (Story) => (
      <div 
        className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600"
        style={{ paddingTop: 0 }}
      >
        <Story />
        <div className="p-8 text-white">
          <h1 className="text-4xl font-bold">Transparent Navigation</h1>
          <p className="mt-4">Perfect for landing pages with hero sections</p>
        </div>
      </div>
    ),
  ],
};

// Minimal
export const Minimal: Story = {
  args: {
    navItems: [],
    showSearch: false,
    showCart: false,
    showNotifications: false,
    user: undefined,
  },
};

// With everything
export const FullFeatured: Story = {
  args: {
    logo: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">M</span>
        </div>
        <span className="text-xl font-bold">Market</span>
      </div>
    ),
    navItems: [
      { id: 'home', label: 'Home', href: '/', icon: 'home' },
      { id: 'categories', label: 'Categories', href: '/categories' },
      { id: 'deals', label: 'Deals', href: '/deals', badge: '50% OFF' },
      { id: 'vendors', label: 'Vendors', href: '/vendors', badge: '200+' },
      { id: 'help', label: 'Help', href: '/help' },
    ],
    showSearch: true,
    searchPlaceholder: 'What are you looking for?',
    showCart: true,
    cartCount: 12,
    showNotifications: true,
    notificationCount: 5,
    user: {
      name: 'Premium User',
      email: 'premium@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    rightActions: (
      <Button variant="outline" size="sm">
        Sell on Market
      </Button>
    ),
    mobileMenuItems: [
      { id: 'download', label: 'Download App', href: '/app', icon: 'download' },
      { id: 'help', label: 'Help & Support', href: '/help', icon: 'helpCircle' },
    ],
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2 px-4">Small</h3>
        <TopNavigationBar 
          size="sm"
          navItems={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'shop', label: 'Shop', href: '/shop' },
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2 px-4">Medium (Default)</h3>
        <TopNavigationBar 
          size="md"
          navItems={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'shop', label: 'Shop', href: '/shop' },
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2 px-4">Large</h3>
        <TopNavigationBar 
          size="lg"
          navItems={[
            { id: 'home', label: 'Home', href: '/' },
            { id: 'shop', label: 'Shop', href: '/shop' },
          ]}
        />
      </div>
    </div>
  ),
};

// Mobile responsive
export const Mobile: Story = {
  args: {
    navItems: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'categories', label: 'Categories', href: '/categories' },
      { id: 'orders', label: 'My Orders', href: '/orders' },
      { id: 'account', label: 'Account', href: '/account' },
    ],
    showSearch: true,
    showCart: true,
    cartCount: 3,
    user: {
      name: 'Mobile User',
      email: 'mobile@example.com',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Scrollable content
export const WithScrollableContent: Story = {
  args: {
    sticky: true,
    navItems: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'about', label: 'About', href: '/about' },
    ],
    cartCount: 2,
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">Sticky Navigation Demo</h1>
          <p className="mb-4">Scroll down to see the sticky navigation in action.</p>
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i} className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
      </div>
    ),
  ],
};