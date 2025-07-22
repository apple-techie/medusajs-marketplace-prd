import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCarousel, RecommendedProducts, RelatedProducts } from './ProductCarousel';

// Mock ProductCard component
jest.mock('../../molecules/ProductCard/ProductCard', () => ({
  ProductCard: ({ title, onClick, variant, size, className, ...props }: any) => (
    <div 
      data-testid={`product-${title}`}
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      {...props}
    >
      {title}
      {props.price && <span data-testid="price">${props.price}</span>}
      {props.vendor && <span data-testid="vendor">{props.vendor.name}</span>}
    </div>
  ),
}));

// Mock Button component
jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, disabled, variant, as: Component = 'button', href, className, ...props }: any) => 
    Component === 'a' ? (
      <a href={href} data-variant={variant} className={className} {...props}>
        {children}
      </a>
    ) : (
      <button onClick={onClick} disabled={disabled} data-variant={variant} className={className} {...props}>
        {children}
      </button>
    ),
}));

// Mock Icon component
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

// Mock Skeleton component
jest.mock('../../atoms/Skeleton/Skeleton', () => ({
  Skeleton: ({ variant, className }: any) => (
    <div data-testid="skeleton" data-variant={variant} className={className}>
      Loading...
    </div>
  ),
}));

// Mock Badge component
jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

