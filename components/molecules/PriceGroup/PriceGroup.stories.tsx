import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PriceGroup, ProductPriceGroup, ComparisonPriceGroup } from './PriceGroup';
import { Icon } from '../../atoms/Icon/Icon';

const meta = {
  title: 'Molecules/PriceGroup',
  component: PriceGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    price: {
      control: { type: 'number', step: 0.01 },
      description: 'Current price',
    },
    originalPrice: {
      control: { type: 'number', step: 0.01 },
      description: 'Original price (for discounts)',
    },
    currency: {
      control: 'select',
      options: ['USD', 'EUR', 'GBP', 'JPY'],
      description: 'Currency code',
    },
    locale: {
      control: 'select',
      options: ['en-US', 'de-DE', 'fr-FR', 'ja-JP'],
      description: 'Locale for formatting',
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'compact'],
      description: 'Layout direction',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size variant',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Alignment',
    },
    showBadge: {
      control: 'boolean',
      description: 'Show discount badge',
    },
    badgePosition: {
      control: 'select',
      options: ['inline', 'top', 'bottom'],
      description: 'Badge position',
    },
    showSavings: {
      control: 'boolean',
      description: 'Show savings amount',
    },
    showInstallments: {
      control: 'boolean',
      description: 'Show installment option',
    },
  },
} satisfies Meta<typeof PriceGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic price group
export const Default: Story = {
  args: {
    price: 29.99,
  },
};

// With discount
export const WithDiscount: Story = {
  args: {
    price: 19.99,
    originalPrice: 29.99,
  },
};

// Different layouts
export const Layouts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Horizontal (default)</p>
        <PriceGroup price={19.99} originalPrice={29.99} layout="horizontal" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Vertical</p>
        <PriceGroup price={19.99} originalPrice={29.99} layout="vertical" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Compact</p>
        <PriceGroup price={19.99} originalPrice={29.99} layout="compact" />
      </div>
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Small</p>
        <PriceGroup price={19.99} originalPrice={29.99} size="sm" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Medium</p>
        <PriceGroup price={19.99} originalPrice={29.99} size="md" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Large</p>
        <PriceGroup price={19.99} originalPrice={29.99} size="lg" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Extra Large</p>
        <PriceGroup price={19.99} originalPrice={29.99} size="xl" />
      </div>
    </div>
  ),
};

// Badge positions
export const BadgePositions: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Inline badge</p>
        <PriceGroup 
          price={19.99} 
          originalPrice={29.99} 
          badgePosition="inline" 
        />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Top badge</p>
        <PriceGroup 
          price={19.99} 
          originalPrice={29.99} 
          badgePosition="top" 
        />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Bottom badge</p>
        <PriceGroup 
          price={19.99} 
          originalPrice={29.99} 
          badgePosition="bottom" 
        />
      </div>
    </div>
  ),
};

// With additional information
export const WithAdditionalInfo: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">With savings</p>
        <PriceGroup 
          price={19.99} 
          originalPrice={39.99}
          showSavings
        />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">With installments</p>
        <PriceGroup 
          price={299.99}
          showInstallments
          installmentCount={12}
        />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">With everything</p>
        <PriceGroup 
          price={179.99} 
          originalPrice={299.99}
          showSavings
          showInstallments
          installmentCount={6}
          layout="vertical"
          size="lg"
        />
      </div>
    </div>
  ),
};

// Custom badge text
export const CustomBadge: Story = {
  render: () => (
    <div className="space-y-4">
      <PriceGroup 
        price={19.99} 
        originalPrice={29.99}
        customBadgeText="Limited Time"
      />
      <PriceGroup 
        price={19.99} 
        originalPrice={29.99}
        customBadgeText="Flash Sale"
      />
      <PriceGroup 
        price={19.99} 
        originalPrice={29.99}
        customBadgeText="Member Price"
      />
    </div>
  ),
};

// Price ranges
export const PriceRanges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Basic range</p>
        <PriceGroup price={0} priceRange={{ min: 10, max: 50 }} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Large range</p>
        <PriceGroup 
          price={0} 
          priceRange={{ min: 99, max: 299 }} 
          size="lg"
        />
      </div>
    </div>
  ),
};

