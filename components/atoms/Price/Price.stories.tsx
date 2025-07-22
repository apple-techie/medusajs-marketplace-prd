import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Price, PriceRange, usePriceCalculations } from './Price';

const meta = {
  title: 'Atoms/Price',
  component: Price,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    amount: {
      control: { type: 'number', step: 0.01 },
    },
    originalAmount: {
      control: { type: 'number', step: 0.01 },
    },
    currency: {
      control: 'select',
      options: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
    },
    currencyDisplay: {
      control: 'select',
      options: ['symbol', 'code', 'name'],
    },
    currencyPosition: {
      control: 'select',
      options: ['before', 'after'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'sale', 'muted', 'strikethrough'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    showCurrency: {
      control: 'boolean',
    },
    showOriginal: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic price
export const Default: Story = {
  args: {
    amount: 29.99,
  },
};

// With discount
export const WithDiscount: Story = {
  args: {
    amount: 19.99,
    originalAmount: 29.99,
  },
};

// Different currencies
export const Currencies: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-1">USD (United States)</p>
        <Price amount={99.99} currency="USD" locale="en-US" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">EUR (Germany)</p>
        <Price amount={99.99} currency="EUR" locale="de-DE" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">GBP (United Kingdom)</p>
        <Price amount={99.99} currency="GBP" locale="en-GB" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">JPY (Japan)</p>
        <Price amount={9999} currency="JPY" locale="ja-JP" minimumFractionDigits={0} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">CAD (Canada)</p>
        <Price amount={99.99} currency="CAD" locale="en-CA" />
      </div>
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-baseline gap-4">
        <span className="w-20 text-sm">Extra Small:</span>
        <Price amount={29.99} size="xs" />
      </div>
      <div className="flex items-baseline gap-4">
        <span className="w-20 text-sm">Small:</span>
        <Price amount={29.99} size="sm" />
      </div>
      <div className="flex items-baseline gap-4">
        <span className="w-20 text-sm">Medium:</span>
        <Price amount={29.99} size="md" />
      </div>
      <div className="flex items-baseline gap-4">
        <span className="w-20 text-sm">Large:</span>
        <Price amount={29.99} size="lg" />
      </div>
      <div className="flex items-baseline gap-4">
        <span className="w-20 text-sm">Extra Large:</span>
        <Price amount={29.99} size="xl" />
      </div>
      <div className="flex items-baseline gap-4">
        <span className="w-20 text-sm">2X Large:</span>
        <Price amount={29.99} size="2xl" />
      </div>
      <div className="flex items-baseline gap-4">
        <span className="w-20 text-sm">3X Large:</span>
        <Price amount={29.99} size="3xl" />
      </div>
    </div>
  ),
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-1">Default</p>
        <Price amount={29.99} variant="default" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Primary</p>
        <Price amount={29.99} variant="primary" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Sale</p>
        <Price amount={29.99} variant="sale" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Muted</p>
        <Price amount={29.99} variant="muted" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Strikethrough</p>
        <Price amount={29.99} variant="strikethrough" />
      </div>
    </div>
  ),
};

// With prefix and suffix
export const WithPrefixSuffix: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-1">Starting price</p>
        <Price amount={9.99} prefix="From" size="lg" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Price per unit</p>
        <Price amount={4.99} suffix="/each" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Subscription pricing</p>
        <Price amount={19.99} suffix="/month" size="lg" weight="bold" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Hourly rate</p>
        <Price amount={75} suffix="/hr" prefix="Starting at" />
      </div>
    </div>
  ),
};

// Currency positions
export const CurrencyPositions: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-1">Currency before (default)</p>
        <Price amount={99.99} currencyPosition="before" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Currency after</p>
        <Price amount={99.99} currencyPosition="after" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">No currency</p>
        <Price amount={99.99} showCurrency={false} />
      </div>
    </div>
  ),
};

// Price ranges
export const PriceRanges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-1">Basic range</p>
        <PriceRange minAmount={10} maxAmount={50} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Large range</p>
        <PriceRange minAmount={99} maxAmount={299} size="lg" weight="bold" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Custom separator</p>
        <PriceRange minAmount={5} maxAmount={25} separator=" to " variant="primary" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-1">Different currency</p>
        <PriceRange minAmount={50} maxAmount={150} currency="EUR" locale="de-DE" />
      </div>
    </div>
  ),
};