describe('ProductCarousel Component', () => {
  const mockProducts = [
    {
      id: 1,
      title: 'Product 1',
      price: 99.99,
      image: '/product1.jpg',
      href: '/products/1',
      vendor: { name: 'Vendor 1' },
      rating: 4.5,
      reviewCount: 123,
    },
    {
      id: 2,
      title: 'Product 2',
      price: 149.99,
      image: '/product2.jpg',
      href: '/products/2',
      vendor: { name: 'Vendor 2' },
      rating: 4.0,
      reviewCount: 89,
    },
    {
      id: 3,
      title: 'Product 3',
      price: 79.99,
      image: '/product3.jpg',
      href: '/products/3',
      vendor: { name: 'Vendor 3' },
      rating: 4.8,
      reviewCount: 234,
    },
    {
      id: 4,
      title: 'Product 4',
      price: 199.99,
      image: '/product4.jpg',
      href: '/products/4',
      vendor: { name: 'Vendor 4' },
      rating: 4.2,
      reviewCount: 56,
    },
    {
      id: 5,
      title: 'Product 5',
      price: 129.99,
      image: '/product5.jpg',
      href: '/products/5',
      vendor: { name: 'Vendor 5' },
      rating: 4.6,
      reviewCount: 178,
    },
  ];

  // Mock window.innerWidth
  const mockWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    mockWindowWidth(1024); // Default to desktop
  });

  it('renders basic product carousel', () => {
    render(<ProductCarousel products={mockProducts} />);
    
    expect(screen.getByTestId('product-Product 1')).toBeInTheDocument();
    expect(screen.getByTestId('product-Product 2')).toBeInTheDocument();
    expect(screen.getByTestId('product-Product 3')).toBeInTheDocument();
    expect(screen.getByTestId('product-Product 4')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(
      <ProductCarousel
        products={mockProducts}
        title="Featured Products"
        subtitle="Hand-picked items just for you"
      />
    );
    
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Hand-picked items just for you')).toBeInTheDocument();
  });

  it('renders with view all button', () => {
    const handleViewAll = jest.fn();
    
    render(
      <ProductCarousel
        products={mockProducts}
        showViewAll
        viewAllHref="/products"
        viewAllText="See All Products"
        onViewAll={handleViewAll}
      />
    );
    
    const viewAllLink = screen.getByText('See All Products').closest('a');
    expect(viewAllLink).toHaveAttribute('href', '/products');
    expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
  });

  it('handles product click', () => {
    const handleProductClick = jest.fn();
    
    render(
      <ProductCarousel
        products={mockProducts}
        onProductClick={handleProductClick}
      />
    );
    
    fireEvent.click(screen.getByTestId('product-Product 1'));
    expect(handleProductClick).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('renders loading skeletons', () => {
    render(
      <ProductCarousel
        products={[]}
        loading
        skeletonCount={3}
      />
    );
    
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(3);
    expect(skeletons[0]).toHaveAttribute('data-variant', 'product');
  });

  it('renders empty state', () => {
    render(<ProductCarousel products={[]} />);
    
    expect(screen.getByText('No products available')).toBeInTheDocument();
    expect(screen.getByTestId('icon-package')).toBeInTheDocument();
  });

  it('renders navigation buttons with sides position', () => {
    render(
      <ProductCarousel
        products={mockProducts}
        showNavigation
        navigationPosition="sides"
        itemsPerView={2}
      />
    );
    
    // Should have previous and next buttons
    const prevButtons = screen.getAllByLabelText('Previous products');
    const nextButtons = screen.getAllByLabelText('Next products');
    
    expect(prevButtons).toHaveLength(1);
    expect(nextButtons).toHaveLength(1);
  });

  it('handles navigation correctly', () => {
    const handleSlideChange = jest.fn();
    
    render(
      <ProductCarousel
        products={mockProducts}
        itemsPerView={2}
        showNavigation
        onSlideChange={handleSlideChange}
      />
    );
    
    const nextButton = screen.getByLabelText('Next products');
    
    // Initially at index 0
    expect(handleSlideChange).not.toHaveBeenCalled();
    
    // Click next
    fireEvent.click(nextButton);
    expect(handleSlideChange).toHaveBeenCalledWith(1);
    
    // Click next again
    fireEvent.click(nextButton);
    expect(handleSlideChange).toHaveBeenCalledWith(2);
  });

  it('disables navigation at boundaries without loop', () => {
    render(
      <ProductCarousel
        products={mockProducts.slice(0, 3)}
        itemsPerView={2}
        showNavigation
        loop={false}
      />
    );
    
    const prevButton = screen.getByLabelText('Previous products');
    const nextButton = screen.getByLabelText('Next products');
    
    // Previous should be disabled at start
    expect(prevButton).toBeDisabled();
    
    // Click next to go to end
    fireEvent.click(nextButton);
    
    // Next should be disabled at end
    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();
  });

  it('enables continuous navigation with loop', () => {
    render(
      <ProductCarousel
        products={mockProducts.slice(0, 3)}
        itemsPerView={2}
        showNavigation
        loop={true}
      />
    );
    
    const prevButton = screen.getByLabelText('Previous products');
    const nextButton = screen.getByLabelText('Next products');
    
    // Neither should be disabled with loop
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('renders dots navigation', () => {
    render(
      <ProductCarousel
        products={mockProducts}
        itemsPerView={2}
        showDots
      />
    );
    
    // Should have dots for navigation
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(dots.length).toBeGreaterThan(0);
    
    // First dot should be active
    expect(dots[0]).toHaveClass('w-8');
  });

  it('handles dot navigation click', () => {
    const handleSlideChange = jest.fn();
    
    render(
      <ProductCarousel
        products={mockProducts}
        itemsPerView={2}
        showDots
        onSlideChange={handleSlideChange}
      />
    );
    
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    
    // Click second dot
    fireEvent.click(dots[1]);
    expect(handleSlideChange).toHaveBeenCalledWith(2); // Second page starts at index 2
  });

  it('applies different variants', () => {
    const { rerender } = render(
      <ProductCarousel products={mockProducts} variant="default" />
    );
    expect(screen.getByTestId('product-Product 1')).toHaveAttribute('data-variant', 'default');
    
    rerender(<ProductCarousel products={mockProducts} variant="minimal" />);
    expect(screen.getByTestId('product-Product 1')).toHaveAttribute('data-variant', 'minimal');
    
    rerender(<ProductCarousel products={mockProducts} variant="compact" />);
    expect(screen.getByTestId('product-Product 1')).toHaveAttribute('data-size', 'sm');
  });

  it('handles responsive items per view', () => {
    const { rerender } = render(
      <ProductCarousel
        products={mockProducts}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
      />
    );
    
    // Desktop view (1024px)
    let products = screen.getAllByTestId(/^product-Product/);
    expect(products).toHaveLength(5); // All products visible in carousel
    
    // Tablet view
    mockWindowWidth(768);
    rerender(
      <ProductCarousel
        products={mockProducts}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
      />
    );
    
    // Mobile view
    mockWindowWidth(375);
    rerender(
      <ProductCarousel
        products={mockProducts}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
      />
    );
  });

  it('handles autoplay', async () => {
    jest.useFakeTimers();
    const handleSlideChange = jest.fn();
    
    render(
      <ProductCarousel
        products={mockProducts}
        itemsPerView={2}
        autoplay
        autoplayInterval={1000}
        onSlideChange={handleSlideChange}
      />
    );
    
    // Wait for autoplay interval
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(handleSlideChange).toHaveBeenCalledWith(1);
    });
    
    jest.useRealTimers();
  });

  it('pauses autoplay on hover', () => {
    jest.useFakeTimers();
    const handleSlideChange = jest.fn();
    
    render(
      <ProductCarousel
        products={mockProducts}
        itemsPerView={2}
        autoplay
        autoplayInterval={1000}
        onSlideChange={handleSlideChange}
      />
    );
    
    const carousel = screen.getByTestId('product-Product 1').parentElement?.parentElement;
    
    // Hover over carousel
    fireEvent.mouseEnter(carousel!);
    
    // Wait for autoplay interval
    jest.advanceTimersByTime(1000);
    
    // Should not advance
    expect(handleSlideChange).not.toHaveBeenCalled();
    
    // Unhover
    fireEvent.mouseLeave(carousel!);
    
    // Now it should advance
    jest.advanceTimersByTime(1000);
    expect(handleSlideChange).toHaveBeenCalled();
    
    jest.useRealTimers();
  });

  it('renders with different navigation positions', () => {
    const { rerender } = render(
      <ProductCarousel
        products={mockProducts}
        showNavigation
        navigationPosition="top-right"
        itemsPerView={2}
      />
    );
    
    // Top-right should have buttons in header area
    let buttons = screen.getAllByLabelText(/products/);
    expect(buttons).toHaveLength(2);
    
    rerender(
      <ProductCarousel
        products={mockProducts}
        showNavigation
        navigationPosition="bottom"
        itemsPerView={2}
      />
    );
    
    // Bottom should have buttons below carousel
    buttons = screen.getAllByLabelText(/products/);
    expect(buttons).toHaveLength(2);
  });

  it('applies custom classes', () => {
    render(
      <ProductCarousel
        products={mockProducts}
        className="custom-section"
        headerClassName="custom-header"
        carouselClassName="custom-carousel"
        navigationClassName="custom-nav"
      />
    );
    
    const section = screen.getByTestId('product-Product 1').closest('section');
    expect(section).toHaveClass('custom-section');
  });

  it('uses aria-label', () => {
    render(
      <ProductCarousel
        products={mockProducts}
        aria-label="Featured products carousel"
      />
    );
    
    const section = screen.getByLabelText('Featured products carousel');
    expect(section).toBeInTheDocument();
  });
});

describe('RecommendedProducts Component', () => {
  const mockProducts = [
    { id: 1, title: 'Recommended 1', price: 99, image: '/p1.jpg', href: '/p1' },
    { id: 2, title: 'Recommended 2', price: 149, image: '/p2.jpg', href: '/p2' },
  ];

  it('renders recommended products carousel', () => {
    render(<RecommendedProducts products={mockProducts} />);
    
    expect(screen.getByText('Recommended for You')).toBeInTheDocument();
    expect(screen.getByTestId('product-Recommended 1')).toBeInTheDocument();
    expect(screen.getByTestId('product-Recommended 2')).toBeInTheDocument();
  });

  it('uses custom title', () => {
    render(
      <RecommendedProducts
        products={mockProducts}
        title="You Might Like"
      />
    );
    
    expect(screen.getByText('You Might Like')).toBeInTheDocument();
  });
});

describe('RelatedProducts Component', () => {
  const mockProducts = [
    { id: 1, title: 'Related 1', price: 79, image: '/r1.jpg', href: '/r1' },
    { id: 2, title: 'Related 2', price: 89, image: '/r2.jpg', href: '/r2' },
  ];

  it('renders related products carousel', () => {
    render(<RelatedProducts products={mockProducts} />);
    
    expect(screen.getByText('Related Products')).toBeInTheDocument();
    expect(screen.getByTestId('product-Related 1')).toBeInTheDocument();
    expect(screen.getByTestId('product-Related 2')).toBeInTheDocument();
  });

  it('uses compact variant', () => {
    render(<RelatedProducts products={mockProducts} />);
    
    expect(screen.getByTestId('product-Related 1')).toHaveAttribute('data-variant', 'compact');
    expect(screen.getByTestId('product-Related 1')).toHaveAttribute('data-size', 'sm');
  });
});