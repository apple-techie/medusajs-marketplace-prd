import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ProductGrid, Product } from './ProductGrid';

const meta = {
  title: 'Organisms/ProductGrid',
  component: ProductGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    viewMode: {
      control: 'select',
      options: ['grid', 'list'],
      description: 'Display mode',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between products',
    },
    imageAspectRatio: {
      control: 'select',
      options: ['1:1', '4:3', '16:9'],
      description: 'Product image aspect ratio',
    },
    showVendor: {
      control: 'boolean',
      description: 'Show vendor name',
    },
    showRating: {
      control: 'boolean',
      description: 'Show product rating',
    },
    showAddToCart: {
      control: 'boolean',
      description: 'Show add to cart button',
    },
    showWishlist: {
      control: 'boolean',
      description: 'Show wishlist button',
    },
  },
} satisfies Meta<typeof ProductGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock products
const generateProducts = (count: number, startIndex: number = 0): Product[] => {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const price = 50 + Math.floor(Math.random() * 150);
    const hasDiscount = Math.random() > 0.7;
    
    return {
      id: `product-${index}`,
      name: `Product ${index + 1}`,
      price: hasDiscount ? price * 0.8 : price,
      originalPrice: hasDiscount ? price : undefined,
      image: `https://source.unsplash.com/400x400/?product,${index}`,
      vendor: {
        id: `vendor-${Math.floor(index / 4)}`,
        name: `Vendor ${Math.floor(index / 4) + 1}`,
      },
      rating: 3.5 + Math.random() * 1.5,
      reviewCount: Math.floor(Math.random() * 200),
      inStock: Math.random() > 0.1,
      isWishlisted: Math.random() > 0.8,
      badges: hasDiscount ? [{ text: 'Sale', variant: 'destructive' as const }] : [],
    };
  });
};

const sampleProducts = generateProducts(12);

// Default grid view
export const Default: Story = {
  args: {
    products: sampleProducts,
  },
};

// List view
export const ListView: Story = {
  args: {
    products: sampleProducts,
    viewMode: 'list',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    products: [],
    loading: true,
    loadingCount: 8,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    products: [],
    emptyMessage: 'No products match your search criteria',
    emptyIcon: 'search',
    emptyAction: {
      label: 'Clear filters',
      onClick: () => console.log('Clear filters'),
    },
  },
};

// With load more
export const WithLoadMore: Story = {
  args: {
    products: sampleProducts,
    hasMore: true,
    onLoadMore: () => console.log('Load more'),
  },
};

// Loading more
export const LoadingMore: Story = {
  args: {
    products: sampleProducts,
    hasMore: true,
    loadingMore: true,
    onLoadMore: () => {},
  },
};

// Different column layouts
export const ColumnLayouts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">3 columns on desktop</h3>
        <ProductGrid
          products={sampleProducts.slice(0, 6)}
          columns={{ mobile: 2, tablet: 2, desktop: 3 }}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">5 columns on desktop</h3>
        <ProductGrid
          products={sampleProducts.slice(0, 10)}
          columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">6 columns on desktop</h3>
        <ProductGrid
          products={sampleProducts}
          columns={{ mobile: 2, tablet: 4, desktop: 6 }}
        />
      </div>
    </div>
  ),
};

// Different gaps
export const GapSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small gap</h3>
        <ProductGrid
          products={sampleProducts.slice(0, 4)}
          gap="sm"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium gap (default)</h3>
        <ProductGrid
          products={sampleProducts.slice(0, 4)}
          gap="md"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Large gap</h3>
        <ProductGrid
          products={sampleProducts.slice(0, 4)}
          gap="lg"
        />
      </div>
    </div>
  ),
};

// Different aspect ratios
export const AspectRatios: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Square (1:1)</h3>
        <ProductGrid
          products={sampleProducts.slice(0, 4)}
          imageAspectRatio="1:1"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Standard (4:3)</h3>
        <ProductGrid
          products={sampleProducts.slice(0, 4)}
          imageAspectRatio="4:3"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Wide (16:9)</h3>
        <ProductGrid
          products={sampleProducts.slice(0, 4)}
          imageAspectRatio="16:9"
        />
      </div>
    </div>
  ),
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [products, setProducts] = useState(generateProducts(12));
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    const handleLoadMore = async () => {
      setLoadingMore(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProducts([...products, ...generateProducts(12, products.length)]);
      setPage(page + 1);
      setLoadingMore(false);
    };
    
    const handleProductClick = (productId: string) => {
      console.log('Navigate to product:', productId);
    };
    
    const handleAddToCart = (productId: string) => {
      console.log('Add to cart:', productId);
      // Show success toast
    };
    
    const handleToggleWishlist = (productId: string) => {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, isWishlisted: !p.isWishlisted } : p
      ));
    };
    
    const handleRefresh = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProducts(generateProducts(12));
      setPage(1);
      setLoading(false);
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Products ({products.length})</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="px-3 py-1 text-sm border rounded hover:bg-neutral-50"
            >
              Refresh
            </button>
            <div className="flex gap-1 border rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-primary-100' : ''}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-primary-100' : ''}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
        
        <ProductGrid
          products={products}
          viewMode={viewMode}
          loading={loading}
          hasMore={page < 5}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
      </div>
    );
  },
};

// E-commerce page example
export const EcommercePage: Story = {
  render: () => {
    const [filters, setFilters] = useState({
      category: 'all',
      priceRange: 'all',
      inStock: false,
    });
    
    let filteredProducts = [...sampleProducts];
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.inStock);
    }
    
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="w-64 flex-shrink-0">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                >
                  <option value="all">All Prices</option>
                  <option value="0-50">Under $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100+">Over $100</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>
          
          {/* Product grid */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing {filteredProducts.length} products
              </p>
              <select className="px-3 py-1 border rounded text-sm">
                <option>Sort by: Featured</option>
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Price (High to Low)</option>
                <option>Sort by: Newest</option>
              </select>
            </div>
            
            <ProductGrid
              products={filteredProducts}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              hasMore
              onLoadMore={() => console.log('Load more')}
              onProductClick={(id) => console.log('View product:', id)}
              onAddToCart={(id) => console.log('Add to cart:', id)}
              onToggleWishlist={(id) => console.log('Toggle wishlist:', id)}
            />
          </main>
        </div>
      </div>
    );
  },
};

// Minimal card display
export const MinimalCards: Story = {
  args: {
    products: sampleProducts,
    showVendor: false,
    showRating: false,
    showAddToCart: false,
    showWishlist: false,
  },
};

// No products
export const NoProducts: Story = {
  args: {
    products: [],
  },
};

// Single row
export const SingleRow: Story = {
  args: {
    products: sampleProducts.slice(0, 4),
    columns: { mobile: 2, tablet: 4, desktop: 4 },
  },
};

// Mobile optimized
export const MobileOptimized: Story = {
  args: {
    products: sampleProducts.slice(0, 6),
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: 'sm',
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
    products: sampleProducts.slice(0, 8),
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 min-h-screen">
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};