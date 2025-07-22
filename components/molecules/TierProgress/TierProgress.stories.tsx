import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TierProgress, Tier } from './TierProgress';

const meta = {
  title: 'Molecules/TierProgress',
  component: TierProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Display variant',
    },
    status: {
      control: 'select',
      options: ['active', 'achieved', 'locked'],
      description: 'Visual status',
    },
    showAllTiers: {
      control: 'boolean',
      description: 'Show all available tiers',
    },
    showBenefits: {
      control: 'boolean',
      description: 'Show tier benefits',
    },
    showProjection: {
      control: 'boolean',
      description: 'Show revenue projection',
    },
    currency: {
      control: 'text',
      description: 'Currency symbol',
    },
  },
} satisfies Meta<typeof TierProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock tier data
const tiers: Tier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    minRevenue: 0,
    maxRevenue: 5000,
    commissionRate: 15,
    benefits: [
      'Basic vendor dashboard',
      'Standard support',
      'Monthly payouts',
    ],
    icon: 'shield',
    color: 'text-orange-600',
  },
  {
    id: 'silver',
    name: 'Silver',
    minRevenue: 5000,
    maxRevenue: 10000,
    commissionRate: 18,
    benefits: [
      'Enhanced analytics',
      'Priority support',
      'Bi-weekly payouts',
      'Featured product slots',
    ],
    icon: 'medal',
    color: 'text-gray-500',
  },
  {
    id: 'gold',
    name: 'Gold',
    minRevenue: 10000,
    maxRevenue: 25000,
    commissionRate: 20,
    benefits: [
      'Advanced analytics',
      'Dedicated account manager',
      'Weekly payouts',
      'Premium featured listings',
      'Marketing support',
    ],
    icon: 'star',
    color: 'text-yellow-500',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minRevenue: 25000,
    maxRevenue: 50000,
    commissionRate: 22,
    benefits: [
      'Real-time analytics',
      'VIP support',
      'Daily payouts',
      'Priority placement',
      'Co-marketing opportunities',
      'API access',
    ],
    icon: 'crown',
    color: 'text-purple-600',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    minRevenue: 50000,
    commissionRate: 25,
    benefits: [
      'Enterprise analytics',
      'Dedicated team',
      'Instant payouts',
      'Homepage features',
      'Strategic partnership',
      'Custom integrations',
      'Exclusive events',
    ],
    icon: 'diamond',
    color: 'text-blue-600',
  },
];

// Default story
export const Default: Story = {
  args: {
    currentTier: tiers[2], // Gold
    nextTier: tiers[3], // Platinum
    currentRevenue: 15000,
  },
};

// Compact variant
export const Compact: Story = {
  args: {
    currentTier: tiers[1], // Silver
    nextTier: tiers[2], // Gold
    currentRevenue: 7500,
    variant: 'compact',
  },
};

// Detailed variant
export const Detailed: Story = {
  args: {
    currentTier: tiers[2], // Gold
    nextTier: tiers[3], // Platinum
    currentRevenue: 18000,
    variant: 'detailed',
    period: 'This month',
  },
};

// With all tiers
export const WithAllTiers: Story = {
  args: {
    currentTier: tiers[2], // Gold
    nextTier: tiers[3], // Platinum
    currentRevenue: 15000,
    tiers: tiers,
    variant: 'detailed',
    showAllTiers: true,
  },
};

// With projection
export const WithProjection: Story = {
  args: {
    currentTier: tiers[2], // Gold
    nextTier: tiers[3], // Platinum
    currentRevenue: 20000,
    showProjection: true,
    projectedRevenue: 28000,
  },
};

// At tier boundary
export const AtTierBoundary: Story = {
  args: {
    currentTier: tiers[1], // Silver
    nextTier: tiers[2], // Gold
    currentRevenue: 9999,
    variant: 'detailed',
  },
};

// Max tier achieved
export const MaxTier: Story = {
  args: {
    currentTier: tiers[4], // Diamond
    currentRevenue: 75000,
    variant: 'detailed',
  },
};

// Base tier
export const BaseTier: Story = {
  args: {
    currentTier: tiers[0], // Bronze
    nextTier: tiers[1], // Silver
    currentRevenue: 2500,
    variant: 'detailed',
    showBenefits: true,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    currentTier: tiers[0],
    currentRevenue: 0,
    loading: true,
    variant: 'detailed',
  },
};

