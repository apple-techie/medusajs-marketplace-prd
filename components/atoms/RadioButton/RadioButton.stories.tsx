import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton, RadioGroup } from './RadioButton';
import { useState } from 'react';

const meta = {
  title: 'Atoms/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic radio button
export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Label',
    description: 'Description text',
  },
};

export const Checked: Story = {
  args: {
    label: 'Selected option',
    checked: true,
    readOnly: true,
  },
};

// States
export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled selected',
    disabled: true,
    checked: true,
    readOnly: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Error state',
    error: true,
  },
};

// Radio Group Examples
export const BasicRadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <RadioGroup name="basic" value={value} onChange={setValue}>
        <RadioButton value="option1" label="Option 1" />
        <RadioButton value="option2" label="Option 2" />
        <RadioButton value="option3" label="Option 3" />
      </RadioGroup>
    );
  },
};

export const HorizontalRadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <RadioGroup 
        name="horizontal" 
        value={value} 
        onChange={setValue}
        orientation="horizontal"
      >
        <RadioButton value="option1" label="Option 1" />
        <RadioButton value="option2" label="Option 2" />
        <RadioButton value="option3" label="Option 3" />
      </RadioGroup>
    );
  },
};

// E-commerce examples
export const PaymentMethod: Story = {
  render: () => {
    const [payment, setPayment] = useState('card');

    return (
      <div className="w-80">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Payment Method</h3>
        <RadioGroup name="payment" value={payment} onChange={setPayment}>
          <RadioButton 
            value="card" 
            label="Credit/Debit Card"
            description="Visa, Mastercard, American Express"
          />
          <RadioButton 
            value="bank" 
            label="Bank Transfer"
            description="Direct bank transfer"
          />
          <RadioButton 
            value="ewallet" 
            label="E-Wallet"
            description="GoPay, OVO, DANA"
          />
          <RadioButton 
            value="cod" 
            label="Cash on Delivery"
            description="Pay when you receive your order"
          />
        </RadioGroup>
      </div>
    );
  },
};

export const ShippingMethod: Story = {
  render: () => {
    const [shipping, setShipping] = useState('standard');

    return (
      <div className="w-80">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Shipping Method</h3>
        <RadioGroup name="shipping" value={shipping} onChange={setShipping}>
          <RadioButton 
            value="standard" 
            label="Standard Shipping"
            description="5-7 business days • Free"
          />
          <RadioButton 
            value="express" 
            label="Express Shipping"
            description="2-3 business days • IDR 25,000"
          />
          <RadioButton 
            value="overnight" 
            label="Overnight Shipping"
            description="Next business day • IDR 50,000"
          />
        </RadioGroup>
      </div>
    );
  },
};

export const AccountType: Story = {
  render: () => {
    const [accountType, setAccountType] = useState('customer');

    return (
      <div className="w-80">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Select Account Type</h3>
        <RadioGroup name="account" value={accountType} onChange={setAccountType}>
          <RadioButton 
            value="customer" 
            label="Customer"
            description="Shop and track orders"
          />
          <RadioButton 
            value="shop" 
            label="Shop (Affiliate)"
            description="Earn commission on sales"
          />
          <RadioButton 
            value="brand" 
            label="Brand"
            description="Sell your products directly"
          />
          <RadioButton 
            value="distributor" 
            label="Distributor"
            description="Fulfill orders for multiple brands"
          />
        </RadioGroup>
      </div>
    );
  },
};

export const SubscriptionPlan: Story = {
  render: () => {
    const [plan, setPlan] = useState('silver');

    return (
      <div className="w-96">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Choose Your Plan</h3>
        <RadioGroup name="plan" value={plan} onChange={setPlan}>
          <div className="p-4 border rounded-lg border-neutral-200">
            <RadioButton 
              value="bronze" 
              label="Bronze Tier"
              description="15% commission • Basic features • Email support"
            />
          </div>
          <div className="p-4 border-2 rounded-lg border-primary-500 bg-primary-50">
            <RadioButton 
              value="silver" 
              label="Silver Tier"
              description="20% commission • Advanced features • Priority support"
            />
          </div>
          <div className="p-4 border rounded-lg border-neutral-200">
            <RadioButton 
              value="gold" 
              label="Gold Tier"
              description="25% commission • All features • Dedicated support"
            />
          </div>
        </RadioGroup>
      </div>
    );
  },
};

export const DeliveryTime: Story = {
  render: () => {
    const [time, setTime] = useState('morning');

    return (
      <div className="w-80">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Preferred Delivery Time</h3>
        <RadioGroup name="time" value={time} onChange={setTime}>
          <RadioButton 
            value="morning" 
            label="Morning"
            description="8:00 AM - 12:00 PM"
          />
          <RadioButton 
            value="afternoon" 
            label="Afternoon"
            description="12:00 PM - 5:00 PM"
          />
          <RadioButton 
            value="evening" 
            label="Evening"
            description="5:00 PM - 9:00 PM"
          />
        </RadioGroup>
      </div>
    );
  },
};

export const SortOptions: Story = {
  render: () => {
    const [sort, setSort] = useState('relevance');

    return (
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Sort By</h3>
        <RadioGroup 
          name="sort" 
          value={sort} 
          onChange={setSort}
          orientation="horizontal"
        >
          <RadioButton value="relevance" label="Relevance" />
          <RadioButton value="price-low" label="Price ↑" />
          <RadioButton value="price-high" label="Price ↓" />
          <RadioButton value="newest" label="Newest" />
        </RadioGroup>
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const hasError = value === '';

    return (
      <div className="w-80">
        <h3 className="text-sm font-medium text-neutral-900 mb-1">
          Select an option <span className="text-danger-500">*</span>
        </h3>
        <p className="text-sm text-neutral-600 mb-3">This field is required</p>
        <RadioGroup name="required" value={value} onChange={setValue}>
          <RadioButton value="yes" label="Yes" error={hasError} />
          <RadioButton value="no" label="No" error={hasError} />
        </RadioGroup>
        {hasError && (
          <p className="mt-2 text-sm text-danger-600">Please select an option</p>
        )}
      </div>
    );
  },
};