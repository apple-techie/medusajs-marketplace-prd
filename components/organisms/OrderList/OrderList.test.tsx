import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderList } from './OrderList';

// Mock components
jest.mock('../../atoms/Card/Card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, variant, loading, disabled }: any) => (
    <button 
      onClick={onClick}
      data-variant={variant}
      disabled={disabled}
      data-loading={loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>{icon}</span>
  ),
}));

jest.mock('../../atoms/Price/Price', () => ({
  Price: ({ amount, currency, size, className }: any) => (
    <span data-testid="price" data-size={size} className={className}>
      ${amount.toFixed(2)}
    </span>
  ),
}));

jest.mock('../../atoms/Spinner/Spinner', () => ({
  Spinner: ({ size }: any) => (
    <div data-testid="spinner" data-size={size}>Loading...</div>
  ),
}));

describe('OrderList Component', () => {
  const mockOrders = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered' as const,
      total: 199.99,
      items: [
        {
          id: 'item-1',
          productId: 'prod-1',
          name: 'Product 1',
          image: '/product1.jpg',
          quantity: 2,
          price: 49.99,
        },
        {
          id: 'item-2',
          productId: 'prod-2',
          name: 'Product 2',
          quantity: 1,
          price: 100.01,
        },
      ],
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      date: '2024-01-10',
      status: 'pending' as const,
      total: 79.99,
      items: [
        {
          id: 'item-3',
          productId: 'prod-3',
          name: 'Product 3',
          quantity: 1,
          price: 79.99,
          variant: 'Size: Large',
        },
      ],
    },
  ];

  it('renders all orders', () => {
    render(<OrderList orders={mockOrders} />);
    
    expect(screen.getByText('Order #ORD-001')).toBeInTheDocument();
    expect(screen.getByText('Order #ORD-002')).toBeInTheDocument();
  });

  it('displays order status badges', () => {
    render(<OrderList orders={mockOrders} />);
    
    const badges = screen.getAllByTestId('badge');
    expect(badges[0]).toHaveTextContent('Delivered');
    expect(badges[0]).toHaveAttribute('data-variant', 'success');
    expect(badges[1]).toHaveTextContent('Pending');
    expect(badges[1]).toHaveAttribute('data-variant', 'secondary');
  });

  it('formats dates correctly', () => {
    render(<OrderList orders={mockOrders} />);
    
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument();
  });

  it('displays order totals', () => {
    render(<OrderList orders={mockOrders} />);
    
    const prices = screen.getAllByTestId('price');
    expect(prices[0]).toHaveTextContent('$199.99');
    expect(prices[2]).toHaveTextContent('$79.99'); // Skip item prices
  });

  it('shows order items', () => {
    render(<OrderList orders={mockOrders} />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.getByText('Size: Large')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<OrderList orders={[]} loading loadingCount={2} />);
    
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
    cards.forEach(card => {
      expect(card.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });

  it('shows empty state', () => {
    render(<OrderList orders={[]} />);
    
    expect(screen.getByTestId('icon-package')).toBeInTheDocument();
    expect(screen.getByText('No orders found')).toBeInTheDocument();
  });

  it('shows custom empty state', () => {
    const handleAction = jest.fn();
    render(
      <OrderList 
        orders={[]} 
        emptyMessage="You haven't placed any orders yet"
        emptyIcon="shopping-bag"
        emptyAction={{
          label: 'Start shopping',
          onClick: handleAction,
        }}
      />
    );
    
    expect(screen.getByTestId('icon-shopping-bag')).toBeInTheDocument();
    expect(screen.getByText("You haven't placed any orders yet")).toBeInTheDocument();
    
    const button = screen.getByText('Start shopping');
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalled();
  });

  it('calls onViewOrder when view button clicked', () => {
    const handleView = jest.fn();
    render(<OrderList orders={mockOrders} onViewOrder={handleView} />);
    
    const viewButtons = screen.getAllByText('View details');
    fireEvent.click(viewButtons[0]);
    
    expect(handleView).toHaveBeenCalledWith('1');
  });

  it('shows track button for shipped/delivered orders', () => {
    const handleTrack = jest.fn();
    render(<OrderList orders={mockOrders} onTrackOrder={handleTrack} />);
    
    // Should only show for delivered order
    const trackButtons = screen.getAllByText('Track');
    expect(trackButtons).toHaveLength(1);
    
    fireEvent.click(trackButtons[0]);
    expect(handleTrack).toHaveBeenCalledWith('1');
  });

  it('shows cancel button for pending/processing orders', () => {
    const handleCancel = jest.fn();
    render(<OrderList orders={mockOrders} onCancelOrder={handleCancel} />);
    
    // Should only show for pending order
    const cancelButtons = screen.getAllByText('Cancel');
    expect(cancelButtons).toHaveLength(1);
    
    fireEvent.click(cancelButtons[0]);
    expect(handleCancel).toHaveBeenCalledWith('2');
  });

  it('calls onReorder when reorder button clicked', () => {
    const handleReorder = jest.fn();
    render(<OrderList orders={mockOrders} onReorder={handleReorder} />);
    
    const reorderButtons = screen.getAllByText('Buy again');
    fireEvent.click(reorderButtons[0]);
    
    expect(handleReorder).toHaveBeenCalledWith('1');
  });

  it('shows shipping information', () => {
    const ordersWithShipping = [{
      ...mockOrders[0],
      trackingNumber: 'TRK123456',
      estimatedDelivery: '2024-01-20',
    }];
    
    render(<OrderList orders={ordersWithShipping} />);
    
    expect(screen.getByText('Tracking:')).toBeInTheDocument();
    expect(screen.getByText('TRK123456')).toBeInTheDocument();
    expect(screen.getByText('Est. delivery:')).toBeInTheDocument();
    expect(screen.getByText('Jan 20, 2024')).toBeInTheDocument();
  });

  it('hides shipping info when showShipping is false', () => {
    const ordersWithShipping = [{
      ...mockOrders[0],
      trackingNumber: 'TRK123456',
    }];
    
    render(<OrderList orders={ordersWithShipping} showShipping={false} />);
    
    expect(screen.queryByText('Tracking:')).not.toBeInTheDocument();
  });

  it('shows images when showImages is true', () => {
    render(<OrderList orders={mockOrders} showImages />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // Only items with images
    expect(images[0]).toHaveAttribute('src', '/product1.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Product 1');
  });

  it('hides images when showImages is false', () => {
    render(<OrderList orders={mockOrders} showImages={false} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows compact layout', () => {
    const manyItemsOrder = [{
      ...mockOrders[0],
      items: [
        ...mockOrders[0].items,
        ...mockOrders[0].items,
        ...mockOrders[0].items,
      ],
    }];
    
    render(<OrderList orders={manyItemsOrder} layout="compact" />);
    
    expect(screen.getByText('+3 more items')).toBeInTheDocument();
  });

  it('shows load more button when hasMore', () => {
    const handleLoadMore = jest.fn();
    render(
      <OrderList 
        orders={mockOrders} 
        hasMore
        onLoadMore={handleLoadMore}
      />
    );
    
    const button = screen.getByText('Load more orders');
    fireEvent.click(button);
    
    expect(handleLoadMore).toHaveBeenCalled();
  });

  it('shows loading state for load more', () => {
    render(
      <OrderList 
        orders={mockOrders} 
        hasMore
        onLoadMore={() => {}}
        loadingMore
      />
    );
    
    expect(screen.getByText('Loading...')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('uses custom labels', () => {
    render(
      <OrderList 
        orders={mockOrders}
        onViewOrder={() => {}}
        onTrackOrder={() => {}}
        onReorder={() => {}}
        onCancelOrder={() => {}}
        viewLabel="Order details"
        trackLabel="Track package"
        reorderLabel="Order again"
        cancelLabel="Cancel order"
        loadMoreLabel="Show more"
      />
    );
    
    expect(screen.getByText('Order details')).toBeInTheDocument();
    expect(screen.getByText('Track package')).toBeInTheDocument();
    expect(screen.getByText('Order again')).toBeInTheDocument();
    expect(screen.getByText('Cancel order')).toBeInTheDocument();
  });

  it('hides action buttons when show props are false', () => {
    render(
      <OrderList 
        orders={mockOrders}
        onViewOrder={() => {}}
        onTrackOrder={() => {}}
        onReorder={() => {}}
        onCancelOrder={() => {}}
        showViewButton={false}
        showTrackButton={false}
        showReorderButton={false}
        showCancelButton={false}
      />
    );
    
    expect(screen.queryByText('View details')).not.toBeInTheDocument();
    expect(screen.queryByText('Track')).not.toBeInTheDocument();
    expect(screen.queryByText('Buy again')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('applies custom class names', () => {
    render(
      <OrderList 
        orders={mockOrders}
        className="custom-container"
        orderClassName="custom-order"
      />
    );
    
    const container = screen.getByLabelText('Order list').parentElement;
    expect(container).toHaveClass('custom-container');
    
    const cards = screen.getAllByTestId('card');
    cards.forEach(card => {
      expect(card).toHaveClass('custom-order');
    });
  });

  it('uses custom aria-label', () => {
    render(
      <OrderList 
        orders={mockOrders}
        aria-label="Your order history"
      />
    );
    
    expect(screen.getByLabelText('Your order history')).toBeInTheDocument();
  });

  it('renders different image sizes', () => {
    const { rerender } = render(
      <OrderList orders={mockOrders} imageSize="sm" />
    );
    
    let imageContainer = screen.getAllByRole('img')[0].parentElement;
    expect(imageContainer).toHaveClass('w-12', 'h-12');
    
    rerender(<OrderList orders={mockOrders} imageSize="lg" />);
    imageContainer = screen.getAllByRole('img')[0].parentElement;
    expect(imageContainer).toHaveClass('w-20', 'h-20');
  });

  it('handles all order statuses', () => {
    const ordersWithStatuses = [
      { ...mockOrders[0], status: 'pending' as const },
      { ...mockOrders[0], id: '2', status: 'processing' as const },
      { ...mockOrders[0], id: '3', status: 'shipped' as const },
      { ...mockOrders[0], id: '4', status: 'cancelled' as const },
      { ...mockOrders[0], id: '5', status: 'refunded' as const },
    ];
    
    render(<OrderList orders={ordersWithStatuses} />);
    
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Refunded')).toBeInTheDocument();
  });
});