import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';
import { Icon } from '../Icon/Icon';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy', 'away'],
    },
    showStatus: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic avatars
export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    alt: 'John Doe',
  },
};

export const WithInitials: Story = {
  args: {
    initials: 'JD',
  },
};

export const WithGeneratedInitials: Story = {
  args: {
    alt: 'Jane Smith',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Icon icon="user" size="sm" />,
  },
};

export const WithFallback: Story = {
  args: {
    src: '/invalid-image.jpg',
    alt: 'User Name',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" initials="XS" />
      <Avatar size="sm" initials="SM" />
      <Avatar size="md" initials="MD" />
      <Avatar size="lg" initials="LG" />
      <Avatar size="xl" initials="XL" />
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar variant="primary" initials="P" />
      <Avatar variant="secondary" initials="S" />
      <Avatar variant="success" initials="S" />
      <Avatar variant="warning" initials="W" />
      <Avatar variant="danger" initials="D" />
      <Avatar variant="neutral" initials="N" />
    </div>
  ),
};

// Status indicators
export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar initials="ON" showStatus status="online" />
      <Avatar initials="OF" showStatus status="offline" />
      <Avatar initials="BU" showStatus status="busy" />
      <Avatar initials="AW" showStatus status="away" />
    </div>
  ),
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
  },
};

// Avatar groups
export const BasicGroup: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" alt="User 1" />
      <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" alt="User 2" />
      <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" alt="User 3" />
    </AvatarGroup>
  ),
};

export const GroupWithMax: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar initials="A" variant="primary" />
      <Avatar initials="B" variant="secondary" />
      <Avatar initials="C" variant="success" />
      <Avatar initials="D" variant="warning" />
      <Avatar initials="E" variant="danger" />
    </AvatarGroup>
  ),
};

export const GroupSpacing: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Tight spacing</p>
        <AvatarGroup spacing="tight">
          <Avatar initials="A" />
          <Avatar initials="B" />
          <Avatar initials="C" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Normal spacing</p>
        <AvatarGroup spacing="normal">
          <Avatar initials="A" />
          <Avatar initials="B" />
          <Avatar initials="C" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Loose spacing</p>
        <AvatarGroup spacing="loose">
          <Avatar initials="A" />
          <Avatar initials="B" />
          <Avatar initials="C" />
        </AvatarGroup>
      </div>
    </div>
  ),
};

// E-commerce examples
export const UserProfile: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
        alt="John Doe"
        size="lg"
        showStatus
        status="online"
      />
      <div>
        <h3 className="font-medium">John Doe</h3>
        <p className="text-sm text-neutral-600">Premium Member</p>
      </div>
    </div>
  ),
};

export const VendorList: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg">
        <Avatar
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
          alt="Shop Partner"
          showStatus
          status="online"
        />
        <div className="flex-1">
          <h4 className="font-medium">Tech Store</h4>
          <p className="text-sm text-neutral-600">Shop Partner • Gold Tier</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg">
        <Avatar
          variant="primary"
          initials="FS"
          showStatus
          status="away"
        />
        <div className="flex-1">
          <h4 className="font-medium">Fashion Store</h4>
          <p className="text-sm text-neutral-600">Brand Partner</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg">
        <Avatar
          variant="secondary"
          initials="DS"
          showStatus
          status="offline"
        />
        <div className="flex-1">
          <h4 className="font-medium">Distribution Center</h4>
          <p className="text-sm text-neutral-600">Distributor Partner</p>
        </div>
      </div>
    </div>
  ),
};

export const CustomerReviews: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
          alt="Sarah Johnson"
          size="sm"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">Sarah Johnson</span>
            <span className="text-xs text-neutral-500">2 days ago</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                icon="starFilled"
                size="xs"
                color="warning"
              />
            ))}
          </div>
          <p className="text-sm text-neutral-700">
            Excellent product! Fast shipping and great quality.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Avatar
          initials="MR"
          variant="primary"
          size="sm"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">Mike Ross</span>
            <span className="text-xs text-neutral-500">1 week ago</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4].map((star) => (
              <Icon
                key={star}
                icon="starFilled"
                size="xs"
                color="warning"
              />
            ))}
            <Icon icon="star" size="xs" color="secondary" />
          </div>
          <p className="text-sm text-neutral-700">
            Good value for money. Would recommend.
          </p>
        </div>
      </div>
    </div>
  ),
};

export const TeamMembers: Story = {
  render: () => (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="font-medium mb-3">Team Members</h3>
      <AvatarGroup max={5}>
        <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" alt="John Doe" />
        <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" alt="Jane Smith" />
        <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" alt="Sarah Johnson" />
        <Avatar initials="MR" variant="primary" />
        <Avatar initials="AS" variant="secondary" />
        <Avatar initials="KL" variant="success" />
        <Avatar initials="TB" variant="warning" />
      </AvatarGroup>
    </div>
  ),
};

export const ChatList: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg cursor-pointer">
        <Avatar
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
          alt="Customer Support"
          showStatus
          status="online"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Customer Support</h4>
            <span className="text-xs text-neutral-500">2m ago</span>
          </div>
          <p className="text-sm text-neutral-600 truncate">
            How can I help you today?
          </p>
        </div>
        <span className="h-2 w-2 bg-primary-500 rounded-full" />
      </div>
      <div className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg cursor-pointer">
        <Avatar
          initials="DS"
          variant="secondary"
          showStatus
          status="away"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Delivery Support</h4>
            <span className="text-xs text-neutral-500">1h ago</span>
          </div>
          <p className="text-sm text-neutral-600 truncate">
            Your order has been shipped
          </p>
        </div>
      </div>
    </div>
  ),
};

export const ProductCards: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <div className="aspect-square bg-neutral-100 rounded-lg mb-3" />
        <h3 className="font-medium mb-2">Product Name</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">$29.99</span>
          <div className="flex items-center gap-2">
            <AvatarGroup size="xs" max={2}>
              <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" alt="Buyer 1" />
              <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" alt="Buyer 2" />
              <Avatar initials="+" />
            </AvatarGroup>
            <span className="text-xs text-neutral-600">23 sold</span>
          </div>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="aspect-square bg-neutral-100 rounded-lg mb-3" />
        <h3 className="font-medium mb-2">Another Product</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">$49.99</span>
          <div className="flex items-center gap-2">
            <Avatar size="xs" initials="JS" variant="primary" />
            <span className="text-xs text-neutral-600">New seller</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Different avatar types
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Image Avatars</h3>
        <div className="flex items-center gap-3">
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
            alt="User 1"
          />
          <Avatar
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
            alt="User 2"
          />
          <Avatar
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
            alt="User 3"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Initial Avatars</h3>
        <div className="flex items-center gap-3">
          <Avatar initials="AB" variant="primary" />
          <Avatar initials="CD" variant="secondary" />
          <Avatar initials="EF" variant="success" />
          <Avatar initials="GH" variant="warning" />
          <Avatar initials="IJ" variant="danger" />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Icon Avatars</h3>
        <div className="flex items-center gap-3">
          <Avatar icon={<Icon icon="user" size="sm" />} variant="primary" />
          <Avatar icon={<Icon icon="store" size="sm" />} variant="secondary" />
          <Avatar icon={<Icon icon="settings" size="sm" />} variant="neutral" />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">With Status</h3>
        <div className="flex items-center gap-3">
          <Avatar initials="ON" showStatus status="online" />
          <Avatar initials="BU" showStatus status="busy" />
          <Avatar initials="AW" showStatus status="away" />
          <Avatar initials="OF" showStatus status="offline" />
        </div>
      </div>
    </div>
  ),
};