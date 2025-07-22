import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { CartItem } from './CartItem';

const meta = {
  title: 'Molecules/CartItem',
  component: CartItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'compact'],
      description: 'Layout style',
    },
    status: {
      control: 'select',
      options: ['available', 'limited', 'backorder', 'unavailable'],
      description: 'Item status',
    },
    editable: {
      control: 'boolean',
      description: 'Allow quantity editing',
    },
    removable: {
      control: 'boolean',
      description: 'Show remove button',
    },
    selectable: {
      control: 'boolean',
      description: 'Show selection checkbox',
    },
  },
} satisfies Meta<typeof CartItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic cart item
export const Default: Story = {
  args: {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    quantity: 1,
    image: {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      alt: 'Wireless headphones',
    },
  },
};

// With variant and description
export const WithDetails: Story = {
  args: {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    description: 'Soft and comfortable 100% organic cotton',
    variant: 'Size: L, Color: Navy Blue',
    price: 29.99,
    quantity: 2,
    image: {
      src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      alt: 'Cotton t-shirt',
    },
  },
};

// With savings
export const WithSavings: Story = {
  args: {
    id: '3',
    name: 'Smart Watch Pro',
    price: 199.99,
    originalPrice: 299.99,
    quantity: 1,
    showSavings: true,
    image: {
      src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      alt: 'Smart watch',
    },
  },
};

// Out of stock
export const OutOfStock: Story = {
  args: {
    id: '4',
    name: 'Limited Edition Sneakers',
    price: 149.99,
    quantity: 1,
    inStock: false,
    showStock: true,
    editable: false,
    image: {
      src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      alt: 'Sneakers',
    },
  },
};

// Limited stock
export const LimitedStock: Story = {
  args: {
    id: '5',
    name: 'Vintage Vinyl Record',
    price: 39.99,
    quantity: 1,
    stockCount: 3,
    lowStockThreshold: 5,
    showStock: true,
    image: {
      src: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=300&h=300&fit=crop',
      alt: 'Vinyl record',
    },
  },
};

// With vendor info
export const WithVendor: Story = {
  args: {
    id: '6',
    name: 'Artisan Coffee Beans',
    description: 'Single-origin Ethiopian beans',
    price: 24.99,
    quantity: 2,
    vendorName: 'Local Roasters Co.',
    showVendor: true,
    fulfillmentTime: 'Ships in 1-2 days',
    image: {
      src: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
      alt: 'Coffee beans',
    },
  },
};

// Vertical layout
export const VerticalLayout: Story = {
  args: {
    id: '7',
    name: 'Smartphone Case',
    variant: 'Color: Black, Model: iPhone 14 Pro',
    price: 29.99,
    quantity: 1,
    layout: 'vertical',
    image: {
      src: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop',
      alt: 'Phone case',
    },
  },
};

// Compact layout
export const CompactLayout: Story = {
  args: {
    id: '8',
    name: 'USB-C Cable',
    price: 12.99,
    quantity: 3,
    layout: 'compact',
    image: {
      src: 'https://images.unsplash.com/photo-1492107376256-4026437926cd?w=200&h=200&fit=crop',
      alt: 'USB cable',
    },
  },
};

// With SKU
export const WithSKU: Story = {
  args: {
    id: '9',
    name: 'Professional Camera Lens',
    sku: 'CAM-LENS-50MM-1.4',
    price: 599.99,
    quantity: 1,
    showSku: true,
    image: {
      src: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=300&h=300&fit=crop',
      alt: 'Camera lens',
    },
  },
};

// Selectable item
export const Selectable: Story = {
  args: {
    id: '10',
    name: 'Wireless Mouse',
    price: 39.99,
    quantity: 1,
    selectable: true,
    selected: true,
    image: {
      src: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      alt: 'Wireless mouse',
    },
  },
};

