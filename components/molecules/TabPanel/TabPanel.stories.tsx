import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TabPanel } from './TabPanel';

const meta = {
  title: 'Molecules/TabPanel',
  component: TabPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline', 'boxed'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tab size',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width tabs',
    },
    lazy: {
      control: 'boolean',
      description: 'Lazy load tab content',
    },
    keyboard: {
      control: 'boolean',
      description: 'Enable keyboard navigation',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Auto focus active tab',
    },
  },
} satisfies Meta<typeof TabPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock content components
const DescriptionContent = () => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-2">Product Description</h3>
    <p className="text-neutral-600 dark:text-neutral-400">
      This premium product offers exceptional quality and performance. Built with the finest materials
      and cutting-edge technology, it's designed to exceed your expectations.
    </p>
    <ul className="mt-4 space-y-2">
      <li className="flex items-start">
        <span className="text-green-500 mr-2">✓</span>
        High-quality materials
      </li>
      <li className="flex items-start">
        <span className="text-green-500 mr-2">✓</span>
        Advanced technology
      </li>
      <li className="flex items-start">
        <span className="text-green-500 mr-2">✓</span>
        Long-lasting durability
      </li>
    </ul>
  </div>
);

const SpecsContent = () => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Dimensions</dt>
        <dd className="mt-1 text-sm">10" x 8" x 3"</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Weight</dt>
        <dd className="mt-1 text-sm">2.5 lbs</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Material</dt>
        <dd className="mt-1 text-sm">Aluminum alloy</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Color</dt>
        <dd className="mt-1 text-sm">Space Gray</dd>
      </div>
    </dl>
  </div>
);

const ReviewsContent = () => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
    <div className="space-y-4">
      <div className="border-b pb-4">
        <div className="flex items-center mb-2">
          <div className="text-yellow-400">★★★★★</div>
          <span className="ml-2 font-medium">John D.</span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Excellent product! Exactly what I was looking for.
        </p>
      </div>
      <div className="border-b pb-4">
        <div className="flex items-center mb-2">
          <div className="text-yellow-400">★★★★☆</div>
          <span className="ml-2 font-medium">Sarah M.</span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Great quality, but shipping took longer than expected.
        </p>
      </div>
    </div>
  </div>
);

// Basic tabs
export const Default: Story = {
  args: {
    tabs: [
      {
        id: 'description',
        label: 'Description',
        content: <DescriptionContent />,
      },
      {
        id: 'specs',
        label: 'Specifications',
        content: <SpecsContent />,
      },
      {
        id: 'reviews',
        label: 'Reviews',
        content: <ReviewsContent />,
      },
    ],
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    tabs: [
      {
        id: 'description',
        label: 'Description',
        icon: 'file-text',
        content: <DescriptionContent />,
      },
      {
        id: 'specs',
        label: 'Specifications',
        icon: 'list',
        content: <SpecsContent />,
      },
      {
        id: 'reviews',
        label: 'Reviews',
        icon: 'star',
        content: <ReviewsContent />,
      },
    ],
  },
};

// With badges
export const WithBadges: Story = {
  args: {
    tabs: [
      {
        id: 'description',
        label: 'Description',
        content: <DescriptionContent />,
      },
      {
        id: 'specs',
        label: 'Specifications',
        content: <SpecsContent />,
      },
      {
        id: 'reviews',
        label: 'Reviews',
        badge: 42,
        content: <ReviewsContent />,
      },
      {
        id: 'qa',
        label: 'Q&A',
        badge: 'New',
        content: <div className="p-4">Questions and answers content</div>,
      },
    ],
  },
};

// Pills variant
export const Pills: Story = {
  args: {
    variant: 'pills',
    tabs: [
      {
        id: 'all',
        label: 'All Products',
        badge: 156,
        content: <div className="p-4">All products content</div>,
      },
      {
        id: 'electronics',
        label: 'Electronics',
        badge: 42,
        content: <div className="p-4">Electronics content</div>,
      },
      {
        id: 'clothing',
        label: 'Clothing',
        badge: 78,
        content: <div className="p-4">Clothing content</div>,
      },
      {
        id: 'home',
        label: 'Home & Garden',
        badge: 36,
        content: <div className="p-4">Home & Garden content</div>,
      },
    ],
  },
};

// Underline variant
export const Underline: Story = {
  args: {
    variant: 'underline',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        content: <div className="p-4">Overview content</div>,
      },
      {
        id: 'features',
        label: 'Features',
        content: <div className="p-4">Features content</div>,
      },
      {
        id: 'pricing',
        label: 'Pricing',
        content: <div className="p-4">Pricing content</div>,
      },
    ],
  },
};

// Boxed variant
export const Boxed: Story = {
  args: {
    variant: 'boxed',
    tabs: [
      {
        id: 'general',
        label: 'General',
        icon: 'settings',
        content: <div className="p-4">General settings</div>,
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: 'user',
        content: <div className="p-4">Profile settings</div>,
      },
      {
        id: 'security',
        label: 'Security',
        icon: 'shield',
        content: <div className="p-4">Security settings</div>,
      },
    ],
  },
};

// Vertical orientation
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    tabs: [
      {
        id: 'account',
        label: 'Account',
        icon: 'user',
        content: <div className="p-4">Account settings content</div>,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'bell',
        badge: 3,
        content: <div className="p-4">Notification preferences</div>,
      },
      {
        id: 'privacy',
        label: 'Privacy',
        icon: 'lock',
        content: <div className="p-4">Privacy settings</div>,
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: 'credit-card',
        content: <div className="p-4">Billing information</div>,
      },
    ],
  },
};

