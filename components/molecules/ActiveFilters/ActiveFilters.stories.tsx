import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ActiveFilters, Filter } from './ActiveFilters';

const meta = {
  title: 'Molecules/ActiveFilters',
  component: ActiveFilters,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Display variant',
    },
    showClearAll: {
      control: 'boolean',
      description: 'Show clear all button',
    },
    showCount: {
      control: 'boolean',
      description: 'Show filter count',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow collapse/expand',
    },
    maxVisible: {
      control: 'number',
      description: 'Max filters before collapse',
    },
  },
} satisfies Meta<typeof ActiveFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample filters
const sampleFilters: Filter[] = [
  { id: '1', type: 'category', label: 'Category', value: 'Electronics' },
  { id: '2', type: 'price', label: 'Price', value: '$100-$500' },
  { id: '3', type: 'brand', label: 'Brand', value: 'Apple' },
  { id: '4', type: 'rating', label: 'Rating', value: '4+ stars' },
];

// Basic active filters
export const Default: Story = {
  args: {
    filters: sampleFilters,
  },
};

// With remove handlers
export const Removable: Story = {
  args: {
    filters: sampleFilters,
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Compact variant
export const Compact: Story = {
  args: {
    filters: sampleFilters,
    variant: 'compact',
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Without count
export const NoCount: Story = {
  args: {
    filters: sampleFilters,
    showCount: false,
    onRemove: (filterId) => console.log('Remove filter:', filterId),
  },
};

// Without clear all
export const NoClearAll: Story = {
  args: {
    filters: sampleFilters,
    showClearAll: false,
    onRemove: (filterId) => console.log('Remove filter:', filterId),
  },
};

// Many filters (collapsible)
export const ManyFilters: Story = {
  args: {
    filters: [
      { id: '1', type: 'category', label: 'Category', value: 'Electronics' },
      { id: '2', type: 'subcategory', label: 'Subcategory', value: 'Smartphones' },
      { id: '3', type: 'brand', label: 'Brand', value: 'Apple' },
      { id: '4', type: 'price', label: 'Price', value: '$500-$1000' },
      { id: '5', type: 'rating', label: 'Rating', value: '4+ stars' },
      { id: '6', type: 'shipping', label: 'Shipping', value: 'Free Shipping' },
      { id: '7', type: 'availability', label: 'Availability', value: 'In Stock' },
      { id: '8', type: 'condition', label: 'Condition', value: 'New' },
    ],
    maxVisible: 5,
    collapsible: true,
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Not collapsible
export const NotCollapsible: Story = {
  args: {
    filters: [
      { id: '1', type: 'category', label: 'Category', value: 'Electronics' },
      { id: '2', type: 'subcategory', label: 'Subcategory', value: 'Smartphones' },
      { id: '3', type: 'brand', label: 'Brand', value: 'Apple' },
      { id: '4', type: 'price', label: 'Price', value: '$500-$1000' },
      { id: '5', type: 'rating', label: 'Rating', value: '4+ stars' },
      { id: '6', type: 'shipping', label: 'Shipping', value: 'Free Shipping' },
      { id: '7', type: 'availability', label: 'Availability', value: 'In Stock' },
      { id: '8', type: 'condition', label: 'Condition', value: 'New' },
    ],
    collapsible: false,
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// With array values
export const ArrayValues: Story = {
  args: {
    filters: [
      { id: '1', type: 'colors', label: 'Colors', value: ['Red', 'Blue', 'Green'] },
      { id: '2', type: 'sizes', label: 'Sizes', value: ['S', 'M', 'L'] },
      { id: '3', type: 'brands', label: 'Brands', value: ['Nike', 'Adidas', 'Puma'] },
    ],
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// With display values
export const DisplayValues: Story = {
  args: {
    filters: [
      { 
        id: '1', 
        type: 'price', 
        label: 'Price', 
        value: 'price_100_500',
        displayValue: '$100 - $500'
      },
      { 
        id: '2', 
        type: 'date', 
        label: 'Date', 
        value: '2024_01_01__2024_12_31',
        displayValue: 'This year'
      },
      { 
        id: '3', 
        type: 'rating', 
        label: 'Rating', 
        value: 'rating_gte_4',
        displayValue: '★★★★☆ & up'
      },
    ],
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [filters, setFilters] = useState<Filter[]>([
      { id: '1', type: 'category', label: 'Category', value: 'Electronics' },
      { id: '2', type: 'price', label: 'Price', value: '$100-$500' },
      { id: '3', type: 'brand', label: 'Brand', value: 'Apple' },
      { id: '4', type: 'rating', label: 'Rating', value: '4+ stars' },
      { id: '5', type: 'shipping', label: 'Shipping', value: 'Free Shipping' },
    ]);
    
    const handleRemove = (filterId: string) => {
      setFilters(filters.filter(f => f.id !== filterId));
    };
    
    const handleClearAll = () => {
      setFilters([]);
    };
    
    const addFilter = () => {
      const newFilter: Filter = {
        id: Date.now().toString(),
        type: 'custom',
        label: 'Custom Filter',
        value: `Value ${filters.length + 1}`,
      };
      setFilters([...filters, newFilter]);
    };
    
    return (
      <div className="space-y-4 w-full max-w-2xl">
        <ActiveFilters
          filters={filters}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
        />
        
        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={addFilter}
            className="px-3 py-1 bg-primary-600 text-white rounded text-sm"
          >
            Add Filter
          </button>
          <button
            onClick={() => setFilters(sampleFilters)}
            className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 rounded text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  },
};

// E-commerce example
export const EcommerceFilters: Story = {
  args: {
    filters: [
      { id: '1', type: 'category', label: 'Category', value: 'Laptops' },
      { id: '2', type: 'brand', label: 'Brand', value: ['Apple', 'Dell', 'HP'] },
      { id: '3', type: 'price', label: 'Price', value: 'price_1000_2000', displayValue: '$1,000 - $2,000' },
      { id: '4', type: 'processor', label: 'Processor', value: 'Intel Core i7' },
      { id: '5', type: 'memory', label: 'Memory', value: '16GB' },
      { id: '6', type: 'storage', label: 'Storage', value: '512GB SSD' },
      { id: '7', type: 'rating', label: 'Rating', value: 'rating_4', displayValue: '★★★★☆ & up' },
      { id: '8', type: 'availability', label: 'Availability', value: 'In Stock' },
    ],
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Job search filters
export const JobSearchFilters: Story = {
  args: {
    filters: [
      { id: '1', type: 'location', label: 'Location', value: 'San Francisco, CA' },
      { id: '2', type: 'jobType', label: 'Job Type', value: ['Full-time', 'Remote'] },
      { id: '3', type: 'experience', label: 'Experience', value: 'Senior Level' },
      { id: '4', type: 'salary', label: 'Salary', value: 'salary_100k_150k', displayValue: '$100k - $150k' },
      { id: '5', type: 'company', label: 'Company Size', value: '50-200 employees' },
    ],
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Real estate filters
export const RealEstateFilters: Story = {
  args: {
    filters: [
      { id: '1', type: 'propertyType', label: 'Type', value: 'House' },
      { id: '2', type: 'price', label: 'Price', value: 'price_500k_1m', displayValue: '$500k - $1M' },
      { id: '3', type: 'bedrooms', label: 'Bedrooms', value: '3+' },
      { id: '4', type: 'bathrooms', label: 'Bathrooms', value: '2+' },
      { id: '5', type: 'size', label: 'Size', value: 'size_2000_3000', displayValue: '2,000 - 3,000 sq ft' },
      { id: '6', type: 'features', label: 'Features', value: ['Pool', 'Garage', 'Garden'] },
    ],
    variant: 'compact',
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Custom labels
export const CustomLabels: Story = {
  args: {
    filters: sampleFilters,
    clearAllLabel: 'Remove all',
    showMoreLabel: 'View all filters',
    showLessLabel: 'Hide filters',
    countLabel: 'active filters',
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    filters: [],
  },
};

// Single filter
export const SingleFilter: Story = {
  args: {
    filters: [
      { id: '1', type: 'category', label: 'Category', value: 'Electronics' },
    ],
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    filters: sampleFilters,
    onRemove: (filterId) => console.log('Remove filter:', filterId),
    onClearAll: () => console.log('Clear all filters'),
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

// With search results
export const WithSearchResults: Story = {
  render: () => {
    const [filters, setFilters] = useState<Filter[]>([
      { id: '1', type: 'category', label: 'Category', value: 'Electronics' },
      { id: '2', type: 'brand', label: 'Brand', value: 'Apple' },
      { id: '3', type: 'price', label: 'Price', value: '$500-$1000' },
    ]);
    
    return (
      <div className="w-full max-w-4xl">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Showing 1-20 of 156 results
            </p>
            <ActiveFilters
              filters={filters}
              onRemove={(id) => setFilters(filters.filter(f => f.id !== id))}
              onClearAll={() => setFilters([])}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="border rounded p-4">
              <div className="h-32 bg-neutral-100 dark:bg-neutral-800 rounded mb-2" />
              <p className="font-medium">Product {i}</p>
              <p className="text-sm text-neutral-600">$599.99</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};