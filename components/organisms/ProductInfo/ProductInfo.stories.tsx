import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ProductInfo } from './ProductInfo';

const meta = {
  title: 'Organisms/ProductInfo',
  component: ProductInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Layout style',
    },
    currency: {
      control: 'text',
      description: 'Currency code',
    },
    showSku: {
      control: 'boolean',
      description: 'Show SKU',
    },
    showVendor: {
      control: 'boolean',
      description: 'Show vendor info',
    },
    showShipping: {
      control: 'boolean',
      description: 'Show shipping info',
    },
  },
} satisfies Meta<typeof ProductInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic product info
export const Default: Story = {
  args: {
    name: 'Premium Wireless Headphones',
    brand: 'AudioTech',
    price: 199.99,
    inStock: true,
  },
};

// With all details
export const Complete: Story = {
  args: {
    name: 'Premium Wireless Headphones',
    brand: 'AudioTech',
    sku: 'AT-WH-001',
    price: 199.99,
    originalPrice: 299.99,
    shortDescription: 'Experience premium sound quality with our latest wireless headphones featuring active noise cancellation and 30-hour battery life.',
    rating: 4.5,
    reviewCount: 128,
    vendorName: 'TechStore Pro',
    vendorRating: 4.8,
    inStock: true,
    stockCount: 15,
    shippingInfo: {
      freeShipping: true,
      estimatedDays: '2-3 business days',
    },
    badges: [
      { text: 'Best Seller', variant: 'success' },
      { text: '25% OFF', variant: 'destructive' },
    ],
    highlights: [
      'Active noise cancellation',
      '30-hour battery life',
      'Premium sound quality',
      'Comfortable over-ear design',
    ],
  },
};

// Compact layout
export const Compact: Story = {
  args: {
    name: 'Wireless Mouse',
    brand: 'TechGear',
    price: 29.99,
    layout: 'compact',
    inStock: true,
    rating: 4.2,
    reviewCount: 45,
  },
};

// Detailed layout with features
export const Detailed: Story = {
  args: {
    name: 'Gaming Laptop Pro X1',
    brand: 'GameTech',
    sku: 'GT-LP-X1',
    price: 1599.99,
    originalPrice: 1999.99,
    layout: 'detailed',
    shortDescription: 'High-performance gaming laptop with RTX graphics and 144Hz display.',
    longDescription: `
      <p>The Gaming Laptop Pro X1 delivers exceptional performance for gamers and creators alike. Built with the latest technology and premium components, this laptop is designed to handle the most demanding tasks.</p>
      <h4>Performance</h4>
      <p>Powered by the latest Intel Core i9 processor and NVIDIA RTX 4080 graphics, experience smooth gameplay at high settings and fast rendering times for creative work.</p>
      <h4>Display</h4>
      <p>The 17.3" 144Hz display with 100% sRGB coverage ensures vibrant colors and smooth motion, perfect for competitive gaming and content creation.</p>
    `,
    features: [
      { icon: 'cpu', label: 'Processor', value: 'Intel Core i9-13900H' },
      { icon: 'monitor', label: 'Display', value: '17.3" 144Hz QHD' },
      { icon: 'hard-drive', label: 'Storage', value: '1TB NVMe SSD' },
      { icon: 'zap', label: 'Graphics', value: 'NVIDIA RTX 4080' },
      { icon: 'database', label: 'Memory', value: '32GB DDR5' },
      { icon: 'battery', label: 'Battery', value: '90Wh, up to 8 hours' },
    ],
    highlights: [
      'RTX 4080 graphics for ultra settings gaming',
      '144Hz display for smooth gameplay',
      'Advanced cooling system',
      'RGB backlit keyboard',
      'Thunderbolt 4 support',
    ],
    rating: 4.8,
    reviewCount: 234,
    vendorName: 'Gaming Central',
    vendorRating: 4.9,
    inStock: true,
    stockCount: 8,
    shippingInfo: {
      freeShipping: true,
      estimatedDays: 'Next day delivery',
    },
    badges: [
      { text: 'New', variant: 'default' },
      { text: 'Save $400', variant: 'destructive' },
    ],
  },
};

// Out of stock
export const OutOfStock: Story = {
  args: {
    name: 'Limited Edition Smartwatch',
    brand: 'WearTech',
    price: 399.99,
    inStock: false,
    shortDescription: 'Advanced health tracking and fitness features in a sleek design.',
    rating: 4.7,
    reviewCount: 89,
  },
};

