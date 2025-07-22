import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PaymentMethodSelector, PaymentMethod } from './PaymentMethodSelector';

const meta = {
  title: 'Organisms/PaymentMethodSelector',
  component: PaymentMethodSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['list', 'grid', 'compact'],
      description: 'Layout style',
    },
    acceptedTypes: {
      control: 'check',
      options: ['card', 'paypal', 'apple-pay', 'google-pay', 'bank', 'wallet'],
      description: 'Accepted payment types',
    },
    allowNewCard: {
      control: 'boolean',
      description: 'Allow adding new card',
    },
    requireCVV: {
      control: 'boolean',
      description: 'Require CVV for saved cards',
    },
    showSaveOption: {
      control: 'boolean',
      description: 'Show save card option',
    },
    showSetDefault: {
      control: 'boolean',
      description: 'Show set as default option',
    },
  },
} satisfies Meta<typeof PaymentMethodSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock saved payment methods
const mockSavedMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
    holderName: 'John Doe',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    expiryMonth: 6,
    expiryYear: 2024,
    holderName: 'John Doe',
  },
  {
    id: '3',
    type: 'paypal',
    email: 'john.doe@example.com',
  },
];

// Basic payment method selector
export const Default: Story = {
  args: {
    savedMethods: mockSavedMethods,
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// With selected method
export const WithSelection: Story = {
  args: {
    savedMethods: mockSavedMethods,
    selectedMethodId: '1',
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// Requiring CVV
export const RequireCVV: Story = {
  args: {
    savedMethods: mockSavedMethods,
    selectedMethodId: '1',
    requireCVV: true,
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// Empty state with new card
export const EmptyState: Story = {
  args: {
    savedMethods: [],
    allowNewCard: true,
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// All payment types
export const AllPaymentTypes: Story = {
  args: {
    savedMethods: [
      ...mockSavedMethods,
      {
        id: '4',
        type: 'bank',
        bankName: 'Chase Bank',
        accountLast4: '6789',
      },
    ],
    acceptedTypes: ['card', 'paypal', 'apple-pay', 'google-pay', 'bank', 'wallet'],
    walletBalance: 250.00,
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// With wallet balance
export const WithWallet: Story = {
  args: {
    savedMethods: mockSavedMethods,
    acceptedTypes: ['card', 'paypal', 'wallet'],
    walletBalance: 150.50,
    walletCurrency: 'USD',
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// Expired card
export const WithExpiredCard: Story = {
  args: {
    savedMethods: [
      ...mockSavedMethods,
      {
        id: '4',
        type: 'card',
        last4: '1111',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2023,
        holderName: 'Jane Doe',
        isExpired: true,
      },
    ],
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// Processing state
export const ProcessingPayment: Story = {
  args: {
    savedMethods: mockSavedMethods,
    selectedMethodId: '1',
    processingMethodId: '1',
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
    onSelect: () => {},
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [selectedMethod, setSelectedMethod] = useState<string>('1');
    const [saveCard, setSaveCard] = useState(true);
    const [cardData, setCardData] = useState({});

    return (
      <div className="w-full max-w-lg space-y-4">
        <PaymentMethodSelector
          savedMethods={mockSavedMethods}
          selectedMethodId={selectedMethod}
          allowNewCard
          requireCVV
          showSaveOption
          onSelect={setSelectedMethod}
          onSaveCard={setSaveCard}
          onCardInputChange={setCardData}
        />
        
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm">
          <p><strong>Selected:</strong> {selectedMethod}</p>
          {selectedMethod === 'new' && (
            <>
              <p><strong>Save card:</strong> {saveCard ? 'Yes' : 'No'}</p>
              <p><strong>Card data:</strong></p>
              <pre className="text-xs mt-1">{JSON.stringify(cardData, null, 2)}</pre>
            </>
          )}
        </div>
      </div>
    );
  },
};

// Checkout flow example
export const CheckoutFlow: Story = {
  render: () => {
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    const handlePayment = async () => {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setOrderComplete(true);
    };

    if (orderComplete) {
      return (
        <div className="text-center space-y-4 p-8">
          <div className="text-green-600 text-5xl">✓</div>
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Your order has been confirmed.
          </p>
          <button
            onClick={() => {
              setOrderComplete(false);
              setSelectedMethod('');
            }}
            className="text-primary-600 hover:underline"
          >
            Place another order
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-lg space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Payment Information</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Order Total: $299.99
          </p>
        </div>

        <PaymentMethodSelector
          savedMethods={mockSavedMethods}
          selectedMethodId={selectedMethod}
          processingMethodId={isProcessing ? selectedMethod : undefined}
          allowNewCard
          requireCVV
          showSaveOption
          acceptedTypes={['card', 'paypal', 'apple-pay', 'google-pay']}
          onSelect={setSelectedMethod}
        />

        <button
          onClick={handlePayment}
          disabled={!selectedMethod || isProcessing}
          className="w-full py-3 bg-primary-600 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Complete Order'}
        </button>
      </div>
    );
  },
};

// New card form with validation
export const NewCardForm: Story = {
  render: () => {
    const [selectedMethod, setSelectedMethod] = useState<string>('new');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateCard = (cardData: any) => {
      const errors: Record<string, string> = {};
      
      if (cardData.number && !cardData.number.startsWith('4')) {
        errors.number = 'Only Visa cards accepted (must start with 4)';
      }
      
      if (cardData.cvv && cardData.cvv.length !== 3) {
        errors.cvv = 'CVV must be 3 digits';
      }
      
      setErrors(errors);
      return Object.keys(errors).length > 0 ? errors : null;
    };

    return (
      <div className="w-full max-w-lg space-y-4">
        <PaymentMethodSelector
          savedMethods={[]}
          selectedMethodId={selectedMethod}
          allowNewCard
          showSaveOption
          validateCard={validateCard}
          onSelect={setSelectedMethod}
          onCardInputChange={(data) => validateCard(data)}
        />
        
        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Validation Errors:
            </p>
            <ul className="mt-1 text-sm text-red-700 dark:text-red-300">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

// Multiple saved cards
export const MultipleCards: Story = {
  args: {
    savedMethods: [
      {
        id: '1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        holderName: 'John Doe',
        isDefault: true,
      },
      {
        id: '2',
        type: 'card',
        last4: '5555',
        brand: 'Mastercard',
        expiryMonth: 6,
        expiryYear: 2024,
        holderName: 'John Doe',
      },
      {
        id: '3',
        type: 'card',
        last4: '3782',
        brand: 'American Express',
        expiryMonth: 9,
        expiryYear: 2026,
        holderName: 'John Doe',
      },
      {
        id: '4',
        type: 'card',
        last4: '6011',
        brand: 'Discover',
        expiryMonth: 3,
        expiryYear: 2025,
        holderName: 'Jane Doe',
      },
    ],
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// Custom labels
export const CustomLabels: Story = {
  args: {
    savedMethods: mockSavedMethods.filter(m => m.type === 'card'),
    title: 'How would you like to pay?',
    savedCardsLabel: 'Your saved cards',
    newCardLabel: 'Use a different card',
    otherMethodsLabel: 'Alternative payment methods',
    onSelect: (methodId) => {
      console.log('Selected method:', methodId);
    },
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <PaymentMethodSelector
        savedMethods={mockSavedMethods}
        selectedMethodId="1"
        allowNewCard
        requireCVV
        acceptedTypes={['card', 'paypal', 'apple-pay', 'google-pay']}
        onSelect={(methodId) => {
          console.log('Selected method:', methodId);
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