import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';

// Mock components
jest.mock('../../molecules/ProductCard/ProductCard', () => ({
  ProductCard: ({ name, price, onClick, onAddToCart, onToggleWishlist, layout, ...props }: any) => (
    <div 
      data-testid="product-card" 
      data-layout={layout}
      onClick={onClick}
      {...props}
    >
      <div>{name}</div>
      <div>${price}</div>
      {props.showAddToCart && (
        <button onClick={onAddToCart}>Add to Cart</button>
      )}
      {props.showWishlist && (
        <button onClick={onToggleWishlist}>Wishlist</button>
      )}
    </div>
  ),
}));

jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, loading, disabled, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-loading={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

jest.mock('../../atoms/Spinner/Spinner', () => ({
  Spinner: ({ size }: any) => (
    <div data-testid="spinner" data-size={size}>Loading...</div>
  ),
}));

describe('ProductGrid Component', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      price: 99.99,
      image: '/product1.jpg',
    },
    {
      id: '2',
      name: 'Product 2',
      price: 149.99,
      image: '/product2.jpg',
    },
    {
      id: '3',
      name: 'Product 3',
      price: 79.99,
      image: '/product3.jpg',
    },
  ];

  it('renders products in grid view', () => {
    render(<ProductGrid products={mockProducts} />);
    
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(3);
    expect(productCards[0]).toHaveAttribute('data-layout', 'vertical');
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders products in list view', () => {
    render(<ProductGrid products={mockProducts} viewMode="list" />);
    
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards[0]).toHaveAttribute('data-layout', 'horizontal');
  });

  it('shows loading skeletons', () => {
    render(<ProductGrid products={[]} loading loadingCount={4} />);
    
    const skeletons = screen.getByLabelText('Loading products');
    expect(skeletons.querySelectorAll('.animate-pulse')).toHaveLength(4);
  });

  it('shows empty state', () => {
    render(<ProductGrid products={[]} />);
    
    expect(screen.getByTestId('icon-package')).toBeInTheDocument();
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('shows custom empty message and icon', () => {
    render(
      <ProductGrid 
        products={[]} 
        emptyMessage="No items available"
        emptyIcon="shopping-bag"
      />
    );
    
    expect(screen.getByTestId('icon-shopping-bag')).toBeInTheDocument();
    expect(screen.getByText('No items available')).toBeInTheDocument();
  });

  it('shows empty action button', () => {
    const handleAction = jest.fn();
    render(
      <ProductGrid 
        products={[]} 
        emptyAction={{
          label: 'Browse all products',
          onClick: handleAction,
        }}
      />
    );
    
    const button = screen.getByText('Browse all products');
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalled();
  });

  it('calls onProductClick when product is clicked', () => {
    const handleClick = jest.fn();
    render(
      <ProductGrid 
        products={mockProducts} 
        onProductClick={handleClick}
      />
    );
    
    const firstProduct = screen.getAllByTestId('product-card')[0];
    fireEvent.click(firstProduct);
    expect(handleClick).toHaveBeenCalledWith('1');
  });

  it('calls onAddToCart when add to cart is clicked', () => {
    const handleAddToCart = jest.fn();
    render(
      <ProductGrid 
        products={mockProducts} 
        onAddToCart={handleAddToCart}
      />
    );
    
    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);
    expect(handleAddToCart).toHaveBeenCalledWith('1');
  });

  it('calls onToggleWishlist when wishlist is clicked', () => {
    const handleWishlist = jest.fn();
    render(
      <ProductGrid 
        products={mockProducts} 
        onToggleWishlist={handleWishlist}
      />
    );
    
    const wishlistButtons = screen.getAllByText('Wishlist');
    fireEvent.click(wishlistButtons[0]);
    expect(handleWishlist).toHaveBeenCalledWith('1');
  });

  it('shows load more button when hasMore is true', () => {
    const handleLoadMore = jest.fn();
    render(
      <ProductGrid 
        products={mockProducts} 
        hasMore
        onLoadMore={handleLoadMore}
      />
    );
    
    const loadMoreButton = screen.getByText('Load more');
    expect(loadMoreButton).toBeInTheDocument();
    
    fireEvent.click(loadMoreButton);
    expect(handleLoadMore).toHaveBeenCalled();
  });

  it('shows loading state for load more', () => {
    render(
      <ProductGrid 
        products={mockProducts} 
        hasMore
        onLoadMore={() => {}}
        loadingMore
      />
    );
    
    const loadMoreButton = screen.getByText('Loading...');
    expect(loadMoreButton).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('uses custom load more label', () => {
    render(
      <ProductGrid 
        products={mockProducts} 
        hasMore
        onLoadMore={() => {}}
        loadMoreLabel="Show more products"
      />
    );
    
    expect(screen.getByText('Show more products')).toBeInTheDocument();
  });

  it('passes card options to ProductCard', () => {
    render(
      <ProductGrid 
        products={mockProducts}
        showVendor={false}
        showRating={false}
        showAddToCart={false}
        showWishlist={false}
        imageAspectRatio="16:9"
      />
    );
    
    const productCard = screen.getAllByTestId('product-card')[0];
    expect(productCard).toHaveAttribute('showVendor', 'false');
    expect(productCard).toHaveAttribute('showRating', 'false');
    expect(productCard).toHaveAttribute('showAddToCart', 'false');
    expect(productCard).toHaveAttribute('showWishlist', 'false');
    expect(productCard).toHaveAttribute('imageAspectRatio', '16:9');
  });

  it('applies custom className', () => {
    render(
      <ProductGrid 
        products={mockProducts}
        className="custom-grid"
      />
    );
    
    const container = screen.getByLabelText('Product list').parentElement;
    expect(container).toHaveClass('custom-grid');
  });

  it('applies custom productClassName', () => {
    render(
      <ProductGrid 
        products={mockProducts}
        productClassName="custom-product"
      />
    );
    
    const productCards = screen.getAllByTestId('product-card');
    productCards.forEach(card => {
      expect(card).toHaveClass('custom-product');
    });
  });

  it('uses custom aria-label', () => {
    render(
      <ProductGrid 
        products={mockProducts}
        aria-label="Featured products"
      />
    );
    
    expect(screen.getByLabelText('Featured products')).toBeInTheDocument();
  });

  it('renders with different gap sizes', () => {
    const { rerender } = render(
      <ProductGrid products={mockProducts} gap="sm" />
    );
    
    let grid = screen.getByLabelText('Product list');
    expect(grid).toHaveClass('gap-2');
    
    rerender(<ProductGrid products={mockProducts} gap="lg" />);
    grid = screen.getByLabelText('Product list');
    expect(grid).toHaveClass('gap-4');
  });

  it('does not show load more when hasMore is false', () => {
    render(
      <ProductGrid 
        products={mockProducts}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );
    
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
  });

  it('does not show load more when onLoadMore is not provided', () => {
    render(
      <ProductGrid 
        products={mockProducts}
        hasMore={true}
      />
    );
    
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
  });

  it('handles empty products with loading state', () => {
    const { rerender } = render(
      <ProductGrid products={[]} loading />
    );
    
    expect(screen.getByLabelText('Loading products')).toBeInTheDocument();
    
    rerender(<ProductGrid products={mockProducts} loading={false} />);
    expect(screen.getAllByTestId('product-card')).toHaveLength(3);
  });
});