import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NewsletterSection, SimpleNewsletter } from './NewsletterSection';

const meta = {
  title: 'Organisms/NewsletterSection',
  component: NewsletterSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'centered', 'split', 'inline'],
      description: 'Newsletter section variant',
    },
    layout: {
      control: 'radio',
      options: ['stacked', 'horizontal'],
      description: 'Form layout',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'gradient', 'custom'],
      description: 'Color theme',
    },
    showNameField: {
      control: 'boolean',
      description: 'Show name input field',
    },
    showPreferences: {
      control: 'boolean',
      description: 'Show preference checkboxes',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show icon',
    },
    showBenefits: {
      control: 'boolean',
      description: 'Show benefits list',
    },
    showSubscriberCount: {
      control: 'boolean',
      description: 'Show subscriber count',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
} satisfies Meta<typeof NewsletterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic newsletter section
export const Default: Story = {
  args: {
    onSubmit: async (data) => {
      console.log('Submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

// Minimal variant
export const Minimal: Story = {
  args: {
    variant: 'minimal',
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// Centered variant with all features
export const Centered: Story = {
  args: {
    variant: 'centered',
    title: 'Never Miss a Deal',
    subtitle: 'Join Our Community',
    description: 'Be the first to know about exclusive offers, new products, and special events.',
    showNameField: true,
    showPreferences: true,
    preferences: [
      { label: 'Daily Deals', value: 'deals' },
      { label: 'New Products', value: 'products' },
      { label: 'Events & Sales', value: 'events' },
      { label: 'Tips & Guides', value: 'guides' },
    ],
    subscriberCount: 25000,
    testimonial: {
      text: "The best newsletter I've subscribed to. Always relevant and never spammy!",
      author: 'Sarah Johnson',
      role: 'Loyal Customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    benefits: [
      '20% off your first order',
      'Exclusive member-only deals',
      'Early access to new products',
      'Free shipping on orders over $50',
    ],
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// Split layout
export const Split: Story = {
  args: {
    variant: 'split',
    title: 'Join 50,000+ Smart Shoppers',
    description: 'Get personalized recommendations, exclusive offers, and shopping tips delivered weekly.',
    benefits: [
      'Curated product recommendations',
      'Member-only flash sales',
      'Expert buying guides',
      'Price drop alerts',
    ],
    showNameField: true,
    subscriberCount: 50000,
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// Inline variant
export const Inline: Story = {
  args: {
    variant: 'inline',
    title: 'Get 10% off your first order',
    description: 'Subscribe to our newsletter',
    layout: 'horizontal',
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    title: 'Stay Connected',
    description: 'Join our community and never miss an update.',
    showSubscriberCount: true,
    subscriberCount: 15000,
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// Gradient theme
export const GradientTheme: Story = {
  args: {
    theme: 'gradient',
    variant: 'centered',
    title: 'Exclusive Offers Await',
    description: 'Subscribe now and get 25% off your first purchase!',
    buttonText: 'Claim Your Discount',
    icon: 'gift',
    benefits: [
      '25% welcome discount',
      'Free shipping always',
      'VIP early access',
    ],
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// With background image
export const WithBackgroundImage: Story = {
  args: {
    backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600',
    theme: 'custom',
    variant: 'centered',
    title: 'Join Our Journey',
    description: 'Be part of something special. Get exclusive content and offers.',
    showIcon: false,
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// E-commerce example
export const EcommerceExample: Story = {
  args: {
    variant: 'split',
    title: 'Save Big on Every Purchase',
    subtitle: '🎉 Welcome Gift Inside!',
    description: 'Join our newsletter and unlock exclusive member benefits.',
    showNameField: true,
    showPreferences: true,
    preferences: [
      { label: "Women's Fashion", value: 'womens' },
      { label: "Men's Fashion", value: 'mens' },
      { label: 'Electronics', value: 'electronics' },
      { label: 'Home & Garden', value: 'home' },
    ],
    benefits: [
      '15% off welcome coupon',
      'Free shipping on all orders',
      'Early access to sales',
      'Birthday surprise gift',
      'Exclusive member prices',
    ],
    subscriberCount: 125000,
    privacyText: 'We respect your privacy. Unsubscribe anytime.',
    privacyLink: '#privacy',
    termsLink: '#terms',
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    loading: true,
    onSubmit: async (data) => {
      console.log('Submitted:', data);
    },
  },
};

// With custom messages
export const CustomMessages: Story = {
  args: {
    successMessage: '🎉 Welcome aboard! Check your inbox for a special surprise.',
    errorMessage: 'Oops! That didn\'t work. Please try again or contact support.',
    placeholder: 'your@email.com',
    buttonText: 'Join Now',
    onSubmit: async (data) => {
      console.log('Submitted:', data);
      // Simulate random success/failure
      if (Math.random() > 0.5) {
        throw new Error('Simulated error');
      }
    },
  },
};

// Simple newsletter component
export const SimpleNewsletterExample: Story = {
  render: () => (
    <div className="p-8 bg-neutral-100 dark:bg-neutral-900">
      <SimpleNewsletter
        title="Quick signup example"
        placeholder="Enter your email"
        buttonText="Subscribe"
        onSubmit={async (email) => {
          console.log('Email submitted:', email);
        }}
      />
    </div>
  ),
};

// Multiple newsletter sections
export const MultipleExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <NewsletterSection
        variant="inline"
        title="Header Newsletter"
        description="Quick signup in header"
        layout="horizontal"
      />
      
      <div className="h-64 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
        <p className="text-neutral-500">Page Content</p>
      </div>
      
      <NewsletterSection
        variant="centered"
        theme="gradient"
        title="Mid-Page CTA"
        description="Strategic placement for higher conversion"
        subscriberCount={10000}
      />
      
      <div className="h-64 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
        <p className="text-neutral-500">More Content</p>
      </div>
      
      <NewsletterSection
        variant="default"
        title="Footer Newsletter"
        description="Complete signup with preferences"
        showNameField
        showPreferences
        preferences={[
          { label: 'Product Updates', value: 'products' },
          { label: 'Blog Posts', value: 'blog' },
          { label: 'Special Offers', value: 'offers' },
        ]}
      />
    </div>
  ),
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [submitted, setSubmitted] = React.useState(false);
    const [data, setData] = React.useState<any>(null);

    const handleSubmit = async (formData: any) => {
      setData(formData);
      setSubmitted(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
      <div>
        <NewsletterSection
          variant="centered"
          title="Interactive Demo"
          description="Try submitting the form to see the data"
          showNameField
          showPreferences
          preferences={[
            { label: 'Daily Newsletter', value: 'daily' },
            { label: 'Weekly Digest', value: 'weekly' },
            { label: 'Special Announcements', value: 'announcements' },
          ]}
          onSubmit={handleSubmit}
        />
        
        {submitted && (
          <div className="mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Submitted Data:</h3>
            <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
};

// Mobile responsive
export const MobileView: Story = {
  args: {
    variant: 'centered',
    title: 'Mobile Newsletter',
    description: 'Optimized for mobile devices',
    showPreferences: true,
    preferences: [
      { label: 'Deals', value: 'deals' },
      { label: 'New Items', value: 'new' },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// RTL support
export const RTLSupport: Story = {
  args: {
    variant: 'split',
    title: 'النشرة الإخبارية',
    description: 'اشترك في نشرتنا الإخبارية للحصول على أحدث العروض',
    placeholder: 'بريدك الإلكتروني',
    buttonText: 'اشترك',
    benefits: [
      'خصومات حصرية',
      'منتجات جديدة',
      'نصائح وإرشادات',
    ],
  },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};