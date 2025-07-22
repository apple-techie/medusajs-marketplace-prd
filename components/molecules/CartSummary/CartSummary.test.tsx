import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartSummary } from './CartSummary';

// Mock components
jest.mock('../../atoms/Price/Price', () => ({
  Price: ({ amount, currency, className, prefix, size }: any) => (
    <span data-testid="price" className={className} data-size={size}>
      {prefix}${amount.toFixed(2)}
    </span>
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
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

describe('CartSummary Component', () => {
  const defaultProps = {
    subtotal: 100,
    total: 110,
  };

  it('renders with basic props', () => {
    render(<CartSummary {...defaultProps} />);
    
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText('$100.00')).toHaveLength(1);
    expect(screen.getAllByText('$110.00')).toHaveLength(1);
  });

  it('renders with shipping info', () => {
    render(
      <CartSummary
        {...defaultProps}
        shipping={{
          amount: 10,
          method: 'Standard Delivery',
          estimatedDays: '3-5 business days',
        }}
      />
    );
    
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('Standard Delivery')).toBeInTheDocument();
  });

  it('renders free shipping', () => {
    render(
      <CartSummary
        {...defaultProps}
        shipping={{
          amount: 0,
          isFree: true,
          method: 'Free Shipping',
        }}
      />
    );
    
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('-$0.00')).toBeInTheDocument();
  });

  it('shows free shipping threshold', () => {
    render(
      <CartSummary
        subtotal={75}
        total={85}
        shipping={{
          amount: 10,
          isFree: false,
          freeThreshold: 100,
        }}
      />
    );
    
    expect(screen.getByText(/Add.*\$25.00.*more for free shipping/)).toBeInTheDocument();
  });

  it('renders with discount', () => {
    render(
      <CartSummary
        {...defaultProps}
        discount={{
          amount: 20,
          code: 'SAVE20',
          description: '20% off your order',
        }}
      />
    );
    
    expect(screen.getByText('Discount (SAVE20)')).toBeInTheDocument();
    expect(screen.getByText('-$20.00')).toBeInTheDocument();
    expect(screen.getByText('20% off your order')).toBeInTheDocument();
  });

  it('renders with tax', () => {
    render(
      <CartSummary
        {...defaultProps}
        tax={{
          amount: 10,
          rate: 10,
        }}
      />
    );
    
    expect(screen.getByText('Tax (10%)')).toBeInTheDocument();
    expect(screen.getByText('+$10.00')).toBeInTheDocument();
  });

  it('renders tax breakdown in detailed variant', () => {
    render(
      <CartSummary
        {...defaultProps}
        variant="detailed"
        tax={{
          amount: 10,
          breakdown: [
            { label: 'State Tax', amount: 6 },
            { label: 'Local Tax', amount: 4 },
          ],
        }}
      />
    );
    
    expect(screen.getByText('State Tax')).toBeInTheDocument();
    expect(screen.getByText('$6.00')).toBeInTheDocument();
    expect(screen.getByText('Local Tax')).toBeInTheDocument();
    expect(screen.getByText('$4.00')).toBeInTheDocument();
  });

  it('shows tax inclusive message', () => {
    render(
      <CartSummary
        {...defaultProps}
        tax={{
          amount: 10,
          inclusive: true,
        }}
      />
    );
    
    expect(screen.getByText('(includes tax)')).toBeInTheDocument();
  });

  it('renders custom line items', () => {
    render(
      <CartSummary
        {...defaultProps}
        items={[
          {
            label: 'Gift Wrapping',
            value: 5,
            icon: 'gift',
            description: 'Premium gift wrap',
          },
          {
            label: 'Express Processing',
            value: 15,
            type: 'fee',
          },
        ]}
      />
    );
    
    expect(screen.getByText('Gift Wrapping')).toBeInTheDocument();
    expect(screen.getByText('Premium gift wrap')).toBeInTheDocument();
    expect(screen.getByText('Express Processing')).toBeInTheDocument();
  });

  it('shows savings when original total provided', () => {
    render(
      <CartSummary
        subtotal={100}
        total={80}
        originalTotal={100}
        showSavings
      />
    );
    
    expect(screen.getByText('You save 20%')).toBeInTheDocument();
  });

  it('renders loyalty points', () => {
    render(
      <CartSummary
        {...defaultProps}
        loyaltyPoints={{
          earned: 110,
          used: 50,
          balance: 500,
        }}
      />
    );
    
    expect(screen.getByText('Points earned')).toBeInTheDocument();
    expect(screen.getByText('+110')).toBeInTheDocument();
    expect(screen.getByText('Points used')).toBeInTheDocument();
    expect(screen.getByText('-50')).toBeInTheDocument();
  });

  it('renders promo code input', () => {
    render(
      <CartSummary
        {...defaultProps}
        showPromoCode
        onApplyPromo={jest.fn()}
      />
    );
    
    expect(screen.getByPlaceholderText('Enter promo code')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('handles promo code submission', async () => {
    const handleApplyPromo = jest.fn();
    render(
      <CartSummary
        {...defaultProps}
        showPromoCode
        onApplyPromo={handleApplyPromo}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter promo code');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: 'TESTCODE' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(handleApplyPromo).toHaveBeenCalledWith('TESTCODE');
    });
  });

  it('handles promo code submission on Enter key', async () => {
    const handleApplyPromo = jest.fn();
    render(
      <CartSummary
        {...defaultProps}
        showPromoCode
        onApplyPromo={handleApplyPromo}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter promo code');
    
    fireEvent.change(input, { target: { value: 'ENTERCODE' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    
    await waitFor(() => {
      expect(handleApplyPromo).toHaveBeenCalledWith('ENTERCODE');
    });
  });

  it('clears promo code after submission', async () => {
    const handleApplyPromo = jest.fn().mockResolvedValue(undefined);
    render(
      <CartSummary
        {...defaultProps}
        showPromoCode
        onApplyPromo={handleApplyPromo}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter promo code');
    fireEvent.change(input, { target: { value: 'CLEARME' } });
    fireEvent.click(screen.getByText('Apply'));
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('renders checkout button', () => {
    const handleCheckout = jest.fn();
    render(
      <CartSummary
        {...defaultProps}
        checkoutButton={{
          label: 'Complete Order',
          onClick: handleCheckout,
        }}
      />
    );
    
    const button = screen.getByText('Complete Order');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleCheckout).toHaveBeenCalled();
  });

  it('shows checkout loading state', () => {
    render(
      <CartSummary
        {...defaultProps}
        checkoutButton={{
          loading: true,
        }}
      />
    );
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByTestId('icon-loader-2')).toHaveClass('animate-spin');
  });

  it('disables checkout button when specified', () => {
    render(
      <CartSummary
        {...defaultProps}
        checkoutButton={{
          disabled: true,
        }}
      />
    );
    
    const button = screen.getByText('Proceed to Checkout');
    expect(button).toBeDisabled();
  });

  it('renders continue shopping link', () => {
    render(
      <CartSummary
        {...defaultProps}
        continueShoppingUrl="/shop"
      />
    );
    
    const link = screen.getByText('Continue Shopping');
    expect(link).toHaveAttribute('href', '/shop');
  });

  it('handles collapsible behavior', () => {
    render(
      <CartSummary
        {...defaultProps}
        collapsible
        defaultExpanded={true}
      />
    );
    
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    
    const header = screen.getByText('Order Summary');
    fireEvent.click(header.parentElement!);
    
    expect(screen.queryByText('Subtotal')).not.toBeInTheDocument();
  });

  it('renders minimal variant', () => {
    render(
      <CartSummary
        {...defaultProps}
        variant="minimal"
        shipping={{ amount: 10 }}
        tax={{ amount: 5 }}
      />
    );
    
    expect(screen.queryByText('Order Summary')).not.toBeInTheDocument();
    expect(screen.queryByText('Subtotal')).not.toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<CartSummary {...defaultProps} loading />);
    
    expect(screen.getByText('', { selector: '.animate-pulse' })).toBeInTheDocument();
    expect(screen.queryByText('Order Summary')).not.toBeInTheDocument();
  });

  it('uses custom labels', () => {
    render(
      <CartSummary
        {...defaultProps}
        subtotalLabel="Items Total"
        totalLabel="Order Total"
        taxLabel="Sales Tax"
        shippingLabel="Delivery"
        tax={{ amount: 10 }}
        shipping={{ amount: 5 }}
      />
    );
    
    expect(screen.getByText('Items Total')).toBeInTheDocument();
    expect(screen.getByText('Order Total')).toBeInTheDocument();
    expect(screen.getByText('Sales Tax')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
  });

  it('uses custom savingsLabel', () => {
    render(
      <CartSummary
        subtotal={100}
        total={80}
        originalTotal={100}
        showSavings
        savingsLabel="Total savings"
      />
    );
    
    expect(screen.getByText('Total savings 20%')).toBeInTheDocument();
  });

  it('applies custom classes', () => {
    render(
      <CartSummary
        {...defaultProps}
        className="custom-class"
        headerClassName="custom-header"
        itemsClassName="custom-items"
        totalClassName="custom-total"
      />
    );
    
    const container = screen.getByLabelText('Order summary');
    expect(container).toHaveClass('custom-class');
  });

  it('uses aria-label when provided', () => {
    render(
      <CartSummary
        {...defaultProps}
        aria-label="Shopping cart summary"
      />
    );
    
    expect(screen.getByLabelText('Shopping cart summary')).toBeInTheDocument();
  });
});