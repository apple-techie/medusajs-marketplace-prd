import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MetricCard } from './MetricCard';

const meta = {
  title: 'Molecules/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed', 'minimal'],
      description: 'Card variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Card size',
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
      description: 'Trend direction',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic metric card
export const Default: Story = {
  args: {
    title: 'Total Revenue',
    value: '$45,678',
    icon: 'dollar-sign',
  },
};

// With trend up
export const TrendUp: Story = {
  args: {
    title: 'Monthly Sales',
    value: '$12,345',
    trend: 'up',
    change: '+15%',
    icon: 'trending-up',
  },
};

// With trend down
export const TrendDown: Story = {
  args: {
    title: 'Bounce Rate',
    value: '42%',
    trend: 'down',
    change: '-8%',
    icon: 'activity',
  },
};

// With subtitle
export const WithSubtitle: Story = {
  args: {
    title: 'Active Users',
    value: '1,234',
    subtitle: 'users online',
    icon: 'users',
  },
};

// With badge
export const WithBadge: Story = {
  args: {
    title: 'Server Status',
    value: '99.9%',
    subtitle: 'uptime',
    badge: { text: 'Healthy', variant: 'success' },
    icon: 'server',
  },
};

// With progress
export const WithProgress: Story = {
  args: {
    title: 'Storage Used',
    value: '75 GB',
    subtitle: 'of 100 GB',
    progress: {
      value: 75,
      max: 100,
      label: 'Capacity',
      showPercentage: true,
    },
    icon: 'hard-drive',
  },
};

// Detailed variant
export const DetailedVariant: Story = {
  args: {
    title: 'Conversion Rate',
    value: '3.45%',
    subtitle: 'Average',
    description: 'Based on 10,234 sessions in the last 30 days',
    trend: 'up',
    change: '+0.23%',
    variant: 'detailed',
    icon: 'target',
    comparison: {
      label: 'Industry average',
      value: '2.8%',
      trend: 'better',
    },
  },
};

// Minimal variant
export const MinimalVariant: Story = {
  args: {
    title: 'Orders',
    value: '156',
    variant: 'minimal',
  },
};

// Compact variant
export const CompactVariant: Story = {
  args: {
    title: 'Page Views',
    value: '23.4K',
    trend: 'up',
    change: '+12%',
    variant: 'compact',
    icon: 'eye',
  },
};

// With sparkline
export const WithSparkline: Story = {
  args: {
    title: 'Daily Revenue',
    value: '$2,345',
    trend: 'up',
    change: '+8%',
    sparkline: [100, 120, 115, 130, 125, 140, 135, 150, 145, 160, 155, 170],
    sparklineColor: '#10b981',
    icon: 'chart-line',
  },
};

// Interactive with onClick
export const Clickable: Story = {
  args: {
    title: 'Click for Details',
    value: '42',
    subtitle: 'items',
    icon: 'mouse-pointer',
    onClick: () => alert('Card clicked!'),
  },
};

// As link
export const AsLink: Story = {
  args: {
    title: 'View Report',
    value: '98.5%',
    subtitle: 'accuracy',
    icon: 'file-text',
    href: '#',
  },
};

// With footer action
export const WithFooterAction: Story = {
  args: {
    title: 'Team Members',
    value: '24',
    icon: 'users',
    footerAction: {
      label: 'Manage team',
      onClick: () => alert('Navigate to team management'),
    },
  },
};

// Different sizes
export const SmallSize: Story = {
  args: {
    title: 'Small Card',
    value: '123',
    size: 'sm',
    icon: 'box',
  },
};

export const LargeSize: Story = {
  args: {
    title: 'Large Card',
    value: '$99,999',
    size: 'lg',
    icon: 'dollar-sign',
    trend: 'up',
    change: '+25%',
  },
};

// Loading state
export const LoadingState: Story = {
  args: {
    title: 'Loading...',
    value: '---',
    loading: true,
  },
};

