import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PromoCodeInput } from './PromoCodeInput';

const meta = {
  title: 'Molecules/PromoCodeInput',
  component: PromoCodeInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    variant: {
      control: 'select',
      options: ['default', 'inline'],
      description: 'Display variant',
    },
    clearOnApply: {
      control: 'boolean',
      description: 'Clear input after apply',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof PromoCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic promo code input
export const Default: Story = {
  args: {
    onApply: (code) => console.log('Applied code:', code),
  },
};

// With label
export const WithLabel: Story = {
  args: {
    label: 'Have a promo code?',
    onApply: (code) => console.log('Applied code:', code),
  },
};

// Custom placeholder
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Enter discount code',
    onApply: (code) => console.log('Applied code:', code),
  },
};

// Applied code - percentage discount
export const AppliedPercentage: Story = {
  args: {
    appliedCode: 'SUMMER20',
    discount: {
      type: 'percentage',
      value: 20,
      description: 'Summer sale - 20% off your order',
    },
    onRemove: () => console.log('Remove code'),
  },
};

// Applied code - fixed discount
export const AppliedFixed: Story = {
  args: {
    appliedCode: 'SAVE10',
    discount: {
      type: 'fixed',
      value: 10,
      description: 'Save $10 on your purchase',
    },
    onRemove: () => console.log('Remove code'),
  },
};

// Applied without description
export const AppliedSimple: Story = {
  args: {
    appliedCode: 'FREESHIP',
    discount: {
      type: 'fixed',
      value: 0,
    },
  },
};

// Inline variant
export const Inline: Story = {
  args: {
    variant: 'inline',
    onApply: (code) => console.log('Applied code:', code),
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <PromoCodeInput
        size="sm"
        label="Small"
        onApply={(code) => console.log('Applied code:', code)}
      />
      <PromoCodeInput
        size="md"
        label="Medium (Default)"
        onApply={(code) => console.log('Applied code:', code)}
      />
      <PromoCodeInput
        size="lg"
        label="Large"
        onApply={(code) => console.log('Applied code:', code)}
      />
    </div>
  ),
};

// With validation
export const WithValidation: Story = {
  args: {
    minLength: 6,
    maxLength: 12,
    pattern: /^[A-Z0-9]+$/,
    validateCode: (code) => {
      if (!code.startsWith('SAVE')) {
        return 'Code must start with SAVE';
      }
      return true;
    },
    onApply: (code) => console.log('Applied code:', code),
  },
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// With error
export const WithError: Story = {
  args: {
    error: 'This promo code has expired',
    onApply: (code) => console.log('Applied code:', code),
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [appliedCode, setAppliedCode] = useState<string | undefined>();
    const [discount, setDiscount] = useState<any>();
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    
    const validCodes = {
      'SAVE20': { type: 'percentage' as const, value: 20, description: '20% off your order' },
      'SHIP10': { type: 'fixed' as const, value: 10, description: 'Free shipping + $10 off' },
      'WELCOME': { type: 'percentage' as const, value: 15, description: 'Welcome discount' },
    };
    
    const handleApply = async (code: string) => {
      setError(undefined);
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (validCodes[code as keyof typeof validCodes]) {
        setAppliedCode(code);
        setDiscount(validCodes[code as keyof typeof validCodes]);
      } else {
        setError('Invalid promo code');
      }
      
      setLoading(false);
    };
    
    const handleRemove = () => {
      setAppliedCode(undefined);
      setDiscount(undefined);
      setError(undefined);
    };
    
    return (
      <div className="space-y-4 w-96">
        <PromoCodeInput
          appliedCode={appliedCode}
          discount={discount}
          error={error}
          loading={loading}
          onApply={handleApply}
          onRemove={handleRemove}
        />
        
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          <p className="font-medium mb-1">Try these codes:</p>
          <ul className="space-y-1">
            <li>• SAVE20 - 20% off</li>
            <li>• SHIP10 - $10 off + free shipping</li>
            <li>• WELCOME - 15% off</li>
          </ul>
        </div>
      </div>
    );
  },
};

// Shopping cart example
export const ShoppingCart: Story = {
  render: () => {
    const [appliedCode, setAppliedCode] = useState<string | undefined>();
    const [discount, setDiscount] = useState<any>();
    
    const subtotal = 89.99;
    const shipping = 9.99;
    const discountAmount = discount
      ? discount.type === 'percentage'
        ? (subtotal * discount.value) / 100
        : discount.value
      : 0;
    const total = subtotal + shipping - discountAmount;
    
    return (
      <div className="w-full max-w-md p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-2 border-t flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <PromoCodeInput
          appliedCode={appliedCode}
          discount={discount}
          onApply={async (code) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (code === 'SAVE20') {
              setAppliedCode(code);
              setDiscount({ type: 'percentage', value: 20 });
            }
          }}
          onRemove={() => {
            setAppliedCode(undefined);
            setDiscount(undefined);
          }}
        />
      </div>
    );
  },
};

// Checkout flow
export const CheckoutFlow: Story = {
  render: () => {
    const [appliedCode, setAppliedCode] = useState<string>('FIRST10');
    const [discount] = useState({ 
      type: 'percentage' as const, 
      value: 10,
      description: 'First time customer discount'
    });
    
    return (
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Information</h3>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Card number"
              className="w-full px-3 py-2 border rounded-md"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                className="px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="CVV"
                className="px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <PromoCodeInput
            label="Promo code or gift card"
            appliedCode={appliedCode}
            discount={discount}
            onRemove={() => setAppliedCode('')}
          />
        </div>
        
        <button className="w-full py-3 bg-primary-600 text-white rounded-md font-medium">
          Complete Order
        </button>
      </div>
    );
  },
};

// Multiple promo code styles
export const MultipleStyles: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-3">Default Style</h3>
        <PromoCodeInput
          onApply={(code) => console.log('Applied:', code)}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-3">Inline Style</h3>
        <PromoCodeInput
          variant="inline"
          onApply={(code) => console.log('Applied:', code)}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-3">Applied State</h3>
        <PromoCodeInput
          appliedCode="BLACKFRIDAY"
          discount={{ type: 'percentage', value: 30 }}
          onRemove={() => console.log('Remove')}
        />
      </div>
    </div>
  ),
};

// Custom labels
export const CustomLabels: Story = {
  args: {
    label: 'Discount Code',
    placeholder: 'Enter your discount',
    applyLabel: 'Use Code',
    removeLabel: 'Clear',
    appliedCode: 'VIP2024',
    discount: { type: 'percentage', value: 25 },
    onApply: (code) => console.log('Applied:', code),
    onRemove: () => console.log('Remove'),
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded space-y-6">
      <PromoCodeInput
        label="Promo code"
        onApply={(code) => console.log('Applied:', code)}
      />
      
      <PromoCodeInput
        appliedCode="DARKMODE"
        discount={{ 
          type: 'percentage', 
          value: 15,
          description: 'Special dark mode discount'
        }}
        onRemove={() => console.log('Remove')}
      />
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};