// With max quantity
export const WithMaxQuantity: Story = {
  args: {
    id: '11',
    name: 'Limited Release Game',
    price: 69.99,
    quantity: 2,
    maxQuantity: 3,
    stockCount: 5,
    image: {
      src: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=300&fit=crop',
      alt: 'Video game',
    },
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    id: '12',
    name: 'Updating Product',
    price: 49.99,
    quantity: 1,
    updating: true,
    image: {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      alt: 'Product',
    },
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);
    const [removed, setRemoved] = useState(false);

    const handleQuantityChange = async (newQuantity: number) => {
      setIsUpdating(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setQuantity(newQuantity);
      setIsUpdating(false);
    };

    const handleRemove = async () => {
      setIsUpdating(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setRemoved(true);
    };

    if (removed) {
      return <div className="text-center p-4">Item removed from cart</div>;
    }

    return (
      <CartItem
        id="interactive"
        name="Interactive Product"
        price={99.99}
        originalPrice={129.99}
        quantity={quantity}
        stockCount={10}
        showStock
        showSavings
        updating={isUpdating}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
        image={{
          src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
          alt: 'Sunglasses',
        }}
      />
    );
  },
};

// Shopping cart example
export const ShoppingCart: Story = {
  render: () => {
    const [items, setItems] = useState([
      {
        id: '1',
        name: 'Laptop Stand',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop',
      },
      {
        id: '2',
        name: 'Mechanical Keyboard',
        variant: 'Switch: Blue, Layout: TKL',
        price: 129.99,
        originalPrice: 159.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop',
      },
      {
        id: '3',
        name: 'Desk Lamp',
        price: 39.99,
        quantity: 2,
        stockCount: 3,
        image: 'https://images.unsplash.com/photo-1565636192850-7e0e7e31e9a8?w=300&h=300&fit=crop',
      },
    ]);

    const updateQuantity = (id: string, quantity: number) => {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    };

    const removeItem = (id: string) => {
      setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold">Shopping Cart ({items.length} items)</h2>
        
        {items.map(item => (
          <CartItem
            key={item.id}
            {...item}
            showSavings
            showStock
            onQuantityChange={(q) => updateQuantity(item.id, q)}
            onRemove={() => removeItem(item.id)}
            image={{ src: item.image, alt: item.name }}
          />
        ))}
        
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  },
};

// Bulk selection example
export const BulkSelection: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(['2']);
    
    const items = [
      {
        id: '1',
        name: 'Item 1',
        price: 29.99,
        quantity: 1,
      },
      {
        id: '2',
        name: 'Item 2',
        price: 39.99,
        quantity: 2,
      },
      {
        id: '3',
        name: 'Item 3',
        price: 19.99,
        quantity: 1,
      },
    ];

    const toggleSelection = (id: string, selected: boolean) => {
      if (selected) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds(selectedIds.filter(sid => sid !== id));
      }
    };

    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Items</h2>
          <button
            onClick={() => setSelectedIds(selectedIds.length === items.length ? [] : items.map(i => i.id))}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            {selectedIds.length === items.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        {items.map(item => (
          <CartItem
            key={item.id}
            {...item}
            selectable
            selected={selectedIds.includes(item.id)}
            onSelect={(selected) => toggleSelection(item.id, selected)}
          />
        ))}
        
        {selectedIds.length > 0 && (
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <p className="text-sm">
              {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>
    );
  },
};

// Mobile optimized
export const MobileOptimized: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <CartItem
        id="mobile1"
        name="Product with a very long name that might wrap"
        variant="Multiple options selected"
        price: 49.99,
        quantity: 1,
        layout="compact"
        image={{
          src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
          alt: 'Product',
        }}
      />
      <CartItem
        id="mobile2"
        name="Another Product"
        price: 29.99,
        originalPrice: 39.99,
        quantity: 2,
        layout="compact"
        showSavings
        image={{
          src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
          alt: 'Product',
        }}
      />
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <div className="space-y-4 max-w-xl">
        <CartItem
          id="dark1"
          name="Dark Theme Product"
          price: 89.99,
          quantity: 1,
          image={{
            src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            alt: 'Headphones',
          }}
        />
        <CartItem
          id="dark2"
          name="Another Dark Product"
          price: 149.99,
          originalPrice: 199.99,
          quantity: 1,
          showSavings
          stockCount: 5,
          showStock
          image={{
            src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
            alt: 'Watch',
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