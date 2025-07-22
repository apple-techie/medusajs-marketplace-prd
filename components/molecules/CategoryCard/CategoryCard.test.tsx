import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryCard, CategoryCardGrid } from './CategoryCard';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock Icon component
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid="icon" data-icon={icon} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

// Mock Badge component
jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

describe('CategoryCard Component', () => {
  const defaultProps = {
    title: 'Electronics',
    href: '/categories/electronics',
  };

  it('renders basic category card', () => {
    render(<CategoryCard {...defaultProps} />);
    
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/categories/electronics');
  });

  it('renders with description', () => {
    render(
      <CategoryCard 
        {...defaultProps} 
        description="Latest gadgets and devices"
      />
    );
    
    expect(screen.getByText('Latest gadgets and devices')).toBeInTheDocument();
  });

  it('renders with product count', () => {
    render(
      <CategoryCard 
        {...defaultProps} 
        productCount={123}
      />
    );
    
    expect(screen.getByText('123 products')).toBeInTheDocument();
  });

  it('renders with image', () => {
    render(
      <CategoryCard 
        {...defaultProps} 
        image="/category-image.jpg"
      />
    );
    
    const img = screen.getByAltText('Electronics');
    expect(img).toHaveAttribute('src', '/category-image.jpg');
  });

  it('renders with icon when no image', () => {
    render(
      <CategoryCard 
        {...defaultProps} 
        icon="shopping-bag"
      />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'shopping-bag');
  });

  it('does not render icon when image is present', () => {
    render(
      <CategoryCard 
        {...defaultProps} 
        icon="shopping-bag"
        image="/category-image.jpg"
      />
    );
    
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('renders badge on image', () => {
    render(
      <CategoryCard 
        {...defaultProps} 
        image="/category-image.jpg"
        badge="New"
        badgeVariant="success"
      />
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('New');
    expect(badge).toHaveAttribute('data-variant', 'success');
  });

  it('renders different variants', () => {
    const { rerender } = render(
      <CategoryCard {...defaultProps} variant="minimal" />
    );
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    
    rerender(<CategoryCard {...defaultProps} variant="compact" icon="shopping-bag" />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    
    rerender(
      <CategoryCard 
        {...defaultProps} 
        variant="featured"
        description="Test description"
        subcategories={['Phones', 'Tablets', 'Laptops']}
      />
    );
    expect(screen.getByText('Phones')).toBeInTheDocument();
    expect(screen.getByText('Tablets')).toBeInTheDocument();
    expect(screen.getByText('Laptops')).toBeInTheDocument();
  });

  it('shows limited subcategories in featured variant', () => {
    render(
      <CategoryCard 
        {...defaultProps} 
        variant="featured"
        subcategories={['One', 'Two', 'Three', 'Four', 'Five']}
      />
    );
    
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('renders different layouts', () => {
    const { rerender } = render(
      <CategoryCard {...defaultProps} layout="vertical" />
    );
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    
    rerender(
      <CategoryCard 
        {...defaultProps} 
        layout="horizontal"
        image="/category-image.jpg"
      />
    );
    const link = screen.getByRole('link');
    expect(link.firstChild).toHaveClass('flex');
  });

  it('renders overlay variant', () => {
    render(
      <CategoryCard 
        {...defaultProps} 
        image="/category-image.jpg"
        overlay
        description="Test description"
        productCount={50}
      />
    );
    
    const title = screen.getByText('Electronics');
    expect(title.parentElement).toHaveClass('text-white');
  });

  it('applies different sizes', () => {
    const { rerender } = render(
      <CategoryCard {...defaultProps} size="sm" />
    );
    expect(screen.getByText('Electronics')).toHaveClass('text-sm');
    
    rerender(<CategoryCard {...defaultProps} size="lg" />);
    expect(screen.getByText('Electronics')).toHaveClass('text-lg');
  });

  it('applies different aspect ratios', () => {
    const { rerender } = render(
      <CategoryCard 
        {...defaultProps} 
        image="/category-image.jpg"
        imageAspectRatio="square"
      />
    );
    const imageContainer = screen.getByAltText('Electronics').parentElement;
    expect(imageContainer).toHaveClass('aspect-square');
    
    rerender(
      <CategoryCard 
        {...defaultProps} 
        image="/category-image.jpg"
        imageAspectRatio="16:9"
      />
    );
    const wideContainer = screen.getByAltText('Electronics').parentElement;
    expect(wideContainer).toHaveClass('aspect-video');
  });

  it('applies hover effects', () => {
    const { rerender } = render(
      <CategoryCard {...defaultProps} hoverEffect="lift" />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:-translate-y-1');
    
    rerender(<CategoryCard {...defaultProps} hoverEffect="zoom" />);
    expect(screen.getByRole('link')).toHaveClass('group');
    
    rerender(<CategoryCard {...defaultProps} hoverEffect="none" />);
    expect(screen.getByRole('link')).not.toHaveClass('hover:-translate-y-1');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <CategoryCard 
        {...defaultProps} 
        onClick={handleClick}
      />
    );
    
    fireEvent.click(screen.getByRole('link'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies custom classes', () => {
    render(
      <CategoryCard 
        {...defaultProps}
        className="custom-card"
        contentClassName="custom-content"
        imageClassName="custom-image"
        image="/test.jpg"
      />
    );
    
    expect(screen.getByRole('link')).toHaveClass('custom-card');
    const img = screen.getByAltText('Electronics');
    expect(img.parentElement).toHaveClass('custom-image');
  });

  it('uses custom aria-label', () => {
    render(
      <CategoryCard 
        {...defaultProps}
        aria-label="Shop electronics category"
      />
    );
    
    expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Shop electronics category');
  });

  it('uses default aria-label when not provided', () => {
    render(<CategoryCard {...defaultProps} />);
    
    expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Browse Electronics category');
  });
});

describe('CategoryCardGrid Component', () => {
  const mockCategories = [
    { id: 1, title: 'Electronics', href: '/electronics' },
    { id: 2, title: 'Clothing', href: '/clothing' },
    { id: 3, title: 'Books', href: '/books' },
    { id: 4, title: 'Home', href: '/home' },
  ];

  it('renders grid of category cards', () => {
    render(<CategoryCardGrid categories={mockCategories} />);
    
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies column classes', () => {
    const { rerender } = render(
      <CategoryCardGrid categories={mockCategories} columns={2} />
    );
    const grid = screen.getByText('Electronics').parentElement?.parentElement?.parentElement;
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
    
    rerender(<CategoryCardGrid categories={mockCategories} columns={4} />);
    const grid4 = screen.getByText('Electronics').parentElement?.parentElement?.parentElement;
    expect(grid4).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4');
  });

  it('applies gap classes', () => {
    const { rerender } = render(
      <CategoryCardGrid categories={mockCategories} gap="sm" />
    );
    const grid = screen.getByText('Electronics').parentElement?.parentElement?.parentElement;
    expect(grid).toHaveClass('gap-3');
    
    rerender(<CategoryCardGrid categories={mockCategories} gap="lg" />);
    const gridLg = screen.getByText('Electronics').parentElement?.parentElement?.parentElement;
    expect(gridLg).toHaveClass('gap-6');
  });

  it('passes size prop to cards', () => {
    render(<CategoryCardGrid categories={mockCategories} size="sm" />);
    
    expect(screen.getByText('Electronics')).toHaveClass('text-sm');
  });

  it('applies custom className', () => {
    render(
      <CategoryCardGrid 
        categories={mockCategories} 
        className="custom-grid"
      />
    );
    
    const grid = screen.getByText('Electronics').parentElement?.parentElement?.parentElement;
    expect(grid).toHaveClass('custom-grid');
  });
});