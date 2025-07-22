import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { VariantSelector } from './VariantSelector';

const meta = {
  title: 'Molecules/VariantSelector',
  component: VariantSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'inline'],
      description: 'Selector variant',
    },
    layout: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction',
    },
    imageSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Image option size',
    },
    colorSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Color swatch size',
    },
    showPrice: {
      control: 'boolean',
      description: 'Show price differences',
    },
    showStock: {
      control: 'boolean',
      description: 'Show stock information',
    },
    showImages: {
      control: 'boolean',
      description: 'Show images for image type variants',
    },
    disableUnavailable: {
      control: 'boolean',
      description: 'Disable unavailable options',
    },
    singleGroup: {
      control: 'boolean',
      description: 'Single group mode',
    },
  },
} satisfies Meta<typeof VariantSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample variant groups
const colorGroup = {
  id: 'color',
  name: 'Color',
  type: 'color' as const,
  options: [
    { value: 'black', label: 'Black', color: '#000000', available: true },
    { value: 'white', label: 'White', color: '#FFFFFF', available: true },
    { value: 'red', label: 'Red', color: '#EF4444', available: true },
    { value: 'blue', label: 'Blue', color: '#3B82F6', available: true },
    { value: 'green', label: 'Green', color: '#10B981', available: false },
  ],
};

const sizeGroup = {
  id: 'size',
  name: 'Size',
  type: 'size' as const,
  options: [
    { value: 'xs', label: 'XS', available: true, stock: 15 },
    { value: 's', label: 'S', available: true, stock: 8 },
    { value: 'm', label: 'M', available: true, stock: 3 },
    { value: 'l', label: 'L', available: true, stock: 0 },
    { value: 'xl', label: 'XL', available: false },
    { value: 'xxl', label: 'XXL', available: true, stock: 12 },
  ],
};

const materialGroup = {
  id: 'material',
  name: 'Material',
  type: 'text' as const,
  options: [
    { value: 'cotton', label: '100% Cotton', available: true, price: 29.99 },
    { value: 'blend', label: 'Cotton Blend', available: true, price: 24.99 },
    { value: 'polyester', label: 'Polyester', available: true, price: 19.99 },
    { value: 'wool', label: 'Merino Wool', available: true, price: 49.99 },
  ],
};

const styleGroup = {
  id: 'style',
  name: 'Style',
  type: 'image' as const,
  options: [
    { 
      value: 'crew', 
      label: 'Crew Neck', 
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80',
      available: true 
    },
    { 
      value: 'vneck', 
      label: 'V-Neck', 
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&q=80',
      available: true 
    },
    { 
      value: 'polo', 
      label: 'Polo', 
      image: 'https://images.unsplash.com/photo-1625910513390-a1c48b2c3f6d?w=200&q=80',
      available: true 
    },
    { 
      value: 'henley', 
      label: 'Henley', 
      available: false 
    },
  ],
};

// Basic color selector
export const ColorSelector: Story = {
  args: {
    groups: [colorGroup],
  },
};

// Size selector with stock
export const SizeSelector: Story = {
  args: {
    groups: [sizeGroup],
    showStock: true,
  },
};

// Multiple variant groups
export const MultipleGroups: Story = {
  args: {
    groups: [colorGroup, sizeGroup, materialGroup],
    showStock: true,
    showPrice: true,
  },
};

// Image variant selector
export const ImageVariants: Story = {
  args: {
    groups: [styleGroup],
    showImages: true,
  },
};

// Compact variant
export const CompactVariant: Story = {
  args: {
    groups: [colorGroup, sizeGroup],
    variant: 'compact',
  },
};

// Inline variant with radio buttons
export const InlineVariant: Story = {
  args: {
    groups: [materialGroup],
    variant: 'inline',
    showPrice: true,
  },
};

// With selected values
export const WithSelection: Story = {
  args: {
    groups: [colorGroup, sizeGroup],
    selected: {
      color: 'black',
      size: 'm',
    },
  },
};

// Disabled unavailable options
export const DisabledOptions: Story = {
  args: {
    groups: [colorGroup, sizeGroup],
    disableUnavailable: true,
    showStock: true,
  },
};

// Single group mode
export const SingleGroup: Story = {
  args: {
    groups: [sizeGroup],
    singleGroup: true,
    showStock: true,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<Record<string, string>>({});
    const [complete, setComplete] = useState(false);

    const handleChange = (groupId: string, value: string) => {
      setSelected(prev => ({
        ...prev,
        [groupId]: value,
      }));
      setComplete(false);
    };

    const handleComplete = (selections: Record<string, string>) => {
      setComplete(true);
      console.log('All selections made:', selections);
    };

    return (
      <div className="space-y-6 min-w-[400px]">
        <VariantSelector
          groups={[colorGroup, sizeGroup, materialGroup]}
          selected={selected}
          onChange={handleChange}
          onComplete={handleComplete}
          showStock
          showPrice
        />
        
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <h3 className="font-semibold mb-2">Current Selection:</h3>
          <pre className="text-sm">{JSON.stringify(selected, null, 2)}</pre>
          {complete && (
            <p className="mt-2 text-green-600 dark:text-green-400 font-medium">
              ✓ All required options selected!
            </p>
          )}
        </div>
      </div>
    );
  },
};

