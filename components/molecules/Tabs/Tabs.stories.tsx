import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, useTabs } from './Tabs';
import { Badge } from '../../atoms/Badge/Badge';
import { Icon } from '../../atoms/Icon/Icon';

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'underline', 'pills', 'bordered'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example
export const Default: Story = {
  render: (args) => (
    <Tabs defaultValue="overview" {...args}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <h3 className="text-lg font-medium mb-2">Overview</h3>
        <p className="text-neutral-600">
          This is the overview tab content. It provides a general summary of your data.
        </p>
      </TabsContent>
      <TabsContent value="analytics">
        <h3 className="text-lg font-medium mb-2">Analytics</h3>
        <p className="text-neutral-600">
          Analytics data and insights would be displayed here.
        </p>
      </TabsContent>
      <TabsContent value="reports">
        <h3 className="text-lg font-medium mb-2">Reports</h3>
        <p className="text-neutral-600">
          Generate and view various reports from this section.
        </p>
      </TabsContent>
      <TabsContent value="notifications">
        <h3 className="text-lg font-medium mb-2">Notifications</h3>
        <p className="text-neutral-600">
          Manage your notification preferences and view recent alerts.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Default</h3>
        <Tabs defaultValue="tab1" variant="default">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Default variant content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Underline</h3>
        <Tabs defaultValue="tab1" variant="underline">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Underline variant content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Pills</h3>
        <Tabs defaultValue="tab1" variant="pills">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Pills variant content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Bordered</h3>
        <Tabs defaultValue="tab1" variant="bordered">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Bordered variant content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-4">Small</h3>
        <Tabs defaultValue="tab1" size="sm">
          <TabsList>
            <TabsTrigger value="tab1">Small Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Small Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Small Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Small size content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Medium (Default)</h3>
        <Tabs defaultValue="tab1" size="md">
          <TabsList>
            <TabsTrigger value="tab1">Medium Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Medium Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Medium Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Medium size content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Large</h3>
        <Tabs defaultValue="tab1" size="lg">
          <TabsList>
            <TabsTrigger value="tab1">Large Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Large Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Large Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Large size content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

// With icons and badges
export const WithExtras: Story = {
  render: () => (
    <Tabs defaultValue="products" variant="underline">
      <TabsList>
        <TabsTrigger value="products" icon={<Icon icon="package" size="sm" />}>
          Products
        </TabsTrigger>
        <TabsTrigger 
          value="orders" 
          icon={<Icon icon="shoppingCart" size="sm" />}
          badge={<Badge size="sm" variant="danger">12</Badge>}
        >
          Orders
        </TabsTrigger>
        <TabsTrigger value="customers" icon={<Icon icon="users" size="sm" />}>
          Customers
        </TabsTrigger>
        <TabsTrigger 
          value="messages" 
          icon={<Icon icon="message" size="sm" />}
          badge={<Badge size="sm" variant="primary">3</Badge>}
        >
          Messages
        </TabsTrigger>
      </TabsList>
      <TabsContent value="products">Products content</TabsContent>
      <TabsContent value="orders">Orders content with notifications</TabsContent>
      <TabsContent value="customers">Customers content</TabsContent>
      <TabsContent value="messages">Messages content</TabsContent>
    </Tabs>
  ),
};

// Disabled tabs
export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="active">This tab is active</TabsContent>
      <TabsContent value="disabled">This content is not accessible</TabsContent>
      <TabsContent value="another">Another tab content</TabsContent>
    </Tabs>
  ),
};

// Vertical orientation
export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical" className="min-h-[300px]">
      <TabsList className="flex-col h-full w-48">
        <TabsTrigger value="account" className="w-full justify-start">
          Account
        </TabsTrigger>
        <TabsTrigger value="password" className="w-full justify-start">
          Password
        </TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start">
          Notifications
        </TabsTrigger>
        <TabsTrigger value="billing" className="w-full justify-start">
          Billing
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="account">
          <h3 className="text-lg font-medium mb-2">Account Settings</h3>
          <p className="text-neutral-600">Manage your account details and preferences.</p>
        </TabsContent>
        <TabsContent value="password">
          <h3 className="text-lg font-medium mb-2">Password & Security</h3>
          <p className="text-neutral-600">Update your password and security settings.</p>
        </TabsContent>
        <TabsContent value="notifications">
          <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
          <p className="text-neutral-600">Control how and when you receive notifications.</p>
        </TabsContent>
        <TabsContent value="billing">
          <h3 className="text-lg font-medium mb-2">Billing Information</h3>
          <p className="text-neutral-600">Manage your payment methods and billing details.</p>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

