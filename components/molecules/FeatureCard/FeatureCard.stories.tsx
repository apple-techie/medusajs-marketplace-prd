import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FeatureCard, FeatureCardGrid, FeatureComparison } from './FeatureCard';

const meta = {
  title: 'Molecules/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Feature title',
    },
    description: {
      control: 'text',
      description: 'Feature description',
    },
    icon: {
      control: 'text',
      description: 'Icon name to display',
    },
    variant: {
      control: 'select',
      options: ['default', 'centered', 'horizontal', 'minimal', 'detailed'],
      description: 'Card variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Card size',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Content alignment',
    },
    iconBackground: {
      control: 'boolean',
      description: 'Show icon background',
    },
    border: {
      control: 'boolean',
      description: 'Show border',
    },
    shadow: {
      control: 'boolean',
      description: 'Show shadow',
    },
    hover: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic feature card
export const Default: Story = {
  args: {
    title: 'Fast Delivery',
    description: 'Get your orders delivered within 24 hours',
    icon: 'truck',
  },
};

// With image instead of icon
export const WithImage: Story = {
  args: {
    title: 'Premium Quality',
    description: 'Only the best products from verified suppliers',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Default</p>
        <FeatureCard
          title="Secure Payments"
          description="Your transactions are protected with bank-level security"
          icon="shield"
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Centered</p>
        <FeatureCard
          title="24/7 Support"
          description="Our team is here to help you anytime"
          icon="headphones"
          variant="centered"
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Horizontal</p>
        <FeatureCard
          title="Easy Returns"
          description="30-day return policy for your peace of mind"
          icon="refresh-cw"
          variant="horizontal"
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Minimal</p>
        <FeatureCard
          title="Free Shipping"
          description="On orders over $50"
          icon="package"
          variant="minimal"
        />
      </div>
    </div>
  ),
};

// Detailed variant with features list
export const DetailedWithFeatures: Story = {
  args: {
    title: 'Premium Membership',
    description: 'Unlock exclusive benefits and save more',
    icon: 'crown',
    variant: 'detailed',
    badge: 'Popular',
    badgeVariant: 'success',
    features: [
      'Free shipping on all orders',
      'Early access to sales',
      'Exclusive member discounts',
      '24/7 priority support',
      'Extended return period',
    ],
    action: {
      label: 'Learn More',
      href: '/membership',
    },
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Small</p>
        <FeatureCard
          title="Small Feature"
          description="Compact size for dense layouts"
          icon="star"
          size="sm"
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Medium (default)</p>
        <FeatureCard
          title="Medium Feature"
          description="Standard size for most use cases"
          icon="star"
          size="md"
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Large</p>
        <FeatureCard
          title="Large Feature"
          description="Prominent size for important features"
          icon="star"
          size="lg"
        />
      </div>
    </div>
  ),
};

// With badges
export const WithBadges: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FeatureCard
        title="New Feature"
        description="Just launched this week"
        icon="sparkles"
        badge="New"
        badgeVariant="success"
      />
      
      <FeatureCard
        title="Beta Feature"
        description="Try our latest innovation"
        icon="flask"
        badge="Beta"
        badgeVariant="warning"
      />
      
      <FeatureCard
        title="Premium Feature"
        description="Exclusive for pro users"
        icon="gem"
        badge="Pro Only"
        badgeVariant="primary"
      />
    </div>
  ),
};

// With actions
export const WithActions: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FeatureCard
        title="Documentation"
        description="Learn how to use our platform"
        icon="book"
        action={{
          label: 'Read Docs',
          href: '/docs',
        }}
      />
      
      <FeatureCard
        title="Get Started"
        description="Create your first project"
        icon="rocket"
        action={{
          label: 'Start Now',
          onClick: () => alert('Starting...'),
        }}
      />
    </div>
  ),
};

// Icon customization
export const IconCustomization: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FeatureCard
        title="With Background"
        description="Default icon style"
        icon="heart"
        iconBackground={true}
      />
      
      <FeatureCard
        title="No Background"
        description="Icon without background"
        icon="heart"
        iconBackground={false}
        iconColor="text-red-500"
      />
      
      <FeatureCard
        title="Custom Color"
        description="Custom icon color"
        icon="heart"
        iconColor="text-purple-500"
      />
    </div>
  ),
};

// Styling options
export const StylingOptions: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FeatureCard
        title="With Border"
        description="Default card style"
        icon="box"
        border={true}
        shadow={false}
      />
      
      <FeatureCard
        title="With Shadow"
        description="Elevated appearance"
        icon="layers"
        border={false}
        shadow={true}
      />
      
      <FeatureCard
        title="No Hover"
        description="Static appearance"
        icon="lock"
        hover={false}
      />
    </div>
  ),
};

