import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddToCart } from './AddToCart';

// Mock components
jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, variant, size, disabled, className }: any) => (
    <button 
      onClick={onClick} 
      data-variant={variant} 
      data-size={size} 
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size, className }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size} className={className}>
      {children}
    </span>
  ),
}));

jest.mock('../../atoms/Price/Price', () => ({
  Price: ({ amount, currency, size, className }: any) => (
    <span data-testid="price" data-amount={amount} data-currency={currency} data-size={size} className={className}>
      ${amount}
    </span>
  ),
}));

describe('AddToCart Component', () => {
  const defaultProps = {
    productId: '123',
    productName: 'Test Product',
    price: 29.99,
  };

  it('renders with default props', () => {
    render(<AddToCart {...defaultProps} />);
    
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toHaveValue(1);
  });

  it('handles quantity increment and decrement', () => {
    render(<AddToCart {...defaultProps} />);
    
    const incrementButton = screen.getByLabelText('Increase quantity');
    const decrementButton = screen.getByLabelText('Decrease quantity');
    const quantityInput = screen.getByLabelText('Quantity');
    
    expect(quantityInput).toHaveValue(1);
    
    fireEvent.click(incrementButton);
    expect(quantityInput).toHaveValue(2);
    
    fireEvent.click(decrementButton);
    expect(quantityInput).toHaveValue(1);
  });

  it('respects max quantity limit', () => {
    render(<AddToCart {...defaultProps} maxQuantity={3} defaultQuantity={3} />);
    
    const incrementButton = screen.getByLabelText('Increase quantity');
    expect(incrementButton).toBeDisabled();
  });

  it('respects stock count limit', () => {
    render(<AddToCart {...defaultProps} stockCount={2} defaultQuantity={2} />);
    
    const incrementButton = screen.getByLabelText('Increase quantity');
    expect(incrementButton).toBeDisabled();
  });

  it('handles manual quantity input', () => {
    const handleQuantityChange = jest.fn();
    render(
      <AddToCart 
        {...defaultProps} 
        onQuantityChange={handleQuantityChange}
      />
    );
    
    const quantityInput = screen.getByLabelText('Quantity');
    fireEvent.change(quantityInput, { target: { value: '5' } });
    
    expect(handleQuantityChange).toHaveBeenCalledWith(5);
  });

  it('handles add to cart click', async () => {
    const handleAddToCart = jest.fn();
    render(
      <AddToCart 
        {...defaultProps} 
        onAddToCart={handleAddToCart}
      />
    );
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    
    expect(handleAddToCart).toHaveBeenCalledWith(1);
  });

  it('shows loading state during add to cart', async () => {
    const handleAddToCart = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(
      <AddToCart 
        {...defaultProps} 
        onAddToCart={handleAddToCart}
      />
    );
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Added!')).toBeInTheDocument();
    });
  });

  it('shows out of stock state', () => {
    render(<AddToCart {...defaultProps} inStock={false} />);
    
    const addButton = screen.getByText('Add to Cart');
    expect(addButton).toBeDisabled();
  });

  it('shows out of stock message', () => {
    render(
      <AddToCart 
        {...defaultProps} 
        inStock={false}
        showStock
      />
    );
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('shows limited stock warning', () => {
    render(
      <AddToCart 
        {...defaultProps} 
        stockCount={5}
        showStock
      />
    );
    
    expect(screen.getByText('Limited Stock (5)')).toBeInTheDocument();
  });

  it('shows price information in full variant', () => {
    render(
      <AddToCart 
        {...defaultProps}
        originalPrice={39.99}
        variant="full"
        showPrice
        showSavings
      />
    );
    
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
    expect(screen.getByText('Save 25%')).toBeInTheDocument();
    expect(screen.getByText(/You save.*\$10/)).toBeInTheDocument();
  });

  it('renders minimal variant without quantity selector', () => {
    render(<AddToCart {...defaultProps} variant="minimal" />);
    
    expect(screen.queryByLabelText('Quantity')).not.toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('renders compact variant with inline quantity', () => {
    render(<AddToCart {...defaultProps} variant="compact" />);
    
    expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
    expect(screen.getByTestId('icon-shopping-cart')).toBeInTheDocument();
  });

  it('renders full variant with additional info', () => {
    render(<AddToCart {...defaultProps} variant="full" />);
    
    expect(screen.getByText('Free shipping')).toBeInTheDocument();
    expect(screen.getByText('Secure checkout')).toBeInTheDocument();
  });

  it('disables when loading prop is true', () => {
    render(<AddToCart {...defaultProps} loading />);
    
    const addButton = screen.getByText('Adding...');
    expect(addButton).toBeDisabled();
  });

  it('disables when disabled prop is true', () => {
    render(<AddToCart {...defaultProps} disabled />);
    
    const addButton = screen.getByText('Add to Cart');
    expect(addButton).toBeDisabled();
  });

  it('uses custom labels', () => {
    render(
      <AddToCart 
        {...defaultProps}
        addToCartLabel="Buy Now"
        quantityLabel="Qty"
        outOfStockLabel="Sold Out"
        inStock={false}
        showStock
        variant="full"
      />
    );
    
    expect(screen.getByText('Buy Now')).toBeInTheDocument();
    expect(screen.getByText('Qty:')).toBeInTheDocument();
    expect(screen.getByText('Sold Out')).toBeInTheDocument();
  });

  it('handles quantity step', () => {
    render(<AddToCart {...defaultProps} quantityStep={5} defaultQuantity={5} />);
    
    const quantityInput = screen.getByLabelText('Quantity');
    const incrementButton = screen.getByLabelText('Increase quantity');
    const decrementButton = screen.getByLabelText('Decrease quantity');
    
    expect(quantityInput).toHaveValue(5);
    
    fireEvent.click(incrementButton);
    expect(quantityInput).toHaveValue(10);
    
    fireEvent.click(decrementButton);
    expect(quantityInput).toHaveValue(5);
    
    // Can't go below step
    fireEvent.click(decrementButton);
    expect(quantityInput).toHaveValue(5);
  });

  it('hides quantity selector when showQuantity is false', () => {
    render(<AddToCart {...defaultProps} showQuantity={false} />);
    
    expect(screen.queryByLabelText('Quantity')).not.toBeInTheDocument();
  });

  it('applies full width styling', () => {
    render(<AddToCart {...defaultProps} fullWidth />);
    
    const button = screen.getByText('Add to Cart');
    expect(button).toHaveClass('flex-1');
  });

  it('quick add mode works like minimal variant', () => {
    render(<AddToCart {...defaultProps} quickAdd />);
    
    expect(screen.queryByLabelText('Quantity')).not.toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { rerender } = render(<AddToCart {...defaultProps} size="sm" />);
    
    let button = screen.getByText('Add to Cart');
    expect(button).toHaveAttribute('data-size', 'sm');
    
    rerender(<AddToCart {...defaultProps} size="lg" />);
    button = screen.getByText('Add to Cart');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('handles error in add to cart', async () => {
    const handleAddToCart = jest.fn().mockRejectedValue(new Error('Failed'));
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    render(
      <AddToCart 
        {...defaultProps} 
        onAddToCart={handleAddToCart}
      />
    );
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to add to cart:', expect.any(Error));
    });
    
    consoleError.mockRestore();
  });

  it('uses aria-label', () => {
    render(
      <AddToCart 
        {...defaultProps}
        aria-label="Add Test Product to shopping cart"
      />
    );
    
    expect(screen.getByLabelText('Add Test Product to shopping cart')).toBeInTheDocument();
  });
});