// E-commerce examples
export const ProductDetails: Story = {
  render: () => (
    <div className="max-w-4xl">
      <Tabs defaultValue="description" variant="underline">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews" badge={<Badge size="sm">24</Badge>}>
            Reviews
          </TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <div className="prose max-w-none">
            <h3>Product Description</h3>
            <p>
              Premium quality wireless headphones with active noise cancellation. 
              Experience crystal-clear audio with deep bass and crisp highs.
            </p>
            <ul>
              <li>30-hour battery life</li>
              <li>Bluetooth 5.0 connectivity</li>
              <li>Comfortable over-ear design</li>
              <li>Built-in microphone for calls</li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="specifications">
          <table className="w-full">
            <tbody className="divide-y">
              <tr>
                <td className="py-2 font-medium">Brand</td>
                <td className="py-2">AudioTech Pro</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Model</td>
                <td className="py-2">AT-WH1000X</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Weight</td>
                <td className="py-2">250g</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Battery Life</td>
                <td className="py-2">Up to 30 hours</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Customer Reviews</h3>
              <button className="text-primary-600 hover:underline">Write a review</button>
            </div>
            <div className="space-y-4">
              {/* Review items would go here */}
              <p className="text-neutral-600">Reviews would be displayed here...</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="shipping">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Shipping Information</h3>
            <p>Free shipping on orders over $50. Standard delivery in 3-5 business days.</p>
            <h3 className="text-lg font-medium mt-4">Return Policy</h3>
            <p>30-day return window. Items must be in original condition with all packaging.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const VendorDashboard: Story = {
  render: () => (
    <Tabs defaultValue="overview" variant="pills">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="products" badge={<Badge size="sm">156</Badge>}>
          Products
        </TabsTrigger>
        <TabsTrigger value="orders" badge={<Badge size="sm" variant="danger">5</Badge>}>
          Orders
        </TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="text-sm text-neutral-600">Total Revenue</h4>
            <p className="text-2xl font-semibold">$12,450</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="text-sm text-neutral-600">Orders Today</h4>
            <p className="text-2xl font-semibold">23</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="text-sm text-neutral-600">Conversion Rate</h4>
            <p className="text-2xl font-semibold">3.2%</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="products">Products management interface</TabsContent>
      <TabsContent value="orders">Orders management interface</TabsContent>
      <TabsContent value="analytics">Analytics dashboard</TabsContent>
      <TabsContent value="settings">Vendor settings</TabsContent>
    </Tabs>
  ),
};

// Controlled example
export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('tab1')}
            className="px-3 py-1 bg-primary-600 text-white rounded"
          >
            Go to Tab 1
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className="px-3 py-1 bg-primary-600 text-white rounded"
          >
            Go to Tab 2
          </button>
          <button
            onClick={() => setActiveTab('tab3')}
            className="px-3 py-1 bg-primary-600 text-white rounded"
          >
            Go to Tab 3
          </button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p>Tab 1 content - Current tab: {activeTab}</p>
          </TabsContent>
          <TabsContent value="tab2">
            <p>Tab 2 content - Current tab: {activeTab}</p>
          </TabsContent>
          <TabsContent value="tab3">
            <p>Tab 3 content - Current tab: {activeTab}</p>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
};

// Using the hook
export const WithHook: Story = {
  render: () => {
    const tabs = useTabs('settings');
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Current tab: <strong>{tabs.value}</strong>
        </p>
        
        <Tabs {...tabs}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">Profile content</TabsContent>
          <TabsContent value="settings">Settings content</TabsContent>
          <TabsContent value="security">Security content</TabsContent>
        </Tabs>
      </div>
    );
  },
};

// Complex example
export const OrderManagement: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Order Management</h2>
      <Tabs defaultValue="pending" variant="bordered">
        <TabsList>
          <TabsTrigger value="pending" badge={<Badge size="sm" variant="warning">8</Badge>}>
            Pending
          </TabsTrigger>
          <TabsTrigger value="processing" badge={<Badge size="sm" variant="primary">3</Badge>}>
            Processing
          </TabsTrigger>
          <TabsTrigger value="shipped" badge={<Badge size="sm" variant="success">12</Badge>}>
            Shipped
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="space-y-2">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">#ORD-001 - John Doe</p>
                  <p className="text-sm text-neutral-600">2 items • $125.99</p>
                </div>
                <Badge variant="warning">Payment Pending</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">#ORD-002 - Jane Smith</p>
                  <p className="text-sm text-neutral-600">5 items • $89.50</p>
                </div>
                <Badge variant="warning">Awaiting Confirmation</Badge>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="processing">
          <p className="text-neutral-600">Orders being prepared for shipment...</p>
        </TabsContent>
        
        <TabsContent value="shipped">
          <p className="text-neutral-600">Orders that have been shipped...</p>
        </TabsContent>
        
        <TabsContent value="delivered">
          <p className="text-neutral-600">Successfully delivered orders...</p>
        </TabsContent>
        
        <TabsContent value="cancelled">
          <p className="text-neutral-600">Cancelled orders...</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};