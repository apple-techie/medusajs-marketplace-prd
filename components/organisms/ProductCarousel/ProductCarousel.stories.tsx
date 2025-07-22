import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ProductCarousel, RecommendedProducts, RelatedProducts } from './ProductCarousel';

const meta = {
  title: 'Organisms/ProductCarousel',
  component: ProductCarousel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'featured', 'minimal'],
      description: 'Carousel variant',
    },
    itemsPerView: {
      control: 'object',
      description: 'Items visible per screen size',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between items',
    },
    showNavigation: {
      control: 'boolean',
      description: 'Show navigation arrows',
    },
    navigationPosition: {
      control: 'select',
      options: ['sides', 'bottom', 'top-right'],
      description: 'Navigation position',
    },
    showDots: {
      control: 'boolean',
      description: 'Show dot indicators',
    },
    autoplay: {
      control: 'boolean',
      description: 'Enable autoplay',
    },
    loop: {
      control: 'boolean',
      description: 'Enable infinite loop',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
  },
} satisfies Meta<typeof ProductCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample products data
const sampleProducts = [
  {
    id: 1,
    title: 'Wireless Bluetooth Headphones',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    href: '/products/1',
    vendor: { name: 'TechStore', verified: true },
    rating: 4.5,
    reviewCount: 234,
    badge: 'Sale',
    badgeVariant: 'danger' as const,
    discount: 20,
  },
  {
    id: 2,
    title: 'Smart Watch Series 5',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    href: '/products/2',
    vendor: { name: 'GadgetHub' },
    rating: 4.8,
    reviewCount: 567,
    isNew: true,
  },
  {
    id: 3,
    title: 'Premium Leather Wallet',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    href: '/products/3',
    vendor: { name: 'LeatherCraft', verified: true },
    rating: 4.6,
    reviewCount: 123,
  },
  {
    id: 4,
    title: 'Portable Power Bank 20000mAh',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    href: '/products/4',
    vendor: { name: 'PowerTech' },
    rating: 4.3,
    reviewCount: 89,
    isFeatured: true,
  },
  {
    id: 5,
    title: 'Mechanical Gaming Keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    href: '/products/5',
    vendor: { name: 'GameZone', verified: true },
    rating: 4.7,
    reviewCount: 456,
  },
  {
    id: 6,
    title: 'Wireless Mouse',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    href: '/products/6',
    vendor: { name: 'TechStore' },
    rating: 4.2,
    reviewCount: 178,
    discount: 25,
  },
  {
    id: 7,
    title: '4K Webcam',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    href: '/products/7',
    vendor: { name: 'CameraPro' },
    rating: 4.4,
    reviewCount: 92,
    isNew: true,
  },
  {
    id: 8,
    title: 'USB-C Hub 7-in-1',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
    href: '/products/8',
    vendor: { name: 'ConnectHub' },
    rating: 4.5,
    reviewCount: 234,
  },
];

// Basic carousel
export const Default: Story = {
  args: {
    products: sampleProducts,
  },
};

// With header
export const WithHeader: Story = {
  args: {
    products: sampleProducts,
    title: 'Featured Products',
    subtitle: 'Hand-picked items just for you',
    showViewAll: true,
    viewAllHref: '/products',
  },
};

// Different navigation positions
export const NavigationPositions: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-lg font-semibold mb-4">Navigation on Sides (Default)</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 5)}
          itemsPerView={3}
          navigationPosition="sides"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Navigation at Bottom</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 5)}
          itemsPerView={3}
          navigationPosition="bottom"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Navigation Top Right</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 5)}
          title="Best Sellers"
          itemsPerView={3}
          navigationPosition="top-right"
        />
      </div>
    </div>
  ),
};

// With dots navigation
export const WithDots: Story = {
  args: {
    products: sampleProducts,
    title: 'Popular Products',
    itemsPerView: 3,
    showDots: true,
    navigationPosition: 'bottom',
  },
};

// Autoplay carousel
export const WithAutoplay: Story = {
  args: {
    products: sampleProducts,
    title: 'Featured Deals',
    itemsPerView: 4,
    autoplay: true,
    autoplayInterval: 3000,
    loop: true,
    showDots: true,
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 4)}
          variant="default"
          itemsPerView={4}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Compact Variant</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 5)}
          variant="compact"
          itemsPerView={5}
          gap="sm"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Minimal Variant</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 6)}
          variant="minimal"
          itemsPerView={6}
        />
      </div>
    </div>
  ),
};

