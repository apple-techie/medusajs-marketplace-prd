import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, Mail, Lock, User, CreditCard, ChevronDown, Eye, EyeOff, Calendar } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic inputs
export const Default: Story = {
  args: {
    placeholder: 'Placeholder',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    helperText: 'Hint Text',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
    helperText: 'We\'ll never share your email',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    leftIcon: <Mail className="h-4 w-4" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search products...',
    rightIcon: <Search className="h-4 w-4" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    leftIcon: <User className="h-4 w-4" />,
    rightIcon: <ChevronDown className="h-4 w-4" />,
  },
};

// States
export const ErrorState: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: true,
    errorMessage: 'Please enter a valid email address',
    leftIcon: <Mail className="h-4 w-4" />,
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    variant: 'success',
    helperText: 'Email is available',
    leftIcon: <Mail className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    disabled: true,
    leftIcon: <Mail className="h-4 w-4" />,
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

// With addons
export const WithLeftAddon: Story = {
  args: {
    label: 'Price',
    placeholder: '0.00',
    leftAddon: 'IDR',
  },
};

export const WithRightAddon: Story = {
  args: {
    label: 'Weight',
    placeholder: '0',
    rightAddon: 'kg',
  },
};

// Input types
export const EmailInput: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
    leftIcon: <Mail className="h-4 w-4" />,
    required: true,
  },
};

export const PasswordInput: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        leftIcon={<Lock className="h-4 w-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer text-neutral-500 hover:text-neutral-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />
    );
  },
};

export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search products, vendors, orders...',
    leftIcon: <Search className="h-4 w-4" />,
  },
};

export const CreditCardInput: Story = {
  args: {
    label: 'Card Number',
    placeholder: '1234 5678 9012 3456',
    leftIcon: <CreditCard className="h-4 w-4" />,
  },
};

export const DateInput: Story = {
  args: {
    label: 'Order Date',
    type: 'date',
    leftIcon: <Calendar className="h-4 w-4" />,
  },
};

// E-commerce specific examples
export const ProductNameInput: Story = {
  args: {
    label: 'Product Name',
    placeholder: 'Enter product name',
    required: true,
    helperText: 'Use a descriptive name that customers will understand',
  },
};

export const SKUInput: Story = {
  args: {
    label: 'SKU',
    placeholder: 'ABC-123-XYZ',
    helperText: 'Stock Keeping Unit for inventory tracking',
  },
};

export const PriceInput: Story = {
  args: {
    label: 'Price',
    type: 'number',
    placeholder: '0.00',
    leftAddon: 'IDR',
    required: true,
  },
};

export const QuantityInput: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    placeholder: '1',
    min: '1',
    helperText: 'Minimum order quantity is 1',
  },
};