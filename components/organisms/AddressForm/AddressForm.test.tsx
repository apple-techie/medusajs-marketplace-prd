import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddressForm } from './AddressForm';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon }: any) => <span data-testid={`icon-${icon}`}>{icon}</span>,
}));

jest.mock('../../atoms/Input/Input', () => ({
  Input: ({ label, value, onChange, error, required, disabled, placeholder, type }: any) => (
    <div>
      <label>
        {label} {required && '*'}
        <input
          type={type || 'text'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          data-error={error}
          aria-label={label}
        />
      </label>
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

jest.mock('../../atoms/Select/Select', () => ({
  Select: ({ label, value, onChange, options, error, required, disabled, placeholder }: any) => (
    <div>
      <label>
        {label} {required && '*'}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label={label}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

jest.mock('../../atoms/Checkbox/Checkbox', () => ({
  Checkbox: ({ checked, onChange, label, disabled }: any) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={label}
      />
      {label}
    </label>
  ),
}));

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, disabled, loading, type = 'button', variant }: any) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      data-variant={variant}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
}));

describe('AddressForm Component', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<AddressForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
    expect(screen.getByLabelText('Address Line 1 *')).toBeInTheDocument();
    expect(screen.getByLabelText('Address Line 2')).toBeInTheDocument();
    expect(screen.getByLabelText('City *')).toBeInTheDocument();
    expect(screen.getByLabelText('State/Province *')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP/Postal Code *')).toBeInTheDocument();
    expect(screen.getByLabelText('Country *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
  });

  it('renders with initial address data', () => {
    const address = {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    };
    
    render(<AddressForm address={address} onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText('First Name *')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name *')).toHaveValue('Doe');
    expect(screen.getByLabelText('Address Line 1 *')).toHaveValue('123 Main St');
    expect(screen.getByLabelText('City *')).toHaveValue('New York');
    expect(screen.getByLabelText('State/Province *')).toHaveValue('NY');
    expect(screen.getByLabelText('ZIP/Postal Code *')).toHaveValue('10001');
    expect(screen.getByLabelText('Country *')).toHaveValue('US');
  });

  it('validates required fields', async () => {
    render(<AddressForm onSubmit={mockSubmit} />);
    
    const submitButton = screen.getByText('Save Address');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Address line1 is required')).toBeInTheDocument();
      expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('State is required')).toBeInTheDocument();
      expect(screen.getByText('Postal code is required')).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<AddressForm onSubmit={mockSubmit} showEmail />);
    
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByText('Save Address');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('validates US ZIP code format', async () => {
    render(<AddressForm onSubmit={mockSubmit} />);
    
    const zipInput = screen.getByLabelText('ZIP/Postal Code *');
    fireEvent.change(zipInput, { target: { value: '123' } });
    
    const submitButton = screen.getByText('Save Address');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid ZIP code')).toBeInTheDocument();
    });
  });

  it('validates Canadian postal code format', async () => {
    render(<AddressForm onSubmit={mockSubmit} />);
    
    const countrySelect = screen.getByLabelText('Country *');
    fireEvent.change(countrySelect, { target: { value: 'CA' } });
    
    const postalInput = screen.getByLabelText('ZIP/Postal Code *');
    fireEvent.change(postalInput, { target: { value: '12345' } });
    
    const submitButton = screen.getByText('Save Address');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid postal code')).toBeInTheDocument();
    });
  });

  it('submits valid form data', async () => {
    render(<AddressForm onSubmit={mockSubmit} />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name *'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Address Line 1 *'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('State/Province *'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText('ZIP/Postal Code *'), { target: { value: '10001' } });
    
    const submitButton = screen.getByText('Save Address');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
      }));
    });
  });

  it('loads states when country changes', async () => {
    const mockLoadStates = jest.fn().mockResolvedValue([
      { code: 'ON', name: 'Ontario' },
      { code: 'QC', name: 'Quebec' },
    ]);
    
    render(<AddressForm onSubmit={mockSubmit} loadStates={mockLoadStates} />);
    
    const countrySelect = screen.getByLabelText('Country *');
    fireEvent.change(countrySelect, { target: { value: 'CA' } });
    
    await waitFor(() => {
      expect(mockLoadStates).toHaveBeenCalledWith('CA');
    });
  });

  it('handles address verification', async () => {
    const mockVerify = jest.fn().mockResolvedValue({
      valid: false,
      suggestions: [{
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001-1234',
        country: 'US',
      }],
    });
    
    render(
      <AddressForm
        onSubmit={mockSubmit}
        verifyAddress
        onVerifyAddress={mockVerify}
      />
    );
    
    // Fill in address
    fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name *'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Address Line 1 *'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('State/Province *'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText('ZIP/Postal Code *'), { target: { value: '10001' } });
    
    const verifyButton = screen.getByText('Verify Address');
    fireEvent.click(verifyButton);
    
    await waitFor(() => {
      expect(mockVerify).toHaveBeenCalled();
      expect(screen.getByText('Address verification failed')).toBeInTheDocument();
      expect(screen.getByText('123 Main Street')).toBeInTheDocument();
    });
  });

  it('uses suggested address', async () => {
    const suggestion = {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001-1234',
      country: 'US',
    };
    
    const mockVerify = jest.fn().mockResolvedValue({
      valid: false,
      suggestions: [suggestion],
    });
    
    render(
      <AddressForm
        onSubmit={mockSubmit}
        verifyAddress
        onVerifyAddress={mockVerify}
      />
    );
    
    // Fill and verify
    fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name *'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Address Line 1 *'), { target: { value: '123 Main' } });
    fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('State/Province *'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText('ZIP/Postal Code *'), { target: { value: '10001' } });
    
    fireEvent.click(screen.getByText('Verify Address'));
    
    await waitFor(() => {
      expect(screen.getByText('123 Main Street')).toBeInTheDocument();
    });
    
    // Click suggestion
    fireEvent.click(screen.getByText('123 Main Street'));
    
    expect(screen.getByLabelText('Address Line 1 *')).toHaveValue('123 Main Street');
    expect(screen.getByLabelText('ZIP/Postal Code *')).toHaveValue('10001-1234');
  });

  it('shows set as default checkbox when enabled', () => {
    render(<AddressForm onSubmit={mockSubmit} showSetDefault />);
    
    expect(screen.getByLabelText('Set as default address')).toBeInTheDocument();
  });

  it('handles cancel action', () => {
    const mockCancel = jest.fn();
    render(<AddressForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockCancel).toHaveBeenCalled();
  });

  it('disables form when loading', () => {
    render(<AddressForm onSubmit={mockSubmit} loading />);
    
    expect(screen.getByLabelText('First Name *')).toBeDisabled();
    expect(screen.getByLabelText('Last Name *')).toBeDisabled();
    expect(screen.getByText('Save Address')).toBeDisabled();
  });

  it('shows custom title', () => {
    render(<AddressForm onSubmit={mockSubmit} title="Shipping Address" />);
    
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
  });

  it('uses custom labels', () => {
    render(
      <AddressForm
        onSubmit={mockSubmit}
        submitLabel="Continue"
        cancelLabel="Back"
        verifyLabel="Check Address"
        onCancel={() => {}}
        verifyAddress
        onVerifyAddress={() => Promise.resolve({ valid: true })}
      />
    );
    
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Check Address')).toBeInTheDocument();
  });

  it('shows email field when enabled', () => {
    render(<AddressForm onSubmit={mockSubmit} showEmail />);
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('hides company field when disabled', () => {
    render(<AddressForm onSubmit={mockSubmit} showCompany={false} />);
    
    expect(screen.queryByLabelText('Company')).not.toBeInTheDocument();
  });

  it('uses custom validation', async () => {
    const customValidate = jest.fn().mockReturnValue({
      firstName: 'First name must be at least 2 characters',
    });
    
    render(<AddressForm onSubmit={mockSubmit} validate={customValidate} />);
    
    fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'J' } });
    fireEvent.click(screen.getByText('Save Address'));
    
    await waitFor(() => {
      expect(customValidate).toHaveBeenCalled();
      expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
    });
  });
});