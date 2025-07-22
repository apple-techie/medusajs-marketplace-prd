import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { 
  DiscountBadge, 
  SaleBadge, 
  LimitedTimeBadge, 
  NewBadge, 
  HotBadge 
} from './DiscountBadge';

const meta = {
  title: 'Atoms/DiscountBadge',
  component: DiscountBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'The discount value',
    },
    type: {
      control: 'select',
      options: ['percentage', 'fixed', 'text'],
      description: 'Type of discount display',
    },
    currency: {
      control: 'text',
      description: 'Currency symbol for fixed discounts',
    },
    prefix: {
      control: 'text',
      description: 'Text before the discount value',
    },
    suffix: {
      control: 'text',
      description: 'Text after the discount value',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show icon in badge',
    },
    icon: {
      control: 'text',
      description: 'Icon name to display',
    },
    animate: {
      control: 'boolean',
      description: 'Enable bounce animation',
    },
    pulse: {
      control: 'boolean',
      description: 'Enable pulse animation',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'gradient', 'subtle'],
      description: 'Visual variant of the badge',
    },
    color: {
      control: 'select',
      options: ['red', 'green', 'orange', 'purple', 'primary'],
      description: 'Color scheme of the badge',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size of the badge',
    },
    shape: {
      control: 'select',
      options: ['rounded', 'square', 'pill', 'flag'],
      description: 'Shape variant of the badge',
    },
    position: {
      control: 'select',
      options: ['inline', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Position when used absolutely',
    },
  },
} satisfies Meta<typeof DiscountBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic percentage discount
export const Default: Story = {
  args: {
    value: 25,
    type: 'percentage',
  },
};

// Fixed amount discount
export const FixedDiscount: Story = {
  args: {
    value: 10,
    type: 'fixed',
    currency: '$',
  },
};

// Text badge
export const TextBadge: Story = {
  args: {
    value: 'Special Offer',
    type: 'text',
  },
};

// With icon
export const WithIcon: Story = {
  args: {
    value: 50,
    type: 'percentage',
    showIcon: true,
    icon: 'tag',
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Filled (default)</p>
        <div className="flex gap-2">
          <DiscountBadge value={30} variant="filled" color="red" />
          <DiscountBadge value={30} variant="filled" color="green" />
          <DiscountBadge value={30} variant="filled" color="orange" />
          <DiscountBadge value={30} variant="filled" color="purple" />
          <DiscountBadge value={30} variant="filled" color="primary" />
        </div>
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Outlined</p>
        <div className="flex gap-2">
          <DiscountBadge value={30} variant="outlined" color="red" />
          <DiscountBadge value={30} variant="outlined" color="green" />
          <DiscountBadge value={30} variant="outlined" color="orange" />
          <DiscountBadge value={30} variant="outlined" color="purple" />
          <DiscountBadge value={30} variant="outlined" color="primary" />
        </div>
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Gradient</p>
        <div className="flex gap-2">
          <DiscountBadge value={30} variant="gradient" color="red" />
          <DiscountBadge value={30} variant="gradient" color="green" />
          <DiscountBadge value={30} variant="gradient" color="orange" />
          <DiscountBadge value={30} variant="gradient" color="purple" />
          <DiscountBadge value={30} variant="gradient" color="primary" />
        </div>
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Subtle</p>
        <div className="flex gap-2">
          <DiscountBadge value={30} variant="subtle" color="red" />
          <DiscountBadge value={30} variant="subtle" color="green" />
          <DiscountBadge value={30} variant="subtle" color="orange" />
          <DiscountBadge value={30} variant="subtle" color="purple" />
          <DiscountBadge value={30} variant="subtle" color="primary" />
        </div>
      </div>
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <DiscountBadge value={25} size="xs" />
      <DiscountBadge value={25} size="sm" />
      <DiscountBadge value={25} size="md" />
      <DiscountBadge value={25} size="lg" />
    </div>
  ),
};

// Different shapes
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <DiscountBadge value={25} shape="rounded" />
      <DiscountBadge value={25} shape="square" />
      <DiscountBadge value={25} shape="pill" />
      <DiscountBadge value={25} shape="flag" />
    </div>
  ),
};

// With prefix and suffix
export const WithPrefixSuffix: Story = {
  render: () => (
    <div className="space-y-2">
      <DiscountBadge value={30} prefix="Save" />
      <DiscountBadge value={30} suffix="off" />
      <DiscountBadge value={30} prefix="Get" suffix="discount" />
      <DiscountBadge value={5} type="fixed" prefix="Save" suffix="today" />
    </div>
  ),
};

// Animated badges
export const Animated: Story = {
  render: () => (
    <div className="flex gap-4">
      <DiscountBadge value={50} animate />
      <DiscountBadge value={50} pulse />
      <DiscountBadge value={50} animate pulse />
    </div>
  ),
};

