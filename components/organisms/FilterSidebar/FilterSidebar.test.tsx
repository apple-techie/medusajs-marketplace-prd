import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterSidebar } from './FilterSidebar';

// Mock components
jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, variant, size, className, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size} className={className} {...props}>
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

jest.mock('../../atoms/Divider/Divider', () => ({
  Divider: ({ className }: any) => <hr className={className} />,
}));

jest.mock('../../atoms/StarRating/StarRating', () => ({
  StarRating: ({ rating, size, readOnly }: any) => (
    <div data-testid="star-rating" data-rating={rating} data-size={size} data-readonly={readOnly}>
      {rating} stars
    </div>
  ),
}));

jest.mock('../../atoms/Price/Price', () => ({
  Price: ({ amount, currency }: any) => (
    <span data-testid="price">${amount}</span>
  ),
}));

describe('FilterSidebar Component', () => {
  const mockSections = [
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox' as const,
      options: [
        { label: 'Electronics', value: 'electronics', count: 123 },
        { label: 'Fashion', value: 'fashion', count: 456 },
        { label: 'Home', value: 'home', count: 789 },
      ],
    },
    {
      id: 'price',
      title: 'Price Range',
      type: 'range' as const,
      range: { min: 0, max: 1000 },
    },
    {
      id: 'rating',
      title: 'Customer Rating',
      type: 'rating' as const,
    },
    {
      id: 'brand',
      title: 'Brand',
      type: 'checkbox' as const,
      options: [
        { label: 'Nike', value: 'nike' },
        { label: 'Adidas', value: 'adidas' },
        { label: 'Puma', value: 'puma' },
      ],
    },
  ];

  it('renders all filter sections', () => {
    render(<FilterSidebar sections={mockSections} />);
    
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByText('Customer Rating')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
  });

  it('renders checkbox options with counts', () => {
    render(<FilterSidebar sections={mockSections} />);
    
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('(123)')).toBeInTheDocument();
    expect(screen.getByText('Fashion')).toBeInTheDocument();
    expect(screen.getByText('(456)')).toBeInTheDocument();
  });

  it('handles checkbox filter selection', () => {
    const handleFilterChange = jest.fn();
    render(
      <FilterSidebar
        sections={mockSections}
        onFilterChange={handleFilterChange}
      />
    );
    
    const electronicsCheckbox = screen.getByLabelText(/Electronics/);
    fireEvent.click(electronicsCheckbox);
    
    expect(handleFilterChange).toHaveBeenCalledWith([
      { sectionId: 'category', value: 'electronics', label: 'Electronics' }
    ]);
  });

  it('renders price range inputs', () => {
    render(<FilterSidebar sections={mockSections} />);
    
    const minInput = screen.getAllByRole('spinbutton')[0];
    const maxInput = screen.getAllByRole('spinbutton')[1];
    
    expect(minInput).toHaveValue(0);
    expect(maxInput).toHaveValue(1000);
  });

  it('handles price range changes', () => {
    const handleFilterChange = jest.fn();
    render(
      <FilterSidebar
        sections={mockSections}
        onFilterChange={handleFilterChange}
      />
    );
    
    const minInput = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(minInput, { target: { value: '100' } });
    fireEvent.blur(minInput);
    
    expect(handleFilterChange).toHaveBeenCalledWith([
      { sectionId: 'price', value: { min: 100, max: 1000 } }
    ]);
  });

  it('renders rating filter options', () => {
    render(<FilterSidebar sections={mockSections} />);
    
    expect(screen.getByText('5 stars')).toBeInTheDocument();
    expect(screen.getByText('4 stars')).toBeInTheDocument();
    expect(screen.getByText('3 stars')).toBeInTheDocument();
  });

  it('handles rating filter selection', () => {
    const handleFilterChange = jest.fn();
    render(
      <FilterSidebar
        sections={mockSections}
        onFilterChange={handleFilterChange}
      />
    );
    
    // Click on 4 stars rating
    const fourStarOption = screen.getByText('4 stars').parentElement;
    fireEvent.click(fourStarOption!);
    
    expect(handleFilterChange).toHaveBeenCalledWith([
      { sectionId: 'rating', value: 4, label: '4+ stars' }
    ]);
  });

  it('toggles section expansion', () => {
    render(<FilterSidebar sections={mockSections} collapsible />);
    
    const categoryButton = screen.getByText('Category').closest('button');
    
    // Check initial expanded state
    expect(categoryButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click to collapse
    fireEvent.click(categoryButton!);
    expect(categoryButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders applied filters', () => {
    const appliedFilters = [
      { sectionId: 'category', value: 'electronics', label: 'Electronics' },
      { sectionId: 'price', value: { min: 100, max: 500 } },
    ];
    
    render(
      <FilterSidebar
        sections={mockSections}
        appliedFilters={appliedFilters}
        showAppliedFilters
      />
    );
    
    expect(screen.getByText('Applied Filters')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('handles clear all filters', () => {
    const handleFilterChange = jest.fn();
    const handleClearAll = jest.fn();
    const appliedFilters = [
      { sectionId: 'category', value: 'electronics', label: 'Electronics' },
    ];
    
    render(
      <FilterSidebar
        sections={mockSections}
        appliedFilters={appliedFilters}
        showAppliedFilters
        showClearAll
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    );
    
    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);
    
    expect(handleFilterChange).toHaveBeenCalledWith([]);
    expect(handleClearAll).toHaveBeenCalled();
  });

  it('handles removing individual filter', () => {
    const handleFilterChange = jest.fn();
    const appliedFilters = [
      { sectionId: 'category', value: 'electronics', label: 'Electronics' },
      { sectionId: 'category', value: 'fashion', label: 'Fashion' },
    ];
    
    render(
      <FilterSidebar
        sections={mockSections}
        appliedFilters={appliedFilters}
        showAppliedFilters
        onFilterChange={handleFilterChange}
      />
    );
    
    // Find and click remove button for Electronics filter
    const removeButtons = screen.getAllByLabelText(/Remove .* filter/);
    fireEvent.click(removeButtons[0]);
    
    expect(handleFilterChange).toHaveBeenCalledWith([
      { sectionId: 'category', value: 'fashion', label: 'Fashion' }
    ]);
  });

  it('shows result count when enabled', () => {
    render(
      <FilterSidebar
        sections={mockSections}
        showResultCount
        resultCount={42}
      />
    );
    
    expect(screen.getByText('42 results')).toBeInTheDocument();
  });

  it('renders apply filters button when callback provided', () => {
    const handleApplyFilters = jest.fn();
    
    render(
      <FilterSidebar
        sections={mockSections}
        onApplyFilters={handleApplyFilters}
      />
    );
    
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);
    
    expect(handleApplyFilters).toHaveBeenCalled();
  });

  it('renders color filter options', () => {
    const colorSection = {
      id: 'color',
      title: 'Color',
      type: 'color' as const,
      options: [
        { label: 'Red', value: '#FF0000' },
        { label: 'Blue', value: '#0000FF' },
        { label: 'Green', value: '#00FF00' },
      ],
    };
    
    render(<FilterSidebar sections={[colorSection]} />);
    
    const redButton = screen.getByTitle('Red');
    expect(redButton).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  it('renders size filter options', () => {
    const sizeSection = {
      id: 'size',
      title: 'Size',
      type: 'size' as const,
      options: [
        { label: 'S', value: 'small' },
        { label: 'M', value: 'medium' },
        { label: 'L', value: 'large' },
      ],
    };
    
    render(<FilterSidebar sections={[sizeSection]} />);
    
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('handles radio button filters', () => {
    const handleFilterChange = jest.fn();
    const radioSection = {
      id: 'sort',
      title: 'Sort By',
      type: 'radio' as const,
      options: [
        { label: 'Price: Low to High', value: 'price-asc' },
        { label: 'Price: High to Low', value: 'price-desc' },
      ],
    };
    
    render(
      <FilterSidebar
        sections={[radioSection]}
        onFilterChange={handleFilterChange}
      />
    );
    
    const priceAscRadio = screen.getByLabelText(/Price: Low to High/);
    fireEvent.click(priceAscRadio);
    
    expect(handleFilterChange).toHaveBeenCalledWith([
      { sectionId: 'sort', value: 'price-asc', label: 'Price: Low to High' }
    ]);
  });

  it('renders mobile trigger button when mobileAsModal is true', () => {
    render(
      <FilterSidebar
        sections={mockSections}
        mobileAsModal
        appliedFilters={[
          { sectionId: 'category', value: 'electronics', label: 'Electronics' }
        ]}
      />
    );
    
    const mobileButton = screen.getByRole('button', { name: /Filters/i });
    expect(mobileButton).toBeInTheDocument();
    
    // Shows badge with filter count
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('1');
  });

  it('opens mobile modal when trigger clicked', () => {
    render(
      <FilterSidebar
        sections={mockSections}
        mobileAsModal
      />
    );
    
    const mobileButton = screen.getByRole('button', { name: /Filters/i });
    fireEvent.click(mobileButton);
    
    // Modal should be visible
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('applies custom classes', () => {
    render(
      <FilterSidebar
        sections={mockSections}
        className="custom-sidebar"
        sectionClassName="custom-section"
      />
    );
    
    const sidebar = screen.getByLabelText('Product filters');
    expect(sidebar).toHaveClass('custom-sidebar');
  });

  it('uses aria-label', () => {
    render(
      <FilterSidebar
        sections={mockSections}
        aria-label="Custom filter sidebar"
      />
    );
    
    const sidebar = screen.getByLabelText('Custom filter sidebar');
    expect(sidebar).toBeInTheDocument();
  });
});