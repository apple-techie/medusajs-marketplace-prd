import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CategoryCard, CategoryCardGrid } from './CategoryCard';

const meta = {
  title: 'Molecules/CategoryCard',
  component: CategoryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Category title',
    },
    description: {
      control: 'text',
      description: 'Category description',
    },
    href: {
      control: 'text',
      description: 'Category link URL',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'featured', 'minimal'],
      description: 'Card variant',
    },
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Card size',
    },
    hoverEffect: {
      control: 'select',
      options: ['none', 'lift', 'zoom', 'darken'],
      description: 'Hover animation',
    },
    overlay: {
      control: 'boolean',
      description: 'Show overlay on image',
    },
  },
} satisfies Meta<typeof CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic category card
export const Default: Story = {
  args: {
    title: 'Electronics',
    description: 'Phones, tablets, computers and more',
    href: '/categories/electronics',
    productCount: 1234,
  },
};

// With image
export const WithImage: Story = {
  args: {
    title: 'Fashion',
    description: 'Latest trends and styles',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    href: '/categories/fashion',
    productCount: 567,
  },
};

// With icon
export const WithIcon: Story = {
  args: {
    title: 'Electronics',
    description: 'Latest gadgets and devices',
    icon: 'desktop',
    href: '/categories/electronics',
    productCount: 890,
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Default</p>
        <CategoryCard
          title="Electronics"
          description="Phones, tablets, computers"
          icon="desktop"
          href="/categories/electronics"
          productCount={123}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Minimal</p>
        <CategoryCard
          title="Fashion"
          image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
          href="/categories/fashion"
          productCount={456}
          variant="minimal"
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Compact</p>
        <CategoryCard
          title="Home & Garden"
          icon="home"
          href="/categories/home"
          productCount={789}
          variant="compact"
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Featured</p>
        <CategoryCard
          title="Sports & Outdoors"
          description="Everything for an active lifestyle"
          icon="activity"
          href="/categories/sports"
          productCount={234}
          subcategories={['Running', 'Cycling', 'Swimming', 'Hiking', 'Yoga']}
          variant="featured"
        />
      </div>
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Small</p>
        <CategoryCard
          title="Small Card"
          description="Compact size for dense layouts"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/small"
          size="sm"
          productCount={123}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Medium (default)</p>
        <CategoryCard
          title="Medium Card"
          description="Standard size for most layouts"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/medium"
          size="md"
          productCount={456}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Large</p>
        <CategoryCard
          title="Large Card"
          description="Prominent size for featured categories"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/large"
          size="lg"
          productCount={789}
        />
      </div>
    </div>
  ),
};

// Horizontal layout
export const HorizontalLayout: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <CategoryCard
        title="Electronics"
        description="Latest technology and gadgets"
        image="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400"
        href="/categories/electronics"
        layout="horizontal"
        productCount={1234}
      />
      
      <CategoryCard
        title="Fashion"
        description="Clothing, shoes, and accessories"
        image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
        href="/categories/fashion"
        layout="horizontal"
        productCount={567}
        badge="Sale"
        badgeVariant="danger"
      />
      
      <CategoryCard
        title="Home & Garden"
        description="Everything for your home"
        image="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"
        href="/categories/home"
        layout="horizontal"
        productCount={890}
      />
    </div>
  ),
};

// With overlay
export const OverlayVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Overlay with gradient</p>
        <CategoryCard
          title="Outdoor Adventures"
          description="Gear for every adventure"
          image="https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=400"
          href="/categories/outdoor"
          overlay
          overlayGradient
          productCount={345}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Overlay without gradient</p>
        <CategoryCard
          title="Tech Essentials"
          description="Must-have gadgets"
          image="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400"
          href="/categories/tech"
          overlay
          overlayGradient={false}
          productCount={678}
        />
      </div>
    </div>
  ),
};

// With badges
export const WithBadges: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CategoryCard
        title="New Arrivals"
        image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
        href="/categories/new"
        badge="New"
        badgeVariant="success"
        productCount={123}
      />
      
      <CategoryCard
        title="Sale Items"
        image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
        href="/categories/sale"
        badge="Up to 50% off"
        badgeVariant="danger"
        productCount={456}
      />
      
      <CategoryCard
        title="Limited Edition"
        image="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400"
        href="/categories/limited"
        badge="Exclusive"
        badgeVariant="primary"
        productCount={78}
      />
    </div>
  ),
};

