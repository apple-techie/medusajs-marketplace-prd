import type { Meta, StoryObj } from '@storybook/react';
import { Badge, BadgeIcons } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    removable: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic badges
export const Default: Story = {
  args: {
    children: 'Placeholder',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger',
    variant: 'danger',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    children: 'Placeholder',
    leftIcon: <BadgeIcons.Plus />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Placeholder',
    rightIcon: <BadgeIcons.Plus />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Placeholder',
    leftIcon: <BadgeIcons.Plus />,
    rightIcon: <BadgeIcons.Plus />,
  },
};

// Removable
export const Removable: Story = {
  args: {
    children: 'Removable',
    removable: true,
    onRemove: () => console.log('Remove clicked'),
  },
};

// E-commerce examples
export const ProductStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" leftIcon={<BadgeIcons.Check />}>In Stock</Badge>
      <Badge variant="danger" leftIcon={<BadgeIcons.Alert />}>Out of Stock</Badge>
      <Badge variant="warning" leftIcon={<BadgeIcons.Info />}>Low Stock</Badge>
      <Badge variant="secondary">Pre-order</Badge>
    </div>
  ),
};

export const OrderStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="warning" leftIcon={<BadgeIcons.Dot />}>Pending</Badge>
      <Badge variant="primary" leftIcon={<BadgeIcons.Dot />}>Processing</Badge>
      <Badge variant="secondary" leftIcon={<BadgeIcons.Dot />}>Shipped</Badge>
      <Badge variant="success" leftIcon={<BadgeIcons.Dot />}>Delivered</Badge>
      <Badge variant="danger" leftIcon={<BadgeIcons.Dot />}>Cancelled</Badge>
    </div>
  ),
};

export const UserRoles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Customer</Badge>
      <Badge variant="primary">Shop Partner</Badge>
      <Badge variant="secondary">Brand Partner</Badge>
      <Badge variant="warning">Distributor</Badge>
      <Badge variant="success" leftIcon={<BadgeIcons.Star />}>Gold Tier</Badge>
    </div>
  ),
};

export const ProductCategories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge size="sm" removable onRemove={() => {}}>Electronics</Badge>
      <Badge size="sm" removable onRemove={() => {}}>Home & Garden</Badge>
      <Badge size="sm" removable onRemove={() => {}}>Fashion</Badge>
      <Badge size="sm" removable onRemove={() => {}}>Sports</Badge>
      <Badge size="sm" removable onRemove={() => {}}>Books</Badge>
    </div>
  ),
};

export const NotificationBadges: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <button className="p-2 rounded-lg bg-neutral-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <Badge 
          variant="danger" 
          size="sm" 
          className="absolute -top-1 -right-1"
        >
          3
        </Badge>
      </div>
      
      <div className="relative">
        <button className="p-2 rounded-lg bg-neutral-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        <Badge 
          variant="primary" 
          size="sm" 
          className="absolute -top-1 -right-1"
        >
          12
        </Badge>
      </div>
    </div>
  ),
};

export const PaymentMethods: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" size="sm">Visa</Badge>
      <Badge variant="outline" size="sm">Mastercard</Badge>
      <Badge variant="outline" size="sm">PayPal</Badge>
      <Badge variant="outline" size="sm">Stripe</Badge>
      <Badge variant="outline" size="sm">Apple Pay</Badge>
    </div>
  ),
};

export const PromotionalBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="danger">Sale</Badge>
      <Badge variant="warning">Limited Time</Badge>
      <Badge variant="success">Free Shipping</Badge>
      <Badge variant="primary">New Arrival</Badge>
      <Badge variant="secondary">Bestseller</Badge>
    </div>
  ),
};

export const AgeRestrictions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="danger" size="sm">18+</Badge>
      <Badge variant="danger" size="sm">21+</Badge>
      <Badge variant="warning" size="sm">ID Required</Badge>
    </div>
  ),
};

export const CommissionTiers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">Bronze • 15%</Badge>
      <Badge variant="secondary">Silver • 20%</Badge>
      <Badge variant="warning" leftIcon={<BadgeIcons.Star />}>Gold • 25%</Badge>
    </div>
  ),
};

export const DeliveryStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge size="sm" variant="secondary">Same Day</Badge>
      <Badge size="sm" variant="primary">Express</Badge>
      <Badge size="sm" variant="default">Standard</Badge>
      <Badge size="sm" variant="success" leftIcon={<BadgeIcons.Check />}>Delivered</Badge>
    </div>
  ),
};

// Interactive example
export const InteractiveFilters: Story = {
  render: () => {
    const [filters, setFilters] = React.useState([
      'Electronics',
      'Under $50',
      'Free Shipping',
      '4+ Stars',
    ]);

    const removeFilter = (filter: string) => {
      setFilters(filters.filter(f => f !== filter));
    };

    const addFilter = () => {
      const newFilters = ['Books', 'On Sale', 'Prime', 'New'];
      const randomFilter = newFilters[Math.floor(Math.random() * newFilters.length)];
      if (!filters.includes(randomFilter)) {
        setFilters([...filters, randomFilter]);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Active Filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter}
                size="sm"
                variant="secondary"
                removable
                onRemove={() => removeFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>
        <button
          onClick={addFilter}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Add Random Filter
        </button>
      </div>
    );
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Basic Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">With Icons</h3>
        <div className="flex flex-wrap gap-2">
          <Badge leftIcon={<BadgeIcons.Plus />} rightIcon={<BadgeIcons.Plus />}>
            Placeholder
          </Badge>
          <Badge variant="primary" leftIcon={<BadgeIcons.Check />}>
            Approved
          </Badge>
          <Badge variant="danger" leftIcon={<BadgeIcons.Alert />}>
            Alert
          </Badge>
          <Badge variant="success" rightIcon={<BadgeIcons.Star />}>
            Featured
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Removable</h3>
        <div className="flex flex-wrap gap-2">
          <Badge removable onRemove={() => {}}>Removable Default</Badge>
          <Badge variant="primary" removable onRemove={() => {}}>Removable Primary</Badge>
          <Badge variant="secondary" removable onRemove={() => {}}>Removable Secondary</Badge>
        </div>
      </div>
    </div>
  ),
};