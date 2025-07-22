import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { CartSummary } from './CartSummary';

const meta = {
  title: 'Molecules/CartSummary',
  component: CartSummary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed', 'minimal'],
      description: 'Display variant',
    },
    showBreakdown: {
      control: 'boolean',
      description: 'Show price breakdown',
    },
    showSavings: {
      control: 'boolean',
      description: 'Show savings amount',
    },
    showPromoCode: {
      control: 'boolean',
      description: 'Show promo code input',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow collapsing breakdown',
    },
  },
} satisfies Meta<typeof CartSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic cart summary
export const Default: Story = {
  args: {
    subtotal: 149.99,
    total: 149.99,
  },
};

// With shipping
export const WithShipping: Story = {
  args: {
    subtotal: 149.99,
    shipping: {
      amount: 9.99,
      method: 'Standard Shipping',
      estimatedDays: '3-5 business days',
    },
    total: 159.98,
  },
};

// Free shipping
export const FreeShipping: Story = {
  args: {
    subtotal: 149.99,
    shipping: {
      amount: 0,
      isFree: true,
      method: 'Free Standard Shipping',
    },
    total: 149.99,
  },
};

// Below free shipping threshold
export const BelowFreeShipping: Story = {
  args: {
    subtotal: 35.99,
    shipping: {
      amount: 9.99,
      isFree: false,
      freeThreshold: 50,
    },
    total: 45.98,
  },
};

// With discount
export const WithDiscount: Story = {
  args: {
    subtotal: 199.99,
    discount: {
      amount: 40,
      code: 'SAVE20',
      type: 'percentage',
      description: '20% off your order',
    },
    total: 159.99,
  },
};

// With tax
export const WithTax: Story = {
  args: {
    subtotal: 99.99,
    tax: {
      amount: 8.99,
      rate: 9,
    },
    total: 108.98,
  },
};

// Detailed variant with tax breakdown
export const DetailedWithTaxBreakdown: Story = {
  args: {
    subtotal: 149.99,
    variant: 'detailed',
    tax: {
      amount: 12.75,
      rate: 8.5,
      breakdown: [
        { label: 'State Tax (6%)', amount: 9.00 },
        { label: 'Local Tax (2.5%)', amount: 3.75 },
      ],
    },
    total: 162.74,
  },
};

// Full example
export const FullExample: Story = {
  args: {
    subtotal: 299.97,
    items: [
      {
        label: 'Gift Wrapping',
        value: 5.99,
        icon: 'gift',
        description: 'Premium gift wrap',
      },
    ],
    shipping: {
      amount: 0,
      isFree: true,
      method: 'Free Express Shipping',
    },
    discount: {
      amount: 30,
      code: 'WELCOME10',
      description: '10% off for new customers',
    },
    tax: {
      amount: 24.30,
      rate: 8.5,
      inclusive: false,
    },
    total: 300.26,
    originalTotal: 330.26,
    showSavings: true,
  },
};

// With loyalty points
export const WithLoyaltyPoints: Story = {
  args: {
    subtotal: 149.99,
    loyaltyPoints: {
      earned: 150,
      used: 100,
      balance: 1250,
    },
    total: 149.99,
  },
};

