import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ProductCard, ProductGrid } from './ProductCard';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Organisms/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
    badgeVariant: {
      control: 'select',
      options: ['primary', 'success', 'danger', 'warning', 'info'],
    },
    price: {
      control: 'number',
    },
    originalPrice: {
      control: 'number',
    },
    rating: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
    },
    reviewCount: {
      control: 'number',
    },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample product image
const productImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop';

// Basic product card
export const Default: Story = {
  args: {
    image: productImage,
    name: 'Premium Wireless Headphones',
    price: 79.99,
    rating: 4.5,
    reviewCount: 128,
  },
};

// Sale product
export const SaleProduct: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    name: 'Polarized Sunglasses UV400 Protection',
    price: 29.99,
    originalPrice: 49.99,
    isSale: true,
    rating: 4.8,
    reviewCount: 245,
  },
};

// New product
export const NewProduct: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
    name: 'Smart Watch Series 5 - Fitness Tracker',
    price: 199.99,
    isNew: true,
    rating: 4.2,
    reviewCount: 89,
  },
};

// Out of stock
export const OutOfStock: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    name: 'Studio Monitor Headphones - Professional Grade',
    price: 149.99,
    rating: 4.9,
    reviewCount: 512,
    isOutOfStock: true,
  },
};

// With custom badge
export const CustomBadge: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
    name: 'Wireless Noise Cancelling Headphones',
    price: 299.99,
    badge: 'Best Seller',
    badgeVariant: 'success',
    rating: 4.7,
    reviewCount: 1024,
  },
};

// Interactive favorite
export const InteractiveFavorite: Story = {
  render: () => {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    
    const toggleFavorite = (id: string) => {
      setFavorites(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    };

    return (
      <ProductCard
        image={productImage}
        name="Premium Wireless Headphones"
        price={79.99}
        rating={4.5}
        reviewCount={128}
        isFavorite={favorites.has('1')}
        onFavoriteClick={() => toggleFavorite('1')}
      />
    );
  },
};

// Minimal variant
export const Minimal: Story = {
  args: {
    image: productImage,
    name: 'Minimalist Design Product',
    price: 49.99,
    variant: 'minimal',
    showAddToCart: false,
    showQuickView: false,
  },
};

// Elevated variant
export const Elevated: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    name: 'Running Shoes - Ultra Comfort',
    price: 89.99,
    originalPrice: 119.99,
    variant: 'elevated',
    isSale: true,
    rating: 4.6,
    reviewCount: 342,
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-start">
      <ProductCard
        size="sm"
        image={productImage}
        name="Small Card"
        price={29.99}
        rating={4.5}
      />
      <ProductCard
        size="md"
        image={productImage}
        name="Medium Card (Default)"
        price={49.99}
        rating={4.5}
      />
      <ProductCard
        size="lg"
        image={productImage}
        name="Large Card"
        price={79.99}
        rating={4.5}
      />
    </div>
  ),
};

// Product grid layout
export const GridLayout: Story = {
  render: () => {
    const products = [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        name: 'Luxury Automatic Watch',
        price: 599.99,
        rating: 4.8,
        reviewCount: 156,
        isNew: true,
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        name: 'Designer Sunglasses',
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.5,
        reviewCount: 89,
        isSale: true,
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
        name: 'Smart Fitness Watch',
        price: 249.99,
        rating: 4.3,
        reviewCount: 210,
      },
      {
        id: '4',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        name: 'Wireless Headphones',
        price: 149.99,
        rating: 4.7,
        reviewCount: 445,
        badge: 'Top Rated',
        badgeVariant: 'success',
      },
      {
        id: '5',
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
        name: 'Premium Headset',
        price: 199.99,
        rating: 4.6,
        reviewCount: 178,
      },
      {
        id: '6',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        name: 'Running Shoes',
        price: 119.99,
        rating: 4.4,
        reviewCount: 92,
        isOutOfStock: true,
      },
    ];

    return (
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ProductGrid columns={3} gap="md">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </ProductGrid>
      </div>
    );
  },
};

// E-commerce example
export const EcommerceExample: Story = {
  render: () => {
    const [cartItems, setCartItems] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null);

    const products = [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        name: 'Perfume Collection - Luxury Edition',
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.7,
        reviewCount: 234,
        isSale: true,
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&h=400&fit=crop',
        name: 'Essential Oil Set - Aromatherapy',
        price: 49.99,
        rating: 4.5,
        reviewCount: 128,
        isNew: true,
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop',
        name: 'Luxury Perfume Bottle - Limited Edition',
        price: 159.99,
        rating: 4.9,
        reviewCount: 89,
        badge: 'Exclusive',
        badgeVariant: 'warning',
      },
      {
        id: '4',
        image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop',
        name: 'Cologne for Men - Fresh Scent',
        price: 69.99,
        rating: 4.3,
        reviewCount: 156,
      },
    ];

    const handleAddToCart = (productId: string) => {
      setCartItems([...cartItems, productId]);
      console.log('Added to cart:', productId);
    };

    const toggleFavorite = (productId: string) => {
      setFavorites(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });
    };

    return (
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Fragrance Collection</h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-neutral-600">
              Cart Items: {cartItems.length}
            </span>
            <span className="text-sm text-neutral-600">
              Favorites: {favorites.size}
            </span>
          </div>
        </div>
        
        <ProductGrid columns={4} gap="md">
          {products.map(product => (
            <ProductCard
              key={product.id}
              {...product}
              isFavorite={favorites.has(product.id)}
              onFavoriteClick={() => toggleFavorite(product.id)}
              onAddToCartClick={() => handleAddToCart(product.id)}
              onQuickViewClick={() => setQuickViewProduct(product.id)}
              href={`/products/${product.id}`}
            />
          ))}
        </ProductGrid>

        {quickViewProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Quick View</h3>
              <p className="text-neutral-600 mb-4">
                Product ID: {quickViewProduct}
              </p>
              <Button onClick={() => setQuickViewProduct(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  },
};

// With custom content
export const CustomContent: Story = {
  args: {
    image: productImage,
    name: 'Customizable Product Card',
    price: 99.99,
    rating: 4.5,
    reviewCount: 67,
    children: (
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
            Free Shipping
          </span>
          <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded">
            In Stock
          </span>
        </div>
        <p className="text-xs text-neutral-600">
          Delivery by: Tomorrow, 3PM
        </p>
      </div>
    ),
  },
};

// Loading state
export const LoadingState: Story = {
  render: () => (
    <div className="animate-pulse">
      <div className="bg-neutral-200 aspect-square rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 rounded w-1/2" />
        <div className="h-6 bg-neutral-200 rounded w-1/3" />
      </div>
    </div>
  ),
};

// Mobile responsive
export const Mobile: Story = {
  args: {
    image: productImage,
    name: 'Mobile Optimized Product',
    price: 39.99,
    rating: 4.5,
    size: 'full',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    image: productImage,
    name: 'Dark Theme Product',
    price: 79.99,
    rating: 4.5,
    reviewCount: 45,
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8">
        <div className="[&_.bg-white]:bg-neutral-800 [&_.text-neutral-900]:text-white [&_.text-neutral-600]:text-neutral-400 [&_.border-neutral-200]:border-neutral-700">
          <Story />
        </div>
      </div>
    ),
  ],
};