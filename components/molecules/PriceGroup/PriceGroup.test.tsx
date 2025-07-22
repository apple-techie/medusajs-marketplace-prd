import React from 'react';
import { render, screen } from '@testing-library/react';
import { PriceGroup, ProductPriceGroup, ComparisonPriceGroup } from './PriceGroup';

// Mock the atom components
jest.mock('../../atoms/Price/Price', () => ({
  Price: ({ amount, originalAmount, size, className, originalClassName, showOriginal }: any) => (
    <div data-testid="price" className={className}>
      {showOriginal && originalAmount && (
        <span data-testid="original-price" className={originalClassName}>
          ${originalAmount}
        </span>
      )}
      <span data-testid="current-price">${amount}</span>
    </div>
  ),
  PriceRange: ({ minAmount, maxAmount }: any) => (
    <div data-testid="price-range">
      ${minAmount} - ${maxAmount}
    </div>
  ),
}));

jest.mock('../../atoms/DiscountBadge/DiscountBadge', () => ({
  DiscountBadge: ({ value, type, className }: any) => (
    <span data-testid="discount-badge" className={className}>
      {type === 'text' ? value : `-${value}%`}
    </span>
  ),
  SaleBadge: ({ originalPrice, salePrice, showAmount }: any) => {
    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    const savings = originalPrice - salePrice;
    return (
      <span data-testid="sale-badge">
        {showAmount ? `Save $${savings}` : `-${discount}%`}
      </span>
    );
  },
}));