// T-shirt product example
export const TShirtProduct: Story = {
  render: () => {
    const [selected, setSelected] = useState<Record<string, string>>({
      color: 'black',
      size: 'm',
    });

    return (
      <div className="max-w-md space-y-6">
        <h3 className="text-lg font-semibold">Classic T-Shirt</h3>
        <VariantSelector
          groups={[
            colorGroup,
            sizeGroup,
            {
              id: 'fit',
              name: 'Fit',
              type: 'text' as const,
              options: [
                { value: 'regular', label: 'Regular Fit', available: true },
                { value: 'slim', label: 'Slim Fit', available: true },
                { value: 'relaxed', label: 'Relaxed Fit', available: true },
              ],
            },
          ]}
          selected={selected}
          onChange={(groupId, value) => {
            setSelected(prev => ({ ...prev, [groupId]: value }));
          }}
          showStock
          disableUnavailable
        />
      </div>
    );
  },
};

// Shoe product example
export const ShoeProduct: Story = {
  render: () => {
    const shoeColors = {
      id: 'color',
      name: 'Color',
      type: 'image' as const,
      options: [
        { 
          value: 'black-white', 
          label: 'Black/White',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
          available: true,
          price: 89.99
        },
        { 
          value: 'all-black', 
          label: 'All Black',
          image: 'https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=200&q=80',
          available: true,
          price: 89.99
        },
        { 
          value: 'white-blue', 
          label: 'White/Blue',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&q=80',
          available: true,
          price: 94.99
        },
      ],
    };

    const shoeSizes = {
      id: 'size',
      name: 'Size',
      type: 'size' as const,
      options: [
        { value: '7', label: '7', available: true, stock: 5 },
        { value: '7.5', label: '7.5', available: true, stock: 3 },
        { value: '8', label: '8', available: true, stock: 8 },
        { value: '8.5', label: '8.5', available: true, stock: 2 },
        { value: '9', label: '9', available: true, stock: 0 },
        { value: '9.5', label: '9.5', available: true, stock: 6 },
        { value: '10', label: '10', available: true, stock: 4 },
        { value: '10.5', label: '10.5', available: false },
        { value: '11', label: '11', available: true, stock: 10 },
      ],
    };

    return (
      <div className="max-w-md space-y-6">
        <h3 className="text-lg font-semibold">Running Shoes</h3>
        <VariantSelector
          groups={[shoeColors, shoeSizes]}
          showStock
          showPrice
          showImages
          imageSize="lg"
          disableUnavailable
        />
      </div>
    );
  },
};

// Custom configuration example
export const CustomConfiguration: Story = {
  render: () => {
    const configGroups = [
      {
        id: 'processor',
        name: 'Processor',
        type: 'text' as const,
        options: [
          { value: 'i5', label: 'Intel Core i5', available: true, price: 0 },
          { value: 'i7', label: 'Intel Core i7', available: true, price: 300 },
          { value: 'i9', label: 'Intel Core i9', available: true, price: 600 },
        ],
      },
      {
        id: 'memory',
        name: 'Memory',
        type: 'size' as const,
        options: [
          { value: '8gb', label: '8GB', available: true, price: 0 },
          { value: '16gb', label: '16GB', available: true, price: 200 },
          { value: '32gb', label: '32GB', available: true, price: 600 },
          { value: '64gb', label: '64GB', available: false, price: 1200 },
        ],
      },
      {
        id: 'storage',
        name: 'Storage',
        type: 'text' as const,
        options: [
          { value: '256gb', label: '256GB SSD', available: true, price: 0 },
          { value: '512gb', label: '512GB SSD', available: true, price: 200 },
          { value: '1tb', label: '1TB SSD', available: true, price: 400 },
          { value: '2tb', label: '2TB SSD', available: true, price: 800 },
        ],
      },
    ];

    const [selected, setSelected] = useState<Record<string, string>>({
      processor: 'i5',
      memory: '8gb',
      storage: '256gb',
    });

    // Calculate total price
    const totalPrice = configGroups.reduce((total, group) => {
      const selectedOption = group.options.find(o => o.value === selected[group.id]);
      return total + (selectedOption?.price || 0);
    }, 1299); // Base price

    return (
      <div className="max-w-md space-y-6">
        <h3 className="text-lg font-semibold">Configure Your Laptop</h3>
        <VariantSelector
          groups={configGroups}
          selected={selected}
          onChange={(groupId, value) => {
            setSelected(prev => ({ ...prev, [groupId]: value }));
          }}
          variant="inline"
          showPrice
          disableUnavailable
        />
        <div className="pt-4 border-t">
          <p className="text-xl font-semibold">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    );
  },
};

// With all features
export const AllFeatures: Story = {
  args: {
    groups: [colorGroup, sizeGroup, styleGroup, materialGroup],
    showPrice: true,
    showStock: true,
    showImages: true,
    disableUnavailable: true,
    selected: {
      color: 'black',
      size: 'm',
    },
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <div className="max-w-md">
        <VariantSelector
          groups={[colorGroup, sizeGroup, materialGroup]}
          showStock
          showPrice
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};