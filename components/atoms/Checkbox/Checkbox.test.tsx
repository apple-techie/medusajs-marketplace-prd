import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  it('renders without label', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Checkbox label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <Checkbox 
        label="Test Label" 
        description="Test Description" 
      />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    const { container } = render(<Checkbox defaultChecked />);
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('handles unchecked state', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('toggles when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(<Checkbox label="Click me" onChange={handleChange} />);
    
    const label = screen.getByText('Click me');
    await user.click(label);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          checked: true,
        }),
      })
    );
  });

  it('works in controlled mode', () => {
    const { rerender } = render(<Checkbox checked={false} onChange={() => {}} />);
    const getCheckbox = () => document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    
    expect(getCheckbox().checked).toBe(false);
    
    rerender(<Checkbox checked={true} onChange={() => {}} />);
    expect(getCheckbox().checked).toBe(true);
  });

  it('works in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Uncontrolled" />);
    
    const label = screen.getByText('Uncontrolled');
    const getCheckbox = () => document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    
    expect(getCheckbox().checked).toBe(false);
    
    await user.click(label);
    expect(getCheckbox().checked).toBe(true);
    
    await user.click(label);
    expect(getCheckbox().checked).toBe(false);
  });

  it('handles disabled state', () => {
    render(<Checkbox label="Disabled" disabled />);
    const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    
    expect(checkbox).toBeDisabled();
    expect(screen.getByText('Disabled').parentElement).toHaveClass('opacity-50');
  });

  it('applies error variant', () => {
    const { container } = render(<Checkbox error />);
    const checkboxUI = container.querySelector('[data-state]');
    expect(checkboxUI).toHaveClass('border-danger-500');
  });

  it('shows indeterminate state', () => {
    const { container } = render(<Checkbox indeterminate />);
    const checkboxUI = container.querySelector('[data-state]');
    const indeterminateBar = checkboxUI?.querySelector('div');
    
    expect(indeterminateBar).toBeInTheDocument();
    expect(indeterminateBar).toHaveClass('h-[2px]', 'w-3');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className', () => {
    const { container } = render(<Checkbox className="custom-class" />);
    const checkboxUI = container.querySelector('[data-state]');
    expect(checkboxUI).toHaveClass('custom-class');
  });

  it('applies containerClassName', () => {
    render(<Checkbox containerClassName="container-class" label="Test" />);
    const container = screen.getByText('Test').parentElement;
    expect(container).toHaveClass('container-class');
  });

  it('renders custom check icon', () => {
    const CustomIcon = () => <span data-testid="custom-icon">✓</span>;
    render(<Checkbox defaultChecked checkIcon={<CustomIcon />} />);
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('respects required attribute', () => {
    const { container } = render(<Checkbox required />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveAttribute('required');
  });

  it('handles form submission', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());
    
    render(
      <form onSubmit={handleSubmit}>
        <Checkbox name="terms" label="Accept terms" />
        <button type="submit">Submit</button>
      </form>
    );
    
    fireEvent.click(screen.getByText('Submit'));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('maintains accessibility', () => {
    render(<Checkbox label="Accessible checkbox" />);
    
    const checkbox = document.querySelector('input[type="checkbox"]');
    const label = screen.getByText('Accessible checkbox');
    
    // Input should be screen-reader only
    expect(checkbox).toHaveClass('sr-only');
    
    // Label should be clickable
    expect(label.parentElement?.tagName).toBe('LABEL');
  });
});