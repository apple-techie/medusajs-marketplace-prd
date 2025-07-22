import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SellerDashboardSidebar, useSellerSidebar, type MenuItem } from './SellerDashboardSidebar';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Organisms/SellerDashboardSidebar',
  component: SellerDashboardSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['collapsed', 'default', 'expanded'],
    },
    showStoreStats: {
      control: 'boolean',
    },
    collapsible: {
      control: 'boolean',
    },
    collapsed: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof SellerDashboardSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default menu items
const defaultMenuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'inbox', label: 'Inbox', icon: 'mail', badge: '5' },
  { id: 'orders', label: 'Customer Order', icon: 'shoppingBag', badge: '12' },
  {
    id: 'products',
    label: 'Products',
    icon: 'package',
    items: [
      { id: 'add-product', label: 'Add Product', icon: 'plus' },
      { id: 'product-lists', label: 'Product Lists', icon: 'list' },
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
    ],
  },
  {
    id: 'feedback',
    label: 'Customer Feedback',
    icon: 'star',
    items: [
      { id: 'reviews', label: 'Product Reviews', icon: 'message' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    items: [
      { id: 'store-settings', label: 'Store Setting', icon: 'store' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin Setting',
    icon: 'shield',
    items: [
      { id: 'admin-lists', label: 'Admin Lists', icon: 'list' },
      { id: 'audit-log', label: 'Audit Trail Log Viewer', icon: 'file' },
    ],
  },
];

// Basic example
export const Default: Story = {
  args: {
    storeInfo: {
      name: 'Tech Store Pro',
      logo: 'https://i.pravatar.cc/150?img=8',
      openTime: '24 hours',
      totalTransactions: '192.4k',
      followers: '82k',
    },
    menuItems: defaultMenuItems,
    activeItemId: 'home',
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const { collapsed, activeItemId, toggleCollapsed, setActiveItem } = useSellerSidebar();
    const [showStats, setShowStats] = useState(true);

    const handleItemClick = (item: MenuItem) => {
      if (item.href || !item.items) {
        setActiveItem(item.id);
        console.log('Navigate to:', item.label);
      }
    };

    return (
      <div className="flex h-screen bg-neutral-50">
        <SellerDashboardSidebar
          storeInfo={{
            name: 'Electronics Hub',
            logo: 'https://i.pravatar.cc/150?img=5',
            openTime: '9:00 AM - 9:00 PM',
            totalTransactions: '45.2k',
            followers: '15.3k',
          }}
          menuItems={defaultMenuItems}
          activeItemId={activeItemId}
          onItemClick={handleItemClick}
          collapsed={collapsed}
          onCollapsedChange={toggleCollapsed}
          showStoreStats={showStats}
        />
        
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">Seller Dashboard Demo</h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-neutral-600">
              Click menu items to navigate. Items with sub-menus will expand/collapse.
            </p>
            <p className="text-sm text-neutral-500">
              Active item: <span className="font-medium text-neutral-900">{activeItemId || 'None'}</span>
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={toggleCollapsed}>
              {collapsed ? 'Expand' : 'Collapse'} Sidebar
            </Button>
            <Button variant="outline" onClick={() => setShowStats(!showStats)}>
              {showStats ? 'Hide' : 'Show'} Store Stats
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveItem('product-performance')}
            >
              Go to Product Performance
            </Button>
          </div>
        </div>
      </div>
    );
  },
};

// Collapsed state
export const Collapsed: Story = {
  args: {
    ...Default.args,
    collapsed: true,
  },
};

// Expanded size
export const ExpandedSize: Story = {
  args: {
    ...Default.args,
    size: 'expanded',
  },
};

// Without store stats
export const WithoutStats: Story = {
  args: {
    storeInfo: {
      name: 'Fashion Boutique',
      logo: 'https://i.pravatar.cc/150?img=20',
    },
    menuItems: defaultMenuItems,
    showStoreStats: false,
  },
};

// Without collapse button
export const NotCollapsible: Story = {
  args: {
    ...Default.args,
    collapsible: false,
  },
};

// Minimal menu
export const MinimalMenu: Story = {
  args: {
    storeInfo: {
      name: 'Simple Store',
    },
    menuItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'products', label: 'Products', icon: 'package' },
      { id: 'orders', label: 'Orders', icon: 'shoppingBag', badge: '3' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
  },
};

// With disabled items
export const WithDisabledItems: Story = {
  args: {
    storeInfo: {
      name: 'New Vendor',
      logo: 'https://i.pravatar.cc/150?img=15',
    },
    menuItems: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'products', label: 'Products', icon: 'package' },
      { id: 'analytics', label: 'Analytics', icon: 'chart', disabled: true },
      { id: 'payments', label: 'Payments', icon: 'dollar', disabled: true },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'settings',
        items: [
          { id: 'profile', label: 'Profile', icon: 'user' },
          { id: 'advanced', label: 'Advanced', icon: 'tool', disabled: true },
        ],
      },
    ],
    activeItemId: 'products',
  },
};

