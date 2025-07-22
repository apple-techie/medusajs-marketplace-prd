import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewToggle } from './ViewToggle';

// Mock Icon component
jest.mock('../Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

describe('ViewToggle Component', () => {
  it('renders both view options', () => {
    render(<ViewToggle value="grid" />);
    
    expect(screen.getByTestId('icon-grid')).toBeInTheDocument();
    expect(screen.getByTestId('icon-list')).toBeInTheDocument();
  });

  it('shows grid view as active', () => {
    render(<ViewToggle value="grid" />);
    
    const gridButton = screen.getByLabelText('Grid view');
    const listButton = screen.getByLabelText('List view');
    
    expect(gridButton).toHaveAttribute('aria-checked', 'true');
    expect(listButton).toHaveAttribute('aria-checked', 'false');
  });

  it('shows list view as active', () => {
    render(<ViewToggle value="list" />);
    
    const gridButton = screen.getByLabelText('Grid view');
    const listButton = screen.getByLabelText('List view');
    
    expect(gridButton).toHaveAttribute('aria-checked', 'false');
    expect(listButton).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when clicking inactive option', () => {
    const handleChange = jest.fn();
    render(<ViewToggle value="grid" onChange={handleChange} />);
    
    const listButton = screen.getByLabelText('List view');
    fireEvent.click(listButton);
    
    expect(handleChange).toHaveBeenCalledWith('list');
  });

  it('does not call onChange when clicking active option', () => {
    const handleChange = jest.fn();
    render(<ViewToggle value="grid" onChange={handleChange} />);
    
    const gridButton = screen.getByLabelText('Grid view');
    fireEvent.click(gridButton);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders with labels when showLabels is true', () => {
    render(<ViewToggle value="grid" showLabels />);
    
    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
  });

  it('hides labels when showLabels is false', () => {
    render(<ViewToggle value="grid" showLabels={false} />);
    
    expect(screen.queryByText('Grid')).not.toBeInTheDocument();
    expect(screen.queryByText('List')).not.toBeInTheDocument();
  });

  it('disables buttons when disabled prop is true', () => {
    render(<ViewToggle value="grid" disabled />);
    
    const gridButton = screen.getByLabelText('Grid view');
    const listButton = screen.getByLabelText('List view');
    
    expect(gridButton).toBeDisabled();
    expect(listButton).toBeDisabled();
  });

  it('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<ViewToggle value="grid" onChange={handleChange} disabled />);
    
    const listButton = screen.getByLabelText('List view');
    fireEvent.click(listButton);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders different sizes', () => {
    const { rerender } = render(<ViewToggle value="grid" size="sm" />);
    
    let container = screen.getByRole('radiogroup');
    expect(container).toHaveClass('p-0.5');
    
    rerender(<ViewToggle value="grid" size="md" />);
    container = screen.getByRole('radiogroup');
    expect(container).toHaveClass('p-1');
    
    rerender(<ViewToggle value="grid" size="lg" />);
    container = screen.getByRole('radiogroup');
    expect(container).toHaveClass('p-1');
  });

  it('renders different variants', () => {
    const { rerender } = render(<ViewToggle value="grid" variant="default" />);
    
    let container = screen.getByRole('radiogroup');
    expect(container).toHaveClass('bg-neutral-100');
    
    rerender(<ViewToggle value="grid" variant="outline" />);
    container = screen.getByRole('radiogroup');
    expect(container).toHaveClass('border');
    
    rerender(<ViewToggle value="grid" variant="ghost" />);
    container = screen.getByRole('radiogroup');
    expect(container).not.toHaveClass('bg-neutral-100');
    expect(container).not.toHaveClass('border');
  });

  it('uses custom labels', () => {
    render(
      <ViewToggle
        value="grid"
        gridLabel="Grid layout"
        listLabel="List layout"
      />
    );
    
    expect(screen.getByLabelText('Grid layout')).toBeInTheDocument();
    expect(screen.getByLabelText('List layout')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ViewToggle value="grid" className="custom-class" />);
    
    const container = screen.getByRole('radiogroup');
    expect(container).toHaveClass('custom-class');
  });

  it('uses custom aria-label', () => {
    render(<ViewToggle value="grid" aria-label="Product view options" />);
    
    const container = screen.getByLabelText('Product view options');
    expect(container).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<ViewToggle value="grid" />);
    
    const container = screen.getByRole('radiogroup');
    expect(container).toHaveAttribute('aria-label', 'View mode');
    
    const gridButton = screen.getByLabelText('Grid view');
    expect(gridButton).toHaveAttribute('role', 'radio');
    expect(gridButton).toHaveAttribute('aria-checked', 'true');
    
    const listButton = screen.getByLabelText('List view');
    expect(listButton).toHaveAttribute('role', 'radio');
    expect(listButton).toHaveAttribute('aria-checked', 'false');
  });

  it('maintains focus after click', () => {
    render(<ViewToggle value="grid" onChange={() => {}} />);
    
    const listButton = screen.getByLabelText('List view');
    listButton.focus();
    fireEvent.click(listButton);
    
    expect(listButton).toHaveFocus();
  });

  it('applies correct active styles', () => {
    render(<ViewToggle value="grid" variant="default" />);
    
    const gridButton = screen.getByLabelText('Grid view');
    const listButton = screen.getByLabelText('List view');
    
    expect(gridButton).toHaveClass('bg-white', 'shadow-sm');
    expect(listButton).toHaveClass('text-neutral-600');
  });

  it('switches between views correctly', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <ViewToggle value="grid" onChange={handleChange} />
    );
    
    // Click list view
    fireEvent.click(screen.getByLabelText('List view'));
    expect(handleChange).toHaveBeenCalledWith('list');
    
    // Update value
    rerender(<ViewToggle value="list" onChange={handleChange} />);
    
    // Click grid view
    fireEvent.click(screen.getByLabelText('Grid view'));
    expect(handleChange).toHaveBeenCalledWith('grid');
  });
});