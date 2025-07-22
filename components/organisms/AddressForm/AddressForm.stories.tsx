import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { AddressForm, Address } from './AddressForm';

const meta = {
  title: 'Organisms/AddressForm',
  component: AddressForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['shipping', 'billing', 'both'],
      description: 'Address type',
    },
    layout: {
      control: 'select',
      options: ['single', 'double'],
      description: 'Form layout',
    },
    showCompany: {
      control: 'boolean',
      description: 'Show company field',
    },
    showPhone: {
      control: 'boolean',
      description: 'Show phone field',
    },
    showEmail: {
      control: 'boolean',
      description: 'Show email field',
    },
    showSetDefault: {
      control: 'boolean',
      description: 'Show set as default checkbox',
    },
    verifyAddress: {
      control: 'boolean',
      description: 'Enable address verification',
    },
  },
} satisfies Meta<typeof AddressForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// US states for examples
const usStates = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

// Canadian provinces
const canadianProvinces = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
];

// Basic shipping address form
export const Default: Story = {
  args: {
    type: 'shipping',
    states: usStates,
    onSubmit: (address) => {
      console.log('Address submitted:', address);
    },
  },
};

// Billing address form
export const BillingAddress: Story = {
  args: {
    type: 'billing',
    states: usStates,
    title: 'Billing Address',
    showEmail: true,
    onSubmit: (address) => {
      console.log('Billing address:', address);
    },
  },
};

// With existing address
export const EditAddress: Story = {
  args: {
    address: {
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Inc.',
      addressLine1: '123 Main Street',
      addressLine2: 'Suite 456',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
    states: usStates,
    showSetDefault: true,
    onSubmit: (address) => {
      console.log('Updated address:', address);
    },
  },
};

// With address verification
export const WithVerification: Story = {
  args: {
    states: usStates,
    verifyAddress: true,
    onVerifyAddress: async (address) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return verification result
      if (address.addressLine1.toLowerCase().includes('main')) {
        return {
          valid: false,
          suggestions: [
            {
              ...address,
              addressLine1: '123 Main Street',
              postalCode: '10001-1234',
            },
          ],
        };
      }
      
      return { valid: true };
    },
    onSubmit: (address) => {
      console.log('Verified address:', address);
    },
  },
};

// Single column layout
export const SingleColumn: Story = {
  args: {
    layout: 'single',
    states: usStates,
    onSubmit: (address) => {
      console.log('Address:', address);
    },
  },
};

// Compact form
export const Compact: Story = {
  args: {
    compact: true,
    showCompany: false,
    showPhone: false,
    states: usStates,
    onSubmit: (address) => {
      console.log('Address:', address);
    },
  },
};

// All fields
export const AllFields: Story = {
  args: {
    showCompany: true,
    showPhone: true,
    showEmail: true,
    showSetDefault: true,
    states: usStates,
    onSubmit: (address) => {
      console.log('Address:', address);
    },
  },
};

// With dynamic state loading
export const DynamicStates: Story = {
  render: () => {
    const [submittedAddress, setSubmittedAddress] = useState<Address | null>(null);

    const loadStates = async (countryCode: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (countryCode === 'US') {
        return usStates;
      } else if (countryCode === 'CA') {
        return canadianProvinces;
      } else {
        return [];
      }
    };

    const countries = [
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'AU', name: 'Australia' },
    ];

    return (
      <div className="space-y-6">
        <AddressForm
          countries={countries}
          loadStates={loadStates}
          onSubmit={(address) => {
            setSubmittedAddress(address);
          }}
        />
        
        {submittedAddress && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold mb-2">Submitted Address:</h4>
            <pre className="text-sm">{JSON.stringify(submittedAddress, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
};

// With custom validation
export const CustomValidation: Story = {
  args: {
    states: usStates,
    validate: (address) => {
      const errors: Record<string, string> = {};
      
      if (address.firstName.length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
      }
      
      if (address.lastName.length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
      }
      
      if (address.phone && !address.phone.match(/^\+?[\d\s\-\(\)]+$/)) {
        errors.phone = 'Please enter a valid phone number';
      }
      
      return Object.keys(errors).length > 0 ? errors : null;
    },
    onSubmit: (address) => {
      console.log('Validated address:', address);
    },
  },
};

// Checkout flow example
export const CheckoutFlow: Story = {
  render: () => {
    const [step, setStep] = useState<'shipping' | 'billing' | 'complete'>('shipping');
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const [sameAsShipping, setSameAsShipping] = useState(false);

    if (step === 'complete') {
      return (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Order Complete!</h3>
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <h4 className="font-medium mb-2">Shipping Address:</h4>
              <p>{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
              <p>{shippingAddress?.addressLine1}</p>
              {shippingAddress?.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}</p>
            </div>
            {!sameAsShipping && billingAddress && (
              <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <h4 className="font-medium mb-2">Billing Address:</h4>
                <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                <p>{billingAddress.addressLine1}</p>
                {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
                <p>{billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setStep('shipping');
              setShippingAddress(null);
              setBillingAddress(null);
            }}
            className="text-primary-600 hover:underline"
          >
            Start Over
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Step {step === 'shipping' ? '1' : '2'} of 2
          </span>
        </div>

        {step === 'shipping' ? (
          <AddressForm
            type="shipping"
            title="Shipping Address"
            states: usStates,
            showPhone: true,
            address={shippingAddress || undefined}
            onSubmit={(address) => {
              setShippingAddress(address);
              setStep('billing');
            }}
          />
        ) : (
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
              />
              <span>Same as shipping address</span>
            </label>
            
            {!sameAsShipping && (
              <AddressForm
                type="billing"
                title="Billing Address"
                states: usStates,
                address={billingAddress || undefined}
                onSubmit={(address) => {
                  setBillingAddress(address);
                  setStep('complete');
                }}
                onCancel={() => setStep('shipping')}
              />
            )}
            
            {sameAsShipping && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2 border rounded-md"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setBillingAddress(shippingAddress);
                    setStep('complete');
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md"
                >
                  Complete Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
};

// Loading state
export const Loading: Story = {
  args: {
    states: usStates,
    loading: true,
    onSubmit: () => {},
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    states: usStates,
    disabled: true,
    address: {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    },
    onSubmit: () => {},
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <AddressForm
        type="shipping"
        title="Shipping Address"
        states={usStates}
        showPhone
        showEmail
        onSubmit={(address) => {
          console.log('Address:', address);
        }}
      />
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};