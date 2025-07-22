import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import { Mail } from 'lucide-react';

describe('Input Component', () => {
  it('renders basic input', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-danger-500');
  });

  it('renders helper text', () => {
    render(<Input helperText="This is helper text" />);
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('shows error message when error prop is true', () => {
    render(
      <Input 
        error 
        errorMessage="This field is required"
        helperText="This is helper text"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
  });

  it('applies error variant styles when error is true', () => {
    render(<Input error placeholder="Error input" />);
    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveClass('border-danger-500');
  });

  it('applies success variant styles', () => {
    render(<Input variant="success" placeholder="Success input" />);
    const input = screen.getByPlaceholderText('Success input');
    expect(input).toHaveClass('border-success-500');
  });

  it('renders with left icon', () => {
    render(
      <Input 
        leftIcon={<Mail data-testid="left-icon" />}
        placeholder="With icon"
      />
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(
      <Input 
        rightIcon={<Mail data-testid="right-icon" />}
        placeholder="With icon"
      />
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('renders with left addon', () => {
    render(<Input leftAddon="$" placeholder="Price" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders with right addon', () => {
    render(<Input rightAddon="kg" placeholder="Weight" />);
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Input size="sm" placeholder="Small" />);
    expect(screen.getByPlaceholderText('Small')).toHaveClass('h-9');

    rerender(<Input size="lg" placeholder="Large" />);
    expect(screen.getByPlaceholderText('Large')).toHaveClass('h-11');
  });

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="With ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <Input 
        placeholder="Type here" 
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello');
    
    expect(input).toHaveValue('Hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" placeholder="Number" />);
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Custom" />);
    expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-class');
  });

  it('applies containerClassName', () => {
    const { container } = render(
      <Input containerClassName="container-class" placeholder="Container" />
    );
    expect(container.firstChild).toHaveClass('container-class');
  });
});