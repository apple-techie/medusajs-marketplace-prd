import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LoyaltyPointsCard } from './LoyaltyPointsCard';

const meta = {
  title: 'Molecules/LoyaltyPointsCard',
  component: LoyaltyPointsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'premium', 'vip'],
      description: 'Card color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Card padding size',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show progress bar to next tier',
    },
    showHistory: {
      control: 'boolean',
      description: 'Show recent activity history',
    },
    historyLimit: {
      control: 'number',
      description: 'Number of history items to show',
    },
  },
} satisfies Meta<typeof LoyaltyPointsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock history data
const mockHistory = [
  {
    id: '1',
    description: 'Purchase at Electronics Store',
    points: 250,
    date: '2024-01-22',
    type: 'earned' as const,
  },
  {
    id: '2',
    description: 'Birthday bonus',
    points: 500,
    date: '2024-01-15',
    type: 'earned' as const,
  },
  {
    id: '3',
    description: 'Redeemed for $10 discount',
    points: 1000,
    date: '2024-01-10',
    type: 'redeemed' as const,
  },
  {
    id: '4',
    description: 'Referral bonus',
    points: 300,
    date: '2024-01-05',
    type: 'earned' as const,
  },
];

// Default story
export const Default: Story = {
  args: {
    points: 2500,
  },
};

// With tier information
export const WithTier: Story = {
  args: {
    points: 2500,
    tier: 'Gold Member',
    tierIcon: 'star',
  },
};

// With progress to next tier
export const WithProgress: Story = {
  args: {
    points: 2500,
    tier: 'Gold Member',
    pointsToNextTier: 1500,
    nextTier: 'Platinum Member',
  },
};

// With expiring points
export const WithExpiringPoints: Story = {
  args: {
    points: 2500,
    tier: 'Gold Member',
    expiringPoints: {
      amount: 500,
      date: '2024-02-28',
    },
  },
};

// With currency value
export const WithCurrencyValue: Story = {
  args: {
    points: 2500,
    tier: 'Gold Member',
    currency: '$',
  },
};

// With history
export const WithHistory: Story = {
  args: {
    points: 2500,
    tier: 'Gold Member',
    history: mockHistory,
  },
};

// With actions
export const WithActions: Story = {
  args: {
    points: 2500,
    tier: 'Gold Member',
    actions: [
      {
        label: 'Redeem points',
        onClick: () => console.log('Redeem clicked'),
        icon: 'gift',
      },
      {
        label: 'View all history',
        onClick: () => console.log('History clicked'),
        variant: 'outline',
        icon: 'clock',
      },
    ],
  },
};

// Full featured
export const FullFeatured: Story = {
  args: {
    points: 7850,
    tier: 'Platinum Member',
    tierIcon: 'crown',
    pointsToNextTier: 2150,
    nextTier: 'Diamond Elite',
    expiringPoints: {
      amount: 300,
      date: '2024-03-15',
    },
    currency: '$',
    history: mockHistory,
    actions: [
      {
        label: 'Redeem rewards',
        onClick: () => console.log('Redeem clicked'),
        icon: 'gift',
      },
      {
        label: 'Earn more',
        onClick: () => console.log('Earn clicked'),
        variant: 'outline',
        icon: 'plus',
      },
    ],
  },
};

// Premium variant
export const PremiumVariant: Story = {
  args: {
    points: 5000,
    tier: 'Premium Member',
    variant: 'premium',
    tierIcon: 'award',
    pointsToNextTier: 5000,
    nextTier: 'Elite Status',
    currency: '€',
  },
};

// VIP variant
export const VIPVariant: Story = {
  args: {
    points: 15000,
    tier: 'VIP Elite',
    variant: 'vip',
    tierIcon: 'diamond',
    currency: '£',
    history: mockHistory.slice(0, 2),
  },
};

// Small size
export const SmallSize: Story = {
  args: {
    points: 1250,
    tier: 'Silver',
    size: 'sm',
  },
};

// Large size
export const LargeSize: Story = {
  args: {
    points: 12500,
    tier: 'Diamond',
    size: 'lg',
    tierIcon: 'diamond',
    pointsToNextTier: 7500,
    nextTier: 'Black Card',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    points: 0,
    loading: true,
  },
};

// Empty history
export const EmptyHistory: Story = {
  args: {
    points: 100,
    tier: 'Bronze',
    history: [],
  },
};