// Feature card grid
export const FeatureGrid: Story = {
  render: () => {
    const features = [
      { id: 1, title: 'Free Shipping', description: 'On orders over $50', icon: 'truck' },
      { id: 2, title: 'Secure Checkout', description: 'SSL encrypted payments', icon: 'shield' },
      { id: 3, title: '24/7 Support', description: 'Always here to help', icon: 'headphones' },
      { id: 4, title: 'Easy Returns', description: '30-day return policy', icon: 'refresh-cw' },
      { id: 5, title: 'Best Prices', description: 'Price match guarantee', icon: 'tag' },
      { id: 6, title: 'Fast Delivery', description: 'Same-day available', icon: 'zap' },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">3 Column Grid</h3>
          <FeatureCardGrid features={features} columns={3} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">4 Column Grid - Small Gap</h3>
          <FeatureCardGrid features={features} columns={4} gap="sm" size="sm" />
        </div>
      </div>
    );
  },
};

// Feature comparison table
export const ComparisonTable: Story = {
  render: () => {
    const features = [
      { name: 'Unlimited Products', basic: false, pro: true, enterprise: true },
      { name: 'Priority Support', basic: false, pro: true, enterprise: true },
      { name: 'Custom Domain', basic: false, pro: true, enterprise: true },
      { name: 'API Access', basic: false, pro: false, enterprise: true },
      { name: 'Team Members', basic: '1', pro: '5', enterprise: 'Unlimited' },
      { name: 'Storage', basic: '5GB', pro: '50GB', enterprise: '500GB' },
      { name: 'Monthly Reports', basic: true, pro: true, enterprise: true },
      { name: 'SSL Certificate', basic: true, pro: true, enterprise: true },
      { name: 'Analytics', basic: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
      { name: 'White Label', basic: false, pro: false, enterprise: true },
    ];

    return (
      <FeatureComparison
        title="Compare Plans"
        description="Choose the perfect plan for your business"
        features={features}
      />
    );
  },
};

// Real-world example - Platform features
export const PlatformFeatures: Story = {
  render: () => {
    const mainFeatures = [
      {
        id: 1,
        title: 'Multi-Vendor Support',
        description: 'Connect with multiple suppliers and manage inventory from one dashboard',
        icon: 'users',
        badge: 'Core',
        badgeVariant: 'primary' as const,
      },
      {
        id: 2,
        title: 'Real-time Analytics',
        description: 'Track sales, inventory, and customer behavior with live dashboards',
        icon: 'bar-chart',
      },
      {
        id: 3,
        title: 'Smart Routing',
        description: 'Automatically route orders to the nearest fulfillment center',
        icon: 'map-pin',
        badge: 'AI-Powered',
        badgeVariant: 'success' as const,
      },
      {
        id: 4,
        title: 'Commission Management',
        description: 'Flexible commission tiers based on sales volume',
        icon: 'percent',
      },
    ];

    const securityFeatures = [
      {
        id: 5,
        title: 'Bank-Level Security',
        description: 'Your data is protected with 256-bit SSL encryption and secure infrastructure',
        icon: 'shield',
        features: [
          'SSL/TLS encryption',
          'PCI DSS compliant',
          'Regular security audits',
          'Data backup & recovery',
        ],
        variant: 'detailed' as const,
        action: {
          label: 'Security Details',
          href: '/security',
        },
      },
      {
        id: 6,
        title: 'Age Verification',
        description: 'Built-in age verification for restricted products with multiple verification methods',
        icon: 'user-check',
        features: [
          'ID verification',
          'Database checks',
          'Session management',
          'Compliance logging',
        ],
        variant: 'detailed' as const,
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Platform Features</h2>
          <p className="text-neutral-600 mb-6">Everything you need to run a successful marketplace</p>
          <FeatureCardGrid features={mainFeatures} columns={2} gap="lg" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Security & Compliance</h2>
          <p className="text-neutral-600 mb-6">Enterprise-grade security for your peace of mind</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature) => (
              <FeatureCard key={feature.id} {...feature} size="lg" />
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
        <FeatureCard
          title="Dark Mode Ready"
          description="Fully styled for dark themes"
          icon="moon"
        />
        
        <FeatureCard
          title="Accessible"
          description="WCAG compliant components"
          icon="eye"
          variant="centered"
        />
        
        <FeatureCard
          title="Responsive"
          description="Works on all devices"
          icon="smartphone"
          badge="Mobile First"
          badgeVariant="primary"
        />
      </div>
    </div>
  ),
};