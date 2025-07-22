import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioButton, RadioGroup } from './RadioButton';

describe('RadioButton Component', () => {
  it('renders without label', () => {
    const { container } = render(<RadioButton />);
    const radio = container.querySelector('input[type="radio"]');
    expect(radio).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<RadioButton label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <RadioButton 
        label="Test Label" 
        description="Test Description" 
      />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    const { container } = render(<RadioButton checked readOnly />);
    const radio = container.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it('handles unchecked state', () => {
    const { container } = render(<RadioButton />);
    const radio = container.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(radio.checked).toBe(false);
  });

  it('applies error variant', () => {
    const { container } = render(<RadioButton error />);
    const radioUI = container.querySelector('[data-state]');
    expect(radioUI).toHaveClass('border-danger-500');
  });

  it('handles disabled state', () => {
    render(<RadioButton label="Disabled" disabled />);
    const radio = document.querySelector('input[type="radio"]') as HTMLInputElement;
    
    expect(radio).toBeDisabled();
    expect(screen.getByText('Disabled').parentElement).toHaveClass('opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<RadioButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className', () => {
    const { container } = render(<RadioButton className="custom-class" />);
    const radioUI = container.querySelector('[aria-hidden="true"]');
    expect(radioUI).toHaveClass('custom-class');
  });

  it('applies containerClassName', () => {
    render(<RadioButton containerClassName="container-class" label="Test" />);
    const container = screen.getByText('Test').parentElement;
    expect(container).toHaveClass('container-class');
  });
});

describe('RadioGroup Component', () => {
  it('renders multiple radio buttons', () => {
    render(
      <RadioGroup name="test">
        <RadioButton value="1" label="Option 1" />
        <RadioButton value="2" label="Option 2" />
        <RadioButton value="3" label="Option 3" />
      </RadioGroup>
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('handles controlled selection', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <RadioGroup name="test" value="1" onChange={handleChange}>
        <RadioButton value="1" label="Option 1" />
        <RadioButton value="2" label="Option 2" />
      </RadioGroup>
    );

    const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement;
    const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement;

    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);

    fireEvent.click(radio2);
    expect(handleChange).toHaveBeenCalledWith('2');

    rerender(
      <RadioGroup name="test" value="2" onChange={handleChange}>
        <RadioButton value="1" label="Option 1" />
        <RadioButton value="2" label="Option 2" />
      </RadioGroup>
    );

    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);
  });

  it('handles uncontrolled selection', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(
      <RadioGroup name="test" defaultValue="1" onChange={handleChange}>
        <RadioButton value="1" label="Option 1" />
        <RadioButton value="2" label="Option 2" />
        <RadioButton value="3" label="Option 3" />
      </RadioGroup>
    );

    const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement;
    const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement;
    const radio3 = screen.getByLabelText('Option 3') as HTMLInputElement;

    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);
    expect(radio3.checked).toBe(false);

    await user.click(radio2);
    
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);
    expect(radio3.checked).toBe(false);
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('all radio buttons in group share the same name', () => {
    const { container } = render(
      <RadioGroup name="test-group">
        <RadioButton value="1" label="Option 1" />
        <RadioButton value="2" label="Option 2" />
        <RadioButton value="3" label="Option 3" />
      </RadioGroup>
    );

    const radios = container.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', 'test-group');
    });
  });

  it('applies horizontal orientation', () => {
    const { container } = render(
      <RadioGroup name="test" orientation="horizontal">
        <RadioButton value="1" label="Option 1" />
        <RadioButton value="2" label="Option 2" />
      </RadioGroup>
    );

    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toHaveClass('flex-row', 'space-x-6');
  });

  it('applies vertical orientation by default', () => {
    const { container } = render(
      <RadioGroup name="test">
        <RadioButton value="1" label="Option 1" />
        <RadioButton value="2" label="Option 2" />
      </RadioGroup>
    );

    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toHaveClass('flex-col', 'space-y-3');
  });

  it('only one radio can be selected at a time', async () => {
    const user = userEvent.setup();
    
    render(
      <RadioGroup name="test">
        <RadioButton value="1" label="Option 1" />
        <RadioButton value="2" label="Option 2" />
        <RadioButton value="3" label="Option 3" />
      </RadioGroup>
    );

    const radio1 = screen.getByLabelText('Option 1') as HTMLInputElement;
    const radio2 = screen.getByLabelText('Option 2') as HTMLInputElement;
    const radio3 = screen.getByLabelText('Option 3') as HTMLInputElement;

    await user.click(radio1);
    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);
    expect(radio3.checked).toBe(false);

    await user.click(radio2);
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);
    expect(radio3.checked).toBe(false);

    await user.click(radio3);
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(false);
    expect(radio3.checked).toBe(true);
  });
});