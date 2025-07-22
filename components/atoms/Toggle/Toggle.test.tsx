import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle Component', () => {
  it('renders without label', () => {
    const { container } = render(<Toggle />);
    const toggle = container.querySelector('input[type="checkbox"]');
    expect(toggle).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Toggle label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <Toggle 
        label="Dark mode" 
        description="Use dark theme across the app" 
      />
    );
    expect(screen.getByText('Use dark theme across the app')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    const { container } = render(<Toggle checked readOnly />);
    const toggle = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
  });

  it('handles unchecked state', () => {
    const { container } = render(<Toggle />);
    const toggle = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(toggle.checked).toBe(false);
  });

  it('toggles state when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { container } = render(<Toggle onCheckedChange={handleChange} />);
    const toggle = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    
    expect(toggle.checked).toBe(false);
    
    await user.click(toggle);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(toggle.checked).toBe(true);
    
    await user.click(toggle);
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(toggle.checked).toBe(false);
  });

  it('handles controlled state', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <Toggle checked={false} onCheckedChange={handleChange} />
    );
    
    const label = document.querySelector('[data-state]');
    expect(label).toHaveAttribute('data-state', 'unchecked');
    
    rerender(<Toggle checked={true} onCheckedChange={handleChange} />);
    expect(label).toHaveAttribute('data-state', 'checked');
  });

  it('handles uncontrolled state with defaultChecked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { container } = render(
      <Toggle defaultChecked={true} onCheckedChange={handleChange} />
    );
    
    const toggle = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
    
    await user.click(toggle);
    expect(toggle.checked).toBe(false);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('applies error variant', () => {
    const { container } = render(<Toggle error />);
    const label = container.querySelector('[data-state]');
    expect(label).toHaveClass('bg-danger-100');
  });

  it('handles disabled state', () => {
    render(<Toggle label="Disabled toggle" disabled />);
    const toggle = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    
    expect(toggle).toBeDisabled();
    expect(screen.getByText('Disabled toggle').parentElement?.parentElement).toHaveClass('opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Toggle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className', () => {
    const { container } = render(<Toggle className="custom-class" />);
    const toggleLabel = container.querySelector('[data-state]');
    expect(toggleLabel).toHaveClass('custom-class');
  });

  it('renders label on the left', () => {
    const { container } = render(
      <Toggle label="Left label" labelPosition="left" />
    );
    
    const wrapper = container.firstChild;
    const label = screen.getByText('Left label');
    const toggle = container.querySelector('[data-state]');
    
    // Label should come before the toggle
    expect(wrapper?.firstChild).toContain(label);
    expect(wrapper?.lastChild).toBe(toggle);
  });

  it('renders label on the right by default', () => {
    const { container } = render(
      <Toggle label="Right label" />
    );
    
    const wrapper = container.firstChild;
    const label = screen.getByText('Right label');
    const toggle = container.querySelector('[data-state]');
    
    // Toggle should come before the label
    expect(wrapper?.firstChild).toBe(toggle);
    expect(wrapper?.lastChild).toContain(label);
  });

  it('moves thumb when toggled', async () => {
    const user = userEvent.setup();
    const { container } = render(<Toggle />);
    const thumb = container.querySelector('[aria-hidden="true"]');
    
    expect(thumb).toHaveAttribute('data-state', 'unchecked');
    expect(thumb).toHaveClass('data-[state=unchecked]:translate-x-0');
    
    const toggle = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await user.click(toggle);
    
    expect(thumb).toHaveAttribute('data-state', 'checked');
    expect(thumb).toHaveClass('data-[state=checked]:translate-x-5');
  });

  it('applies containerClassName', () => {
    render(<Toggle containerClassName="container-class" label="Test" />);
    const container = screen.getByText('Test').parentElement?.parentElement;
    expect(container).toHaveClass('container-class');
  });

  it('calls both onChange and onCheckedChange', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const handleCheckedChange = jest.fn();
    
    const { container } = render(
      <Toggle onChange={handleChange} onCheckedChange={handleCheckedChange} />
    );
    
    const toggle = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await user.click(toggle);
    
    expect(handleChange).toHaveBeenCalled();
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });
});