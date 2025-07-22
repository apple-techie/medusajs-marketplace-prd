import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select Component', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders with placeholder', () => {
    render(<Select placeholder="Select an option" options={defaultOptions} />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Select label="Choose Option" options={defaultOptions} />);
    expect(screen.getByText('Choose Option')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Select label="Required Field" required options={defaultOptions} />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-danger-500');
  });

  it('renders helper text', () => {
    render(<Select helperText="This is helper text" options={defaultOptions} />);
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('shows error message when error prop is true', () => {
    render(
      <Select 
        error 
        errorMessage="Please select an option"
        helperText="This is helper text"
        options={defaultOptions}
      />
    );
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
    expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
  });

  it('applies error variant styles when error is true', () => {
    render(<Select error options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-danger-500');
  });

  it('applies success variant styles', () => {
    render(<Select variant="success" options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-success-500');
  });

  it('renders all options', () => {
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    
    defaultOptions.forEach(option => {
      expect(select).toHaveTextContent(option.label);
    });
  });

  it('handles disabled options', () => {
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ];
    
    render(<Select options={optionsWithDisabled} />);
    const disabledOption = screen.getByRole('option', { name: 'Option 2' });
    expect(disabledOption).toBeDisabled();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Select size="sm" options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toHaveClass('h-9');

    rerender(<Select size="lg" options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toHaveClass('h-11');
  });

  it('handles disabled state', () => {
    render(<Select disabled options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('disabled:opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<Select ref={ref} options={defaultOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <Select 
        onChange={handleChange}
        options={defaultOptions}
        defaultValue=""
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'option2');
    
    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue('option2');
  });

  it('renders with default value', () => {
    render(
      <Select 
        defaultValue="option2"
        options={defaultOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('option2');
  });

  it('applies custom className', () => {
    render(<Select className="custom-class" options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });

  it('applies containerClassName', () => {
    const { container } = render(
      <Select containerClassName="container-class" options={defaultOptions} />
    );
    expect(container.firstChild).toHaveClass('container-class');
  });

  it('renders chevron icon by default', () => {
    const { container } = render(<Select options={defaultOptions} />);
    const icon = container.querySelector('.lucide-chevron-down');
    expect(icon).toBeInTheDocument();
  });

  it('placeholder option is not selectable', () => {
    render(
      <Select 
        placeholder="Select an option"
        options={defaultOptions}
        defaultValue=""
      />
    );
    
    const placeholderOption = screen.getByText('Select an option');
    expect(placeholderOption).toHaveAttribute('hidden');
    expect(placeholderOption).toHaveAttribute('disabled');
  });
});