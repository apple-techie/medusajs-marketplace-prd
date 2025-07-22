import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveFilters } from './ActiveFilters';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, className, variant }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, className, variant, size }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

describe('ActiveFilters Component', () => {
  const mockFilters = [
    { id: '1', type: 'category', label: 'Category', value: 'Electronics' },
    { id: '2', type: 'price', label: 'Price', value: '$100-$500' },
    { id: '3', type: 'brand', label: 'Brand', value: 'Apple' },
  ];

  it('renders all filters', () => {
    render(<ActiveFilters filters={mockFilters} />);
    
    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Price:')).toBeInTheDocument();
    expect(screen.getByText('$100-$500')).toBeInTheDocument();
    expect(screen.getByText('Brand:')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('shows filter count', () => {
    render(<ActiveFilters filters={mockFilters} showCount />);
    
    expect(screen.getByText('3 filters:')).toBeInTheDocument();
  });

  it('shows singular filter count', () => {
    render(<ActiveFilters filters={[mockFilters[0]]} showCount />);
    
    expect(screen.getByText('1 filter:')).toBeInTheDocument();
  });

  it('hides filter count when showCount is false', () => {
    render(<ActiveFilters filters={mockFilters} showCount={false} />);
    
    expect(screen.queryByText('3 filters:')).not.toBeInTheDocument();
  });

  it('renders nothing when filters array is empty', () => {
    const { container } = render(<ActiveFilters filters={[]} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('calls onRemove when clicking remove button', () => {
    const handleRemove = jest.fn();
    render(<ActiveFilters filters={mockFilters} onRemove={handleRemove} />);
    
    const removeButtons = screen.getAllByLabelText(/Remove .* filter/);
    fireEvent.click(removeButtons[0]);
    
    expect(handleRemove).toHaveBeenCalledWith('1');
  });

  it('shows clear all button', () => {
    const handleClearAll = jest.fn();
    render(
      <ActiveFilters
        filters={mockFilters}
        onClearAll={handleClearAll}
        showClearAll
      />
    );
    
    const clearAllButton = screen.getByText('Clear all');
    expect(clearAllButton).toBeInTheDocument();
    
    fireEvent.click(clearAllButton);
    expect(handleClearAll).toHaveBeenCalled();
  });

  it('hides clear all button when showClearAll is false', () => {
    render(
      <ActiveFilters
        filters={mockFilters}
        onClearAll={() => {}}
        showClearAll={false}
      />
    );
    
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('hides clear all button when onClearAll is not provided', () => {
    render(<ActiveFilters filters={mockFilters} showClearAll />);
    
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('collapses filters when exceeding maxVisible', () => {
    const manyFilters = Array.from({ length: 8 }, (_, i) => ({
      id: `${i}`,
      type: 'test',
      label: `Filter ${i}`,
      value: `Value ${i}`,
    }));
    
    render(
      <ActiveFilters
        filters={manyFilters}
        collapsible
        maxVisible={5}
      />
    );
    
    // Should only show first 5 filters
    expect(screen.getByText('Filter 0:')).toBeInTheDocument();
    expect(screen.getByText('Filter 4:')).toBeInTheDocument();
    expect(screen.queryByText('Filter 5:')).not.toBeInTheDocument();
    
    // Should show "Show more" button
    expect(screen.getByText('Show more')).toBeInTheDocument();
    expect(screen.getByText('(3)')).toBeInTheDocument();
  });

  it('expands and collapses filters', () => {
    const manyFilters = Array.from({ length: 8 }, (_, i) => ({
      id: `${i}`,
      type: 'test',
      label: `Filter ${i}`,
      value: `Value ${i}`,
    }));
    
    render(
      <ActiveFilters
        filters={manyFilters}
        collapsible
        maxVisible={5}
      />
    );
    
    const toggleButton = screen.getByText('Show more');
    fireEvent.click(toggleButton);
    
    // Should show all filters
    expect(screen.getByText('Filter 5:')).toBeInTheDocument();
    expect(screen.getByText('Filter 7:')).toBeInTheDocument();
    
    // Button should change to "Show less"
    expect(screen.getByText('Show less')).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(screen.getByText('Show less'));
    expect(screen.queryByText('Filter 5:')).not.toBeInTheDocument();
  });

  it('does not show expand button when collapsible is false', () => {
    const manyFilters = Array.from({ length: 8 }, (_, i) => ({
      id: `${i}`,
      type: 'test',
      label: `Filter ${i}`,
      value: `Value ${i}`,
    }));
    
    render(
      <ActiveFilters
        filters={manyFilters}
        collapsible={false}
        maxVisible={5}
      />
    );
    
    // Should show all filters
    expect(screen.getByText('Filter 7:')).toBeInTheDocument();
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
  });

  it('collapses automatically when removing filters', () => {
    const manyFilters = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`,
      type: 'test',
      label: `Filter ${i}`,
      value: `Value ${i}`,
    }));
    
    const { rerender } = render(
      <ActiveFilters
        filters={manyFilters}
        onRemove={() => {}}
        collapsible
        maxVisible={5}
      />
    );
    
    // Expand filters
    fireEvent.click(screen.getByText('Show more'));
    expect(screen.getByText('Filter 5:')).toBeInTheDocument();
    
    // Simulate removing a filter (now only 5 filters)
    const reducedFilters = manyFilters.slice(0, 5);
    rerender(
      <ActiveFilters
        filters={reducedFilters}
        onRemove={() => {}}
        collapsible
        maxVisible={5}
      />
    );
    
    // Should not show expand button anymore
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
    expect(screen.queryByText('Show less')).not.toBeInTheDocument();
  });

  it('renders with array values', () => {
    const filtersWithArray = [
      {
        id: '1',
        type: 'colors',
        label: 'Colors',
        value: ['Red', 'Blue', 'Green'],
      },
    ];
    
    render(<ActiveFilters filters={filtersWithArray} />);
    
    expect(screen.getByText('Red, Blue, Green')).toBeInTheDocument();
  });

  it('uses displayValue when provided', () => {
    const filtersWithDisplay = [
      {
        id: '1',
        type: 'price',
        label: 'Price',
        value: 'price_100_500',
        displayValue: '$100 - $500',
      },
    ];
    
    render(<ActiveFilters filters={filtersWithDisplay} />);
    
    expect(screen.getByText('$100 - $500')).toBeInTheDocument();
    expect(screen.queryByText('price_100_500')).not.toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(<ActiveFilters filters={mockFilters} variant="compact" />);
    
    const badges = screen.getAllByTestId('badge');
    badges.forEach(badge => {
      expect(badge).toHaveClass('text-xs');
    });
  });

  it('uses custom labels', () => {
    render(
      <ActiveFilters
        filters={mockFilters}
        onClearAll={() => {}}
        clearAllLabel="Remove all"
        countLabel="active filters"
      />
    );
    
    expect(screen.getByText('3 active filters:')).toBeInTheDocument();
    expect(screen.getByText('Remove all')).toBeInTheDocument();
  });

  it('uses custom show more/less labels', () => {
    const manyFilters = Array.from({ length: 8 }, (_, i) => ({
      id: `${i}`,
      type: 'test',
      label: `Filter ${i}`,
      value: `Value ${i}`,
    }));
    
    render(
      <ActiveFilters
        filters={manyFilters}
        collapsible
        maxVisible={5}
        showMoreLabel="View all"
        showLessLabel="Collapse"
      />
    );
    
    expect(screen.getByText('View all')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('View all'));
    expect(screen.getByText('Collapse')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    render(
      <ActiveFilters
        filters={mockFilters}
        className="custom-container"
        filterClassName="custom-filter"
      />
    );
    
    const container = screen.getByLabelText('Active filters');
    expect(container).toHaveClass('custom-container');
    
    const badges = screen.getAllByTestId('badge');
    badges.forEach(badge => {
      expect(badge).toHaveClass('custom-filter');
    });
  });

  it('uses custom aria-label', () => {
    render(
      <ActiveFilters
        filters={mockFilters}
        aria-label="Current search filters"
      />
    );
    
    expect(screen.getByLabelText('Current search filters')).toBeInTheDocument();
  });

  it('has proper ARIA labels for remove buttons', () => {
    render(<ActiveFilters filters={mockFilters} onRemove={() => {}} />);
    
    expect(screen.getByLabelText('Remove Category filter')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove Price filter')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove Brand filter')).toBeInTheDocument();
  });

  it('hides remove buttons when onRemove is not provided', () => {
    render(<ActiveFilters filters={mockFilters} />);
    
    expect(screen.queryByLabelText(/Remove .* filter/)).not.toBeInTheDocument();
  });
});