// With disabled tabs
export const WithDisabled: Story = {
  args: {
    tabs: [
      {
        id: 'active1',
        label: 'Active Tab 1',
        content: <div className="p-4">This tab is active</div>,
      },
      {
        id: 'disabled1',
        label: 'Coming Soon',
        content: <div className="p-4">This content is not available</div>,
        disabled: true,
      },
      {
        id: 'active2',
        label: 'Active Tab 2',
        content: <div className="p-4">This tab is also active</div>,
      },
      {
        id: 'disabled2',
        label: 'Beta Feature',
        badge: 'Beta',
        content: <div className="p-4">Beta content</div>,
        disabled: true,
      },
    ],
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8 w-full">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small</h3>
        <TabPanel
          size="sm"
          tabs={[
            { id: '1', label: 'Tab 1', content: <div className="p-4">Small tab content</div> },
            { id: '2', label: 'Tab 2', content: <div className="p-4">Small tab content</div> },
            { id: '3', label: 'Tab 3', content: <div className="p-4">Small tab content</div> },
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium (Default)</h3>
        <TabPanel
          size="md"
          tabs={[
            { id: '1', label: 'Tab 1', content: <div className="p-4">Medium tab content</div> },
            { id: '2', label: 'Tab 2', content: <div className="p-4">Medium tab content</div> },
            { id: '3', label: 'Tab 3', content: <div className="p-4">Medium tab content</div> },
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Large</h3>
        <TabPanel
          size="lg"
          tabs={[
            { id: '1', label: 'Tab 1', content: <div className="p-4">Large tab content</div> },
            { id: '2', label: 'Tab 2', content: <div className="p-4">Large tab content</div> },
            { id: '3', label: 'Tab 3', content: <div className="p-4">Large tab content</div> },
          ]}
        />
      </div>
    </div>
  ),
};

// Full width tabs
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    tabs: [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: <div className="p-4">Full width tab 1</div>,
      },
      {
        id: 'tab2',
        label: 'Tab 2',
        content: <div className="p-4">Full width tab 2</div>,
      },
      {
        id: 'tab3',
        label: 'Tab 3',
        content: <div className="p-4">Full width tab 3</div>,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

// Lazy loading example
export const LazyLoading: Story = {
  args: {
    lazy: true,
    tabs: [
      {
        id: 'instant',
        label: 'Instant',
        content: <div className="p-4">This content loads immediately</div>,
      },
      {
        id: 'lazy1',
        label: 'Lazy Load 1',
        content: (
          <div className="p-4">
            <div className="animate-pulse">
              This content was loaded when you clicked the tab
            </div>
          </div>
        ),
      },
      {
        id: 'lazy2',
        label: 'Lazy Load 2',
        content: (
          <div className="p-4">
            <div className="animate-pulse">
              This content was also loaded on demand
            </div>
          </div>
        ),
      },
    ],
  },
};

// Controlled component
export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab2');
    
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
        
        <TabPanel
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            {
              id: 'tab1',
              label: 'Tab 1',
              content: <div className="p-4">Controlled tab 1 content</div>,
            },
            {
              id: 'tab2',
              label: 'Tab 2',
              content: <div className="p-4">Controlled tab 2 content</div>,
            },
            {
              id: 'tab3',
              label: 'Tab 3',
              content: <div className="p-4">Controlled tab 3 content</div>,
            },
          ]}
        />
        
        <p className="text-sm text-neutral-600">
          Active tab: <strong>{activeTab}</strong>
        </p>
      </div>
    );
  },
};

// Product page example
export const ProductPage: Story = {
  args: {
    variant: 'underline',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        content: <DescriptionContent />,
      },
      {
        id: 'specs',
        label: 'Tech Specs',
        icon: 'cpu',
        content: <SpecsContent />,
      },
      {
        id: 'reviews',
        label: 'Reviews',
        icon: 'star',
        badge: 128,
        content: <ReviewsContent />,
      },
      {
        id: 'qa',
        label: 'Q&A',
        icon: 'message-circle',
        badge: 24,
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Questions & Answers</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Have a question? Check here for answers.
            </p>
          </div>
        ),
      },
      {
        id: 'shipping',
        label: 'Shipping',
        icon: 'truck',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Free shipping on orders over $50. Standard delivery in 3-5 business days.
            </p>
          </div>
        ),
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
};

// Settings page example
export const SettingsPage: Story = {
  args: {
    variant: 'boxed',
    orientation: 'vertical',
    tabs: [
      {
        id: 'general',
        label: 'General',
        icon: 'settings',
        content: (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>UTC-5 (EST)</option>
                  <option>UTC-8 (PST)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'bell',
        badge: 3,
        content: (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Email notifications
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Push notifications
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                SMS notifications
              </label>
            </div>
          </div>
        ),
      },
      {
        id: 'privacy',
        label: 'Privacy',
        icon: 'shield',
        content: (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Make profile public
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Show online status
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Allow messages from anyone
              </label>
            </div>
          </div>
        ),
      },
      {
        id: 'security',
        label: 'Security',
        icon: 'lock',
        content: (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md">
                Change Password
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md">
                Enable Two-Factor Auth
              </button>
            </div>
          </div>
        ),
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl h-96">
        <Story />
      </div>
    ),
  ],
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    variant: 'pills',
    tabs: [
      {
        id: 'dark1',
        label: 'Dark Tab 1',
        icon: 'moon',
        content: <div className="p-4">Dark theme content 1</div>,
      },
      {
        id: 'dark2',
        label: 'Dark Tab 2',
        icon: 'star',
        badge: 5,
        content: <div className="p-4">Dark theme content 2</div>,
      },
      {
        id: 'dark3',
        label: 'Dark Tab 3',
        icon: 'sun',
        content: <div className="p-4">Dark theme content 3</div>,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};