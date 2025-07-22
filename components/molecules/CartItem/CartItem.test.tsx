import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartItem } from './CartItem';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Price/Price', () => ({
  Price: ({ amount, currency, className }: any) => (
    <span data-testid="price" className={className}>
      ${amount.toFixed(2)}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

describe('CartItem Component', () => {
  const defaultProps = {
    id: '123',
    name: 'Test Product',
    price: 29.99,
    quantity: 2,
  };

  it('renders with basic props', () => {
    render(<CartItem {...defaultProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getAllByText('$59.98')).toHaveLength(1); // Subtotal
    expect(screen.getByDisplayValue('2')).toBeInTheDocument(); // Quantity
  });

  it('renders with image', () => {
    render(
      <CartItem
        {...defaultProps}
        image={{ src: '/product.jpg', alt: 'Product image' }}
      />
    );
    
    const img = screen.getByAltText('Product image');
    expect(img).toHaveAttribute('src', '/product.jpg');
  });

  it('renders with variant and description', () => {
    render(
      <CartItem
        {...defaultProps}
        variant="Size: Large, Color: Blue"
        description="High-quality product description"
      />
    );
    
    expect(screen.getByText('Size: Large, Color: Blue')).toBeInTheDocument();
    expect(screen.getByText('High-quality product description')).toBeInTheDocument();
  });

  it('shows savings when original price provided', () => {
    render(
      <CartItem
        {...defaultProps}
        originalPrice={39.99}
        showSavings
      />
    );
    
    expect(screen.getByText('$79.98')).toHaveClass('line-through'); // Original subtotal
    expect(screen.getByText('Save 25%')).toBeInTheDocument();
  });

  it('renders vendor information when enabled', () => {
    render(
      <CartItem
        {...defaultProps}
        vendorName="Test Vendor"
        showVendor
      />
    );
    
    expect(screen.getByText('Sold by: Test Vendor')).toBeInTheDocument();
  });

  it('renders SKU when enabled', () => {
    render(
      <CartItem
        {...defaultProps}
        sku="TEST-SKU-123"
        showSku
      />
    );
    
    expect(screen.getByText('SKU: TEST-SKU-123')).toBeInTheDocument();
  });

  it('handles quantity changes', async () => {
    const handleQuantityChange = jest.fn();
    render(
      <CartItem
        {...defaultProps}
        onQuantityChange={handleQuantityChange}
      />
    );
    
    const increaseBtn = screen.getByLabelText('Increase quantity');
    fireEvent.click(increaseBtn);
    
    await waitFor(() => {
      expect(handleQuantityChange).toHaveBeenCalledWith(3);
    });
  });

  it('handles quantity decrease', async () => {
    const handleQuantityChange = jest.fn();
    render(
      <CartItem
        {...defaultProps}
        quantity={3}
        onQuantityChange={handleQuantityChange}
      />
    );
    
    const decreaseBtn = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decreaseBtn);
    
    await waitFor(() => {
      expect(handleQuantityChange).toHaveBeenCalledWith(2);
    });
  });

  it('handles direct quantity input', async () => {
    const handleQuantityChange = jest.fn();
    render(
      <CartItem
        {...defaultProps}
        onQuantityChange={handleQuantityChange}
      />
    );
    
    const input = screen.getByLabelText('Quantity');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(handleQuantityChange).toHaveBeenCalledWith(5);
    });
  });

  it('respects max quantity', () => {
    render(
      <CartItem
        {...defaultProps}
        quantity={5}
        maxQuantity={5}
      />
    );
    
    const increaseBtn = screen.getByLabelText('Increase quantity');
    expect(increaseBtn).toBeDisabled();
  });

  it('respects stock count limit', () => {
    render(
      <CartItem
        {...defaultProps}
        quantity={3}
        stockCount={3}
      />
    );
    
    const increaseBtn = screen.getByLabelText('Increase quantity');
    expect(increaseBtn).toBeDisabled();
  });

  it('disables quantity controls when not editable', () => {
    render(
      <CartItem
        {...defaultProps}
        editable={false}
      />
    );
    
    expect(screen.queryByLabelText('Increase quantity')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Decrease quantity')).not.toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
  });

  it('shows out of stock status', () => {
    render(
      <CartItem
        {...defaultProps}
        inStock={false}
        showStock
      />
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('Out of Stock');
    expect(badge).toHaveAttribute('data-variant', 'destructive');
  });

  it('shows limited stock warning', () => {
    render(
      <CartItem
        {...defaultProps}
        stockCount={3}
        lowStockThreshold={5}
        showStock
      />
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('Limited Stock - 3 left');
    expect(badge).toHaveAttribute('data-variant', 'secondary');
  });

  it('handles remove action', () => {
    const handleRemove = jest.fn();
    render(
      <CartItem
        {...defaultProps}
        onRemove={handleRemove}
      />
    );
    
    const removeBtn = screen.getByLabelText(`Remove ${defaultProps.name}`);
    fireEvent.click(removeBtn);
    
    expect(handleRemove).toHaveBeenCalled();
  });

  it('shows removing state', () => {
    render(
      <CartItem
        {...defaultProps}
        removing
      />
    );
    
    expect(screen.getByTestId('icon-loader-2')).toHaveClass('animate-spin');
  });

  it('disables controls when updating', () => {
    render(
      <CartItem
        {...defaultProps}
        updating
      />
    );
    
    expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
    expect(screen.getByLabelText('Quantity')).toBeDisabled();
  });

  it('renders selectable checkbox', () => {
    const handleSelect = jest.fn();
    render(
      <CartItem
        {...defaultProps}
        selectable
        selected={false}
        onSelect={handleSelect}
      />
    );
    
    const checkbox = screen.getByLabelText(`Select ${defaultProps.name}`);
    fireEvent.click(checkbox);
    
    expect(handleSelect).toHaveBeenCalledWith(true);
  });

  it('handles click when onClick provided', () => {
    const handleClick = jest.fn();
    render(
      <CartItem
        {...defaultProps}
        onClick={handleClick}
      />
    );
    
    const item = screen.getByLabelText(`Cart item: ${defaultProps.name}`);
    fireEvent.click(item);
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders vertical layout', () => {
    render(
      <CartItem
        {...defaultProps}
        layout="vertical"
      />
    );
    
    const item = screen.getByLabelText(`Cart item: ${defaultProps.name}`);
    expect(item).toHaveClass('flex-col');
  });

  it('renders compact layout', () => {
    render(
      <CartItem
        {...defaultProps}
        layout="compact"
        description="Test description"
      />
    );
    
    // Description should not be shown in compact layout
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    // Price and quantity should be inline
    expect(screen.getByText('× 2')).toBeInTheDocument();
  });

  it('respects quantity step', async () => {
    const handleQuantityChange = jest.fn();
    render(
      <CartItem
        {...defaultProps}
        quantity={6}
        quantityStep={6}
        onQuantityChange={handleQuantityChange}
      />
    );
    
    const increaseBtn = screen.getByLabelText('Increase quantity');
    fireEvent.click(increaseBtn);
    
    await waitFor(() => {
      expect(handleQuantityChange).toHaveBeenCalledWith(12);
    });
  });

  it('shows fulfillment time', () => {
    render(
      <CartItem
        {...defaultProps}
        fulfillmentTime="Ships in 2-3 days"
      />
    );
    
    expect(screen.getByText('Ships in 2-3 days')).toBeInTheDocument();
  });

  it('applies custom classes', () => {
    render(
      <CartItem
        {...defaultProps}
        className="custom-class"
        imageClassName="custom-image"
        contentClassName="custom-content"
      />
    );
    
    const item = screen.getByLabelText(`Cart item: ${defaultProps.name}`);
    expect(item).toHaveClass('custom-class');
  });

  it('uses custom labels', () => {
    render(
      <CartItem
        {...defaultProps}
        inStock={false}
        showStock
        outOfStockLabel="Sold Out"
        removeLabel="Delete"
      />
    );
    
    expect(screen.getByText('Sold Out')).toBeInTheDocument();
    expect(screen.getByLabelText(`Delete ${defaultProps.name}`)).toBeInTheDocument();
  });

  it('uses aria-label when provided', () => {
    render(
      <CartItem
        {...defaultProps}
        aria-label="Custom cart item label"
      />
    );
    
    expect(screen.getByLabelText('Custom cart item label')).toBeInTheDocument();
  });

  it('prevents quantity below minimum', async () => {
    const handleQuantityChange = jest.fn();
    render(
      <CartItem
        {...defaultProps}
        quantity={1}
        quantityStep={1}
        onQuantityChange={handleQuantityChange}
      />
    );
    
    const decreaseBtn = screen.getByLabelText('Decrease quantity');
    expect(decreaseBtn).toBeDisabled();
  });

  it('handles non-removable items', () => {
    render(
      <CartItem
        {...defaultProps}
        removable={false}
      />
    );
    
    expect(screen.queryByLabelText(`Remove ${defaultProps.name}`)).not.toBeInTheDocument();
  });
});