// Hover effects
export const HoverEffects: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Lift effect</p>
        <CategoryCard
          title="Lift on Hover"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/lift"
          hoverEffect="lift"
          productCount={123}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Zoom effect</p>
        <CategoryCard
          title="Zoom on Hover"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/zoom"
          hoverEffect="zoom"
          productCount={456}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Darken effect</p>
        <CategoryCard
          title="Darken on Hover"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/darken"
          hoverEffect="darken"
          productCount={789}
        />
      </div>
    </div>
  ),
};

// Aspect ratios
export const AspectRatios: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Square (1:1)</p>
        <CategoryCard
          title="Square Image"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/square"
          imageAspectRatio="square"
          productCount={123}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">4:3</p>
        <CategoryCard
          title="4:3 Ratio"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/4-3"
          imageAspectRatio="4:3"
          productCount={456}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">16:9</p>
        <CategoryCard
          title="Widescreen"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/16-9"
          imageAspectRatio="16:9"
          productCount={789}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">3:2</p>
        <CategoryCard
          title="3:2 Ratio"
          image="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400"
          href="/categories/3-2"
          imageAspectRatio="3:2"
          productCount={234}
        />
      </div>
    </div>
  ),
};

// Category grid
export const CategoryGrid: Story = {
  render: () => {
    const categories = [
      { id: 1, title: 'Electronics', icon: 'desktop', productCount: 1234 },
      { id: 2, title: 'Fashion', icon: 'shopping-bag', productCount: 567 },
      { id: 3, title: 'Home & Garden', icon: 'home', productCount: 890 },
      { id: 4, title: 'Sports', icon: 'activity', productCount: 345 },
      { id: 5, title: 'Books', icon: 'book', productCount: 678 },
      { id: 6, title: 'Toys', icon: 'gift', productCount: 234 },
      { id: 7, title: 'Beauty', icon: 'sparkles', productCount: 456 },
      { id: 8, title: 'Automotive', icon: 'truck', productCount: 123 },
    ].map(cat => ({ ...cat, href: `/categories/${cat.title.toLowerCase()}` }));

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">4 Column Grid</h3>
          <CategoryCardGrid categories={categories} columns={4} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">3 Column Grid - Large Gap</h3>
          <CategoryCardGrid categories={categories.slice(0, 6)} columns={3} gap="lg" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">2 Column Grid - Small Size</h3>
          <CategoryCardGrid categories={categories.slice(0, 4)} columns={2} size="sm" />
        </div>
      </div>
    );
  },
};

// Real-world example
export const MarketplaceCategories: Story = {
  render: () => {
    const mainCategories = [
      {
        id: 1,
        title: 'Electronics & Tech',
        description: 'Latest gadgets and devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        productCount: 2456,
        badge: 'Hot',
        badgeVariant: 'danger' as const,
      },
      {
        id: 2,
        title: 'Fashion & Apparel',
        description: 'Trending styles for everyone',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
        productCount: 3789,
      },
      {
        id: 3,
        title: 'Home & Living',
        description: 'Transform your space',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        productCount: 1567,
        badge: 'Sale',
        badgeVariant: 'danger' as const,
      },
      {
        id: 4,
        title: 'Sports & Outdoors',
        description: 'Gear for active lifestyles',
        image: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=400',
        productCount: 892,
      },
    ].map(cat => ({ ...cat, href: `/categories/${cat.id}` }));

    const featuredCategories = [
      {
        id: 5,
        title: 'New Arrivals',
        description: 'Fresh products added daily',
        icon: 'sparkles',
        productCount: 456,
        subcategories: ['Electronics', 'Fashion', 'Home Decor', 'Beauty', 'Sports'],
        variant: 'featured' as const,
      },
      {
        id: 6,
        title: 'Best Sellers',
        description: 'Top rated by customers',
        icon: 'trending-up',
        productCount: 789,
        subcategories: ['Phones', 'Laptops', 'Headphones', 'Smart Home'],
        variant: 'featured' as const,
      },
    ].map(cat => ({ ...cat, href: `/categories/${cat.id}` }));

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
          <CategoryCardGrid categories={mainCategories} columns={4} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} {...category} size="lg" />
            ))}
          </div>
        </div>
      </div>
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategoryCard
          title="Electronics"
          description="Latest tech products"
          icon="desktop"
          href="/categories/electronics"
          productCount={1234}
        />
        
        <CategoryCard
          title="Fashion"
          description="Trending styles"
          image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
          href="/categories/fashion"
          productCount={567}
          overlay
        />
        
        <CategoryCard
          title="Featured"
          description="Hand-picked items"
          icon="star"
          href="/categories/featured"
          productCount={890}
          variant="featured"
          subcategories={['Electronics', 'Fashion', 'Home']}
        />
      </div>
    </div>
  ),
};