// With promo code
export const WithPromoCode: Story = {
  args: {
    subtotal: 99.99,
    total: 99.99,
    showPromoCode: true,
    onApplyPromo: (code: string) => {
      console.log('Applying promo code:', code);
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

// With checkout button
export const WithCheckoutButton: Story = {
  args: {
    subtotal: 249.99,
    shipping: {
      amount: 0,
      isFree: true,
    },
    tax: {
      amount: 22.50,
      rate: 9,
    },
    total: 272.49,
    checkoutButton: {
      label: 'Proceed to Checkout',
      onClick: () => alert('Proceeding to checkout'),
    },
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    subtotal: 0,
    total: 0,
    loading: true,
  },
};

// Minimal variant
export const MinimalVariant: Story = {
  args: {
    subtotal: 49.99,
    total: 59.98,
    variant: 'minimal',
    shipping: {
      amount: 9.99,
    },
  },
};

// Collapsible
export const Collapsible: Story = {
  args: {
    subtotal: 199.99,
    shipping: {
      amount: 15.99,
      method: 'Express Shipping',
    },
    tax: {
      amount: 19.44,
      rate: 9,
    },
    total: 235.42,
    collapsible: true,
    defaultExpanded: true,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [discount, setDiscount] = useState<any>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    
    const subtotal = 149.99;
    const shipping = 9.99;
    const tax = 14.40;
    const discountAmount = discount ? subtotal * 0.15 : 0;
    const total = subtotal + shipping + tax - discountAmount;

    const handleApplyPromo = async (code: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (code.toUpperCase() === 'SAVE15') {
        setDiscount({
          amount: subtotal * 0.15,
          code: code.toUpperCase(),
          type: 'percentage',
          description: '15% off your order',
        });
      } else {
        alert('Invalid promo code');
      }
    };

    const handleCheckout = async () => {
      setIsCheckingOut(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsCheckingOut(false);
      alert('Order placed successfully!');
    };

    return (
      <CartSummary
        subtotal={subtotal}
        shipping={{
          amount: shipping,
          method: 'Standard Shipping',
          estimatedDays: '3-5 business days',
        }}
        discount={discount}
        tax={{
          amount: tax,
          rate: 9.6,
        }}
        total={total}
        showPromoCode
        onApplyPromo={handleApplyPromo}
        checkoutButton={{
          onClick: handleCheckout,
          loading: isCheckingOut,
        }}
        continueShoppingUrl="#"
      />
    );
  },
};

// E-commerce example
export const EcommerceCart: Story = {
  render: () => {
    return (
      <div className="max-w-md">
        <CartSummary
          subtotal={324.97}
          items={[
            {
              label: 'Product Protection',
              value: 29.99,
              icon: 'shield',
              description: '2-year coverage',
            },
          ]}
          shipping={{
            amount: 0,
            isFree: true,
            method: 'Free 2-Day Shipping',
            freeThreshold: 35,
          }}
          discount={{
            amount: 48.75,
            code: 'SUMMER15',
            description: '15% off summer sale',
          }}
          tax={{
            amount: 27.61,
            rate: 8.5,
          }}
          loyaltyPoints={{
            earned: 334,
            balance: 2150,
          }}
          total={333.82}
          originalTotal: 382.57,
          showSavings
          showPromoCode
          onApplyPromo={async (code) => {
            console.log('Applying:', code);
          }}
          checkoutButton={{
            label: 'Checkout',
            onClick: () => console.log('Checkout clicked'),
          }}
          continueShoppingUrl="/shop"
        />
      </div>
    );
  },
};

// Marketplace with multiple vendors
export const MarketplaceCart: Story = {
  render: () => {
    return (
      <div className="max-w-md">
        <CartSummary
          subtotal={189.96}
          items={[
            {
              label: 'Vendor A Shipping',
              value: 5.99,
              icon: 'truck',
              description: 'Standard delivery',
            },
            {
              label: 'Vendor B Shipping',
              value: 7.99,
              icon: 'truck',
              description: 'Express delivery',
            },
            {
              label: 'Marketplace Fee',
              value: 2.85,
              type: 'fee',
            },
          ]}
          tax={{
            amount: 17.65,
            rate: 8.25,
            inclusive: false,
          }}
          total={224.44}
          variant="detailed"
          checkoutButton={{
            label: 'Place Order',
          }}
        />
      </div>
    );
  },
};

// Subscription cart
export const SubscriptionCart: Story = {
  render: () => {
    return (
      <div className="max-w-md">
        <CartSummary
          subtotal={39.99}
          items={[
            {
              label: 'Monthly Subscription',
              value: 39.99,
              icon: 'calendar',
              highlight: true,
            },
            {
              label: 'First Month Discount',
              value: 10,
              type: 'discount',
              description: 'New subscriber offer',
            },
          ]}
          total={29.99}
          originalTotal={39.99}
          showSavings
          checkoutButton={{
            label: 'Start Subscription',
          }}
        />
      </div>
    );
  },
};

// Mobile optimized
export const MobileOptimized: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <CartSummary
        subtotal={89.99}
        shipping={{
          amount: 9.99,
          method: 'Standard',
        }}
        tax={{
          amount: 9.00,
          rate: 9,
        }}
        total={108.98}
        variant="compact"
        checkoutButton={{
          label: 'Checkout',
        }}
      />
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <div className="max-w-md">
        <CartSummary
          subtotal={299.99}
          shipping={{
            amount: 0,
            isFree: true,
            method: 'Free Shipping',
          }}
          discount={{
            amount: 45,
            code: 'DARK15',
            description: '15% off',
          }}
          tax={{
            amount: 22.95,
            rate: 9,
          }}
          total={277.94}
          originalTotal={322.94,
          showSavings
          showPromoCode
          onApplyPromo={async () => {}}
          checkoutButton={{
            label: 'Complete Purchase',
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};