// Low stock warning
export const LowStock: Story = {
  args: {
    name: 'Mechanical Keyboard',
    brand: 'KeyMaster',
    price: 149.99,
    inStock: true,
    stockCount: 3,
    lowStockThreshold: 5,
    shortDescription: 'Premium mechanical keyboard with hot-swappable switches.',
    badges: [
      { text: 'Limited Stock', variant: 'destructive' },
    ],
  },
};

// With age restriction
export const AgeRestricted: Story = {
  args: {
    name: 'Premium Wine Collection',
    brand: 'Vintage Cellars',
    price: 89.99,
    ageRestriction: 21,
    shortDescription: 'Curated selection of premium wines from renowned vineyards.',
    rating: 4.6,
    reviewCount: 42,
    inStock: true,
    shippingInfo: {
      cost: 12.99,
      estimatedDays: '3-5 business days',
    },
  },
};

// With vendor info
export const WithVendor: Story = {
  args: {
    name: 'Organic Coffee Beans',
    brand: 'GreenBean Co.',
    price: 24.99,
    shortDescription: 'Single-origin, fair-trade organic coffee beans.',
    vendorName: 'The Coffee Shop',
    vendorId: 'vendor-123',
    vendorRating: 4.9,
    showVendor: true,
    inStock: true,
    badges: [
      { text: 'Organic', variant: 'success' },
      { text: 'Fair Trade', variant: 'default' },
    ],
  },
};

// Sale pricing
export const OnSale: Story = {
  args: {
    name: 'Bluetooth Speaker',
    brand: 'SoundWave',
    price: 49.99,
    originalPrice: 79.99,
    shortDescription: 'Portable waterproof speaker with 360° sound.',
    rating: 4.3,
    reviewCount: 156,
    inStock: true,
    stockCount: 50,
    badges: [
      { text: '38% OFF', variant: 'destructive' },
      { text: 'Flash Sale', variant: 'destructive' },
    ],
    highlights: [
      'IPX7 waterproof rating',
      '20-hour battery life',
      '360° immersive sound',
      'Built-in power bank',
    ],
  },
};

// Custom availability
export const CustomAvailability: Story = {
  args: {
    name: 'Custom Engraved Watch',
    brand: 'TimeCraft',
    price: 299.99,
    availability: 'Made to order - Ships in 7-10 business days',
    shortDescription: 'Personalized luxury watch with custom engraving.',
    inStock: true,
    showShipping: false,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
      <div className="w-full max-w-2xl">
        <ProductInfo
          name="Smart Home Hub"
          brand="HomeTech"
          sku="HT-HUB-001"
          price={149.99}
          originalPrice={199.99}
          currency="USD"
          shortDescription="Control all your smart home devices from one central hub with voice control and automation features."
          rating={4.6}
          reviewCount={312}
          vendorName="Smart Living Store"
          vendorRating={4.7}
          inStock={true}
          stockCount={25}
          shippingInfo={{
            freeShipping: true,
            estimatedDays: '2-day shipping',
          }}
          badges={[
            { text: '25% OFF', variant: 'destructive' },
            { text: 'Top Rated', variant: 'success' },
          ]}
          highlights={[
            'Works with Alexa, Google, and Siri',
            'Controls up to 100 devices',
            'Advanced automation features',
            'Energy monitoring',
            'Local processing for privacy',
          ]}
          isWishlisted={isWishlisted}
          onWishlist={() => setIsWishlisted(!isWishlisted)}
          onShare={() => alert('Share functionality would open here')}
          onReviewClick={() => alert('Scroll to reviews section')}
          onVendorClick={() => alert('Navigate to vendor page')}
        />
      </div>
    );
  },
};

// Multiple badges
export const MultipleBadges: Story = {
  args: {
    name: 'Professional Camera Kit',
    brand: 'PhotoPro',
    price: 2499.99,
    badges: [
      { text: 'New Arrival', variant: 'default' },
      { text: 'Best Seller', variant: 'success' },
      { text: 'Limited Edition', variant: 'secondary' },
      { text: '10% OFF', variant: 'destructive' },
    ],
    shortDescription: 'Complete camera kit for professional photographers.',
    rating: 4.9,
    reviewCount: 78,
    inStock: true,
  },
};

