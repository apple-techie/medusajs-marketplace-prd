import type { Meta, StoryObj } from '@storybook/react';
import { Icon, icons } from './Icon';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(icons),
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['current', 'primary', 'secondary', 'success', 'warning', 'danger', 'neutral', 'white'],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic icon
export const Default: Story = {
  args: {
    icon: 'search',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="search" size="xs" />
      <Icon icon="search" size="sm" />
      <Icon icon="search" size="md" />
      <Icon icon="search" size="lg" />
      <Icon icon="search" size="xl" />
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="star" color="current" />
      <Icon icon="star" color="primary" />
      <Icon icon="star" color="secondary" />
      <Icon icon="star" color="success" />
      <Icon icon="star" color="warning" />
      <Icon icon="star" color="danger" />
      <Icon icon="star" color="neutral" />
      <div className="bg-neutral-900 p-2 rounded">
        <Icon icon="star" color="white" />
      </div>
    </div>
  ),
};

// Icon categories
export const NavigationIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      <div className="text-center">
        <Icon icon="chevronDown" size="lg" />
        <p className="text-xs mt-1">chevronDown</p>
      </div>
      <div className="text-center">
        <Icon icon="chevronUp" size="lg" />
        <p className="text-xs mt-1">chevronUp</p>
      </div>
      <div className="text-center">
        <Icon icon="chevronLeft" size="lg" />
        <p className="text-xs mt-1">chevronLeft</p>
      </div>
      <div className="text-center">
        <Icon icon="chevronRight" size="lg" />
        <p className="text-xs mt-1">chevronRight</p>
      </div>
      <div className="text-center">
        <Icon icon="arrowDown" size="lg" />
        <p className="text-xs mt-1">arrowDown</p>
      </div>
      <div className="text-center">
        <Icon icon="arrowUp" size="lg" />
        <p className="text-xs mt-1">arrowUp</p>
      </div>
    </div>
  ),
};

export const ActionIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      <div className="text-center">
        <Icon icon="plus" size="lg" />
        <p className="text-xs mt-1">plus</p>
      </div>
      <div className="text-center">
        <Icon icon="minus" size="lg" />
        <p className="text-xs mt-1">minus</p>
      </div>
      <div className="text-center">
        <Icon icon="close" size="lg" />
        <p className="text-xs mt-1">close</p>
      </div>
      <div className="text-center">
        <Icon icon="check" size="lg" />
        <p className="text-xs mt-1">check</p>
      </div>
      <div className="text-center">
        <Icon icon="edit" size="lg" />
        <p className="text-xs mt-1">edit</p>
      </div>
      <div className="text-center">
        <Icon icon="trash" size="lg" />
        <p className="text-xs mt-1">trash</p>
      </div>
    </div>
  ),
};

export const EcommerceIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      <div className="text-center">
        <Icon icon="cart" size="lg" />
        <p className="text-xs mt-1">cart</p>
      </div>
      <div className="text-center">
        <Icon icon="bag" size="lg" />
        <p className="text-xs mt-1">bag</p>
      </div>
      <div className="text-center">
        <Icon icon="tag" size="lg" />
        <p className="text-xs mt-1">tag</p>
      </div>
      <div className="text-center">
        <Icon icon="star" size="lg" />
        <p className="text-xs mt-1">star</p>
      </div>
      <div className="text-center">
        <Icon icon="starFilled" size="lg" />
        <p className="text-xs mt-1">starFilled</p>
      </div>
      <div className="text-center">
        <Icon icon="store" size="lg" />
        <p className="text-xs mt-1">store</p>
      </div>
    </div>
  ),
};

export const CommunicationIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      <div className="text-center">
        <Icon icon="bell" size="lg" />
        <p className="text-xs mt-1">bell</p>
      </div>
      <div className="text-center">
        <Icon icon="message" size="lg" />
        <p className="text-xs mt-1">message</p>
      </div>
      <div className="text-center">
        <Icon icon="mail" size="lg" />
        <p className="text-xs mt-1">mail</p>
      </div>
      <div className="text-center">
        <Icon icon="user" size="lg" />
        <p className="text-xs mt-1">user</p>
      </div>
      <div className="text-center">
        <Icon icon="users" size="lg" />
        <p className="text-xs mt-1">users</p>
      </div>
      <div className="text-center">
        <Icon icon="logout" size="lg" />
        <p className="text-xs mt-1">logout</p>
      </div>
    </div>
  ),
};

