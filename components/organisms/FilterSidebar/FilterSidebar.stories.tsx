import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FilterSidebar } from './FilterSidebar';

const meta = {
  title: 'Organisms/FilterSidebar',
  component: FilterSidebar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'minimal'],
      description: 'Sidebar variant',
    },
    showClearAll: {
      control: 'boolean',
      description: 'Show clear all button',
    },
    showAppliedFilters: {
      control: 'boolean',
      description: 'Show applied filters section',
    },
    showResultCount: {
      control: 'boolean',
      description: 'Show result count',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow sections to collapse',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Default expanded state for sections',
    },
    mobileAsModal: {
      control: 'boolean',
      description: 'Show as modal on mobile',
    },
  },
} satisfies Meta<typeof FilterSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample filter sections
const sampleSections = [
  {
    id: 'category',
    title: 'Category',
    type: 'checkbox' as const,
    icon: 'grid',
    options: [
      { label: 'Electronics', value: 'electronics', count: 1234 },
      { label: 'Fashion', value: 'fashion', count: 567 },
      { label: 'Home & Garden', value: 'home', count: 890 },
      { label: 'Sports & Outdoors', value: 'sports', count: 345 },
      { label: 'Beauty & Health', value: 'beauty', count: 678 },
    ],
  },
  {
    id: 'price',
    title: 'Price Range',
    type: 'range' as const,
    icon: 'dollar-sign',
    range: { min: 0, max: 1000 },
  },
  {
    id: 'brand',
    title: 'Brand',
    type: 'checkbox' as const,
    icon: 'tag',
    options: [
      { label: 'Nike', value: 'nike', count: 234 },
      { label: 'Adidas', value: 'adidas', count: 178 },
      { label: 'Puma', value: 'puma', count: 92 },
      { label: 'New Balance', value: 'new-balance', count: 156 },
      { label: 'Under Armour', value: 'under-armour', count: 87 },
    ],
  },
  {
    id: 'rating',
    title: 'Customer Rating',
    type: 'rating' as const,
    icon: 'star',
  },
  {
    id: 'availability',
    title: 'Availability',
    type: 'checkbox' as const,
    icon: 'package',
    options: [
      { label: 'In Stock', value: 'in-stock', count: 2456 },
      { label: 'Ships in 1-2 days', value: 'fast-ship', count: 892 },
      { label: 'Free Shipping', value: 'free-ship', count: 1678 },
    ],
  },
];

// Fashion-specific sections
const fashionSections = [
  {
    id: 'size',
    title: 'Size',
    type: 'size' as const,
    icon: 'ruler',
    options: [
      { label: 'XS', value: 'xs' },
      { label: 'S', value: 's' },
      { label: 'M', value: 'm' },
      { label: 'L', value: 'l' },
      { label: 'XL', value: 'xl' },
      { label: 'XXL', value: 'xxl' },
    ],
  },
  {
    id: 'color',
    title: 'Color',
    type: 'color' as const,
    icon: 'palette',
    options: [
      { label: 'Black', value: '#000000' },
      { label: 'White', value: '#FFFFFF' },
      { label: 'Red', value: '#FF0000' },
      { label: 'Blue', value: '#0000FF' },
      { label: 'Green', value: '#00FF00' },
      { label: 'Yellow', value: '#FFFF00' },
      { label: 'Purple', value: '#800080' },
      { label: 'Pink', value: '#FFC0CB' },
    ],
  },
  {
    id: 'material',
    title: 'Material',
    type: 'checkbox' as const,
    icon: 'layers',
    options: [
      { label: 'Cotton', value: 'cotton', count: 456 },
      { label: 'Polyester', value: 'polyester', count: 234 },
      { label: 'Wool', value: 'wool', count: 89 },
      { label: 'Silk', value: 'silk', count: 67 },
      { label: 'Denim', value: 'denim', count: 178 },
    ],
  },
];

// Basic filter sidebar
export const Default: Story = {
  args: {
    sections: sampleSections,
  },
};

// With applied filters
export const WithAppliedFilters: Story = {
  args: {
    sections: sampleSections,
    appliedFilters: [
      { sectionId: 'category', value: 'electronics', label: 'Electronics' },
      { sectionId: 'brand', value: 'nike', label: 'Nike' },
      { sectionId: 'price', value: { min: 100, max: 500 } },
    ],
    showAppliedFilters: true,
  },
};

// Fashion filters with special types
export const FashionFilters: Story = {
  args: {
    sections: [...sampleSections.slice(2), ...fashionSections],
    showResultCount: true,
    resultCount: 234,
  },
};

// Compact variant
export const CompactVariant: Story = {
  args: {
    sections: sampleSections,
    variant: 'compact',
    defaultExpanded: false,
  },
};

// With apply button
export const WithApplyButton: Story = {
  render: () => {
    const [filters, setFilters] = useState([]);
    const [resultCount, setResultCount] = useState(1234);

    const handleApplyFilters = () => {
      // Simulate applying filters
      setResultCount(Math.floor(Math.random() * 1000) + 100);
      alert('Filters applied!');
    };

    return (
      <div className="max-w-xs">
        <FilterSidebar
          sections={sampleSections}
          appliedFilters={filters}
          onFilterChange={setFilters}
          onApplyFilters={handleApplyFilters}
          showResultCount
          resultCount={resultCount}
        />
      </div>
    );
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [filters, setFilters] = useState([
      { sectionId: 'category', value: 'electronics', label: 'Electronics' },
    ]);

    const handleFilterChange = (newFilters) => {
      setFilters(newFilters);
      console.log('Filters changed:', newFilters);
    };

    const handleClearAll = () => {
      console.log('All filters cleared');
    };

    return (
      <div className="max-w-xs">
        <FilterSidebar
          sections={sampleSections}
          appliedFilters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          showAppliedFilters
          showClearAll
          showResultCount
          resultCount={567}
        />
      </div>
    );
  },
};

