import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductInfo } from './ProductInfo';

// Mock components
jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

jest.mock('../../atoms/Price/Price', () => ({
  Price: ({ amount, currency, className, size }: any) => (
    <span data-testid="price" className={className} data-size={size}>
      ${amount.toFixed(2)}
    </span>
  ),
}));

jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Rating/Rating', () => ({
  Rating: ({ value, readonly, size }: any) => (
    <div data-testid="rating" data-value={value} data-readonly={readonly} data-size={size}>
      Rating: {value}
    </div>
  ),
}));

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('ProductInfo Component', () => {
  const defaultProps = {
    name: 'Test Product',
    price: 99.99,
  };

  it('renders basic product information', () => {
    render(<ProductInfo {...defaultProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders brand when provided', () => {
    render(<ProductInfo {...defaultProps} brand="Test Brand" />);
    
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
  });

  it('renders SKU when provided and showSku is true', () => {
    render(<ProductInfo {...defaultProps} sku="TEST-123" showSku />);
    
    expect(screen.getByText('SKU: TEST-123')).toBeInTheDocument();
  });

  it('hides SKU when showSku is false', () => {
    render(<ProductInfo {...defaultProps} sku="TEST-123" showSku={false} />);
    
    expect(screen.queryByText('SKU: TEST-123')).not.toBeInTheDocument();
  });

  it('renders pricing with savings', () => {
    render(
      <ProductInfo
        {...defaultProps}
        originalPrice={149.99}
      />
    );
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toHaveClass('line-through');
    expect(screen.getByText('Save 33%')).toBeInTheDocument();
    expect(screen.getByText('You save:', { exact: false })).toBeInTheDocument();
  });

  it('renders rating and reviews', () => {
    const handleReviewClick = jest.fn();
    
    render(
      <ProductInfo
        {...defaultProps}
        rating={4.5}
        reviewCount={123}
        onReviewClick={handleReviewClick}
      />
    );
    
    expect(screen.getByTestId('rating')).toHaveAttribute('data-value', '4.5');
    expect(screen.getByText('4.5')).toBeInTheDocument();
    
    const reviewButton = screen.getByText('123 reviews');
    fireEvent.click(reviewButton);
    expect(handleReviewClick).toHaveBeenCalled();
  });

  it('renders single review text correctly', () => {
    render(
      <ProductInfo
        {...defaultProps}
        rating={5}
        reviewCount={1}
      />
    );
    
    expect(screen.getByText('1 review')).toBeInTheDocument();
  });

  it('renders short description', () => {
    render(
      <ProductInfo
        {...defaultProps}
        shortDescription="This is a great product"
      />
    );
    
    expect(screen.getByText('This is a great product')).toBeInTheDocument();
  });

  it('renders stock status - in stock', () => {
    render(<ProductInfo {...defaultProps} inStock />);
    
    expect(screen.getByTestId('icon-check-circle')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('renders stock status - out of stock', () => {
    render(<ProductInfo {...defaultProps} inStock={false} />);
    
    expect(screen.getByTestId('icon-x-circle')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('renders low stock warning', () => {
    render(
      <ProductInfo
        {...defaultProps}
        inStock
        stockCount={3}
        lowStockThreshold={5}
      />
    );
    
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    expect(screen.getByText('Only 3 left in stock')).toBeInTheDocument();
  });

  it('renders custom availability', () => {
    render(
      <ProductInfo
        {...defaultProps}
        availability="Ships within 24 hours"
      />
    );
    
    expect(screen.getByText('Ships within 24 hours')).toBeInTheDocument();
  });

  it('renders shipping info', () => {
    render(
      <ProductInfo
        {...defaultProps}
        showShipping
        shippingInfo={{
          freeShipping: true,
          estimatedDays: '2-3 business days',
        }}
      />
    );
    
    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
    expect(screen.getByText('• 2-3 business days')).toBeInTheDocument();
  });

  it('renders shipping cost', () => {
    render(
      <ProductInfo
        {...defaultProps}
        showShipping
        shippingInfo={{
          cost: 9.99,
          estimatedDays: '5-7 days',
        }}
      />
    );
    
    expect(screen.getByText('Shipping:')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('renders vendor info', () => {
    const handleVendorClick = jest.fn();
    
    render(
      <ProductInfo
        {...defaultProps}
        showVendor
        vendorName="Test Vendor"
        vendorRating={4.8}
        onVendorClick={handleVendorClick}
      />
    );
    
    expect(screen.getByText('Sold by')).toBeInTheDocument();
    const vendorButton = screen.getByText('Test Vendor');
    expect(vendorButton).toBeInTheDocument();
    
    fireEvent.click(vendorButton);
    expect(handleVendorClick).toHaveBeenCalled();
    
    expect(screen.getByText('(4.8)')).toBeInTheDocument();
  });

  it('renders highlights', () => {
    render(
      <ProductInfo
        {...defaultProps}
        highlights={[
          'Free returns',
          '2-year warranty',
          'Eco-friendly materials',
        ]}
      />
    );
    
    expect(screen.getByText('Highlights')).toBeInTheDocument();
    expect(screen.getByText('Free returns')).toBeInTheDocument();
    expect(screen.getByText('2-year warranty')).toBeInTheDocument();
    expect(screen.getByText('Eco-friendly materials')).toBeInTheDocument();
  });

  it('renders features in detailed layout', () => {
    render(
      <ProductInfo
        {...defaultProps}
        layout="detailed"
        features={[
          { icon: 'cpu', label: 'Processor', value: 'Intel i7' },
          { icon: 'hard-drive', label: 'Storage', value: '512GB SSD' },
        ]}
      />
    );
    
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Processor:')).toBeInTheDocument();
    expect(screen.getByText('Intel i7')).toBeInTheDocument();
    expect(screen.getByText('Storage:')).toBeInTheDocument();
    expect(screen.getByText('512GB SSD')).toBeInTheDocument();
  });

  it('renders long description in detailed layout', () => {
    const longDesc = '<p>This is a <strong>detailed</strong> description</p>';
    
    render(
      <ProductInfo
        {...defaultProps}
        layout="detailed"
        longDescription={longDesc}
      />
    );
    
    expect(screen.getByText('Description')).toBeInTheDocument();
    const descContainer = screen.getByText('detailed').parentElement;
    expect(descContainer).toContainHTML('<strong>detailed</strong>');
  });

  it('renders badges', () => {
    render(
      <ProductInfo
        {...defaultProps}
        badges={[
          { text: 'New', variant: 'default' },
          { text: 'Best Seller', variant: 'success' },
        ]}
      />
    );
    
    const badges = screen.getAllByTestId('badge');
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent('New');
    expect(badges[1]).toHaveTextContent('Best Seller');
  });

  it('renders age restriction', () => {
    render(
      <ProductInfo
        {...defaultProps}
        ageRestriction={21}
      />
    );
    
    expect(screen.getByText('Must be 21+ years old to purchase')).toBeInTheDocument();
  });

  it('renders wishlist button', () => {
    const handleWishlist = jest.fn();
    
    render(
      <ProductInfo
        {...defaultProps}
        onWishlist={handleWishlist}
        isWishlisted={false}
      />
    );
    
    const wishlistButton = screen.getByText('Save');
    fireEvent.click(wishlistButton);
    expect(handleWishlist).toHaveBeenCalled();
  });

  it('renders wishlisted state', () => {
    render(
      <ProductInfo
        {...defaultProps}
        onWishlist={() => {}}
        isWishlisted={true}
      />
    );
    
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('renders share button', () => {
    const handleShare = jest.fn();
    
    render(
      <ProductInfo
        {...defaultProps}
        onShare={handleShare}
      />
    );
    
    const shareButton = screen.getByText('Share');
    fireEvent.click(shareButton);
    expect(handleShare).toHaveBeenCalled();
  });

  it('renders compact layout', () => {
    render(
      <ProductInfo
        {...defaultProps}
        layout="compact"
        shortDescription="Short desc"
        highlights={['Highlight 1']}
      />
    );
    
    // Short description and highlights should not be shown in compact layout
    expect(screen.queryByText('Short desc')).not.toBeInTheDocument();
    expect(screen.queryByText('Highlight 1')).not.toBeInTheDocument();
  });

  it('hides vendor info when showVendor is false', () => {
    render(
      <ProductInfo
        {...defaultProps}
        showVendor={false}
        vendorName="Test Vendor"
      />
    );
    
    expect(screen.queryByText('Sold by')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Vendor')).not.toBeInTheDocument();
  });

  it('hides shipping info when showShipping is false', () => {
    render(
      <ProductInfo
        {...defaultProps}
        showShipping={false}
        shippingInfo={{ freeShipping: true }}
      />
    );
    
    expect(screen.queryByText('Free Shipping')).not.toBeInTheDocument();
  });

  it('uses custom aria-label', () => {
    render(
      <ProductInfo
        {...defaultProps}
        aria-label="Custom product info"
      />
    );
    
    expect(screen.getByLabelText('Custom product info')).toBeInTheDocument();
  });
});