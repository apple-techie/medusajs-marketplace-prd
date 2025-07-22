import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { OrderList, Order } from './OrderList';

const meta = {
  title: 'Organisms/OrderList',
  component: OrderList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Display layout',
    },
    showImages: {
      control: 'boolean',
      description: 'Show product images',
    },
    showShipping: {
      control: 'boolean',
      description: 'Show shipping information',
    },
    imageSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Product image size',
    },
    onViewOrder: {
      action: 'viewOrder',
    },
    onTrackOrder: {
      action: 'trackOrder',
    },
    onReorder: {
      action: 'reorder',
    },
    onCancelOrder: {
      action: 'cancelOrder',
    },
  },
} satisfies Meta<typeof OrderList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock orders
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15T10:30:00Z',
    status: 'delivered',
    total: 299.98,
    currency: 'USD',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-18',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Premium Wireless Headphones',
        image: 'https://source.unsplash.com/400x400/?headphones',
        quantity: 1,
        price: 199.99,
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        name: 'USB-C Charging Cable',
        quantity: 2,
        price: 49.99,
        variant: 'Length: 2m',
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-20T14:45:00Z',
    status: 'shipped',
    total: 89.97,
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-25',
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        name: 'Ergonomic Mouse',
        image: 'https://source.unsplash.com/400x400/?mouse,computer',
        quantity: 1,
        price: 59.99,
      },
      {
        id: 'item-4',
        productId: 'prod-4',
        name: 'Mouse Pad',
        image: 'https://source.unsplash.com/400x400/?mousepad',
        quantity: 1,
        price: 29.98,
        variant: 'Size: Large',
      },
    ],
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-22T09:15:00Z',
    status: 'processing',
    total: 449.95,
    items: [
      {
        id: 'item-5',
        productId: 'prod-5',
        name: 'Mechanical Keyboard',
        image: 'https://source.unsplash.com/400x400/?keyboard,mechanical',
        quantity: 1,
        price: 149.99,
        variant: 'Switch: Blue',
      },
      {
        id: 'item-6',
        productId: 'prod-6',
        name: 'Gaming Monitor',
        image: 'https://source.unsplash.com/400x400/?monitor,gaming',
        quantity: 1,
        price: 299.96,
        variant: 'Size: 27"',
      },
    ],
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-01-23T16:00:00Z',
    status: 'pending',
    total: 79.99,
    items: [
      {
        id: 'item-7',
        productId: 'prod-7',
        name: 'Webcam HD',
        image: 'https://source.unsplash.com/400x400/?webcam',
        quantity: 1,
        price: 79.99,
      },
    ],
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    date: '2024-01-10T11:30:00Z',
    status: 'cancelled',
    total: 129.99,
    items: [
      {
        id: 'item-8',
        productId: 'prod-8',
        name: 'External SSD',
        image: 'https://source.unsplash.com/400x400/?harddrive,ssd',
        quantity: 1,
        price: 129.99,
        variant: 'Capacity: 1TB',
      },
    ],
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    date: '2024-01-05T13:20:00Z',
    status: 'refunded',
    total: 199.98,
    items: [
      {
        id: 'item-9',
        productId: 'prod-9',
        name: 'Smart Speaker',
        image: 'https://source.unsplash.com/400x400/?speaker,smart',
        quantity: 2,
        price: 99.99,
      },
    ],
  },
];

// Default story
export const Default: Story = {
  args: {
    orders: mockOrders.slice(0, 3),
  },
};

// All order statuses
export const AllStatuses: Story = {
  args: {
    orders: mockOrders,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    orders: [],
    loading: true,
    loadingCount: 4,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    orders: [],
    emptyMessage: "You haven't placed any orders yet",
    emptyIcon: 'shopping-bag',
    emptyAction: {
      label: 'Start shopping',
      onClick: () => console.log('Start shopping clicked'),
    },
  },
};

// Compact layout
export const CompactLayout: Story = {
  args: {
    orders: mockOrders.map(order => ({
      ...order,
      items: [
        ...order.items,
        ...order.items,
        ...order.items,
      ],
    })).slice(0, 3),
    layout: 'compact',
  },
};

