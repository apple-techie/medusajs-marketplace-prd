import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Footer } from './Footer';

const meta = {
  title: 'Organisms/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    companyName: {
      control: 'text',
    },
    tagline: {
      control: 'text',
    },
    showNewsletter: {
      control: 'boolean',
    },
    newsletterTitle: {
      control: 'text',
    },
    newsletterDescription: {
      control: 'text',
    },
    copyrightText: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic footer
export const Default: Story = {
  args: {
    companyName: 'Neo Mart',
    tagline: 'Get exclusive deals, faster checkout, and real-time order updates—right at your fingertips. Download now and enjoy a better shopping experience!',
  },
};

// With newsletter
export const WithNewsletter: Story = {
  args: {
    companyName: 'Neo Mart',
    tagline: 'Your trusted marketplace for all your needs.',
    showNewsletter: true,
    newsletterTitle: 'Stay Updated',
    newsletterDescription: 'Subscribe to get the latest deals and updates delivered to your inbox.',
    onNewsletterSubmit: (email) => {
      console.log('Newsletter subscription:', email);
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

// With social links
export const WithSocialLinks: Story = {
  args: {
    companyName: 'Neo Mart',
    socialLinks: {
      facebook: 'https://facebook.com/neomart',
      twitter: 'https://twitter.com/neomart',
      instagram: 'https://instagram.com/neomart',
      linkedin: 'https://linkedin.com/company/neomart',
      youtube: 'https://youtube.com/neomart',
    },
  },
};

// Minimal footer
export const Minimal: Story = {
  args: {
    companyName: 'Neo Mart',
    sections: [
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Terms', href: '/terms' },
          { label: 'Privacy', href: '/privacy' },
        ],
      },
    ],
    appStoreLinks: [],
  },
};

// E-commerce marketplace footer
export const Marketplace: Story = {
  args: {
    companyName: 'MarketPlace Pro',
    tagline: 'Connect buyers and sellers in a trusted marketplace environment.',
    sections: [
      {
        title: 'For Buyers',
        links: [
          { label: 'How to Buy', href: '/how-to-buy' },
          { label: 'Buyer Protection', href: '/buyer-protection' },
          { label: 'Shipping Info', href: '/shipping' },
          { label: 'Returns & Refunds', href: '/returns' },
          { label: 'Track Order', href: '/track' },
        ],
      },
      {
        title: 'For Sellers',
        links: [
          { label: 'Start Selling', href: '/start-selling' },
          { label: 'Seller Center', href: '/seller-center' },
          { label: 'Seller Policies', href: '/seller-policies' },
          { label: 'Fees & Pricing', href: '/fees' },
          { label: 'Seller Support', href: '/seller-support' },
        ],
      },
      {
        title: 'Categories',
        links: [
          { label: 'Electronics', href: '/category/electronics' },
          { label: 'Fashion', href: '/category/fashion' },
          { label: 'Home & Garden', href: '/category/home' },
          { label: 'Sports & Outdoors', href: '/category/sports' },
          { label: 'View All', href: '/categories' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Careers', href: '/careers' },
          { label: 'Press Center', href: '/press' },
          { label: 'Investor Relations', href: '/investors' },
          { label: 'Blog', href: '/blog' },
        ],
      },
    ],
    showNewsletter: true,
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
};

// With QR code
export const WithQRCode: Story = {
  args: {
    companyName: 'Neo Mart',
    qrCodeUrl: 'https://via.placeholder.com/96x96/000000/FFFFFF/?text=QR',
    appStoreLinks: [
      { type: 'google', url: 'https://play.google.com' },
      { type: 'apple', url: 'https://apps.apple.com' },
    ],
  },
};

// Custom sections
export const CustomSections: Story = {
  args: {
    companyName: 'Tech Store',
    sections: [
      {
        title: 'Products',
        links: [
          { label: 'Laptops', href: '/laptops' },
          { label: 'Smartphones', href: '/phones' },
          { label: 'Accessories', href: '/accessories' },
          { label: 'Gaming', href: '/gaming' },
        ],
      },
      {
        title: 'Services',
        links: [
          { label: 'Repairs', href: '/repairs' },
          { label: 'Tech Support', href: '/support' },
          { label: 'Warranty', href: '/warranty' },
          { label: 'Trade-In', href: '/trade-in' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Buying Guides', href: '/guides' },
          { label: 'Tech News', href: '/news' },
          { label: 'Reviews', href: '/reviews' },
          { label: 'Community', href: '/community' },
        ],
      },
    ],
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    companyName: 'Neo Mart Dark',
    className: 'bg-neutral-900 text-white [&_.text-neutral-600]:text-neutral-400 [&_.text-neutral-900]:text-white [&_.bg-white]:bg-neutral-900 [&_.border-neutral-200]:border-neutral-700',
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 min-h-screen">
        <div className="h-96" />
        <Story />
      </div>
    ),
  ],
};

// With all features
export const FullFeatured: Story = {
  args: {
    companyName: 'Neo Mart',
    tagline: 'Your one-stop marketplace for everything you need.',
    sections: [
      {
        title: 'Shop',
        links: [
          { label: 'New Arrivals', href: '/new' },
          { label: 'Best Sellers', href: '/best-sellers' },
          { label: 'Deals', href: '/deals' },
          { label: 'Gift Cards', href: '/gift-cards' },
        ],
      },
      {
        title: 'Services',
        links: [
          { label: 'Neo Mart Plus', href: '/plus' },
          { label: 'Credit Card', href: '/credit-card' },
          { label: 'Gift Registry', href: '/registry' },
          { label: 'Neo Mart Pay', href: '/pay' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Help Center', href: '/help' },
          { label: 'Returns', href: '/returns' },
          { label: 'Shipping', href: '/shipping' },
          { label: 'Product Recalls', href: '/recalls' },
        ],
      },
    ],
    showNewsletter: true,
    newsletterTitle: 'Get 10% Off Your First Order',
    newsletterDescription: 'Subscribe to our newsletter and receive exclusive offers.',
    qrCodeUrl: 'https://via.placeholder.com/96x96/000000/FFFFFF/?text=QR',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
      youtube: '#',
    },
    appStoreLinks: [
      { type: 'google', url: '#' },
      { type: 'apple', url: '#' },
    ],
  },
};

// Mobile responsive view
export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [email, setEmail] = React.useState('');
    const [subscribed, setSubscribed] = React.useState(false);

    const handleNewsletterSubmit = async (email: string) => {
      console.log('Subscribing:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmail(email);
      setSubscribed(true);
    };

    return (
      <div>
        {subscribed && (
          <div className="bg-success-50 text-success-800 p-4 text-center">
            Successfully subscribed {email} to our newsletter!
          </div>
        )}
        <Footer
          companyName="Interactive Store"
          showNewsletter={true}
          onNewsletterSubmit={handleNewsletterSubmit}
          socialLinks={{
            facebook: '#',
            twitter: '#',
            instagram: '#',
          }}
        />
      </div>
    );
  },
};