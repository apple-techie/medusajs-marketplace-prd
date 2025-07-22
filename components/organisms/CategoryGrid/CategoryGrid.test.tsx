import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryGrid, QuickCategoryGrid } from './CategoryGrid';

// Mock CategoryCard component
jest.mock('../../molecules/CategoryCard/CategoryCard', () => ({
  CategoryCard: ({ title, onClick, variant, size, ...props }: any) => (
    <div 
      data-testid={`category-${title}`}
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {title}
      {props.productCount && <span data-testid="product-count">{props.productCount}</span>}
      {props.badge && <span data-testid="badge">{props.badge}</span>}
    </div>
  ),
}));

// Mock Button component
jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, disabled, variant, as: Component = 'button', href, ...props }: any) => 
    Component === 'a' ? (
      <a href={href} data-variant={variant} {...props}>
        {children}
      </a>
    ) : (
      <button onClick={onClick} disabled={disabled} data-variant={variant} {...props}>
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

describe('CategoryGrid Component', () => {
  const mockCategories = [
    {
      id: 1,
      title: 'Electronics',
      description: 'Gadgets and devices',
      href: '/categories/electronics',
      icon: 'desktop',
      productCount: 1234,
    },
    {
      id: 2,
      title: 'Fashion',
      description: 'Clothing and accessories',
      href: '/categories/fashion',
      icon: 'shopping-bag',
      productCount: 567,
      featured: true,
    },
    {
      id: 3,
      title: 'Home',
      description: 'Home and garden',
      href: '/categories/home',
      icon: 'home',
      productCount: 890,
    },
    {
      id: 4,
      title: 'Sports',
      description: 'Sports equipment',
      href: '/categories/sports',
      icon: 'activity',
      productCount: 345,
      badge: 'Sale',
    },
  ];

  it('renders basic category grid', () => {
    render(<CategoryGrid categories={mockCategories} />);
    
    expect(screen.getByTestId('category-Electronics')).toBeInTheDocument();
    expect(screen.getByTestId('category-Fashion')).toBeInTheDocument();
    expect(screen.getByTestId('category-Home')).toBeInTheDocument();
    expect(screen.getByTestId('category-Sports')).toBeInTheDocument();
  });

  it('renders with title and subtitle', () => {
    render(
      <CategoryGrid
        categories={mockCategories}
        title="Shop by Category"
        subtitle="Browse our product categories"
      />
    );
    
    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    expect(screen.getByText('Browse our product categories')).toBeInTheDocument();
  });

  it('renders with view all button', () => {
    const handleViewAll = jest.fn();
    
    render(
      <CategoryGrid
        categories={mockCategories}
        showViewAll
        viewAllHref="/categories"
        viewAllText="See All"
        onViewAll={handleViewAll}
      />
    );
    
    const viewAllLink = screen.getByText('See All').closest('a');
    expect(viewAllLink).toHaveAttribute('href', '/categories');
    expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
  });

  it('handles category click', () => {
    const handleCategoryClick = jest.fn();
    
    render(
      <CategoryGrid
        categories={mockCategories}
        onCategoryClick={handleCategoryClick}
      />
    );
    
    fireEvent.click(screen.getByTestId('category-Electronics'));
    expect(handleCategoryClick).toHaveBeenCalledWith(mockCategories[0]);
  });

  it('renders loading skeletons', () => {
    render(
      <CategoryGrid
        categories={[]}
        loading
        skeletonCount={4}
      />
    );
    
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(4);
    expect(skeletons[0]).toHaveAttribute('data-variant', 'card');
  });

  it('renders empty state', () => {
    render(<CategoryGrid categories={[]} />);
    
    expect(screen.getByText('No categories found')).toBeInTheDocument();
    expect(screen.getByTestId('icon-folder')).toBeInTheDocument();
  });

  it('renders with filter options', () => {
    const handleFilterChange = jest.fn();
    const filterOptions = [
      { label: 'Popular', value: 'popular' },
      { label: 'New', value: 'new' },
    ];
    
    render(
      <CategoryGrid
        categories={mockCategories}
        showFilter
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
    );
    
    const filterSelect = screen.getByLabelText('Filter categories');
    expect(filterSelect).toBeInTheDocument();
    
    fireEvent.change(filterSelect, { target: { value: 'popular' } });
    expect(handleFilterChange).toHaveBeenCalledWith('popular');
  });

  it('renders with sort options', () => {
    const handleSortChange = jest.fn();
    const sortOptions = [
      { label: 'Name A-Z', value: 'name' },
      { label: 'Name Z-A', value: 'name-desc' },
      { label: 'Most Products', value: 'products' },
    ];
    
    render(
      <CategoryGrid
        categories={mockCategories}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
      />
    );
    
    const sortSelect = screen.getByLabelText('Sort categories');
    expect(sortSelect).toBeInTheDocument();
    
    fireEvent.change(sortSelect, { target: { value: 'products' } });
    expect(handleSortChange).toHaveBeenCalledWith('products');
  });

  it('sorts categories correctly', () => {
    const sortOptions = [
      { label: 'Name A-Z', value: 'name' },
      { label: 'Most Products', value: 'products' },
    ];
    
    const { rerender } = render(
      <CategoryGrid
        categories={mockCategories}
        sortOptions={sortOptions}
        defaultSort="name"
      />
    );
    
    // Check alphabetical order
    const categoriesInOrder = screen.getAllByTestId(/^category-/);
    expect(categoriesInOrder[0]).toHaveAttribute('data-testid', 'category-Electronics');
    expect(categoriesInOrder[1]).toHaveAttribute('data-testid', 'category-Fashion');
    expect(categoriesInOrder[2]).toHaveAttribute('data-testid', 'category-Home');
    expect(categoriesInOrder[3]).toHaveAttribute('data-testid', 'category-Sports');
  });

  it('renders featured categories separately', () => {
    render(
      <CategoryGrid
        categories={mockCategories}
        showFeaturedSeparately
        featuredTitle="Featured Categories"
        featuredSubtitle="Top picks for you"
      />
    );
    
    expect(screen.getByText('Featured Categories')).toBeInTheDocument();
    expect(screen.getByText('Top picks for you')).toBeInTheDocument();
    
    // Fashion is featured
    const fashionCard = screen.getByTestId('category-Fashion');
    expect(fashionCard).toHaveAttribute('data-variant', 'featured');
    expect(fashionCard).toHaveAttribute('data-size', 'lg');
  });

  it('handles pagination', () => {
    const manyCategories = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Category ${i + 1}`,
      href: `/categories/${i + 1}`,
    }));
    
    render(
      <CategoryGrid
        categories={manyCategories}
        showPagination
        itemsPerPage={6}
      />
    );
    
    // Should show first 6 categories
    expect(screen.getByTestId('category-Category 1')).toBeInTheDocument();
    expect(screen.getByTestId('category-Category 6')).toBeInTheDocument();
    expect(screen.queryByTestId('category-Category 7')).not.toBeInTheDocument();
    
    // Check pagination controls
    const nextButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('[data-testid="icon-chevron-right"]')
    );
    
    fireEvent.click(nextButton!);
    
    // Should now show categories 7-12
    expect(screen.queryByTestId('category-Category 6')).not.toBeInTheDocument();
    expect(screen.getByTestId('category-Category 7')).toBeInTheDocument();
  });

  it('applies different column layouts', () => {
    const { rerender } = render(
      <CategoryGrid categories={mockCategories} columns={2} />
    );
    let grid = screen.getByTestId('category-Electronics').parentElement;
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    
    rerender(<CategoryGrid categories={mockCategories} columns={6} />);
    grid = screen.getByTestId('category-Electronics').parentElement;
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'xl:grid-cols-6');
  });

  it('applies different gap sizes', () => {
    const { rerender } = render(
      <CategoryGrid categories={mockCategories} gap="sm" />
    );
    let grid = screen.getByTestId('category-Electronics').parentElement;
    expect(grid).toHaveClass('gap-4');
    
    rerender(<CategoryGrid categories={mockCategories} gap="lg" />);
    grid = screen.getByTestId('category-Electronics').parentElement;
    expect(grid).toHaveClass('gap-8');
  });

  it('renders different variants', () => {
    const { rerender } = render(
      <CategoryGrid categories={mockCategories} variant="compact" />
    );
    expect(screen.getByTestId('category-Electronics')).toHaveAttribute('data-variant', 'compact');
    expect(screen.getByTestId('category-Electronics')).toHaveAttribute('data-size', 'sm');
    
    rerender(<CategoryGrid categories={mockCategories} variant="featured" />);
    expect(screen.getByTestId('category-Electronics')).toHaveAttribute('data-variant', 'featured');
  });

  it('applies custom classes', () => {
    render(
      <CategoryGrid
        categories={mockCategories}
        className="custom-section"
        headerClassName="custom-header"
        gridClassName="custom-grid"
      />
    );
    
    const section = screen.getByTestId('category-Electronics').closest('section');
    expect(section).toHaveClass('custom-section');
  });

  it('uses aria-label', () => {
    render(
      <CategoryGrid
        categories={mockCategories}
        aria-label="Product categories"
      />
    );
    
    const section = screen.getByLabelText('Product categories');
    expect(section).toBeInTheDocument();
  });
});

describe('QuickCategoryGrid Component', () => {
  const quickCategories = [
    { id: 1, title: 'Electronics', icon: 'desktop', href: '/electronics', productCount: 123 },
    { id: 2, title: 'Fashion', icon: 'shopping-bag', href: '/fashion', productCount: 456 },
    { id: 3, title: 'Home', icon: 'home', href: '/home' },
    { id: 4, title: 'Sports', icon: 'activity', href: '/sports', productCount: 789 },
  ];

  it('renders quick category grid', () => {
    render(<QuickCategoryGrid categories={quickCategories} />);
    
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Fashion')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
  });

  it('renders category icons', () => {
    render(<QuickCategoryGrid categories={quickCategories} />);
    
    expect(screen.getByTestId('icon-desktop')).toBeInTheDocument();
    expect(screen.getByTestId('icon-shopping-bag')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-activity')).toBeInTheDocument();
  });

  it('renders product counts when provided', () => {
    render(<QuickCategoryGrid categories={quickCategories} />);
    
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getByText('789')).toBeInTheDocument();
  });

  it('renders with different column counts', () => {
    const { rerender } = render(
      <QuickCategoryGrid categories={quickCategories} columns={4} />
    );
    let grid = screen.getByText('Electronics').closest('div')?.parentElement;
    expect(grid).toHaveClass('grid-cols-2', 'sm:grid-cols-4');
    
    rerender(<QuickCategoryGrid categories={quickCategories} columns={8} />);
    grid = screen.getByText('Electronics').closest('div')?.parentElement;
    expect(grid).toHaveClass('grid-cols-4', 'sm:grid-cols-6', 'md:grid-cols-8');
  });

  it('creates correct links', () => {
    render(<QuickCategoryGrid categories={quickCategories} />);
    
    const electronicsLink = screen.getByText('Electronics').closest('a');
    expect(electronicsLink).toHaveAttribute('href', '/electronics');
    
    const fashionLink = screen.getByText('Fashion').closest('a');
    expect(fashionLink).toHaveAttribute('href', '/fashion');
  });
});