// Sale badge examples
export const SaleBadges: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <p className="text-sm text-neutral-600 mb-1">Percentage discount</p>
        <SaleBadge originalPrice={100} salePrice={75} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Amount saved</p>
        <SaleBadge originalPrice={100} salePrice={60} showAmount currency="$" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Large discount</p>
        <SaleBadge originalPrice={200} salePrice={99} size="lg" variant="gradient" />
      </div>
    </div>
  ),
};

// Limited time badge examples
export const LimitedTimeBadges: Story = {
  render: () => {
    const now = new Date();
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return (
      <div className="space-y-2">
        <div>
          <p className="text-sm text-neutral-600 mb-1">Default (no end time)</p>
          <LimitedTimeBadge />
        </div>
        <div>
          <p className="text-sm text-neutral-600 mb-1">Ending in 2 hours</p>
          <LimitedTimeBadge endTime={in2Hours} />
        </div>
        <div>
          <p className="text-sm text-neutral-600 mb-1">Ending tomorrow</p>
          <LimitedTimeBadge endTime={in24Hours} />
        </div>
        <div>
          <p className="text-sm text-neutral-600 mb-1">Ending in 3 days</p>
          <LimitedTimeBadge endTime={in3Days} />
        </div>
        <div>
          <p className="text-sm text-neutral-600 mb-1">Flash Sale</p>
          <LimitedTimeBadge 
            text="Flash Sale" 
            icon="bolt" 
            color="red" 
            variant="gradient"
            size="lg"
          />
        </div>
      </div>
    );
  },
};

// New and Hot badges
export const SpecialBadges: Story = {
  render: () => (
    <div className="space-y-2">
      <div>
        <p className="text-sm text-neutral-600 mb-1">New arrival</p>
        <NewBadge />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Just arrived</p>
        <NewBadge size="lg">Just Arrived</NewBadge>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Hot item</p>
        <HotBadge />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Trending</p>
        <HotBadge size="lg" variant="gradient">Trending</HotBadge>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Best Seller</p>
        <HotBadge icon="star" color="purple">Best Seller</HotBadge>
      </div>
    </div>
  ),
};

// Product card example
export const ProductCard: Story = {
  render: () => (
    <div className="relative border rounded-lg p-4 w-64">
      <DiscountBadge value={30} position="top-left" />
      <HotBadge position="top-right" size="sm" />
      
      <div className="mt-8">
        <img 
          src="https://via.placeholder.com/200x150" 
          alt="Product" 
          className="w-full h-40 object-cover rounded mb-3"
        />
        <h3 className="font-semibold mb-2">Premium Wireless Headphones</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold">$69.99</span>
          <span className="text-sm text-neutral-500 line-through">$99.99</span>
        </div>
        <div className="flex gap-2">
          <SaleBadge 
            originalPrice={99.99} 
            salePrice={69.99} 
            size="sm" 
            variant="subtle" 
          />
          <LimitedTimeBadge 
            endTime={new Date(Date.now() + 3 * 60 * 60 * 1000)} 
            size="sm"
            variant="subtle"
            color="orange"
          />
        </div>
      </div>
    </div>
  ),
};

// Badge combinations
export const BadgeCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">E-commerce product badges</p>
        <div className="flex gap-2">
          <DiscountBadge value={25} />
          <NewBadge />
          <HotBadge size="sm" />
          <LimitedTimeBadge text="24h Left" size="sm" />
        </div>
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Subtle style badges</p>
        <div className="flex gap-2">
          <DiscountBadge value={15} variant="subtle" />
          <NewBadge variant="subtle" />
          <HotBadge variant="subtle" size="sm" />
          <DiscountBadge value="Free Shipping" type="text" variant="subtle" color="primary" />
        </div>
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Outlined badges</p>
        <div className="flex gap-2">
          <DiscountBadge value={40} variant="outlined" />
          <DiscountBadge value="BOGO" type="text" variant="outlined" color="purple" />
          <DiscountBadge value="Clearance" type="text" variant="outlined" color="orange" />
        </div>
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Large promotional badges</p>
        <div className="flex gap-2">
          <DiscountBadge value={50} size="lg" variant="gradient" animate />
          <DiscountBadge value="MEGA SALE" type="text" size="lg" variant="gradient" color="red" pulse />
          <HotBadge size="lg" variant="gradient" />
        </div>
      </div>
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-neutral-400 mb-2">Dark theme badges</p>
          <div className="flex gap-2">
            <DiscountBadge value={30} />
            <NewBadge />
            <HotBadge />
            <LimitedTimeBadge />
          </div>
        </div>
        
        <div className="relative border border-neutral-700 rounded-lg p-4 w-64">
          <DiscountBadge value={40} position="top-left" variant="gradient" />
          
          <div className="mt-8">
            <div className="w-full h-40 bg-neutral-800 rounded mb-3" />
            <h3 className="font-semibold mb-2">Product Name</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">$59.99</span>
              <span className="text-sm text-neutral-500 line-through">$99.99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};