// Mobile modal behavior
export const MobileModal: Story = {
  args: {
    sections: sampleSections,
    mobileAsModal: true,
    mobileBreakpoint: 'lg',
    appliedFilters: [
      { sectionId: 'category', value: 'fashion', label: 'Fashion' },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// All collapsed by default
export const CollapsedByDefault: Story = {
  args: {
    sections: sampleSections,
    collapsible: true,
    defaultExpanded: false,
  },
};

// Non-collapsible
export const NonCollapsible: Story = {
  args: {
    sections: sampleSections.slice(0, 3),
    collapsible: false,
  },
};

// Real-world e-commerce example
export const EcommerceExample: Story = {
  render: () => {
    const [filters, setFilters] = useState([]);
    const [loading, setLoading] = useState(false);

    const ecommerceSections = [
      {
        id: 'department',
        title: 'Department',
        type: 'radio' as const,
        icon: 'layers',
        options: [
          { label: 'All Departments', value: 'all' },
          { label: 'Men', value: 'men', count: 1234 },
          { label: 'Women', value: 'women', count: 2345 },
          { label: 'Kids', value: 'kids', count: 890 },
        ],
      },
      ...sampleSections,
      {
        id: 'discount',
        title: 'Discount',
        type: 'checkbox' as const,
        icon: 'percent',
        options: [
          { label: '10% off or more', value: '10', count: 456 },
          { label: '25% off or more', value: '25', count: 234 },
          { label: '50% off or more', value: '50', count: 89 },
          { label: '70% off or more', value: '70', count: 23 },
        ],
      },
      {
        id: 'seller',
        title: 'Seller',
        type: 'checkbox' as const,
        icon: 'store',
        options: [
          { label: 'Marketplace', value: 'marketplace', count: 3456 },
          { label: 'Third Party', value: 'third-party', count: 1234 },
          { label: 'Premium Sellers', value: 'premium', count: 567 },
        ],
      },
    ];

    const handleFilterChange = (newFilters) => {
      setFilters(newFilters);
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    return (
      <div className="flex gap-8">
        <div className="w-64">
          <FilterSidebar
            sections={ecommerceSections}
            appliedFilters={filters}
            onFilterChange={handleFilterChange}
            showAppliedFilters
            showClearAll
            showResultCount
            resultCount={loading ? 0 : 4567}
          />
        </div>
        
        <div className="flex-1">
          <div className="p-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-center">
            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div>
                <p className="text-lg font-semibold mb-2">Product Grid Area</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {filters.length} filters applied
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};

// Different filter types showcase
export const FilterTypes: Story = {
  render: () => {
    const allTypeSections = [
      {
        id: 'checkbox-example',
        title: 'Checkbox Filters',
        type: 'checkbox' as const,
        options: [
          { label: 'Option 1', value: 'opt1', count: 123 },
          { label: 'Option 2', value: 'opt2', count: 45 },
          { label: 'Option 3', value: 'opt3', count: 67 },
        ],
      },
      {
        id: 'radio-example',
        title: 'Radio Filters',
        type: 'radio' as const,
        options: [
          { label: 'Choice A', value: 'a' },
          { label: 'Choice B', value: 'b' },
          { label: 'Choice C', value: 'c' },
        ],
      },
      {
        id: 'price-example',
        title: 'Price Range',
        type: 'range' as const,
        range: { min: 0, max: 500 },
      },
      {
        id: 'rating-example',
        title: 'Rating Filter',
        type: 'rating' as const,
      },
      {
        id: 'color-example',
        title: 'Color Selection',
        type: 'color' as const,
        options: [
          { label: 'Red', value: '#FF0000' },
          { label: 'Blue', value: '#0000FF' },
          { label: 'Green', value: '#00FF00' },
          { label: 'Yellow', value: '#FFFF00' },
          { label: 'Purple', value: '#800080' },
          { label: 'Orange', value: '#FFA500' },
        ],
      },
      {
        id: 'size-example',
        title: 'Size Options',
        type: 'size' as const,
        options: [
          { label: 'XS', value: 'xs' },
          { label: 'S', value: 's' },
          { label: 'M', value: 'm' },
          { label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
        ],
      },
    ];

    return (
      <div className="max-w-xs">
        <FilterSidebar
          sections={allTypeSections}
          showAppliedFilters
          onFilterChange={(filters) => console.log('Filters:', filters)}
        />
      </div>
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <div className="max-w-xs">
        <FilterSidebar
          sections={sampleSections}
          appliedFilters={[
            { sectionId: 'category', value: 'electronics', label: 'Electronics' },
            { sectionId: 'brand', value: 'nike', label: 'Nike' },
          ]}
          showAppliedFilters
          showResultCount
          resultCount={789}
        />
      </div>
    </div>
  ),
};