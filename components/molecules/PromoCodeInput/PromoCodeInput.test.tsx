import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromoCodeInput } from './PromoCodeInput';

// Mock components
jest.mock('../../atoms/Input/Input', () => ({
  Input: ({ onChange, value, ...props }: any) => (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange?.(e)}
      data-testid="promo-input"
    />
  ),
}));

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, loading, ...props }: any) => (
    <button {...props} data-loading={loading}>
      {loading && <span>Loading...</span>}
      {children}
    </button>
  ),
}));

jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

describe('PromoCodeInput Component', () => {
  it('renders input and apply button', () => {
    render(<PromoCodeInput />);
    
    expect(screen.getByPlaceholderText('Enter promo code')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByTestId('icon-tag')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<PromoCodeInput label="Discount code" />);
    
    expect(screen.getByText('Discount code')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<PromoCodeInput placeholder="Enter discount" />);
    
    expect(screen.getByPlaceholderText('Enter discount')).toBeInTheDocument();
  });

  it('converts input to uppercase', async () => {
    const user = userEvent.setup();
    render(<PromoCodeInput />);
    
    const input = screen.getByTestId('promo-input');
    await user.type(input, 'save10');
    
    expect(input).toHaveValue('SAVE10');
  });

  it('calls onApply with trimmed code', async () => {
    const handleApply = jest.fn();
    render(<PromoCodeInput onApply={handleApply} />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: '  SAVE10  ' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(handleApply).toHaveBeenCalledWith('SAVE10');
    });
  });

  it('shows error for empty code', () => {
    render(<PromoCodeInput />);
    
    const button = screen.getByText('Apply');
    fireEvent.click(button);
    
    expect(screen.getByText('Please enter a promo code')).toBeInTheDocument();
  });

  it('validates minimum length', () => {
    render(<PromoCodeInput minLength={5} />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: 'ABC' } });
    fireEvent.click(button);
    
    expect(screen.getByText('Code must be at least 5 characters')).toBeInTheDocument();
  });

  it('validates maximum length', () => {
    render(<PromoCodeInput maxLength={10} />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: 'VERYLONGPROMOCODE' } });
    fireEvent.click(button);
    
    expect(screen.getByText('Code must be no more than 10 characters')).toBeInTheDocument();
  });

  it('validates with custom pattern', () => {
    render(<PromoCodeInput pattern={/^[A-Z0-9]+$/} />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: 'SAVE-10' } });
    fireEvent.click(button);
    
    expect(screen.getByText('Invalid promo code format')).toBeInTheDocument();
  });

  it('uses custom validation function', () => {
    const validateCode = (code: string) => {
      if (!code.startsWith('VALID')) {
        return 'Code must start with VALID';
      }
      return true;
    };
    
    render(<PromoCodeInput validateCode={validateCode} />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(button);
    
    expect(screen.getByText('Code must start with VALID')).toBeInTheDocument();
  });

  it('clears input after successful apply', async () => {
    const handleApply = jest.fn();
    render(<PromoCodeInput onApply={handleApply} clearOnApply />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('does not clear input when clearOnApply is false', async () => {
    const handleApply = jest.fn();
    render(<PromoCodeInput onApply={handleApply} clearOnApply={false} />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(input).toHaveValue('SAVE10');
    });
  });

  it('shows loading state', () => {
    render(<PromoCodeInput loading />);
    
    const button = screen.getByText('Apply').closest('button');
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('disables input and button when disabled', () => {
    render(<PromoCodeInput disabled />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('shows external error', () => {
    render(<PromoCodeInput error="Invalid promo code" />);
    
    expect(screen.getByText('Invalid promo code')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
  });

  it('applies code on Enter key', async () => {
    const handleApply = jest.fn();
    const user = userEvent.setup();
    render(<PromoCodeInput onApply={handleApply} />);
    
    const input = screen.getByTestId('promo-input');
    await user.type(input, 'SAVE10{Enter}');
    
    expect(handleApply).toHaveBeenCalledWith('SAVE10');
  });

  it('renders applied code state', () => {
    render(
      <PromoCodeInput
        appliedCode="SAVE20"
        discount={{
          type: 'percentage',
          value: 20,
          description: 'Summer sale discount',
        }}
      />
    );
    
    expect(screen.getByText('SAVE20')).toBeInTheDocument();
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(screen.getByText('Summer sale discount')).toBeInTheDocument();
    expect(screen.getByTestId('icon-check-circle')).toBeInTheDocument();
  });

  it('renders fixed amount discount', () => {
    render(
      <PromoCodeInput
        appliedCode="SAVE5"
        discount={{
          type: 'fixed',
          value: 5,
        }}
      />
    );
    
    expect(screen.getByText('-$5.00')).toBeInTheDocument();
  });

  it('shows remove button for applied code', () => {
    const handleRemove = jest.fn();
    render(
      <PromoCodeInput
        appliedCode="SAVE20"
        discount={{ type: 'percentage', value: 20 }}
        onRemove={handleRemove}
      />
    );
    
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalled();
  });

  it('hides remove button when onRemove not provided', () => {
    render(
      <PromoCodeInput
        appliedCode="SAVE20"
        discount={{ type: 'percentage', value: 20 }}
      />
    );
    
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
  });

  it('renders inline variant', () => {
    render(<PromoCodeInput variant="inline" />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    expect(input).toHaveClass('rounded-r-none');
    expect(button).toHaveClass('rounded-l-none');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<PromoCodeInput size="sm" />);
    
    let input = screen.getByTestId('promo-input');
    expect(input).toHaveClass('h-8');
    
    rerender(<PromoCodeInput size="lg" />);
    input = screen.getByTestId('promo-input');
    expect(input).toHaveClass('h-12');
  });

  it('uses custom labels', () => {
    render(
      <PromoCodeInput
        applyLabel="Use Code"
        removeLabel="Delete"
        appliedCode="SAVE20"
        discount={{ type: 'percentage', value: 20 }}
        onRemove={() => {}}
      />
    );
    
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('clears error on input change', () => {
    render(<PromoCodeInput />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    // Trigger error
    fireEvent.click(button);
    expect(screen.getByText('Please enter a promo code')).toBeInTheDocument();
    
    // Type something
    fireEvent.change(input, { target: { value: 'TEST' } });
    expect(screen.queryByText('Please enter a promo code')).not.toBeInTheDocument();
  });

  it('disables apply button when code is empty', () => {
    render(<PromoCodeInput />);
    
    const button = screen.getByText('Apply');
    expect(button).toBeDisabled();
    
    const input = screen.getByTestId('promo-input');
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    
    expect(button).not.toBeDisabled();
  });

  it('uses aria-label', () => {
    render(<PromoCodeInput aria-label="Discount code input" />);
    
    const input = screen.getByTestId('promo-input');
    expect(input).toHaveAttribute('aria-label', 'Discount code input');
  });

  it('sets aria-invalid when error', () => {
    render(<PromoCodeInput error="Invalid code" />);
    
    const input = screen.getByTestId('promo-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles async onApply', async () => {
    const handleApply = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<PromoCodeInput onApply={handleApply} />);
    
    const input = screen.getByTestId('promo-input');
    const button = screen.getByText('Apply');
    
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(button);
    
    expect(button).toHaveAttribute('data-loading', 'true');
    
    await waitFor(() => {
      expect(button).toHaveAttribute('data-loading', 'false');
    });
  });
});