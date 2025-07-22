import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortDropdown } from './SortDropdown';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, size, variant }: any) => (
    <span data-testid="badge" data-size={size} data-variant={variant}>
      {children}
    </span>
  ),
}));

describe('SortDropdown Component', () => {
  const mockOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High', direction: 'asc' as const },
    { value: 'price-desc', label: 'Price: High to Low', direction: 'desc' as const },
  ];

  it('renders with label', () => {
    render(<SortDropdown options={mockOptions} />);
    
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<SortDropdown options={mockOptions} label="Order by" />);
    
    expect(screen.getByText('Order by:')).toBeInTheDocument();
  });

  it('shows placeholder when no value selected', () => {
    render(<SortDropdown options={mockOptions} placeholder="Choose sort" />);
    
    expect(screen.getByText('Choose sort')).toBeInTheDocument();
  });

  it('shows selected option', () => {
    render(<SortDropdown options={mockOptions} value="newest" />);
    
    expect(screen.getByText('Newest First')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<SortDropdown options={mockOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('closes dropdown on option select', () => {
    const handleChange = jest.fn();
    render(<SortDropdown options={mockOptions} onChange={handleChange} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    fireEvent.click(screen.getByText('Oldest First'));
    
    expect(handleChange).toHaveBeenCalledWith('oldest');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows direction indicators', () => {
    render(
      <SortDropdown
        options={mockOptions}
        value="price-asc"
        showDirection
      />
    );
    
    expect(screen.getByTestId('icon-arrow-up')).toBeInTheDocument();
  });

  it('hides direction indicators when showDirection is false', () => {
    render(
      <SortDropdown
        options={mockOptions}
        value="price-asc"
        showDirection={false}
      />
    );
    
    expect(screen.queryByTestId('icon-arrow-up')).not.toBeInTheDocument();
  });

  it('renders with icons', () => {
    const optionsWithIcons = [
      { value: 'date', label: 'Date', icon: 'calendar' },
      { value: 'name', label: 'Name', icon: 'type' },
    ];
    
    render(<SortDropdown options={optionsWithIcons} value="date" />);
    
    expect(screen.getByTestId('icon-calendar')).toBeInTheDocument();
  });

  it('renders with badges', () => {
    const optionsWithBadges = [
      { value: 'popular', label: 'Most Popular', badge: 'Hot' },
      { value: 'rated', label: 'Top Rated', badge: 'New' },
    ];
    
    render(<SortDropdown options={optionsWithBadges} value="popular" />);
    
    expect(screen.getByTestId('badge')).toHaveTextContent('Hot');
  });

  it('disables button when disabled prop is true', () => {
    render(<SortDropdown options={mockOptions} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<SortDropdown options={mockOptions} loading />);
    
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <SortDropdown options={mockOptions} />
        <div data-testid="outside">Outside element</div>
      </div>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    fireEvent.mouseDown(screen.getByTestId('outside'));
    
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<SortDropdown options={mockOptions} />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    // Open with Enter
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Close with Escape
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    
    // Open with Space
    await user.keyboard(' ');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Close with Escape again
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens with arrow keys', async () => {
    const user = userEvent.setup();
    render(<SortDropdown options={mockOptions} />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    // Open with ArrowDown
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Close and reopen with ArrowUp
    fireEvent.click(button);
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows check mark for selected option', () => {
    render(<SortDropdown options={mockOptions} value="oldest" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const options = screen.getAllByRole('option');
    const selectedOption = options.find(opt => opt.getAttribute('aria-selected') === 'true');
    
    expect(selectedOption).toBeInTheDocument();
    expect(selectedOption).toContainElement(screen.getByTestId('icon-check'));
  });

  it('renders different sizes', () => {
    const { rerender } = render(
      <SortDropdown options={mockOptions} size="sm" />
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    
    rerender(<SortDropdown options={mockOptions} size="lg" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-5', 'py-2.5', 'text-lg');
  });

  it('renders different variants', () => {
    const { rerender } = render(
      <SortDropdown options={mockOptions} variant="default" />
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('shadow-sm');
    
    rerender(<SortDropdown options={mockOptions} variant="outline" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border');
    
    rerender(<SortDropdown options={mockOptions} variant="ghost" />);
    button = screen.getByRole('button');
    expect(button).not.toHaveClass('border');
  });

  it('supports full width', () => {
    render(<SortDropdown options={mockOptions} fullWidth />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('aligns dropdown to end', () => {
    render(<SortDropdown options={mockOptions} align="end" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const dropdown = screen.getByRole('listbox');
    expect(dropdown).toHaveClass('right-0');
  });

  it('applies custom class names', () => {
    render(
      <SortDropdown
        options={mockOptions}
        className="custom-container"
        dropdownClassName="custom-dropdown"
      />
    );
    
    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass('custom-container');
    
    fireEvent.click(screen.getByRole('button'));
    const dropdown = screen.getByRole('listbox');
    expect(dropdown).toHaveClass('custom-dropdown');
  });

  it('uses custom aria-label', () => {
    render(
      <SortDropdown
        options={mockOptions}
        aria-label="Sort products"
      />
    );
    
    const button = screen.getByLabelText('Sort products');
    expect(button).toBeInTheDocument();
  });

  it('sets proper ARIA attributes', () => {
    render(<SortDropdown options={mockOptions} value="newest" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-label', 'Sort by options');
    
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('handles empty options array', () => {
    render(<SortDropdown options={[]} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const dropdown = screen.getByRole('listbox');
    expect(dropdown).toBeEmptyDOMElement();
  });
});