import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
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
    indeterminate: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic checkbox
export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Checkbox Label',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Checkbox Label',
    description: 'Checkbox Sublabel',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checkbox Label',
    defaultChecked: true,
  },
};

// States
export const Disabled: Story = {
  args: {
    label: 'Disabled Checkbox',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled Checked',
    disabled: true,
    defaultChecked: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Error Checkbox',
    error: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate State',
    indeterminate: true,
  },
};

// E-commerce examples
export const TermsAndConditions: Story = {
  args: {
    label: 'I agree to the Terms and Conditions',
    required: true,
  },
};

export const NewsletterSignup: Story = {
  args: {
    label: 'Send me promotional emails',
    description: 'You can unsubscribe at any time',
  },
};

export const RememberMe: Story = {
  args: {
    label: 'Remember me',
    description: 'Keep me logged in on this device',
  },
};

// Filter examples
export const ProductFilter: Story = {
  render: () => {
    const [filters, setFilters] = useState({
      inStock: false,
      onSale: false,
      freeShipping: false,
      newArrival: false,
    });

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Filters</h3>
        <Checkbox
          label="In Stock"
          checked={filters.inStock}
          onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
        />
        <Checkbox
          label="On Sale"
          checked={filters.onSale}
          onChange={(e) => setFilters({ ...filters, onSale: e.target.checked })}
        />
        <Checkbox
          label="Free Shipping"
          checked={filters.freeShipping}
          onChange={(e) => setFilters({ ...filters, freeShipping: e.target.checked })}
        />
        <Checkbox
          label="New Arrival"
          checked={filters.newArrival}
          onChange={(e) => setFilters({ ...filters, newArrival: e.target.checked })}
        />
      </div>
    );
  },
};

export const BrandFilter: Story = {
  render: () => {
    const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Under Armour'];
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const toggleBrand = (brand: string) => {
      setSelectedBrands(prev =>
        prev.includes(brand)
          ? prev.filter(b => b !== brand)
          : [...prev, brand]
      );
    };

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Brands</h3>
        {brands.map(brand => (
          <Checkbox
            key={brand}
            label={brand}
            checked={selectedBrands.includes(brand)}
            onChange={() => toggleBrand(brand)}
          />
        ))}
      </div>
    );
  },
};

// Vendor dashboard examples
export const VendorPermissions: Story = {
  render: () => {
    const [permissions, setPermissions] = useState({
      viewOrders: true,
      manageProducts: true,
      viewAnalytics: false,
      managePayouts: false,
    });

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">User Permissions</h3>
        <Checkbox
          label="View Orders"
          description="Can view order details and history"
          checked={permissions.viewOrders}
          onChange={(e) => setPermissions({ ...permissions, viewOrders: e.target.checked })}
        />
        <Checkbox
          label="Manage Products"
          description="Can add, edit, and delete products"
          checked={permissions.manageProducts}
          onChange={(e) => setPermissions({ ...permissions, manageProducts: e.target.checked })}
        />
        <Checkbox
          label="View Analytics"
          description="Can access sales and performance data"
          checked={permissions.viewAnalytics}
          onChange={(e) => setPermissions({ ...permissions, viewAnalytics: e.target.checked })}
        />
        <Checkbox
          label="Manage Payouts"
          description="Can configure payout settings"
          checked={permissions.managePayouts}
          onChange={(e) => setPermissions({ ...permissions, managePayouts: e.target.checked })}
        />
      </div>
    );
  },
};

// Bulk selection example
export const BulkSelection: Story = {
  render: () => {
    const items = [
      { id: 1, name: 'Product 1', price: '$99.00' },
      { id: 2, name: 'Product 2', price: '$149.00' },
      { id: 3, name: 'Product 3', price: '$199.00' },
      { id: 4, name: 'Product 4', price: '$79.00' },
    ];
    
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const allSelected = selectedItems.length === items.length;
    const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

    const toggleAll = () => {
      if (allSelected) {
        setSelectedItems([]);
      } else {
        setSelectedItems(items.map(item => item.id));
      }
    };

    const toggleItem = (id: number) => {
      setSelectedItems(prev =>
        prev.includes(id)
          ? prev.filter(itemId => itemId !== id)
          : [...prev, id]
      );
    };

    return (
      <div className="w-96">
        <div className="border-b border-neutral-200 pb-3 mb-3">
          <Checkbox
            label={`Select all (${selectedItems.length} selected)`}
            checked={allSelected}
            indeterminate={someSelected}
            onChange={toggleAll}
          />
        </div>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <Checkbox
                label={item.name}
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItem(item.id)}
              />
              <span className="text-sm text-neutral-600">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};