// No reviews
export const NoReviews: Story = {
  args: {
    name: 'New Product Launch',
    brand: 'InnovateTech',
    price: 99.99,
    shortDescription: 'Be the first to experience our latest innovation.',
    inStock: true,
    badges: [
      { text: 'Pre-order', variant: 'secondary' },
    ],
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <ProductInfo
        name="Premium Headphones"
        brand="AudioTech"
        price={299.99}
        originalPrice={399.99}
        shortDescription="Immerse yourself in pure sound with our premium headphones."
        rating={4.7}
        reviewCount={234}
        inStock={true}
        stockCount={12}
        shippingInfo={{
          freeShipping: true,
          estimatedDays: '2-3 days',
        }}
        badges={[
          { text: 'Premium', variant: 'default' },
          { text: '25% OFF', variant: 'destructive' },
        ]}
        highlights={[
          'Studio-quality sound',
          '40-hour battery life',
          'Premium materials',
          'Foldable design',
        ]}
      />
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

// Minimal info
export const Minimal: Story = {
  args: {
    name: 'Basic T-Shirt',
    price: 19.99,
  },
};

// Product with everything
export const KitchenSink: Story = {
  args: {
    name: 'Ultimate Gaming Setup Bundle',
    brand: 'GameMaster Pro',
    sku: 'GMP-BUNDLE-001',
    price: 3999.99,
    originalPrice: 4999.99,
    currency: 'USD',
    layout: 'detailed',
    shortDescription: 'Complete gaming setup including PC, monitor, peripherals, and accessories for the ultimate gaming experience.',
    longDescription: `
      <h3>The Complete Gaming Experience</h3>
      <p>Transform your gaming space with our Ultimate Gaming Setup Bundle. This comprehensive package includes everything you need to create a professional-grade gaming station.</p>
      
      <h4>What's Included:</h4>
      <ul>
        <li><strong>Gaming PC:</strong> Custom-built with RTX 4090 and Intel i9-13900K</li>
        <li><strong>Monitor:</strong> 32" 4K 144Hz HDR display with G-Sync</li>
        <li><strong>Peripherals:</strong> Mechanical keyboard, wireless gaming mouse, premium headset</li>
        <li><strong>Accessories:</strong> RGB lighting, cable management, gaming chair</li>
      </ul>
      
      <h4>Why Choose This Bundle?</h4>
      <p>We've carefully selected and tested each component to ensure perfect compatibility and maximum performance. Save time and money with our expertly curated bundle.</p>
    `,
    features: [
      { icon: 'cpu', label: 'Processor', value: 'Intel Core i9-13900K' },
      { icon: 'monitor', label: 'Monitor', value: '32" 4K 144Hz HDR' },
      { icon: 'hard-drive', label: 'Storage', value: '2TB NVMe + 4TB HDD' },
      { icon: 'zap', label: 'Graphics', value: 'NVIDIA RTX 4090' },
      { icon: 'database', label: 'Memory', value: '64GB DDR5 RGB' },
      { icon: 'wifi', label: 'Connectivity', value: 'WiFi 6E + 2.5Gb Ethernet' },
    ],
    highlights: [
      '4K gaming at 144Hz with RTX 4090',
      'Professional streaming capable',
      'VR-ready system',
      'Whisper-quiet cooling',
      'Future-proof components',
      '3-year warranty included',
    ],
    rating: 4.9,
    reviewCount: 523,
    vendorName: 'Elite Gaming Store',
    vendorId: 'vendor-elite-001',
    vendorRating: 4.8,
    inStock: true,
    stockCount: 5,
    lowStockThreshold: 10,
    availability: 'Ships within 24 hours',
    shippingInfo: {
      freeShipping: true,
      estimatedDays: 'Free white-glove delivery and setup',
    },
    badges: [
      { text: 'Bundle Deal', variant: 'success' },
      { text: 'Save $1000', variant: 'destructive' },
      { text: 'Limited Stock', variant: 'secondary' },
      { text: 'Top Rated', variant: 'default' },
    ],
    ageRestriction: 0,
    showSku: true,
    showVendor: true,
    showShipping: true,
    onShare: () => console.log('Share clicked'),
    onWishlist: () => console.log('Wishlist clicked'),
    onReviewClick: () => console.log('Reviews clicked'),
    onVendorClick: () => console.log('Vendor clicked'),
    isWishlisted: false,
  },
};