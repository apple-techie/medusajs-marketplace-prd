import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { HeroSection, SimpleHero, SearchHero, MarketplaceHero } from './HeroSection';

const meta = {
  title: 'Organisms/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Hero title text',
    },
    subtitle: {
      control: 'text',
      description: 'Hero subtitle text',
    },
    description: {
      control: 'text',
      description: 'Hero description text',
    },
    variant: {
      control: 'select',
      options: ['default', 'centered', 'split', 'minimal', 'fullscreen'],
      description: 'Hero section variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Hero section size',
    },
    layout: {
      control: 'select',
      options: ['content-left', 'content-right', 'content-center'],
      description: 'Content layout',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'auto'],
      description: 'Color theme',
    },
    showSearch: {
      control: 'boolean',
      description: 'Show search bar',
    },
    overlay: {
      control: 'boolean',
      description: 'Show overlay on background',
    },
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Overlay opacity',
    },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic hero section
export const Default: Story = {
  args: {
    title: 'Welcome to Our Marketplace',
    subtitle: 'Discover Amazing Products',
    description: 'Browse thousands of products from trusted vendors with fast delivery and secure payments.',
    primaryAction: {
      label: 'Start Shopping',
      href: '/shop',
    },
    secondaryAction: {
      label: 'Learn More',
      href: '/about',
    },
  },
};

// With background image
export const WithBackgroundImage: Story = {
  args: {
    title: 'Summer Collection 2024',
    subtitle: 'Up to 50% Off',
    description: 'Discover the latest trends and styles for this summer season.',
    backgroundImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600',
    overlay: true,
    overlayOpacity: 0.4,
    theme: 'dark',
    primaryAction: {
      label: 'Shop Now',
      href: '/summer-sale',
    },
  },
};

// With search functionality
export const WithSearch: Story = {
  args: {
    title: 'Find What You\'re Looking For',
    subtitle: 'Over 100,000 Products Available',
    showSearch: true,
    searchPlaceholder: 'Search for products, brands, categories...',
    searchCategories: [
      { label: 'All Categories', value: 'all' },
      { label: 'Electronics', value: 'electronics' },
      { label: 'Fashion', value: 'fashion' },
      { label: 'Home & Garden', value: 'home' },
      { label: 'Sports', value: 'sports' },
    ],
    backgroundGradient: true,
    theme: 'dark',
  },
};

// With features
export const WithFeatures: Story = {
  args: {
    title: 'Why Choose Our Marketplace?',
    description: 'Experience the best online shopping with these amazing features.',
    features: [
      { icon: 'truck', text: 'Free Shipping on Orders $50+' },
      { icon: 'shield', text: 'Secure & Safe Payments' },
      { icon: 'refresh-cw', text: '30-Day Easy Returns' },
      { icon: 'headphones', text: '24/7 Customer Support' },
    ],
    variant: 'centered',
    primaryAction: {
      label: 'Get Started',
      href: '/register',
      variant: 'primary',
    },
  },
};

// With badges
export const WithBadges: Story = {
  args: {
    title: 'Black Friday Mega Sale',
    subtitle: 'Limited Time Only',
    badges: [
      { text: '🔥 Hot Deal', variant: 'danger' },
      { text: 'Up to 70% Off', variant: 'success' },
      { text: 'Free Shipping', variant: 'primary' },
    ],
    primaryAction: {
      label: 'Shop Black Friday Deals',
      href: '/black-friday',
    },
    backgroundImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600',
    overlay: true,
    theme: 'dark',
  },
};

// With statistics
export const WithStats: Story = {
  args: {
    title: 'Join Thousands of Happy Customers',
    subtitle: 'The Marketplace You Can Trust',
    stats: [
      { value: '50K+', label: 'Products' },
      { value: '10K+', label: 'Vendors' },
      { value: '500K+', label: 'Happy Customers' },
      { value: '4.8', label: 'Average Rating' },
    ],
    primaryAction: {
      label: 'Join Now',
      href: '/register',
    },
    variant: 'default',
  },
};

