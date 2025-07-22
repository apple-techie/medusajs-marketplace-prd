import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Banner, PersistentBanner, useBanner } from './Banner';
import { Icon } from '../../atoms/Icon/Icon';

const meta = {
  title: 'Molecules/Banner',
  component: Banner,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showIcon: {
      control: 'boolean',
    },
    dismissible: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example
export const Default: Story = {
  args: {
    heading: 'Banner Heading',
    subheading: 'Banner Subheading',
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Banner 
        variant="default"
        heading="Default Banner"
        subheading="This is the default/primary variant for general announcements"
      />
      
      <Banner 
        variant="info"
        heading="Information"
        subheading="This banner provides helpful information to users"
      />
      
      <Banner 
        variant="success"
        heading="Success!"
        subheading="Your order has been successfully placed"
      />
      
      <Banner 
        variant="warning"
        heading="Warning"
        subheading="Your subscription will expire in 7 days"
      />
      
      <Banner 
        variant="danger"
        heading="Error"
        subheading="There was a problem processing your payment"
      />
      
      <Banner 
        variant="neutral"
        heading="Neutral Message"
        subheading="This is a neutral informational banner"
      />
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Banner 
        size="sm"
        heading="Small Banner"
        subheading="Compact size for less prominent messages"
      />
      
      <Banner 
        size="md"
        heading="Medium Banner (Default)"
        subheading="Standard size for most use cases"
      />
      
      <Banner 
        size="lg"
        heading="Large Banner"
        subheading="Larger size for important announcements that need more attention"
      />
    </div>
  ),
};

// With action
export const WithAction: Story = {
  args: {
    heading: 'New Feature Available',
    subheading: 'Check out our new vendor dashboard with advanced analytics',
    action: {
      label: 'Learn More',
      onClick: () => alert('Learn more clicked'),
    },
  },
};

// Custom content
export const CustomContent: Story = {
  render: () => (
    <Banner variant="info">
      <div>
        <p className="font-semibold">Custom Banner Content</p>
        <p className="text-sm mt-1">
          You can use custom content with rich formatting, 
          <a href="#" className="underline mx-1">links</a>, 
          and other elements.
        </p>
        <ul className="text-sm mt-2 list-disc list-inside">
          <li>Feature one</li>
          <li>Feature two</li>
          <li>Feature three</li>
        </ul>
      </div>
    </Banner>
  ),
};

// Without icon
export const NoIcon: Story = {
  args: {
    heading: 'Simple Banner',
    subheading: 'This banner has no icon',
    showIcon: false,
  },
};

// Custom icon
export const CustomIcon: Story = {
  render: () => (
    <Banner 
      heading="Special Offer"
      subheading="Get 20% off your first order"
      icon={<Icon icon="tag" size="md" className="text-primary-600" />}
    />
  ),
};

// Non-dismissible
export const NonDismissible: Story = {
  args: {
    heading: 'Important Notice',
    subheading: 'This banner cannot be dismissed',
    dismissible: false,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const { isVisible, message, show, hide } = useBanner(false);
    
    return (
      <div>
        <div className="mb-4 space-x-2">
          <button
            onClick={() => show('Dynamic Banner', 'This was triggered programmatically', 'success')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Show Success
          </button>
          <button
            onClick={() => show('Warning!', 'Something needs your attention', 'warning')}
            className="px-4 py-2 bg-warning-600 text-white rounded hover:bg-warning-700"
          >
            Show Warning
          </button>
          <button
            onClick={() => hide()}
            className="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700"
          >
            Hide Banner
          </button>
        </div>
        
        {isVisible && (
          <Banner 
            {...message}
            onDismiss={hide}
          />
        )}
      </div>
    );
  },
};

// E-commerce examples
export const Promotion: Story = {
  render: () => (
    <Banner 
      variant="default"
      heading="🎉 Flash Sale - 30% Off Everything!"
      subheading="Use code FLASH30 at checkout. Ends midnight tonight."
      icon={<Icon icon="sparkles" size="md" className="text-primary-600" />}
      action={{
        label: 'Shop Now',
        onClick: () => console.log('Navigate to shop'),
      }}
    />
  ),
};

export const ShippingNotice: Story = {
  render: () => (
    <Banner 
      variant="warning"
      heading="Shipping Delays"
      subheading="Due to high demand, orders may take 3-5 extra business days to deliver."
      action={{
        label: 'Track Your Order',
        onClick: () => console.log('Navigate to tracking'),
      }}
    />
  ),
};

export const VendorAlert: Story = {
  render: () => (
    <Banner 
      variant="info"
      heading="Action Required: Complete Your Vendor Profile"
      subheading="Add your business documents to start selling on our marketplace."
      action={{
        label: 'Complete Profile',
        onClick: () => console.log('Navigate to vendor profile'),
      }}
    />
  ),
};

export const SecurityWarning: Story = {
  render: () => (
    <Banner 
      variant="danger"
      heading="Security Alert"
      subheading="We noticed unusual activity on your account. Please verify your recent transactions."
      action={{
        label: 'Review Activity',
        onClick: () => console.log('Navigate to security settings'),
      }}
    />
  ),
};

// Persistent banner
export const PersistentExample: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    
    return (
      <div>
        <PersistentBanner
          key={key}
          storageKey="storybook-persistent-banner"
          variant="info"
          heading="Welcome to Our New Marketplace!"
          subheading="Discover thousands of products from verified vendors."
          action={{
            label: 'Start Shopping',
            onClick: () => console.log('Start shopping'),
          }}
        />
        
        <button
          onClick={() => {
            localStorage.removeItem('storybook-persistent-banner');
            setKey(prev => prev + 1);
          }}
          className="mt-4 px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300"
        >
          Reset Banner (Clear localStorage)
        </button>
      </div>
    );
  },
};