// No progress (max tier)
export const MaxTier: Story = {
  args: {
    points: 50000,
    tier: 'Black Card Elite',
    variant: 'vip',
    tierIcon: 'trophy',
    currency: '$',
    history: mockHistory,
  },
};

// Custom points label
export const CustomPointsLabel: Story = {
  args: {
    points: 850,
    pointsLabel: 'stars',
    tier: 'Rising Star',
    tierIcon: 'star',
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [points, setPoints] = React.useState(2500);
    const [history, setHistory] = React.useState(mockHistory.slice(0, 3));
    
    const handleRedeem = () => {
      if (points >= 1000) {
        setPoints(points - 1000);
        setHistory([
          {
            id: Date.now().toString(),
            description: 'Redeemed for reward',
            points: 1000,
            date: new Date().toISOString(),
            type: 'redeemed',
          },
          ...history,
        ]);
      }
    };
    
    const handleEarn = () => {
      const earned = Math.floor(Math.random() * 500) + 100;
      setPoints(points + earned);
      setHistory([
        {
          id: Date.now().toString(),
          description: 'Bonus points earned',
          points: earned,
          date: new Date().toISOString(),
          type: 'earned',
        },
        ...history,
      ]);
    };
    
    return (
      <LoyaltyPointsCard
        points={points}
        tier="Gold Member"
        pointsToNextTier={Math.max(0, 5000 - points)}
        nextTier="Platinum Member"
        currency="$"
        history={history}
        historyLimit={5}
        actions={[
          {
            label: 'Redeem 1000 pts',
            onClick: handleRedeem,
            icon: 'gift',
            variant: points >= 1000 ? 'default' : 'outline',
          },
          {
            label: 'Earn bonus',
            onClick: handleEarn,
            variant: 'outline',
            icon: 'plus',
          },
        ]}
      />
    );
  },
};

// Customer dashboard example
export const CustomerDashboard: Story = {
  render: () => (
    <div className="grid gap-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoyaltyPointsCard
          points={3750}
          tier="Gold Member"
          tierIcon="star"
          pointsToNextTier={1250}
          nextTier="Platinum"
          currency="$"
          expiringPoints={{
            amount: 200,
            date: '2024-02-28',
          }}
          actions={[
            {
              label: 'Redeem',
              onClick: () => {},
              icon: 'gift',
            },
          ]}
        />
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Benefits</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Free shipping on all orders
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                15% discount on purchases
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Early access to sales
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Ways to earn</h3>
            <ul className="space-y-2 text-sm">
              <li>• 1 point per $1 spent</li>
              <li>• 500 points for referrals</li>
              <li>• 200 points on birthday</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Different tiers showcase
export const TierShowcase: Story = {
  render: () => (
    <div className="grid gap-4 max-w-2xl">
      <LoyaltyPointsCard
        points={500}
        tier="Bronze"
        tierIcon="shield"
        variant="default"
        size="sm"
        pointsToNextTier={500}
        nextTier="Silver"
      />
      
      <LoyaltyPointsCard
        points={1500}
        tier="Silver"
        tierIcon="star"
        variant="default"
        pointsToNextTier={1000}
        nextTier="Gold"
      />
      
      <LoyaltyPointsCard
        points={3500}
        tier="Gold"
        tierIcon="crown"
        variant="premium"
        pointsToNextTier={1500}
        nextTier="Platinum"
      />
      
      <LoyaltyPointsCard
        points={8000}
        tier="Platinum"
        tierIcon="diamond"
        variant="vip"
        pointsToNextTier={2000}
        nextTier="Diamond"
      />
      
      <LoyaltyPointsCard
        points={25000}
        tier="Diamond Elite"
        tierIcon="trophy"
        variant="vip"
        size="lg"
        currency="$"
      />
    </div>
  ),
};

// Mobile view
export const MobileView: Story = {
  args: {
    points: 1850,
    tier: 'Silver Member',
    pointsToNextTier: 650,
    nextTier: 'Gold Member',
    history: mockHistory.slice(0, 2),
    actions: [
      {
        label: 'Redeem',
        onClick: () => {},
        icon: 'gift',
      },
    ],
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
    points: 5000,
    tier: 'Platinum',
    tierIcon: 'diamond',
    variant: 'vip',
    pointsToNextTier: 5000,
    nextTier: 'Diamond Elite',
    currency: '$',
    history: mockHistory,
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