describe('PriceGroup Component', () => {
  it('renders basic price', () => {
    render(<PriceGroup price={29.99} />);
    
    expect(screen.getByTestId('current-price')).toHaveTextContent('$29.99');
  });

  it('renders price with original price', () => {
    render(<PriceGroup price={19.99} originalPrice={29.99} />);
    
    expect(screen.getByTestId('current-price')).toHaveTextContent('$19.99');
    expect(screen.getByTestId('original-price')).toHaveTextContent('$29.99');
  });

  it('shows discount badge when there is a discount', () => {
    render(<PriceGroup price={20} originalPrice={40} showBadge />);
    
    expect(screen.getByTestId('sale-badge')).toHaveTextContent('-50%');
  });

  it('does not show badge when showBadge is false', () => {
    render(<PriceGroup price={20} originalPrice={40} showBadge={false} />);
    
    expect(screen.queryByTestId('sale-badge')).not.toBeInTheDocument();
  });

  it('shows custom badge text', () => {
    render(
      <PriceGroup 
        price={20} 
        originalPrice={40} 
        customBadgeText="Special Offer" 
      />
    );
    
    expect(screen.getByTestId('discount-badge')).toHaveTextContent('Special Offer');
  });

  it('shows savings information', () => {
    render(
      <PriceGroup 
        price={30} 
        originalPrice={50} 
        showSavings 
        savingsText="You save"
      />
    );
    
    expect(screen.getByText(/You save/)).toBeInTheDocument();
  });

  it('shows installment information', () => {
    render(
      <PriceGroup 
        price={120} 
        showInstallments 
        installmentCount={12}
        installmentText="mo"
      />
    );
    
    expect(screen.getByText(/or/)).toBeInTheDocument();
    expect(screen.getByText(/\/mo/)).toBeInTheDocument();
  });

  it('renders price range', () => {
    render(
      <PriceGroup 
        price={0}
        priceRange={{ min: 10, max: 50 }}
      />
    );
    
    expect(screen.getByTestId('price-range')).toHaveTextContent('$10 - $50');
  });

  it('applies different layouts', () => {
    const { rerender } = render(<PriceGroup price={29.99} layout="horizontal" />);
    let container = screen.getByTestId('price').parentElement;
    expect(container).toHaveClass('flex', 'flex-wrap');

    rerender(<PriceGroup price={29.99} layout="vertical" />);
    container = screen.getByTestId('price').parentElement?.parentElement;
    expect(container).toHaveClass('inline-flex', 'flex-col');

    rerender(<PriceGroup price={29.99} layout="compact" />);
    container = screen.getByTestId('price').parentElement;
    expect(container).toHaveClass('inline-flex');
  });

  it('applies different badge positions', () => {
    const { rerender } = render(
      <PriceGroup price={20} originalPrice={40} badgePosition="inline" />
    );
    let badge = screen.getByTestId('sale-badge');
    let priceContainer = screen.getByTestId('price').parentElement;
    expect(priceContainer).toContainElement(badge);

    rerender(
      <PriceGroup price={20} originalPrice={40} badgePosition="top" />
    );
    badge = screen.getByTestId('sale-badge');
    expect(badge.parentElement).toHaveClass('mb-1');

    rerender(
      <PriceGroup price={20} originalPrice={40} badgePosition="bottom" />
    );
    // Badge should be in additional content section
    expect(screen.getByTestId('sale-badge')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { rerender } = render(<PriceGroup price={29.99} size="sm" />);
    expect(screen.getByTestId('price')).toBeInTheDocument();

    rerender(<PriceGroup price={29.99} size="xl" />);
    expect(screen.getByTestId('price')).toBeInTheDocument();
  });

  it('applies alignment', () => {
    const { rerender } = render(<PriceGroup price={29.99} align="center" />);
    const container = screen.getByTestId('price').parentElement?.parentElement;
    expect(container).toHaveClass('justify-center');

    rerender(<PriceGroup price={29.99} align="right" />);
    const rightContainer = screen.getByTestId('price').parentElement?.parentElement;
    expect(rightContainer).toHaveClass('justify-end');
  });

  it('renders prefix and suffix', () => {
    render(
      <PriceGroup 
        price={29.99} 
        prefix={<span>From</span>}
        suffix={<span>/month</span>}
      />
    );
    
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    render(
      <PriceGroup 
        price={29.99}
        className="custom-group"
        priceClassName="custom-price"
        badgeClassName="custom-badge"
        originalPrice={39.99}
      />
    );
    
    expect(screen.getByTestId('price').parentElement?.parentElement).toHaveClass('custom-group');
    expect(screen.getByTestId('price')).toHaveClass('custom-price');
  });

  it('uses custom aria-label', () => {
    render(<PriceGroup price={29.99} aria-label="Product price" />);
    
    const container = screen.getByTestId('price').parentElement?.parentElement;
    expect(container).toHaveAttribute('aria-label', 'Product price');
  });
});

describe('ProductPriceGroup Component', () => {
  it('renders with rating above price', () => {
    render(
      <ProductPriceGroup 
        price={29.99}
        rating={4.5}
        reviewCount={120}
        showRating
        ratingPosition="above"
      />
    );
    
    expect(screen.getByText('★ 4.5')).toBeInTheDocument();
    expect(screen.getByText('(120)')).toBeInTheDocument();
  });

  it('renders with rating below price', () => {
    render(
      <ProductPriceGroup 
        price={29.99}
        rating={4.5}
        reviewCount={120}
        showRating
        ratingPosition="below"
      />
    );
    
    expect(screen.getByText('★ 4.5')).toBeInTheDocument();
    expect(screen.getByText('(120)')).toBeInTheDocument();
  });

  it('hides rating when showRating is false', () => {
    render(
      <ProductPriceGroup 
        price={29.99}
        rating={4.5}
        showRating={false}
      />
    );
    
    expect(screen.queryByText('★ 4.5')).not.toBeInTheDocument();
  });

  it('renders without review count', () => {
    render(
      <ProductPriceGroup 
        price={29.99}
        rating={4.5}
        showRating
      />
    );
    
    expect(screen.getByText('★ 4.5')).toBeInTheDocument();
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('uses vertical layout by default', () => {
    render(<ProductPriceGroup price={29.99} />);
    
    const container = screen.getByTestId('price').parentElement?.parentElement;
    expect(container).toHaveClass('inline-flex', 'flex-col');
  });
});

describe('ComparisonPriceGroup Component', () => {
  const mockPrices = [
    { label: 'Basic', price: 9.99 },
    { label: 'Pro', price: 19.99, originalPrice: 29.99, highlighted: true },
    { label: 'Enterprise', price: 49.99 },
  ];

  it('renders multiple price options', () => {
    render(<ComparisonPriceGroup prices={mockPrices} />);
    
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('highlights selected option', () => {
    render(<ComparisonPriceGroup prices={mockPrices} />);
    
    const proContainer = screen.getByText('Pro').parentElement;
    expect(proContainer).toHaveClass('ring-2', 'ring-primary-500');
  });

  it('applies horizontal layout', () => {
    render(<ComparisonPriceGroup prices={mockPrices} layout="horizontal" />);
    
    const container = screen.getByText('Basic').parentElement?.parentElement;
    expect(container).toHaveClass('flex', 'gap-6');
  });

  it('applies vertical layout', () => {
    render(<ComparisonPriceGroup prices={mockPrices} layout="vertical" />);
    
    const container = screen.getByText('Basic').parentElement?.parentElement;
    expect(container).toHaveClass('space-y-3');
  });

  it('renders with discount prices', () => {
    render(<ComparisonPriceGroup prices={mockPrices} />);
    
    // Pro option has original price
    const proSection = screen.getByText('Pro').parentElement;
    expect(proSection).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ComparisonPriceGroup prices={mockPrices} className="custom-comparison" />);
    
    const container = screen.getByText('Basic').parentElement?.parentElement;
    expect(container).toHaveClass('custom-comparison');
  });
});