// Without images
export const NoImages: Story = {
  args: {
    orders: mockOrders.slice(0, 3),
    showImages: false,
  },
};

// Without shipping info
export const NoShipping: Story = {
  args: {
    orders: mockOrders.slice(0, 3),
    showShipping: false,
  },
};

// Different image sizes
export const ImageSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small Images</h3>
        <OrderList
          orders={[mockOrders[0]]}
          imageSize="sm"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium Images (default)</h3>
        <OrderList
          orders={[mockOrders[1]]}
          imageSize="md"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Large Images</h3>
        <OrderList
          orders={[mockOrders[2]]}
          imageSize="lg"
        />
      </div>
    </div>
  ),
};

// With load more
export const WithLoadMore: Story = {
  args: {
    orders: mockOrders.slice(0, 3),
    hasMore: true,
    onLoadMore: () => console.log('Load more clicked'),
    loadMoreLabel: 'Show more orders',
  },
};

// Loading more
export const LoadingMore: Story = {
  args: {
    orders: mockOrders.slice(0, 3),
    hasMore: true,
    loadingMore: true,
    onLoadMore: () => {},
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [orders, setOrders] = useState(mockOrders.slice(0, 3));
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const handleLoadMore = async () => {
      setLoadingMore(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const currentLength = orders.length;
      const remainingOrders = mockOrders.slice(currentLength, currentLength + 2);
      
      if (remainingOrders.length > 0) {
        setOrders([...orders, ...remainingOrders]);
      }
      
      if (currentLength + 2 >= mockOrders.length) {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    };
    
    const handleViewOrder = (orderId: string) => {
      alert(`View order: ${orderId}`);
    };
    
    const handleTrackOrder = (orderId: string) => {
      alert(`Track order: ${orderId}`);
    };
    
    const handleReorder = (orderId: string) => {
      alert(`Reorder items from order: ${orderId}`);
    };
    
    const handleCancelOrder = (orderId: string) => {
      if (confirm('Are you sure you want to cancel this order?')) {
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' as const }
            : order
        ));
      }
    };
    
    const handleRefresh = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOrders(mockOrders.slice(0, 3));
      setHasMore(true);
      setLoading(false);
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Orders ({orders.length})</h2>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 text-sm border rounded hover:bg-neutral-50"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        
        <OrderList
          orders={orders}
          loading={loading}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
          onViewOrder={handleViewOrder}
          onTrackOrder={handleTrackOrder}
          onReorder={handleReorder}
          onCancelOrder={handleCancelOrder}
        />
      </div>
    );
  },
};

// Customer dashboard example
export const CustomerDashboard: Story = {
  render: () => {
    const recentOrders = mockOrders.slice(0, 3);
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">My Account</h1>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded">
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Orders</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded">
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">In Progress</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded">
              <p className="text-3xl font-bold">$2,459</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Spent</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <OrderList
              orders={recentOrders}
              onViewOrder={(id) => console.log('View order:', id)}
              onTrackOrder={(id) => console.log('Track order:', id)}
              onReorder={(id) => console.log('Reorder:', id)}
              onCancelOrder={(id) => console.log('Cancel order:', id)}
              hasMore
              onLoadMore={() => console.log('View all orders')}
              loadMoreLabel="View all orders"
            />
          </div>
        </div>
      </div>
    );
  },
};

// Mobile optimized
export const MobileOptimized: Story = {
  args: {
    orders: mockOrders.slice(0, 2),
    imageSize: 'sm',
    layout: 'compact',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Custom labels
export const CustomLabels: Story = {
  args: {
    orders: mockOrders.slice(0, 2),
    viewLabel: 'Order details',
    trackLabel: 'Track package',
    reorderLabel: 'Order again',
    cancelLabel: 'Cancel order',
    loadMoreLabel: 'Show more',
  },
};

// Limited actions
export const LimitedActions: Story = {
  args: {
    orders: mockOrders.slice(0, 3),
    showTrackButton: false,
    showCancelButton: false,
    onViewOrder: () => {},
    onReorder: () => {},
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    orders: mockOrders.slice(0, 3),
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 min-h-screen">
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