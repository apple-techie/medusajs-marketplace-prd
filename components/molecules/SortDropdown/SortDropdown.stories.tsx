import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SortDropdown } from './SortDropdown';

const meta = {
  title: 'Molecules/SortDropdown',
  component: SortDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Dropdown size',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual style variant',
    },
    align: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Dropdown alignment',
    },
    showDirection: {
      control: 'boolean',
      description: 'Show sort direction arrows',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
} satisfies Meta<typeof SortDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic sort options
const basicOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating', label: 'Customer Rating' },
];

// Price sort options with direction
const priceOptions = [
  { value: 'price-low', label: 'Price: Low to High', direction: 'asc' as const },
  { value: 'price-high', label: 'Price: High to Low', direction: 'desc' as const },
];

// Options with icons
const iconOptions = [
  { value: 'name-asc', label: 'Name (A-Z)', icon: 'type', direction: 'asc' as const },
  { value: 'name-desc', label: 'Name (Z-A)', icon: 'type', direction: 'desc' as const },
  { value: 'date-new', label: 'Date Added', icon: 'calendar', direction: 'desc' as const },
  { value: 'rating', label: 'Rating', icon: 'star', direction: 'desc' as const },
];

// Options with badges
const badgeOptions = [
  { value: 'popular', label: 'Most Popular', badge: 'Hot' },
  { value: 'trending', label: 'Trending', badge: 'New' },
  { value: 'rated', label: 'Top Rated' },
  { value: 'reviewed', label: 'Most Reviewed' },
];

// Default story
export const Default: Story = {
  args: {
    options: basicOptions,
  },
};

// With selected value
export const WithValue: Story = {
  args: {
    options: basicOptions,
    value: 'newest',
  },
};

// With direction indicators
export const WithDirection: Story = {
  args: {
    options: [...basicOptions, ...priceOptions],
    value: 'price-low',
    showDirection: true,
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    options: iconOptions,
    value: 'name-asc',
    showDirection: true,
  },
};

// With badges
export const WithBadges: Story = {
  args: {
    options: badgeOptions,
    value: 'popular',
  },
};

// Custom label
export const CustomLabel: Story = {
  args: {
    options: basicOptions,
    label: 'Order by',
    placeholder: 'Choose order',
  },
};

// No label
export const NoLabel: Story = {
  args: {
    options: basicOptions,
    label: '',
    value: 'newest',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SortDropdown
        size="sm"
        options={basicOptions}
        value="newest"
      />
      <SortDropdown
        size="md"
        options={basicOptions}
        value="newest"
      />
      <SortDropdown
        size="lg"
        options={basicOptions}
        value="newest"
      />
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SortDropdown
        variant="default"
        options={basicOptions}
        value="newest"
      />
      <SortDropdown
        variant="outline"
        options={basicOptions}
        value="newest"
      />
      <SortDropdown
        variant="ghost"
        options={basicOptions}
        value="newest"
      />
    </div>
  ),
};

// Full width
export const FullWidth: Story = {
  args: {
    options: basicOptions,
    fullWidth: true,
    value: 'newest',
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

// Disabled state
export const Disabled: Story = {
  args: {
    options: basicOptions,
    value: 'newest',
    disabled: true,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    options: basicOptions,
    loading: true,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    
    const allOptions = [
      { value: 'relevance', label: 'Most Relevant' },
      { value: 'popular', label: 'Most Popular', badge: 'Hot' },
      { value: 'price-low', label: 'Price: Low to High', icon: 'trending-up', direction: 'asc' as const },
      { value: 'price-high', label: 'Price: High to Low', icon: 'trending-down', direction: 'desc' as const },
      { value: 'newest', label: 'Newest First', icon: 'calendar' },
      { value: 'rating', label: 'Customer Rating', icon: 'star' },
    ];
    
    return (
      <div className="space-y-4">
        <SortDropdown
          options={allOptions}
          value={value}
          onChange={setValue}
          showDirection
        />
        
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded">
          <p className="text-sm">
            Selected value: <strong>{value || 'none'}</strong>
          </p>
          {value && (
            <p className="text-sm mt-1">
              Label: <strong>{allOptions.find(opt => opt.value === value)?.label}</strong>
            </p>
          )}
        </div>
      </div>
    );
  },
};

// Product listing example
export const ProductListing: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState('relevance');
    
    const sortOptions = [
      { value: 'relevance', label: 'Most Relevant' },
      { value: 'popular', label: 'Best Sellers', badge: 'Popular' },
      { value: 'rating', label: 'Customer Rating', icon: 'star' },
      { value: 'newest', label: 'New Arrivals', icon: 'calendar' },
      { value: 'price-low', label: 'Price: Low to High', direction: 'asc' as const },
      { value: 'price-high', label: 'Price: High to Low', direction: 'desc' as const },
    ];
    
    return (
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Products (128 results)</h2>
          <SortDropdown
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            showDirection
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded">
              <div className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
              <p className="font-medium">Product {i}</p>
              <p className="text-sm text-neutral-600">$99.99</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// Table sorting example
export const TableSorting: Story = {
  render: () => {
    const [sortField, setSortField] = useState('date');
    
    const tableOptions = [
      { value: 'date', label: 'Date', icon: 'calendar' },
      { value: 'order', label: 'Order #', icon: 'hash' },
      { value: 'customer', label: 'Customer', icon: 'user' },
      { value: 'amount', label: 'Amount', icon: 'dollar-sign' },
      { value: 'status', label: 'Status', icon: 'circle' },
    ];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent Orders</h3>
          <SortDropdown
            options={tableOptions}
            value={sortField}
            onChange={setSortField}
            size="sm"
            variant="outline"
          />
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Order</th>
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i} className="border-b">
                <td className="py-2">#000{i}</td>
                <td className="py-2">Customer {i}</td>
                <td className="py-2">${(i * 99.99).toFixed(2)}</td>
                <td className="py-2">
                  <span className="text-green-600">Complete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

// Multiple sort dropdowns
export const MultipleDropdowns: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState('newest');
    const [groupBy, setGroupBy] = useState('category');
    
    const sortOptions = [
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'name', label: 'Name' },
      { value: 'size', label: 'Size' },
    ];
    
    const groupOptions = [
      { value: 'none', label: 'No Grouping' },
      { value: 'category', label: 'Category' },
      { value: 'brand', label: 'Brand' },
      { value: 'price', label: 'Price Range' },
    ];
    
    return (
      <div className="flex gap-4">
        <SortDropdown
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          label="Sort"
          variant="outline"
        />
        <SortDropdown
          options={groupOptions}
          value={groupBy}
          onChange={setGroupBy}
          label="Group"
          variant="outline"
        />
      </div>
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    options: iconOptions,
    value: 'rating',
    showDirection: true,
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 rounded">
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

// Empty state
export const EmptyOptions: Story = {
  args: {
    options: [],
    placeholder: 'No options available',
  },
};

// Long labels
export const LongLabels: Story = {
  args: {
    options: [
      { value: '1', label: 'This is a very long option label that might overflow' },
      { value: '2', label: 'Another extremely long label to test text wrapping' },
      { value: '3', label: 'Short label' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};