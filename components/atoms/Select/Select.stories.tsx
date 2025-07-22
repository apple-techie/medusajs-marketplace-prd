import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { ChevronDown, Globe, Package, Store, Truck } from 'lucide-react';

const meta = {
  title: 'Atoms/Select',
  component: Select,
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
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic selects
export const Default: Story = {
  args: {
    placeholder: 'Select an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    helperText: 'Hint Text',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const Required: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select your country',
    required: true,
    helperText: 'Required for shipping',
    options: [
      { value: 'id', label: 'Indonesia' },
      { value: 'my', label: 'Malaysia' },
      { value: 'sg', label: 'Singapore' },
      { value: 'th', label: 'Thailand' },
    ],
  },
};

// States
export const ErrorState: Story = {
  args: {
    label: 'Category',
    placeholder: 'Select a category',
    error: true,
    errorMessage: 'Please select a category',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'fashion', label: 'Fashion' },
      { value: 'home', label: 'Home & Garden' },
    ],
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Status',
    variant: 'success',
    helperText: 'Status updated successfully',
    defaultValue: 'active',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
};

export const Disabled: Story = {
  args: {
    label: 'Shipping Method',
    disabled: true,
    defaultValue: 'standard',
    options: [
      { value: 'standard', label: 'Standard Shipping' },
      { value: 'express', label: 'Express Shipping' },
      { value: 'overnight', label: 'Overnight Shipping' },
    ],
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small select',
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium select',
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large select',
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  },
};

// E-commerce specific examples
export const ProductCategory: Story = {
  args: {
    label: 'Product Category',
    placeholder: 'Select a category',
    required: true,
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'fashion-men', label: 'Fashion - Men' },
      { value: 'fashion-women', label: 'Fashion - Women' },
      { value: 'home-garden', label: 'Home & Garden' },
      { value: 'sports', label: 'Sports & Outdoors' },
      { value: 'beauty', label: 'Beauty & Personal Care' },
      { value: 'toys', label: 'Toys & Games' },
      { value: 'books', label: 'Books' },
    ],
  },
};

export const VendorType: Story = {
  args: {
    label: 'Vendor Type',
    placeholder: 'Select vendor type',
    helperText: 'This determines your commission structure',
    options: [
      { value: 'shop', label: 'Shop (Affiliate)' },
      { value: 'brand', label: 'Brand (Direct Supplier)' },
      { value: 'distributor', label: 'Distributor (Fulfillment)' },
    ],
  },
};

export const OrderStatus: Story = {
  args: {
    label: 'Order Status',
    defaultValue: 'pending',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'processing', label: 'Processing' },
      { value: 'shipped', label: 'Shipped' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'refunded', label: 'Refunded' },
    ],
  },
};

export const PaymentMethod: Story = {
  args: {
    label: 'Payment Method',
    placeholder: 'Select payment method',
    required: true,
    options: [
      { value: 'card', label: 'Credit/Debit Card' },
      { value: 'bank', label: 'Bank Transfer' },
      { value: 'ewallet', label: 'E-Wallet' },
      { value: 'cod', label: 'Cash on Delivery' },
    ],
  },
};

export const ShippingProvider: Story = {
  args: {
    label: 'Shipping Provider',
    placeholder: 'Select shipping provider',
    options: [
      { value: 'internal', label: 'Neo Mart Express' },
      { value: 'jne', label: 'JNE' },
      { value: 'jnt', label: 'J&T Express' },
      { value: 'sicepat', label: 'SiCepat' },
      { value: 'anteraja', label: 'AnterAja' },
      { value: 'grab', label: 'GrabExpress' },
      { value: 'gojek', label: 'GoSend' },
    ],
  },
};

export const ProductVariant: Story = {
  args: {
    label: 'Size',
    placeholder: 'Select size',
    required: true,
    options: [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
      { value: '2xl', label: '2XL' },
      { value: '3xl', label: '3XL', disabled: true },
    ],
  },
};

export const PriceRange: Story = {
  args: {
    label: 'Price Range',
    placeholder: 'Select price range',
    options: [
      { value: '0-100000', label: 'Under IDR 100,000' },
      { value: '100000-500000', label: 'IDR 100,000 - 500,000' },
      { value: '500000-1000000', label: 'IDR 500,000 - 1,000,000' },
      { value: '1000000-5000000', label: 'IDR 1,000,000 - 5,000,000' },
      { value: '5000000+', label: 'Above IDR 5,000,000' },
    ],
  },
};

export const SortBy: Story = {
  args: {
    label: 'Sort By',
    defaultValue: 'relevance',
    options: [
      { value: 'relevance', label: 'Relevance' },
      { value: 'price-low', label: 'Price: Low to High' },
      { value: 'price-high', label: 'Price: High to Low' },
      { value: 'newest', label: 'Newest First' },
      { value: 'rating', label: 'Customer Rating' },
      { value: 'bestselling', label: 'Best Selling' },
    ],
  },
};