import type { Meta, StoryObj } from '@storybook/react';
import { Counter } from './Counter';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Counter',
  component: Counter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'primary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic counter
export const Default: Story = {
  args: {
    defaultValue: 1,
  },
};

export const WithMinMax: Story = {
  args: {
    defaultValue: 5,
    min: 0,
    max: 10,
  },
};

export const WithStep: Story = {
  args: {
    defaultValue: 0,
    step: 5,
    min: 0,
    max: 50,
  },
};

// Variants
export const OutlineVariant: Story = {
  args: {
    variant: 'outline',
    defaultValue: 1,
  },
};

export const PrimaryVariant: Story = {
  args: {
    variant: 'primary',
    defaultValue: 1,
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    defaultValue: 1,
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    defaultValue: 1,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    defaultValue: 1,
  },
};

// States
export const Disabled: Story = {
  args: {
    defaultValue: 1,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 1,
    readOnly: true,
  },
};

// E-commerce examples
export const QuantitySelector: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(1);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Quantity
        </label>
        <Counter
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={99}
          label="Product quantity"
        />
        <p className="text-xs text-neutral-600">
          Selected: {quantity} {quantity === 1 ? 'item' : 'items'}
        </p>
      </div>
    );
  },
};

export const CartItemQuantity: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: 1, name: 'Product A', price: 29.99, quantity: 1 },
      { id: 2, name: 'Product B', price: 49.99, quantity: 2 },
      { id: 3, name: 'Product C', price: 19.99, quantity: 1 },
    ]);

    const updateQuantity = (id: number, quantity: number) => {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
      <div className="w-96 space-y-4">
        <h3 className="text-lg font-medium">Shopping Cart</h3>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-neutral-600">${item.price}</p>
              </div>
              <Counter
                size="sm"
                value={item.quantity}
                onChange={(value) => updateQuantity(item.id, value)}
                min={0}
                max={99}
                label={`Quantity for ${item.name}`}
              />
            </div>
          ))}
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  },
};

export const BulkOrderQuantity: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(100);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Bulk Order Quantity
        </label>
        <Counter
          value={quantity}
          onChange={setQuantity}
          min={100}
          max={10000}
          step={100}
          variant="primary"
        />
        <p className="text-xs text-neutral-600">
          Minimum order: 100 units (increments of 100)
        </p>
      </div>
    );
  },
};

export const PriceAdjustment: Story = {
  render: () => {
    const [price, setPrice] = useState(29.99);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Product Price
        </label>
        <Counter
          value={price}
          onChange={setPrice}
          min={0}
          max={999.99}
          step={0.01}
          formatValue={(value) => `$${value.toFixed(2)}`}
        />
      </div>
    );
  },
};

export const InventoryAdjustment: Story = {
  render: () => {
    const [stock, setStock] = useState(50);

    return (
      <div className="p-4 bg-white border rounded-lg">
        <h4 className="font-medium mb-3">Inventory Management</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Current Stock:</span>
            <Counter
              size="sm"
              variant="outline"
              value={stock}
              onChange={setStock}
              min={0}
              max={999}
              step={10}
              label="Stock quantity"
            />
          </div>
          <div className="text-xs">
            {stock === 0 && <span className="text-danger-600">Out of stock</span>}
            {stock > 0 && stock <= 10 && <span className="text-warning-600">Low stock</span>}
            {stock > 10 && <span className="text-success-600">In stock</span>}
          </div>
        </div>
      </div>
    );
  },
};

export const RatingSelector: Story = {
  render: () => {
    const [rating, setRating] = useState(4);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Rate this product
        </label>
        <div className="flex items-center gap-3">
          <Counter
            value={rating}
            onChange={setRating}
            min={1}
            max={5}
            formatValue={(value) => `${value} ★`}
            size="sm"
          />
          <span className="text-sm text-neutral-600">
            {rating === 5 && 'Excellent'}
            {rating === 4 && 'Good'}
            {rating === 3 && 'Average'}
            {rating === 2 && 'Poor'}
            {rating === 1 && 'Very Poor'}
          </span>
        </div>
      </div>
    );
  },
};

export const PageSelector: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = 25;

    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-600">Page</span>
        <Counter
          value={page}
          onChange={setPage}
          min={1}
          max={totalPages}
          size="sm"
          variant="outline"
        />
        <span className="text-sm text-neutral-600">of {totalPages}</span>
      </div>
    );
  },
};

export const DiscountPercentage: Story = {
  render: () => {
    const [discount, setDiscount] = useState(10);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Discount Percentage
        </label>
        <Counter
          value={discount}
          onChange={setDiscount}
          min={0}
          max={100}
          step={5}
          formatValue={(value) => `${value}%`}
          variant="primary"
        />
        <p className="text-xs text-neutral-600">
          Apply discount in 5% increments
        </p>
      </div>
    );
  },
};

export const CommissionRate: Story = {
  render: () => {
    const [commission, setCommission] = useState(15);

    return (
      <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
        <h4 className="font-medium text-primary-900 mb-3">Commission Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-800">Commission Rate:</span>
            <Counter
              size="sm"
              variant="primary"
              value={commission}
              onChange={setCommission}
              min={15}
              max={25}
              step={5}
              formatValue={(value) => `${value}%`}
              label="Commission percentage"
            />
          </div>
          <div className="text-xs text-primary-700">
            {commission === 15 && 'Bronze Tier (15%)'}
            {commission === 20 && 'Silver Tier (20%)'}
            {commission === 25 && 'Gold Tier (25%)'}
          </div>
        </div>
      </div>
    );
  },
};

// Interactive example
export const ProductConfigurator: Story = {
  render: () => {
    const [config, setConfig] = useState({
      quantity: 1,
      warranty: 0,
      accessories: 0,
    });

    const basePrice = 299.99;
    const warrantyPrice = 49.99;
    const accessoryPrice = 19.99;
    
    const total = basePrice * config.quantity + 
                  warrantyPrice * config.warranty +
                  accessoryPrice * config.accessories;

    return (
      <div className="w-96 p-6 bg-neutral-50 rounded-lg space-y-4">
        <h3 className="text-lg font-medium">Product Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Quantity
            </label>
            <Counter
              value={config.quantity}
              onChange={(value) => setConfig({...config, quantity: value})}
              min={1}
              max={10}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Extended Warranty (Years)
            </label>
            <Counter
              value={config.warranty}
              onChange={(value) => setConfig({...config, warranty: value})}
              min={0}
              max={3}
              size="sm"
              variant="outline"
            />
            {config.warranty > 0 && (
              <p className="text-xs text-neutral-600 mt-1">
                +${(warrantyPrice * config.warranty).toFixed(2)}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Additional Accessories
            </label>
            <Counter
              value={config.accessories}
              onChange={(value) => setConfig({...config, accessories: value})}
              min={0}
              max={5}
              size="sm"
              variant="outline"
            />
            {config.accessories > 0 && (
              <p className="text-xs text-neutral-600 mt-1">
                +${(accessoryPrice * config.accessories).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span>Product ({config.quantity}x)</span>
            <span>${(basePrice * config.quantity).toFixed(2)}</span>
          </div>
          {config.warranty > 0 && (
            <div className="flex justify-between text-sm">
              <span>Warranty ({config.warranty} year{config.warranty > 1 ? 's' : ''})</span>
              <span>${(warrantyPrice * config.warranty).toFixed(2)}</span>
            </div>
          )}
          {config.accessories > 0 && (
            <div className="flex justify-between text-sm">
              <span>Accessories ({config.accessories}x)</span>
              <span>${(accessoryPrice * config.accessories).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  },
};