// Dashboard grid example
export const DashboardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
      <MetricCard
        title="Total Revenue"
        value="$124,563"
        trend="up"
        change="+12.5%"
        icon="dollar-sign"
      />
      <MetricCard
        title="New Customers"
        value="1,234"
        trend="up"
        change="+18%"
        icon="users"
      />
      <MetricCard
        title="Conversion Rate"
        value="3.24%"
        trend="down"
        change="-0.14%"
        icon="target"
      />
      <MetricCard
        title="Avg Order Value"
        value="$89.50"
        trend="up"
        change="+4.3%"
        icon="shopping-cart"
      />
    </div>
  ),
};

// E-commerce metrics
export const EcommerceMetrics: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
      <MetricCard
        title="Today's Sales"
        value="$3,456"
        subtitle="42 orders"
        trend="up"
        change="+23%"
        changeLabel="vs yesterday"
        icon="shopping-bag"
        sparkline={[20, 25, 30, 28, 35, 40, 38, 45, 42, 48]}
        badge={{ text: 'Live', variant: 'success' }}
      />
      <MetricCard
        title="Cart Abandonment"
        value="68.3%"
        trend="down"
        change="-5.2%"
        icon="shopping-cart"
        progress={{
          value: 68.3,
          max: 100,
          label: 'Rate',
        }}
      />
      <MetricCard
        title="Top Product"
        value="Wireless Headphones"
        subtitle="156 sold today"
        icon="package"
        footerAction={{
          label: 'View all products',
          onClick: () => console.log('Navigate to products'),
        }}
      />
    </div>
  ),
};

// Performance metrics
export const PerformanceMetrics: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <MetricCard
        title="Server Response Time"
        value="124ms"
        trend="down"
        change="-15ms"
        changeLabel="improvement"
        icon="zap"
        variant="detailed"
        description="Average response time across all endpoints"
        comparison={{
          label: 'Target',
          value: '200ms',
          trend: 'better',
        }}
      />
      <MetricCard
        title="Error Rate"
        value="0.02%"
        trend="down"
        change="-0.01%"
        icon="alert-triangle"
        variant="detailed"
        description="Errors in the last 24 hours"
        badge={{ text: 'Low', variant: 'success' }}
        progress={{
          value: 0.02,
          max: 1,
          showPercentage: false,
        }}
      />
    </div>
  ),
};

// Custom styled cards
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <MetricCard
        title="Premium Plan"
        value="$299"
        subtitle="/month"
        icon="crown"
        iconColor="text-yellow-500"
        className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800"
        valueClassName="text-yellow-700 dark:text-yellow-300"
      />
      <MetricCard
        title="Critical Alert"
        value="3"
        subtitle="issues"
        icon="alert-circle"
        iconColor="text-red-600"
        iconBackground={false}
        className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        valueClassName="text-red-700 dark:text-red-300"
        badge={{ text: 'Urgent', variant: 'destructive' }}
      />
    </div>
  ),
};

// Real-time metrics
export const RealTimeMetrics: Story = {
  render: () => {
    const [value, setValue] = React.useState(234);
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setValue(prev => prev + Math.floor(Math.random() * 10 - 5));
      }, 2000);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <MetricCard
        title="Active Sessions"
        value={value.toLocaleString()}
        subtitle="users online"
        icon="activity"
        badge={{ text: 'Real-time', variant: 'secondary' }}
        sparkline={Array.from({ length: 10 }, () => Math.random() * 50 + 200)}
      />
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Revenue"
          value="$45,678"
          trend="up"
          change="+12%"
          icon="dollar-sign"
        />
        <MetricCard
          title="Users"
          value="8,942"
          trend="up"
          change="+5.3%"
          icon="users"
        />
        <MetricCard
          title="Performance"
          value="98.5%"
          badge={{ text: 'Excellent', variant: 'success' }}
          icon="gauge"
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};