export const StatusIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      <div className="text-center">
        <Icon icon="info" size="lg" color="primary" />
        <p className="text-xs mt-1">info</p>
      </div>
      <div className="text-center">
        <Icon icon="alert" size="lg" color="warning" />
        <p className="text-xs mt-1">alert</p>
      </div>
      <div className="text-center">
        <Icon icon="check" size="lg" color="success" />
        <p className="text-xs mt-1">check</p>
      </div>
      <div className="text-center">
        <Icon icon="close" size="lg" color="danger" />
        <p className="text-xs mt-1">close</p>
      </div>
      <div className="text-center">
        <Icon icon="clock" size="lg" />
        <p className="text-xs mt-1">clock</p>
      </div>
      <div className="text-center">
        <Icon icon="calendar" size="lg" />
        <p className="text-xs mt-1">calendar</p>
      </div>
    </div>
  ),
};

// Usage examples
export const InButton: Story = {
  render: () => (
    <div className="flex gap-2">
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
        <Icon icon="plus" size="sm" />
        Add Item
      </button>
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200">
        <Icon icon="edit" size="sm" />
        Edit
      </button>
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600">
        <Icon icon="trash" size="sm" />
        Delete
      </button>
    </div>
  ),
};

export const NotificationBadge: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="relative">
        <Icon icon="bell" size="lg" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-danger-500 rounded-full" />
      </div>
      <div className="relative">
        <Icon icon="cart" size="lg" />
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full">
          3
        </span>
      </div>
    </div>
  ),
};

export const NavigationMenu: Story = {
  render: () => (
    <nav className="flex items-center gap-6 p-4 bg-neutral-50 rounded-lg">
      <a href="#" className="flex items-center gap-2 text-neutral-700 hover:text-primary-600">
        <Icon icon="home" size="md" />
        <span>Home</span>
      </a>
      <a href="#" className="flex items-center gap-2 text-neutral-700 hover:text-primary-600">
        <Icon icon="bag" size="md" />
        <span>Products</span>
      </a>
      <a href="#" className="flex items-center gap-2 text-neutral-700 hover:text-primary-600">
        <Icon icon="cart" size="md" />
        <span>Cart</span>
      </a>
      <a href="#" className="flex items-center gap-2 text-neutral-700 hover:text-primary-600">
        <Icon icon="user" size="md" />
        <span>Account</span>
      </a>
    </nav>
  ),
};

export const StatusList: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-success-50 text-success-900 rounded-lg">
        <Icon icon="check" color="success" />
        <span>Order delivered successfully</span>
      </div>
      <div className="flex items-center gap-2 p-3 bg-warning-50 text-warning-900 rounded-lg">
        <Icon icon="alert" color="warning" />
        <span>Low stock warning</span>
      </div>
      <div className="flex items-center gap-2 p-3 bg-danger-50 text-danger-900 rounded-lg">
        <Icon icon="close" color="danger" />
        <span>Payment failed</span>
      </div>
      <div className="flex items-center gap-2 p-3 bg-primary-50 text-primary-900 rounded-lg">
        <Icon icon="info" color="primary" />
        <span>New features available</span>
      </div>
    </div>
  ),
};

export const RatingStars: Story = {
  render: () => {
    const rating = 4;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            icon={star <= rating ? 'starFilled' : 'star'}
            size="md"
            color={star <= rating ? 'warning' : 'secondary'}
          />
        ))}
        <span className="ml-2 text-sm text-neutral-600">(4.0)</span>
      </div>
    );
  },
};

export const FileList: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded">
        <Icon icon="folder" size="md" color="secondary" />
        <span>Documents</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded">
        <Icon icon="file" size="md" color="secondary" />
        <span>invoice.pdf</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded">
        <Icon icon="image" size="md" color="secondary" />
        <span>product-photo.jpg</span>
      </div>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg disabled:opacity-50" disabled>
        <Icon icon="activity" size="sm" className="animate-pulse" />
        Processing...
      </button>
      <div className="animate-spin">
        <Icon icon="settings" size="lg" />
      </div>
    </div>
  ),
};

// All icons showcase
export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-4 p-4">
      {Object.keys(icons).map((iconName) => (
        <div key={iconName} className="text-center">
          <div className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100">
            <Icon icon={iconName as keyof typeof icons} size="lg" />
          </div>
          <p className="text-xs mt-1 text-neutral-600">{iconName}</p>
        </div>
      ))}
    </div>
  ),
};