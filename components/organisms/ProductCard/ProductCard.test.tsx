import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard, ProductGrid } from './ProductCard';

describe('ProductCard Component', () => {
  const defaultProps = {
    image: 'https://example.com/product.jpg',
    name: 'Test Product',
    price: 99.99,
  };

  it('renders basic product information', () => {
    render(<ProductCard {...defaultProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('renders with custom image alt text', () => {
    render(
      <ProductCard 
        {...defaultProps} 
        imageAlt="Custom alt text"
      />
    );
    
    expect(screen.getByAltText('Custom alt text')).toBeInTheDocument();
  });

  it('displays original price when on sale', () => {
    render(
      <ProductCard 
        {...defaultProps}
        price={79.99}
        originalPrice={99.99}
        isSale={true}
      />
    );
    
    expect(screen.getByText('$79.99')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toHaveClass('line-through');
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('formats string prices correctly', () => {
    render(
      <ProductCard 
        {...defaultProps}
        price="99.99"
        currency="€"
      />
    );
    
    expect(screen.getByText('99.99')).toBeInTheDocument();
  });

  it('displays rating stars', () => {
    render(
      <ProductCard 
        {...defaultProps}
        rating={4.5}
        reviewCount={123}
      />
    );
    
    // Check for stars (we'll have 4 full stars, 1 half star, 0 empty stars)
    const stars = screen.getAllByTestId(/star/i);
    expect(stars).toHaveLength(5);
    expect(screen.getByText('(123)')).toBeInTheDocument();
  });

  it('shows new badge when isNew is true', () => {
    render(
      <ProductCard 
        {...defaultProps}
        isNew={true}
      />
    );
    
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('shows custom badge', () => {
    render(
      <ProductCard 
        {...defaultProps}
        badge="Limited Edition"
        badgeVariant="warning"
      />
    );
    
    const badge = screen.getByText('Limited Edition');
    expect(badge).toBeInTheDocument();
    expect(badge.closest('span')).toHaveClass('bg-warning-100');
  });

  it('handles favorite toggle', () => {
    const handleFavoriteClick = jest.fn();
    render(
      <ProductCard 
        {...defaultProps}
        onFavoriteClick={handleFavoriteClick}
      />
    );
    
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    
    expect(handleFavoriteClick).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  it('respects controlled favorite state', () => {
    const { rerender } = render(
      <ProductCard 
        {...defaultProps}
        isFavorite={false}
      />
    );
    
    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();
    
    rerender(
      <ProductCard 
        {...defaultProps}
        isFavorite={true}
      />
    );
    
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  it('shows quick view button on hover', async () => {
    const handleQuickView = jest.fn();
    render(
      <ProductCard 
        {...defaultProps}
        showQuickView={true}
        onQuickViewClick={handleQuickView}
      />
    );
    
    const quickViewButton = screen.getByLabelText('Quick view');
    expect(quickViewButton).toHaveClass('opacity-0');
    
    // Hover over the image container
    const imageContainer = screen.getByAltText('Test Product').parentElement!;
    fireEvent.mouseEnter(imageContainer);
    
    expect(quickViewButton).toHaveClass('group-hover:opacity-100');
    
    fireEvent.click(quickViewButton);
    expect(handleQuickView).toHaveBeenCalledTimes(1);
  });

  it('hides quick view when showQuickView is false', () => {
    render(
      <ProductCard 
        {...defaultProps}
        showQuickView={false}
      />
    );
    
    expect(screen.queryByLabelText('Quick view')).not.toBeInTheDocument();
  });

  it('shows out of stock overlay', () => {
    render(
      <ProductCard 
        {...defaultProps}
        isOutOfStock={true}
      />
    );
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
  });

  it('handles add to cart click', () => {
    const handleAddToCart = jest.fn();
    render(
      <ProductCard 
        {...defaultProps}
        onAddToCartClick={handleAddToCart}
      />
    );
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(handleAddToCart).toHaveBeenCalledTimes(1);
  });

  it('hides add to cart when showAddToCart is false', () => {
    render(
      <ProductCard 
        {...defaultProps}
        showAddToCart={false}
      />
    );
    
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
  });

  it('handles card click', () => {
    const handleClick = jest.fn();
    render(
      <ProductCard 
        {...defaultProps}
        onClick={handleClick}
      />
    );
    
    fireEvent.click(screen.getByText('Test Product'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a link when href is provided', () => {
    render(
      <ProductCard 
        {...defaultProps}
        href="/products/test-product"
      />
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/test-product');
  });

  it('prevents event bubbling on action clicks', () => {
    const handleCardClick = jest.fn();
    const handleFavoriteClick = jest.fn();
    
    render(
      <ProductCard 
        {...defaultProps}
        onClick={handleCardClick}
        onFavoriteClick={handleFavoriteClick}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Add to favorites'));
    
    expect(handleFavoriteClick).toHaveBeenCalledTimes(1);
    expect(handleCardClick).not.toHaveBeenCalled();
  });

  it('handles image loading states', () => {
    render(<ProductCard {...defaultProps} />);
    
    const img = screen.getByAltText('Test Product');
    expect(img).toHaveClass('opacity-0');
    
    fireEvent.load(img);
    expect(img).not.toHaveClass('opacity-0');
  });

  it('handles image error', () => {
    render(<ProductCard {...defaultProps} />);
    
    const img = screen.getByAltText('Test Product');
    fireEvent.error(img);
    
    // Should show image icon instead
    expect(screen.queryByAltText('Test Product')).not.toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container: smContainer } = render(
      <ProductCard {...defaultProps} size="sm" />
    );
    expect(smContainer.firstChild).toHaveClass('max-w-[200px]');

    const { container: lgContainer } = render(
      <ProductCard {...defaultProps} size="lg" />
    );
    expect(lgContainer.firstChild).toHaveClass('max-w-[360px]');
  });

  it('applies style variants', () => {
    const { container: elevatedContainer } = render(
      <ProductCard {...defaultProps} variant="elevated" />
    );
    expect(elevatedContainer.firstChild).toHaveClass('shadow-md');

    const { container: minimalContainer } = render(
      <ProductCard {...defaultProps} variant="minimal" />
    );
    expect(minimalContainer.firstChild).not.toHaveClass('border');
  });

  it('renders custom children', () => {
    render(
      <ProductCard {...defaultProps}>
        <div>Custom content</div>
      </ProductCard>
    );
    
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProductCard {...defaultProps} className="custom-card" />
    );
    
    expect(container.firstChild).toHaveClass('custom-card');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ProductCard {...defaultProps} ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ProductGrid Component', () => {
  const products = [
    <ProductCard key="1" image="test1.jpg" name="Product 1" price={10} />,
    <ProductCard key="2" image="test2.jpg" name="Product 2" price={20} />,
    <ProductCard key="3" image="test3.jpg" name="Product 3" price={30} />,
    <ProductCard key="4" image="test4.jpg" name="Product 4" price={40} />,
  ];

  it('renders children in grid layout', () => {
    render(<ProductGrid>{products}</ProductGrid>);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
    expect(screen.getByText('Product 4')).toBeInTheDocument();
  });

  it('applies column classes', () => {
    const { container } = render(
      <ProductGrid columns={3}>{products}</ProductGrid>
    );
    
    expect(container.firstChild).toHaveClass('lg:grid-cols-3');
  });

  it('applies gap classes', () => {
    const { container: smGap } = render(
      <ProductGrid gap="sm">{products}</ProductGrid>
    );
    expect(smGap.firstChild).toHaveClass('gap-2');

    const { container: lgGap } = render(
      <ProductGrid gap="lg">{products}</ProductGrid>
    );
    expect(lgGap.firstChild).toHaveClass('gap-6');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProductGrid className="custom-grid">{products}</ProductGrid>
    );
    
    expect(container.firstChild).toHaveClass('custom-grid');
  });
});