// Multiple banners
export const BannerStack: Story = {
  render: () => {
    const [banners, setBanners] = useState([
      { id: 1, heading: 'Free Shipping', subheading: 'On orders over $50', variant: 'success' as const },
      { id: 2, heading: 'New Products', subheading: 'Check out our latest arrivals', variant: 'info' as const },
      { id: 3, heading: 'Limited Stock', subheading: 'Some items in your cart are running low', variant: 'warning' as const },
    ]);
    
    const removeBanner = (id: number) => {
      setBanners(prev => prev.filter(b => b.id !== id));
    };
    
    return (
      <div className="space-y-2">
        {banners.map(banner => (
          <Banner
            key={banner.id}
            {...banner}
            onDismiss={() => removeBanner(banner.id)}
          />
        ))}
        
        {banners.length === 0 && (
          <p className="text-neutral-500 text-center py-8">
            All banners dismissed. Refresh to reset.
          </p>
        )}
      </div>
    );
  },
};

// Accessibility example
export const AccessibleBanner: Story = {
  render: () => (
    <div className="space-y-4">
      <Banner 
        variant="danger"
        heading="Urgent: Payment Method Expired"
        subheading="Please update your payment information to avoid service interruption."
        aria-live="assertive"
        aria-label="Urgent payment notification"
        action={{
          label: 'Update Payment',
          onClick: () => console.log('Update payment'),
        }}
      />
      
      <Banner 
        variant="info"
        heading="New Terms of Service"
        subheading="We've updated our terms. They'll take effect on January 1st."
        aria-live="polite"
        aria-label="Terms of service update notification"
      />
    </div>
  ),
};

// Complex content example
export const ComplexContent: Story = {
  render: () => (
    <Banner variant="neutral" showIcon={false} size="lg">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Become a Vendor</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Join thousands of sellers on our marketplace and grow your business.
          </p>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Access to millions of customers</li>
            <li>• Competitive commission rates</li>
            <li>• Marketing support</li>
          </ul>
        </div>
        <div className="flex items-center justify-center md:justify-end">
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Start Selling Today
          </button>
        </div>
      </div>
    </Banner>
  ),
};