// Product card example
export const ProductCard: Story = {
  render: () => (
    <div className="border rounded-lg p-4 max-w-sm">
      <img 
        src="https://via.placeholder.com/300x200" 
        alt="Product" 
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="font-semibold mb-2">Premium Wireless Headphones</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <Price amount={79.99} originalAmount={119.99} size="lg" weight="bold" />
        <span className="text-sm text-success-600 font-medium">33% off</span>
      </div>
      <button className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">
        Add to Cart
      </button>
    </div>
  ),
};

// Shopping cart example
export const ShoppingCart: Story = {
  render: () => {
    const items = [
      { name: 'Laptop Stand', price: 49.99, quantity: 1 },
      { name: 'Wireless Mouse', price: 29.99, originalPrice: 39.99, quantity: 2 },
      { name: 'USB-C Hub', price: 39.99, quantity: 1 },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
      <div className="border rounded-lg p-4 max-w-md">
        <h3 className="font-semibold text-lg mb-4">Shopping Cart</h3>
        
        <div className="space-y-3 mb-4 pb-4 border-b">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <Price 
                  amount={item.price * item.quantity} 
                  originalAmount={item.originalPrice && item.originalPrice * item.quantity}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <Price amount={subtotal} variant="muted" />
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <Price amount={tax} variant="muted" />
          </div>
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <span className="font-semibold">Total</span>
          <Price amount={total} size="lg" weight="bold" />
        </div>
      </div>
    );
  },
};

// Price calculator example
export const PriceCalculator: Story = {
  render: () => {
    const basePrice = 99.99;
    const calculations = usePriceCalculations(basePrice, {
      discount: 15,
      discountType: 'percentage',
      taxRate: 8.5,
      quantity: 2,
    });

    return (
      <div className="border rounded-lg p-6 max-w-md">
        <h3 className="font-semibold text-lg mb-4">Price Calculator</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Original Price</span>
            <Price amount={calculations.originalPrice} />
          </div>
          
          <div className="flex justify-between text-danger-600">
            <span>Discount (15%)</span>
            <span>-<Price amount={calculations.discountAmount} showCurrency={false} /></span>
          </div>
          
          <div className="flex justify-between">
            <span>Discounted Price</span>
            <Price amount={calculations.discountedPrice} />
          </div>
          
          <div className="flex justify-between">
            <span>Tax (8.5%)</span>
            <span>+<Price amount={calculations.taxAmount} showCurrency={false} /></span>
          </div>
          
          <div className="flex justify-between font-medium">
            <span>Price per item</span>
            <Price amount={calculations.finalPrice} />
          </div>
          
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Quantity</span>
            <span>× 2</span>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <span className="font-semibold">Total</span>
            <Price amount={calculations.totalPrice} size="lg" weight="bold" variant="primary" />
          </div>
          
          <div className="bg-success-50 text-success-800 p-3 rounded text-sm">
            You save <Price amount={calculations.savings} variant="sale" /> ({calculations.savingsPercentage.toFixed(0)}%)
          </div>
        </div>
      </div>
    );
  },
};

// International pricing
export const InternationalPricing: Story = {
  render: () => {
    const price = 99.99;
    const exchangeRates = {
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      CAD: 1.25,
    };

    return (
      <div className="space-y-3">
        <h3 className="font-semibold mb-3">International Pricing</h3>
        
        <div className="flex items-center gap-4">
          <span className="w-32">United States:</span>
          <Price amount={price} currency="USD" locale="en-US" size="lg" />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="w-32">European Union:</span>
          <Price amount={price * exchangeRates.EUR} currency="EUR" locale="de-DE" size="lg" />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="w-32">United Kingdom:</span>
          <Price amount={price * exchangeRates.GBP} currency="GBP" locale="en-GB" size="lg" />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="w-32">Japan:</span>
          <Price amount={price * exchangeRates.JPY} currency="JPY" locale="ja-JP" size="lg" minimumFractionDigits={0} />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="w-32">Canada:</span>
          <Price amount={price * exchangeRates.CAD} currency="CAD" locale="en-CA" size="lg" />
        </div>
      </div>
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Dark Theme Pricing</h3>
        <Price 
          amount={49.99} 
          originalAmount={79.99} 
          size="xl" 
          weight="bold"
          className="text-white"
          originalClassName="text-neutral-400"
        />
      </div>
      
      <div className="border-t border-neutral-700 pt-4">
        <PriceRange 
          minAmount={20} 
          maxAmount={100} 
          className="text-neutral-300"
        />
      </div>
    </div>
  ),
};