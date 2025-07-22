import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('renders with default value', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with custom default value', () => {
    render(<Counter defaultValue={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('increments value when plus button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter defaultValue={0} />);
    
    const incrementButton = screen.getByLabelText('Increase value');
    await user.click(incrementButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements value when minus button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter defaultValue={5} />);
    
    const decrementButton = screen.getByLabelText('Decrease value');
    await user.click(decrementButton);
    
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('respects min value', async () => {
    const user = userEvent.setup();
    render(<Counter defaultValue={0} min={0} />);
    
    const decrementButton = screen.getByLabelText('Decrease value');
    await user.click(decrementButton);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(decrementButton).toBeDisabled();
  });

  it('respects max value', async () => {
    const user = userEvent.setup();
    render(<Counter defaultValue={10} max={10} />);
    
    const incrementButton = screen.getByLabelText('Increase value');
    await user.click(incrementButton);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(incrementButton).toBeDisabled();
  });

  it('uses step value for increment/decrement', async () => {
    const user = userEvent.setup();
    render(<Counter defaultValue={0} step={5} />);
    
    const incrementButton = screen.getByLabelText('Increase value');
    await user.click(incrementButton);
    expect(screen.getByText('5')).toBeInTheDocument();
    
    await user.click(incrementButton);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles controlled value', () => {
    const handleChange = jest.fn();
    const { rerender } = render(<Counter value={5} onChange={handleChange} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    
    const incrementButton = screen.getByLabelText('Increase value');
    fireEvent.click(incrementButton);
    
    expect(handleChange).toHaveBeenCalledWith(6);
    
    rerender(<Counter value={10} onChange={handleChange} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('formats value with custom formatter', () => {
    const formatValue = (value: number) => `$${value.toFixed(2)}`;
    render(<Counter defaultValue={5} formatValue={formatValue} />);
    
    expect(screen.getByText('$5.00')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    const { container } = render(<Counter defaultValue={5} min={0} max={10} />);
    const counter = container.firstChild as HTMLElement;
    
    counter.focus();
    
    // Arrow up
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('6')).toBeInTheDocument();
    
    // Arrow down
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Home (min value)
    await user.keyboard('{Home}');
    expect(screen.getByText('0')).toBeInTheDocument();
    
    // End (max value)
    await user.keyboard('{End}');
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('disables all interactions when disabled', () => {
    render(<Counter defaultValue={5} disabled />);
    
    const decrementButton = screen.getByLabelText('Decrease value');
    const incrementButton = screen.getByLabelText('Increase value');
    
    expect(decrementButton).toBeDisabled();
    expect(incrementButton).toBeDisabled();
  });

  it('prevents changes when readOnly', async () => {
    const user = userEvent.setup();
    render(<Counter defaultValue={5} readOnly />);
    
    const incrementButton = screen.getByLabelText('Increase value');
    await user.click(incrementButton);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container: smallContainer } = render(<Counter size="sm" />);
    expect(smallContainer.firstChild).toHaveClass('h-8');
    
    const { container: mediumContainer } = render(<Counter size="md" />);
    expect(mediumContainer.firstChild).toHaveClass('h-10');
    
    const { container: largeContainer } = render(<Counter size="lg" />);
    expect(largeContainer.firstChild).toHaveClass('h-12');
  });

  it('applies variant styles', () => {
    const { container: defaultContainer } = render(<Counter variant="default" />);
    expect(defaultContainer.firstChild).toHaveClass('bg-neutral-100');
    
    const { container: outlineContainer } = render(<Counter variant="outline" />);
    expect(outlineContainer.firstChild).toHaveClass('border', 'border-neutral-300');
    
    const { container: primaryContainer } = render(<Counter variant="primary" />);
    expect(primaryContainer.firstChild).toHaveClass('bg-primary-50');
  });

  it('uses custom aria labels', () => {
    render(
      <Counter
        label="Quantity selector"
        decrementAriaLabel="Remove one item"
        incrementAriaLabel="Add one item"
      />
    );
    
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Quantity selector');
    expect(screen.getByLabelText('Remove one item')).toBeInTheDocument();
    expect(screen.getByLabelText('Add one item')).toBeInTheDocument();
  });

  it('clamps value between min and max', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Counter value={5} min={0} max={10} step={20} onChange={handleChange} />);
    
    const incrementButton = screen.getByLabelText('Increase value');
    await user.click(incrementButton);
    
    // Should clamp to max (10) instead of going to 25
    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Counter ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    const { container } = render(<Counter className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('announces value changes to screen readers', async () => {
    const user = userEvent.setup();
    render(<Counter defaultValue={0} />);
    
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-atomic', 'true');
    
    const incrementButton = screen.getByLabelText('Increase value');
    await user.click(incrementButton);
    
    expect(status).toHaveTextContent('1');
  });
});