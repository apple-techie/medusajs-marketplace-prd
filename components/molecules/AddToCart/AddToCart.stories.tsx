import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { AddToCart } from './AddToCart';

const meta = {
  title: 'Molecules/AddToCart',
  component: AddToCart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'minimal', 'full'],
      description: 'Display variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    showQuantity: {
      control: 'boolean',
      description: 'Show quantity selector',
    },
    showPrice: {
      control: 'boolean',
      description: 'Show price information',
    },
    showStock: {
      control: 'boolean',
      description: 'Show stock status',
    },
    showSavings: {
      control: 'boolean',
      description: 'Show savings amount',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    quickAdd: {
      control: 'boolean',
      description: 'Quick add mode',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    available: {
      control: 'boolean',
      description: 'Product availability',
    },
    inStock: {
      control: 'boolean',
      description: 'Stock status',
    },
  },
} satisfies Meta<typeof AddToCart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic add to cart
export const Default: Story = {
  args: {
    productId: '123',
    productName: 'Wireless Headphones',
    price: 79.99,
  },
};

// With original price and savings
export const WithSavings: Story = {
  args: {
    productId: '123',
    productName: 'Premium Headphones',
    price: 79.99,
    originalPrice: 129.99,
    showSavings: true,
  },
};

// Out of stock
export const OutOfStock: Story = {
  args: {
    productId: '123',
    productName: 'Popular Item',
    price: 49.99,
    inStock: false,
    showStock: true,
  },
};

// Limited stock
export const LimitedStock: Story = {
  args: {
    productId: '123',
    productName: 'Limited Edition',
    price: 99.99,
    stockCount: 3,
    showStock: true,
  },
};

// Compact variant
export const CompactVariant: Story = {
  args: {
    productId: '123',
    productName: 'Compact Product',
    price: 29.99,
    variant: 'compact',
  },
};

// Minimal variant (quick add)
export const MinimalVariant: Story = {
  args: {
    productId: '123',
    productName: 'Quick Add Item',
    price: 19.99,
    variant: 'minimal',
  },
};

// Full variant with all features
export const FullVariant: Story = {
  args: {
    productId: '123',
    productName: 'Premium Product',
    price: 149.99,
    originalPrice: 199.99,
    variant: 'full',
    showPrice: true,
    showStock: true,
    showSavings: true,
    stockCount: 15,
  },
};

// Different sizes
export const SmallSize: Story = {
  args: {
    productId: '123',
    productName: 'Small Button',
    price: 29.99,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    productId: '123',
    productName: 'Large Button',
    price: 29.99,
    size: 'lg',
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    productId: '123',
    productName: 'Loading Product',
    price: 59.99,
    loading: true,
  },
};

// Disabled state
export const DisabledState: Story = {
  args: {
    productId: '123',
    productName: 'Disabled Product',
    price: 39.99,
    disabled: true,
  },
};

// With max quantity
export const WithMaxQuantity: Story = {
  args: {
    productId: '123',
    productName: 'Limited Quantity',
    price: 89.99,
    maxQuantity: 5,
    stockCount: 10,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [cartItems, setCartItems] = useState<Array<{ id: string; quantity: number }>>([]);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (quantity: number) => {
      setIsAdding(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCartItems(prev => [...prev, { id: '123', quantity }]);
      setIsAdding(false);
    };

    return (
      <div className="space-y-6 min-w-[400px]">
        <AddToCart
          productId="123"
          productName="Interactive Product"
          price={99.99}
          originalPrice={149.99}
          stockCount={8}
          showStock
          showSavings
          onAddToCart={handleAddToCart}
          loading={isAdding}
        />
        
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <h3 className="font-semibold mb-2">Cart Items:</h3>
          {cartItems.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400">Cart is empty</p>
          ) : (
            <ul className="space-y-1">
              {cartItems.map((item, index) => (
                <li key={index} className="text-sm">
                  Item #{item.id} - Quantity: {item.quantity}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
};

// Product card integration
export const ProductCardExample: Story = {
  render: () => (
    <div className="w-64 p-4 border rounded-lg space-y-4">
      <img
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
        alt="Product"
        className="w-full h-48 object-cover rounded"
      />
      <div>
        <h3 className="font-semibold">Wireless Headphones</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Premium sound quality
        </p>
      </div>
      <AddToCart
        productId="123"
        productName="Wireless Headphones"
        price={79.99}
        originalPrice={99.99}
        variant="compact"
        fullWidth
      />
    </div>
  ),
};

// Product detail page example
export const ProductDetailExample: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Premium Wireless Headphones</h1>
        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <span>⭐ 4.5 (234 reviews)</span>
          <span>SKU: WH-12345</span>
        </div>
      </div>
      
      <AddToCart
        productId="123"
        productName="Premium Wireless Headphones"
        price={149.99
        originalPrice={199.99}
        stockCount={12}
        variant="full"
        showPrice
        showStock
        showSavings
        size="lg"
      />
    </div>
  ),
};

// Quick add buttons grid
export const QuickAddGrid: Story = {
  render: () => {
    const products = [
      { id: '1', name: 'T-Shirt', price: 19.99 },
      { id: '2', name: 'Jeans', price: 59.99 },
      { id: '3', name: 'Sneakers', price: 89.99 },
      { id: '4', name: 'Hat', price: 24.99 },
    ];

    return (
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 space-y-3">
            <div className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded" />
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-lg font-bold">${product.price}</p>
            <AddToCart
              productId={product.id}
              productName={product.name}
              price={product.price}
              variant="minimal"
              size="sm"
              fullWidth
            />
          </div>
        ))}
      </div>
    );
  },
};

// Different quantity steps
export const QuantitySteps: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Single units (default)</h3>
        <AddToCart
          productId="123"
          productName="Single Unit Product"
          price={29.99}
          quantityStep={1}
        />
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Pack of 6</h3>
        <AddToCart
          productId="456"
          productName="6-Pack Product"
          price={149.99}
          quantityStep={6}
          defaultQuantity={6}
        />
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Dozen (12)</h3>
        <AddToCart
          productId="789"
          productName="Dozen Product"
          price={359.99}
          quantityStep={12}
          defaultQuantity={12}
        />
      </div>
    </div>
  ),
};

// Custom labels
export const CustomLabels: Story = {
  args: {
    productId: '123',
    productName: 'Custom Product',
    price: 49.99,
    addToCartLabel: 'Buy Now',
    addingLabel: 'Processing...',
    addedLabel: 'Success!',
    outOfStockLabel: 'Sold Out',
    limitedStockLabel: 'Only Few Left',
    quantityLabel: 'Qty',
    stockCount: 4,
    showStock: true,
    variant: 'full',
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <div className="max-w-md space-y-6">
        <div className="text-white">
          <h2 className="text-xl font-bold mb-2">Dark Theme Product</h2>
          <p className="text-neutral-400">Premium quality item</p>
        </div>
        
        <AddToCart
          productId="123"
          productName="Dark Theme Product"
          price={89.99}
          originalPrice={119.99}
          stockCount={7}
          variant="full"
          showPrice
          showStock
          showSavings
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