// With prefix and suffix
export const WithPrefixSuffix: Story = {
  render: () => (
    <div className="space-y-4">
      <PriceGroup 
        price={9.99}
        prefix={<span className="text-neutral-600">From</span>}
      />
      <PriceGroup 
        price={19.99}
        suffix={<span className="text-neutral-600">/month</span>}
      />
      <PriceGroup 
        price={49.99}
        originalPrice={79.99}
        prefix={<Icon icon="tag" size="sm" className="text-primary-600" />}
        suffix={<span className="text-xs text-neutral-500">+ shipping</span>}
      />
    </div>
  ),
};

// Product price group
export const ProductPriceGroups: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 max-w-xs">
        <h3 className="font-semibold mb-2">With rating above</h3>
        <ProductPriceGroup 
          price={79.99}
          originalPrice={119.99}
          rating={4.5}
          reviewCount={234}
          ratingPosition="above"
        />
      </div>
      
      <div className="border rounded-lg p-4 max-w-xs">
        <h3 className="font-semibold mb-2">With rating below</h3>
        <ProductPriceGroup 
          price={79.99}
          originalPrice={119.99}
          rating={4.8}
          reviewCount={567}
          ratingPosition="below"
        />
      </div>
      
      <div className="border rounded-lg p-4 max-w-xs">
        <h3 className="font-semibold mb-2">Without rating</h3>
        <ProductPriceGroup 
          price={79.99}
          originalPrice={119.99}
          showRating={false}
        />
      </div>
    </div>
  ),
};

// Comparison price group
export const ComparisonPriceGroups: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Subscription Plans</h3>
        <ComparisonPriceGroup
          prices={[
            { label: 'Basic', price: 9.99 },
            { label: 'Pro', price: 19.99, originalPrice: 29.99, highlighted: true },
            { label: 'Enterprise', price: 49.99 },
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Size Options (Vertical)</h3>
        <ComparisonPriceGroup
          layout="vertical"
          prices={[
            { label: 'Small', price: 24.99 },
            { label: 'Medium', price: 29.99, highlighted: true },
            { label: 'Large', price: 34.99 },
            { label: 'X-Large', price: 39.99 },
          ]}
        />
      </div>
    </div>
  ),
};

// Real-world examples
export const ProductCard: Story = {
  render: () => (
    <div className="border rounded-lg p-4 max-w-sm">
      <img 
        src="https://via.placeholder.com/300x200" 
        alt="Product" 
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="font-semibold mb-2">Premium Wireless Headphones</h3>
      
      <ProductPriceGroup 
        price={79.99}
        originalPrice={119.99}
        rating={4.5}
        reviewCount={234}
        showSavings
        size="lg"
      />
      
      <button className="w-full mt-4 bg-primary-600 text-white py-2 rounded hover:bg-primary-700">
        Add to Cart
      </button>
    </div>
  ),
};

export const CheckoutSummary: Story = {
  render: () => (
    <div className="border rounded-lg p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-3 pb-4 border-b">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <PriceGroup price={159.97} size="sm" />
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <PriceGroup 
            price={139.97} 
            originalPrice={159.97}
            showBadge={false}
            size="sm"
          />
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <PriceGroup price={9.99} size="sm" />
        </div>
      </div>
      
      <div className="pt-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="font-semibold">Total</span>
          <PriceGroup 
            price={149.96}
            size="lg"
            showInstallments
            installmentCount={4}
            installmentText="installment"
          />
        </div>
      </div>
    </div>
  ),
};

// Different currencies
export const InternationalPricing: Story = {
  render: () => (
    <div className="space-y-4">
      <PriceGroup 
        price={99.99} 
        originalPrice={149.99}
        currency="USD"
        locale="en-US"
      />
      <PriceGroup 
        price={89.99} 
        originalPrice={134.99}
        currency="EUR"
        locale="de-DE"
      />
      <PriceGroup 
        price={79.99} 
        originalPrice={119.99}
        currency="GBP"
        locale="en-GB"
      />
      <PriceGroup 
        price={10999} 
        originalPrice={16499}
        currency="JPY"
        locale="ja-JP"
      />
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Dark Theme Pricing</h3>
          <PriceGroup 
            price={49.99}
            originalPrice={79.99}
            size="xl"
            showSavings
            showInstallments
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <ProductPriceGroup 
            price={29.99}
            originalPrice={49.99}
            rating={4.5}
            reviewCount={123}
          />
          <ProductPriceGroup 
            price={39.99}
            rating={4.8}
            reviewCount={456}
          />
          <ProductPriceGroup 
            price={19.99}
            originalPrice={34.99}
            rating={4.2}
            reviewCount={78}
          />
        </div>
      </div>
    </div>
  ),
};