// With trusted by section
export const WithTrustedBy: Story = {
  args: {
    title: 'Trusted by Leading Brands',
    description: 'Join the marketplace where top brands showcase their products.',
    trustedBy: [
      { name: 'Nike', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=Nike' },
      { name: 'Apple', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=Apple' },
      { name: 'Samsung', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=Samsung' },
      { name: 'Sony', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=Sony' },
      { name: 'Adidas', logo: 'https://via.placeholder.com/120x40/000000/FFFFFF?text=Adidas' },
    ],
    primaryAction: {
      label: 'Become a Vendor',
      href: '/vendor-signup',
    },
  },
};

// Different variants showcase
export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <h3 className="text-lg font-semibold mb-4 px-4">Default Variant</h3>
        <HeroSection
          title="Default Hero Section"
          subtitle="Standard layout with all features"
          description="This is the default hero section with centered content."
          primaryAction={{ label: 'Get Started', href: '#' }}
          variant="default"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 px-4">Minimal Variant</h3>
        <HeroSection
          title="Minimal Hero Section"
          subtitle="Clean and simple"
          primaryAction={{ label: 'Learn More', href: '#' }}
          variant="minimal"
          size="sm"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 px-4">Centered Variant</h3>
        <HeroSection
          title="Perfectly Centered"
          description="Everything aligned to the center for maximum impact."
          primaryAction={{ label: 'Explore', href: '#' }}
          variant="centered"
          backgroundGradient
          theme="dark"
        />
      </div>
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-16">
      <HeroSection
        title="Small Hero Section"
        subtitle="Compact size for subtle impact"
        size="sm"
        primaryAction={{ label: 'Small Button', href: '#' }}
      />
      
      <HeroSection
        title="Medium Hero Section"
        subtitle="Default size for most use cases"
        size="md"
        primaryAction={{ label: 'Medium Button', href: '#' }}
      />
      
      <HeroSection
        title="Large Hero Section"
        subtitle="Prominent size for important messages"
        size="lg"
        primaryAction={{ label: 'Large Button', href: '#' }}
      />
      
      <HeroSection
        title="Extra Large Hero"
        subtitle="Maximum impact for landing pages"
        size="xl"
        primaryAction={{ label: 'Extra Large Button', href: '#' }}
      />
    </div>
  ),
};

// Split layout
export const SplitLayout: Story = {
  args: {
    title: 'Premium Shopping Experience',
    subtitle: 'Curated for You',
    description: 'Discover hand-picked products from the best brands and vendors.',
    variant: 'split',
    layout: 'content-left',
    backgroundImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    primaryAction: {
      label: 'Start Shopping',
      href: '/shop',
    },
    secondaryAction: {
      label: 'Watch Video',
      onClick: () => console.log('Play video'),
      variant: 'ghost',
    },
  },
};

// Fullscreen variant
export const Fullscreen: Story = {
  args: {
    title: 'Welcome to the Future of Shopping',
    subtitle: 'Everything You Need, All in One Place',
    description: 'Join millions of customers enjoying the best online shopping experience.',
    variant: 'fullscreen',
    backgroundImage: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1600',
    overlay: true,
    overlayOpacity: 0.5,
    theme: 'dark',
    primaryAction: {
      label: 'Get Started',
      href: '/register',
      variant: 'primary',
    },
    features: [
      { icon: 'check', text: 'Verified Vendors' },
      { icon: 'check', text: 'Secure Payments' },
      { icon: 'check', text: 'Fast Delivery' },
    ],
  },
};

// Simple hero variant
export const SimpleHeroExample: Story = {
  render: () => (
    <SimpleHero
      title="Simple and Clean"
      subtitle="Sometimes less is more"
      primaryAction={{ label: 'Get Started', href: '#' }}
      secondaryAction={{ label: 'Learn More', href: '#' }}
    />
  ),
};

// Search hero variant
export const SearchHeroExample: Story = {
  render: () => (
    <SearchHero
      title="Search Our Entire Catalog"
      subtitle="Over 100,000 Products"
      searchPlaceholder="What are you looking for?"
      searchCategories={[
        { label: 'All', value: 'all' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Fashion', value: 'fashion' },
        { label: 'Home', value: 'home' },
      ]}
      onSearch={(query, category) => console.log('Search:', query, category)}
      backgroundImage="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600"
    />
  ),
};

// Marketplace hero variant
export const MarketplaceHeroExample: Story = {
  render: () => (
    <MarketplaceHero
      title="Your Trusted Online Marketplace"
      subtitle="Where Quality Meets Convenience"
      description="Shop from thousands of verified vendors with confidence."
      stats={[
        { value: '100K+', label: 'Products' },
        { value: '10K+', label: 'Vendors' },
        { value: '1M+', label: 'Customers' },
        { value: '4.9', label: 'Rating' },
      ]}
      primaryAction={{ label: 'Start Shopping', href: '/shop' }}
      trustedBy={[
        { name: 'Brand 1', logo: 'https://via.placeholder.com/100x30' },
        { name: 'Brand 2', logo: 'https://via.placeholder.com/100x30' },
        { name: 'Brand 3', logo: 'https://via.placeholder.com/100x30' },
        { name: 'Brand 4', logo: 'https://via.placeholder.com/100x30' },
      ]}
    />
  ),
};

// Real-world example
export const RealWorldExample: Story = {
  render: () => (
    <HeroSection
      title={
        <>
          The <span className="text-primary-600">Marketplace</span> Where
          <br />
          Quality Meets Convenience
        </>
      }
      subtitle="Discover. Shop. Enjoy."
      description="Join millions shopping from verified vendors with guaranteed quality, fast delivery, and secure payments."
      variant="default"
      size="xl"
      backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600"
      overlay
      overlayOpacity={0.3}
      theme="dark"
      showSearch
      searchPlaceholder="Search over 100,000 products..."
      searchCategories={[
        { label: 'All Categories', value: '' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Fashion & Apparel', value: 'fashion' },
        { label: 'Home & Living', value: 'home' },
        { label: 'Sports & Outdoors', value: 'sports' },
        { label: 'Beauty & Health', value: 'beauty' },
      ]}
      badges={[
        { text: '🎉 New User Offer', variant: 'success' },
        { text: '15% Off First Order', variant: 'warning' },
      ]}
      features={[
        { icon: 'shield-check', text: 'Verified Vendors' },
        { icon: 'truck', text: 'Fast Delivery' },
        { icon: 'credit-card', text: 'Secure Payments' },
        { icon: 'refresh-cw', text: 'Easy Returns' },
      ]}
      primaryAction={{
        label: 'Start Shopping',
        href: '/shop',
        variant: 'primary',
      }}
      secondaryAction={{
        label: 'Become a Vendor',
        href: '/vendor-signup',
        variant: 'secondary',
      }}
    />
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900">
      <HeroSection
        title="Shop in Dark Mode"
        subtitle="Easy on the eyes, great on style"
        description="Experience our marketplace with a beautiful dark theme."
        theme="dark"
        primaryAction={{ label: 'Shop Now', href: '#' }}
        features={[
          { icon: 'moon', text: 'Dark Mode' },
          { icon: 'eye', text: 'Eye Comfort' },
          { icon: 'battery', text: 'Battery Saving' },
        ]}
      />
    </div>
  ),
};