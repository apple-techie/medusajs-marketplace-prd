import React from 'react';
import { render, screen } from '@testing-library/react';
import { Price, PriceRange, usePriceCalculations } from './Price';
import { renderHook } from '@testing-library/react';

describe('Price Component', () => {
  it('renders basic price', () => {
    render(<Price amount={29.99} />);
    
    expect(screen.getByText('29.99')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders price with different currency', () => {
    render(<Price amount={29.99} currency="EUR" locale="de-DE" />);
    
    expect(screen.getByText('29,99')).toBeInTheDocument();
    expect(screen.getByText('€')).toBeInTheDocument();
  });

  it('renders price without currency symbol', () => {
    render(<Price amount={29.99} showCurrency={false} />);
    
    expect(screen.getByText('29.99')).toBeInTheDocument();
    expect(screen.queryByText('$')).not.toBeInTheDocument();
  });

  it('renders price with currency after', () => {
    render(<Price amount={100} currency="JPY" currencyPosition="after" locale="ja-JP" />);
    
    const price = screen.getByLabelText(/100/);
    expect(price).toBeInTheDocument();
  });

  it('renders price with original amount', () => {
    render(<Price amount={19.99} originalAmount={29.99} />);
    
    expect(screen.getByText('19.99')).toBeInTheDocument();
    expect(screen.getByText('29.99')).toBeInTheDocument();
    expect(screen.getByText('29.99').parentElement).toHaveClass('line-through');
  });

  it('does not show original if not discounted', () => {
    render(<Price amount={29.99} originalAmount={29.99} />);
    
    expect(screen.getAllByText('29.99')).toHaveLength(1);
  });

  it('hides original when showOriginal is false', () => {
    render(<Price amount={19.99} originalAmount={29.99} showOriginal={false} />);
    
    expect(screen.getByText('19.99')).toBeInTheDocument();
    expect(screen.queryByText('29.99')).not.toBeInTheDocument();
  });

  it('renders with prefix and suffix', () => {
    render(<Price amount={29.99} prefix="From" suffix="/month" />);
    
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
  });

  it('handles string amounts', () => {
    render(<Price amount="49.99" />);
    
    expect(screen.getByText('49.99')).toBeInTheDocument();
  });

  it('handles invalid amounts', () => {
    render(<Price amount="invalid" />);
    
    expect(screen.getByText('0.00')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { rerender } = render(<Price amount={29.99} size="xs" />);
    expect(screen.getByLabelText(/29.99/)).toHaveClass('text-xs');
    
    rerender(<Price amount={29.99} size="3xl" />);
    expect(screen.getByLabelText(/29.99/)).toHaveClass('text-3xl');
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Price amount={29.99} variant="primary" />);
    expect(screen.getByLabelText(/29.99/)).toHaveClass('text-primary-600');
    
    rerender(<Price amount={29.99} variant="sale" />);
    expect(screen.getByLabelText(/29.99/)).toHaveClass('text-danger-600');
  });

  it('automatically applies sale variant when discounted', () => {
    render(<Price amount={19.99} originalAmount={29.99} />);
    
    const salePrice = screen.getByText('19.99').parentElement;
    expect(salePrice).toHaveClass('text-danger-600');
  });

  it('applies weight variants', () => {
    render(<Price amount={29.99} weight="bold" />);
    
    expect(screen.getByLabelText(/29.99/)).toHaveClass('font-bold');
  });

  it('renders with custom className', () => {
    render(<Price amount={29.99} className="custom-price" />);
    
    expect(screen.getByLabelText(/29.99/)).toHaveClass('custom-price');
  });

  it('renders with custom originalClassName', () => {
    render(
      <Price 
        amount={19.99} 
        originalAmount={29.99} 
        originalClassName="custom-original" 
      />
    );
    
    expect(screen.getByText('29.99').parentElement).toHaveClass('custom-original');
  });

  it('renders as different HTML elements', () => {
    const { rerender } = render(<Price amount={29.99} as="div" />);
    expect(screen.getByLabelText(/29.99/).tagName).toBe('DIV');
    
    rerender(<Price amount={29.99} as="p" />);
    expect(screen.getByLabelText(/29.99/).tagName).toBe('P');
  });

  it('uses custom aria-label', () => {
    render(<Price amount={29.99} aria-label="Special price: Twenty-nine ninety-nine" />);
    
    expect(screen.getByLabelText('Special price: Twenty-nine ninety-nine')).toBeInTheDocument();
  });

  it('handles custom fraction digits', () => {
    render(
      <Price 
        amount={29.999} 
        minimumFractionDigits={3}
        maximumFractionDigits={3}
      />
    );
    
    expect(screen.getByText('29.999')).toBeInTheDocument();
  });

  it('handles different locales', () => {
    render(<Price amount={1234.56} locale="fr-FR" currency="EUR" />);
    
    // French locale uses space as thousands separator and comma as decimal
    expect(screen.getByText(/1.*234,56/)).toBeInTheDocument();
  });

  it('handles currency display options', () => {
    const { rerender } = render(
      <Price amount={29.99} currency="USD" currencyDisplay="code" />
    );
    expect(screen.getByText('USD')).toBeInTheDocument();
    
    rerender(<Price amount={29.99} currency="USD" currencyDisplay="name" locale="en-US" />);
    expect(screen.getByText(/dollar/i)).toBeInTheDocument();
  });
});

describe('PriceRange Component', () => {
  it('renders price range', () => {
    render(<PriceRange minAmount={10} maxAmount={50} />);
    
    expect(screen.getByText('10.00')).toBeInTheDocument();
    expect(screen.getByText('50.00')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders with custom separator', () => {
    render(<PriceRange minAmount={10} maxAmount={50} separator=" to " />);
    
    expect(screen.getByText('to')).toBeInTheDocument();
  });

  it('applies consistent styling', () => {
    render(
      <PriceRange 
        minAmount={10} 
        maxAmount={50} 
        size="lg"
        variant="primary"
        weight="bold"
      />
    );
    
    const prices = screen.getAllByLabelText(/\$\d+/);
    prices.forEach(price => {
      expect(price).toHaveClass('text-lg', 'text-primary-600', 'font-bold');
    });
  });

  it('handles different currencies', () => {
    render(
      <PriceRange 
        minAmount={10} 
        maxAmount={50} 
        currency="GBP"
        locale="en-GB"
      />
    );
    
    expect(screen.getAllByText('£')).toHaveLength(2);
  });
});

describe('usePriceCalculations Hook', () => {
  it('calculates basic price without modifications', () => {
    const { result } = renderHook(() => usePriceCalculations(100));
    
    expect(result.current).toEqual({
      originalPrice: 100,
      discountAmount: 0,
      discountedPrice: 100,
      taxAmount: 0,
      finalPrice: 100,
      totalPrice: 100,
      savings: 0,
      savingsPercentage: 0,
    });
  });

  it('calculates percentage discount', () => {
    const { result } = renderHook(() => 
      usePriceCalculations(100, { discount: 20, discountType: 'percentage' })
    );
    
    expect(result.current.discountAmount).toBe(20);
    expect(result.current.discountedPrice).toBe(80);
    expect(result.current.savings).toBe(20);
    expect(result.current.savingsPercentage).toBe(20);
  });

  it('calculates fixed discount', () => {
    const { result } = renderHook(() => 
      usePriceCalculations(100, { discount: 15, discountType: 'fixed' })
    );
    
    expect(result.current.discountAmount).toBe(15);
    expect(result.current.discountedPrice).toBe(85);
    expect(result.current.savings).toBe(15);
    expect(result.current.savingsPercentage).toBe(15);
  });

  it('calculates tax', () => {
    const { result } = renderHook(() => 
      usePriceCalculations(100, { taxRate: 10 })
    );
    
    expect(result.current.taxAmount).toBe(10);
    expect(result.current.finalPrice).toBe(110);
  });

  it('calculates quantity', () => {
    const { result } = renderHook(() => 
      usePriceCalculations(100, { quantity: 3 })
    );
    
    expect(result.current.totalPrice).toBe(300);
  });

  it('combines discount, tax, and quantity', () => {
    const { result } = renderHook(() => 
      usePriceCalculations(100, {
        discount: 20,
        discountType: 'percentage',
        taxRate: 10,
        quantity: 2,
      })
    );
    
    expect(result.current.discountedPrice).toBe(80);
    expect(result.current.taxAmount).toBe(8); // 10% of 80
    expect(result.current.finalPrice).toBe(88); // 80 + 8
    expect(result.current.totalPrice).toBe(176); // 88 * 2
  });

  it('prevents negative prices', () => {
    const { result } = renderHook(() => 
      usePriceCalculations(50, { discount: 100, discountType: 'fixed' })
    );
    
    expect(result.current.discountedPrice).toBe(0);
    expect(result.current.finalPrice).toBe(0);
  });

  it('handles zero price', () => {
    const { result } = renderHook(() => 
      usePriceCalculations(0, { discount: 20, discountType: 'percentage' })
    );
    
    expect(result.current.savingsPercentage).toBe(0);
  });
});