// With learn more
export const WithLearnMore: Story = {
  args: {
    currentTier: tiers[2], // Gold
    nextTier: tiers[3], // Platinum
    currentRevenue: 15000,
    variant: 'detailed',
    onLearnMore: () => console.log('Learn more clicked'),
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [revenue, setRevenue] = React.useState(15000);
    
    const getCurrentTier = (rev: number) => {
      return tiers.findLast(tier => rev >= tier.minRevenue) || tiers[0];
    };
    
    const getNextTier = (currentTier: Tier) => {
      const currentIndex = tiers.findIndex(t => t.id === currentTier.id);
      return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : undefined;
    };
    
    const currentTier = getCurrentTier(revenue);
    const nextTier = getNextTier(currentTier);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Simulate Revenue:</label>
          <input
            type="range"
            min="0"
            max="80000"
            step="1000"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="flex-1"
          />
          <span className="font-mono font-medium w-20 text-right">
            ${revenue.toLocaleString()}
          </span>
        </div>
        
        <TierProgress
          currentTier={currentTier}
          nextTier={nextTier}
          currentRevenue={revenue}
          tiers={tiers}
          variant="detailed"
          showAllTiers
          showBenefits
          showProjection
          projectedRevenue={revenue * 1.2}
          onTierClick={(tier) => console.log('Clicked tier:', tier)}
          onLearnMore={() => console.log('Learn more clicked')}
        />
      </div>
    );
  },
};

// Vendor dashboard example
export const VendorDashboard: Story = {
  render: () => (
    <div className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TierProgress
            currentTier={tiers[2]} // Gold
            nextTier={tiers[3]} // Platinum
            currentRevenue={18500}
            tiers={tiers}
            variant="detailed"
            showAllTiers
            showBenefits
            period="November 2024"
            onLearnMore={() => {}}
          />
        </div>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Quick Stats</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-neutral-600">Orders</dt>
                <dd className="font-medium">156</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-neutral-600">Avg Order</dt>
                <dd className="font-medium">$118.59</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-neutral-600">Growth</dt>
                <dd className="font-medium text-green-600">+23%</dd>
              </div>
            </dl>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Add 5 more products
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Improve product photos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Run a promotion
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Multiple instances
export const MultipleInstances: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="font-semibold">Default Variant</h3>
      <TierProgress
        currentTier={tiers[1]}
        nextTier={tiers[2]}
        currentRevenue={7500}
        showProjection
        projectedRevenue={8900}
      />
      
      <h3 className="font-semibold mt-6">Compact Variant</h3>
      <TierProgress
        currentTier={tiers[2]}
        nextTier={tiers[3]}
        currentRevenue={15000}
        variant="compact"
      />
      
      <h3 className="font-semibold mt-6">Detailed Variant</h3>
      <TierProgress
        currentTier={tiers[3]}
        nextTier={tiers[4]}
        currentRevenue: 35000,
        variant="detailed"
        showBenefits
      />
    </div>
  ),
};

// Status variations
export const StatusVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <TierProgress
        currentTier={tiers[2]}
        nextTier={tiers[3]}
        currentRevenue={15000}
        variant="compact"
        status="active"
      />
      
      <TierProgress
        currentTier={tiers[3]}
        currentRevenue={30000}
        variant="compact"
        status="achieved"
      />
      
      <TierProgress
        currentTier={tiers[0]}
        nextTier={tiers[1]}
        currentRevenue={1000}
        variant="compact"
        status="locked"
      />
    </div>
  ),
};

// Different currencies
export const DifferentCurrencies: Story = {
  render: () => (
    <div className="space-y-4">
      <TierProgress
        currentTier={tiers[2]}
        nextTier={tiers[3]}
        currentRevenue={15000}
        currency="$"
      />
      
      <TierProgress
        currentTier={tiers[2]}
        nextTier={tiers[3]}
        currentRevenue={15000}
        currency="€"
      />
    </div>
  ),
};

// Mobile view
export const MobileView: Story = {
  args: {
    currentTier: tiers[2],
    nextTier: tiers[3],
    currentRevenue: 15000,
    variant: 'detailed',
    showBenefits: true,
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
    currentTier: tiers[3],
    nextTier: tiers[4],
    currentRevenue: 35000,
    tiers: tiers,
    variant: 'detailed',
    showAllTiers: true,
    showBenefits: true,
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