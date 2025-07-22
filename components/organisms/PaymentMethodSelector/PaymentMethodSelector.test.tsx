import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentMethodSelector } from './PaymentMethodSelector';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon }: any) => <span data-testid={`icon-${icon}`}>{icon}</span>,
}));

jest.mock('../../atoms/Input/Input', () => ({
  Input: ({ label, value, onChange, error, placeholder, type, onClick }: any) => (
    <div>
      <label>
        {label}
        <input
          type={type || 'text'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          data-error={error}
          aria-label={label}
          onClick={onClick}
        />
      </label>
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

jest.mock('../../atoms/Select/Select', () => ({
  Select: ({ value, onChange, options, placeholder, error }: any) => (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

jest.mock('../../atoms/Checkbox/Checkbox', () => ({
  Checkbox: ({ checked, onChange, label }: any) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      {label}
    </label>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

describe('PaymentMethodSelector Component', () => {
  const mockOnSelect = jest.fn();
  
  const mockSavedMethods = [
    {
      id: '1',
      type: 'card' as const,
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      holderName: 'John Doe',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card' as const,
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 6,
      expiryYear: 2024,
      holderName: 'Jane Doe',
    },
    {
      id: '3',
      type: 'paypal' as const,
      email: 'john@example.com',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders saved payment methods', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Visa ending in 4242')).toBeInTheDocument();
    expect(screen.getByText('Mastercard ending in 5555')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('shows default badge for default method', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        onSelect={mockOnSelect}
      />
    );
    
    const defaultBadge = screen.getByTestId('badge');
    expect(defaultBadge).toHaveTextContent('Default');
    expect(defaultBadge).toHaveAttribute('data-variant', 'secondary');
  });

  it('shows expiry information for cards', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Expires 12/2025')).toBeInTheDocument();
    expect(screen.getByText('Expires 6/2024')).toBeInTheDocument();
  });

  it('shows cardholder name', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('handles method selection', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        onSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Mastercard ending in 5555'));
    expect(mockOnSelect).toHaveBeenCalledWith('2');
  });

  it('shows selected method', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        selectedMethodId="2"
        onSelect={mockOnSelect}
      />
    );
    
    const selectedMethod = screen.getByLabelText('Mastercard ending in 5555');
    expect(selectedMethod).toHaveAttribute('aria-checked', 'true');
  });

  it('shows CVV input for selected card when required', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        selectedMethodId="1"
        requireCVV={true}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByLabelText('CVV')).toBeInTheDocument();
  });

  it('shows new card option', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        allowNewCard={true}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Add new card')).toBeInTheDocument();
  });

  it('shows new card form when selected', () => {
    render(
      <PaymentMethodSelector
        savedMethods={[]}
        allowNewCard={true}
        onSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Add new card'));
    
    expect(screen.getByLabelText('Card Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Cardholder Name')).toBeInTheDocument();
    expect(screen.getByLabelText('CVV')).toBeInTheDocument();
  });

  it('validates card number', async () => {
    render(
      <PaymentMethodSelector
        savedMethods={[]}
        allowNewCard={true}
        onSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Add new card'));
    
    const cardNumberInput = screen.getByLabelText('Card Number');
    fireEvent.change(cardNumberInput, { target: { value: '123' } });
    
    // Trigger validation by trying to select the method
    fireEvent.click(screen.getByText('Add new card'));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid card number')).toBeInTheDocument();
    });
  });

  it('shows save card option', () => {
    render(
      <PaymentMethodSelector
        savedMethods={[]}
        allowNewCard={true}
        showSaveOption={true}
        onSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Add new card'));
    
    expect(screen.getByLabelText('Save this card for future purchases')).toBeInTheDocument();
  });

  it('handles save card checkbox', () => {
    const mockOnSaveCard = jest.fn();
    
    render(
      <PaymentMethodSelector
        savedMethods={[]}
        allowNewCard={true}
        showSaveOption={true}
        onSelect={mockOnSelect}
        onSaveCard={mockOnSaveCard}
      />
    );
    
    fireEvent.click(screen.getByText('Add new card'));
    
    const checkbox = screen.getByLabelText('Save this card for future purchases');
    fireEvent.click(checkbox);
    
    expect(mockOnSaveCard).toHaveBeenCalledWith(false);
  });

  it('shows wallet balance option', () => {
    render(
      <PaymentMethodSelector
        savedMethods={[]}
        acceptedTypes={['card', 'wallet']}
        walletBalance={150.50}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Wallet Balance')).toBeInTheDocument();
    expect(screen.getByText('Available: $150.50')).toBeInTheDocument();
  });

  it('shows other payment methods', () => {
    render(
      <PaymentMethodSelector
        savedMethods={[]}
        acceptedTypes={['card', 'paypal', 'apple-pay', 'google-pay']}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('PayPal')).toBeInTheDocument();
    expect(screen.getByText('Apple Pay')).toBeInTheDocument();
    expect(screen.getByText('Google Pay')).toBeInTheDocument();
  });

  it('shows expired card indicator', () => {
    const expiredMethod = {
      id: '4',
      type: 'card' as const,
      last4: '1111',
      brand: 'Visa',
      isExpired: true,
    };
    
    render(
      <PaymentMethodSelector
        savedMethods={[expiredMethod]}
        onSelect={mockOnSelect}
      />
    );
    
    const expiredBadge = screen.getByTestId('badge');
    expect(expiredBadge).toHaveTextContent('Expired');
    expect(expiredBadge).toHaveAttribute('data-variant', 'destructive');
  });

  it('shows processing state', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        processingMethodId="1"
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByTestId('icon-loader-2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <PaymentMethodSelector
        loading={true}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('', { selector: '.animate-pulse' })).toBeInTheDocument();
  });

  it('groups methods by type when enabled', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        groupByType={true}
        onSelect={mockOnSelect}
      />
    );
    
    // All methods should still be visible
    expect(screen.getByText('Visa ending in 4242')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('filters accepted payment types', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        acceptedTypes={['card']}
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Visa ending in 4242')).toBeInTheDocument();
    expect(screen.queryByText('PayPal')).not.toBeInTheDocument();
  });

  it('handles custom card validation', async () => {
    const customValidate = jest.fn().mockReturnValue({
      number: 'Card number must start with 4',
    });
    
    render(
      <PaymentMethodSelector
        savedMethods={[]}
        allowNewCard={true}
        validateCard={customValidate}
        onSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Add new card'));
    
    const cardNumberInput = screen.getByLabelText('Card Number');
    fireEvent.change(cardNumberInput, { target: { value: '5555555555555555' } });
    
    fireEvent.click(screen.getByText('Add new card'));
    
    await waitFor(() => {
      expect(customValidate).toHaveBeenCalled();
      expect(screen.getByText('Card number must start with 4')).toBeInTheDocument();
    });
  });

  it('handles card input changes', () => {
    const mockOnCardInputChange = jest.fn();
    
    render(
      <PaymentMethodSelector
        savedMethods={[]}
        allowNewCard={true}
        onCardInputChange={mockOnCardInputChange}
        onSelect={mockOnSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Add new card'));
    
    const cardNumberInput = screen.getByLabelText('Card Number');
    fireEvent.change(cardNumberInput, { target: { value: '4242424242424242' } });
    
    expect(mockOnCardInputChange).toHaveBeenCalledWith(
      expect.objectContaining({
        number: '4242424242424242',
      })
    );
  });

  it('uses custom labels', () => {
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods.filter(m => m.type === 'card')}
        title="Choose Payment",
        savedCardsLabel="Your Cards",
        newCardLabel="Use a different card",
        onSelect={mockOnSelect}
      />
    );
    
    expect(screen.getByText('Choose Payment')).toBeInTheDocument();
    expect(screen.getByText('Your Cards')).toBeInTheDocument();
    expect(screen.getByText('Use a different card')).toBeInTheDocument();
  });

  it('stops propagation on CVV input click', () => {
    const mockOnSelect = jest.fn();
    
    render(
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        selectedMethodId="1"
        requireCVV={true}
        onSelect={mockOnSelect}
      />
    );
    
    const cvvInput = screen.getByLabelText('CVV');
    fireEvent.click(cvvInput);
    
    // Should not trigger method selection
    expect(mockOnSelect).not.toHaveBeenCalled();
  });
});