// Dark theme example
export const DarkTheme: Story = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 min-h-screen">
        <div className="[&_aside]:bg-neutral-800 [&_aside]:border-neutral-700 [&_aside_div]:border-neutral-700">
          <div className="[&_h3]:text-white [&_span]:text-neutral-200 [&_.text-neutral-600]:text-neutral-400">
            <div className="[&_.bg-neutral-50]:bg-neutral-700 [&_.hover\\:bg-neutral-50:hover]:bg-neutral-700">
              <div className="[&_.text-neutral-700]:text-neutral-200 [&_.bg-primary-50]:bg-primary-900 [&_.text-primary-700]:text-primary-300">
                <Story />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

// Mobile responsive
export const Mobile: Story = {
  args: {
    storeInfo: {
      name: 'Mobile Store',
    },
    menuItems: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'products', label: 'Products', icon: 'package' },
      { id: 'orders', label: 'Orders', icon: 'shoppingBag' },
      { id: 'more', label: 'More', icon: 'moreHorizontal' },
    ],
    collapsed: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Complex navigation example
export const ComplexNavigation: Story = {
  args: {
    storeInfo: {
      name: 'Enterprise Marketplace',
      logo: 'https://i.pravatar.cc/150?img=30',
      openTime: '24/7',
      totalTransactions: '1.2M',
      followers: '250k',
    },
    menuItems: [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'inbox', label: 'Messages', icon: 'mail', badge: '23' },
      {
        id: 'products',
        label: 'Product Management',
        icon: 'package',
        items: [
          { id: 'all-products', label: 'All Products', icon: 'list', badge: '1.2k' },
          { id: 'add-product', label: 'Add New Product', icon: 'plus' },
          { id: 'categories', label: 'Categories', icon: 'folder' },
          { id: 'inventory', label: 'Inventory', icon: 'box' },
          {
            id: 'import-export',
            label: 'Import/Export',
            icon: 'download',
            items: [
              { id: 'bulk-import', label: 'Bulk Import', icon: 'upload' },
              { id: 'export-data', label: 'Export Data', icon: 'download' },
              { id: 'templates', label: 'Templates', icon: 'file' },
            ],
          },
        ],
      },
      {
        id: 'orders',
        label: 'Order Management',
        icon: 'shoppingBag',
        badge: '45',
        items: [
          { id: 'pending', label: 'Pending Orders', icon: 'clock', badge: '12' },
          { id: 'processing', label: 'Processing', icon: 'refresh', badge: '8' },
          { id: 'shipped', label: 'Shipped', icon: 'truck', badge: '25' },
          { id: 'completed', label: 'Completed', icon: 'check' },
          { id: 'cancelled', label: 'Cancelled', icon: 'x' },
        ],
      },
      {
        id: 'customers',
        label: 'Customer Management',
        icon: 'users',
        items: [
          { id: 'all-customers', label: 'All Customers', icon: 'users' },
          { id: 'reviews', label: 'Reviews & Ratings', icon: 'star' },
          { id: 'support', label: 'Support Tickets', icon: 'helpCircle', badge: '3' },
        ],
      },
      {
        id: 'marketing',
        label: 'Marketing',
        icon: 'megaphone',
        items: [
          { id: 'campaigns', label: 'Campaigns', icon: 'flag' },
          { id: 'discounts', label: 'Discounts & Coupons', icon: 'tag' },
          { id: 'affiliates', label: 'Affiliate Program', icon: 'link' },
        ],
      },
    ],
    activeItemId: 'pending',
  },
};