// Responsive items per view
export const Responsive: Story = {
  args: {
    products: sampleProducts,
    title: 'Responsive Carousel',
    subtitle: 'Adjusts items based on screen size',
    itemsPerView: {
      mobile: 1,
      tablet: 2,
      desktop: 4,
    },
    showNavigation: true,
    showDots: true,
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    products: [],
    title: 'Loading Products',
    loading: true,
    skeletonCount: 4,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    products: [],
    title: 'No Products Found',
  },
};

// With loop enabled
export const InfiniteLoop: Story = {
  args: {
    products: sampleProducts.slice(0, 3),
    title: 'Infinite Loop Example',
    itemsPerView: 2,
    loop: true,
    showNavigation: true,
  },
};

// Different gap sizes
export const GapSizes: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small Gap</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 4)}
          itemsPerView={4}
          gap="sm"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium Gap (Default)</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 4)}
          itemsPerView={4}
          gap="md"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Large Gap</h3>
        <ProductCarousel
          products={sampleProducts.slice(0, 4)}
          itemsPerView={4}
          gap="lg"
        />
      </div>
    </div>
  ),
};

// Recommended products variant
export const RecommendedProductsExample: Story = {
  render: () => (
    <RecommendedProducts
      products={sampleProducts}
      loading={false}
      onProductClick={(product) => console.log('Clicked:', product.title)}
    />
  ),
};

// Related products variant
export const RelatedProductsExample: Story = {
  render: () => (
    <RelatedProducts
      products={sampleProducts.slice(0, 6)}
      title="You might also like"
      onProductClick={(product) => console.log('Clicked:', product.title)}
    />
  ),
};

// Real-world example
export const MarketplaceCarousel: Story = {
  render: () => {
    const flashSaleProducts = sampleProducts.map(p => ({
      ...p,
      badge: `${20 + Math.floor(Math.random() * 30)}% OFF`,
      badgeVariant: 'danger' as const,
      originalPrice: Number(p.price) * 1.5,
    }));

    return (
      <div className="space-y-16">
        <ProductCarousel
          products={flashSaleProducts}
          title="⚡ Flash Sale"
          subtitle="Limited time offers - Ends in 24 hours"
          showViewAll
          viewAllHref="/flash-sale"
          itemsPerView={{ mobile: 1, tablet: 3, desktop: 5 }}
          autoplay
          autoplayInterval={4000}
          loop
          showDots
        />
        
        <ProductCarousel
          products={sampleProducts.filter(p => p.isNew)}
          title="New Arrivals"
          subtitle="Fresh products added this week"
          variant="default"
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
          navigationPosition="top-right"
        />
        
        <ProductCarousel
          products={sampleProducts.filter(p => p.rating && p.rating >= 4.5)}
          title="Top Rated"
          subtitle="Highest rated by our customers"
          variant="default"
          itemsPerView={{ mobile: 1, tablet: 3, desktop: 4 }}
          showViewAll
          viewAllHref="/top-rated"
        />
      </div>
    );
  },
};

// Interactive example
export const InteractiveCarousel: Story = {
  render: () => {
    const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

    const handleProductClick = (product: any) => {
      setSelectedProduct(product);
      alert(`Selected: ${product.title}\nPrice: $${product.price}`);
    };

    const handleViewAll = () => {
      console.log('View all clicked');
    };

    return (
      <div>
        <ProductCarousel
          products={sampleProducts}
          title="Click on Products"
          subtitle="Try clicking on products or navigation"
          showViewAll
          onViewAll={handleViewAll}
          itemsPerView={3}
          showNavigation
          showDots
          onProductClick={handleProductClick}
          onSlideChange={(index) => console.log('Slide changed to:', index)}
        />
        
        {selectedProduct && (
          <div className="mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <p className="text-sm">Last selected: <strong>{selectedProduct.title}</strong></p>
          </div>
        )}
      </div>
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <ProductCarousel
        products={sampleProducts}
        title="Dark Mode Products"
        subtitle="Beautiful in dark theme"
        itemsPerView={4}
        showNavigation
        navigationPosition="top-right"
      />
    </div>
  ),
};