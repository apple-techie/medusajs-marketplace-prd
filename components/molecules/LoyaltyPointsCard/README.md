# LoyaltyPointsCard Component

A loyalty points display card for customer dashboards and reward programs. Shows current points balance, tier status, progress to next tier, recent activity, and available actions.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { LoyaltyPointsCard } from '@/components/molecules/LoyaltyPointsCard';

// Basic usage
<LoyaltyPointsCard
  points={2500}
  tier="Gold Member"
/>

// With progress and actions
<LoyaltyPointsCard
  points={2500}
  tier="Gold Member"
  pointsToNextTier={1500}
  nextTier="Platinum"
  actions={[
    { label: 'Redeem', onClick: handleRedeem, icon: 'gift' }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `points` | `number` | - | **Required**. Current points balance |
| `tier` | `string` | - | Current loyalty tier name |
| `tierIcon` | `string` | `'star'` | Icon for the tier |
| `pointsToNextTier` | `number` | - | Points needed for next tier |
| `nextTier` | `string` | - | Name of the next tier |
| `expiringPoints` | `object` | - | Points expiring soon |
| `history` | `array` | `[]` | Recent transaction history |
| `actions` | `array` | `[]` | Action buttons |
| `showProgress` | `boolean` | `true` | Show progress bar |
| `showHistory` | `boolean` | `true` | Show transaction history |
| `historyLimit` | `number` | `3` | Number of history items to show |
| `loading` | `boolean` | `false` | Loading state |
| `currency` | `string` | - | Currency symbol for value display |
| `pointsLabel` | `string` | `'points'` | Label for points |
| `variant` | `'default' \| 'premium' \| 'vip'` | `'default'` | Card color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card padding size |
| `className` | `string` | - | Additional CSS classes |

### ExpiringPoints Type

```tsx
expiringPoints?: {
  amount: number;
  date: string | Date;
}
```

### History Type

```tsx
history?: Array<{
  id: string;
  description: string;
  points: number;
  date: string | Date;
  type: 'earned' | 'redeemed';
}>
```

### Actions Type

```tsx
actions?: Array<{
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: string;
}>
```

## Common Patterns

### Basic Points Display

```tsx
<LoyaltyPointsCard
  points={1250}
/>
```

### With Tier and Progress

```tsx
<LoyaltyPointsCard
  points={3500}
  tier="Gold Member"
  tierIcon="crown"
  pointsToNextTier={1500}
  nextTier="Platinum Member"
/>
```

### With Expiring Points Warning

```tsx
<LoyaltyPointsCard
  points={2000}
  tier="Silver"
  expiringPoints={{
    amount: 300,
    date: '2024-03-31'
  }}
/>
```

### With Currency Value

```tsx
<LoyaltyPointsCard
  points={5000}
  tier="Gold"
  currency="$"
/>
// Shows: 5,000 points ≈ $50.00 value
```

### With Transaction History

```tsx
const history = [
  {
    id: '1',
    description: 'Purchase at Store ABC',
    points: 250,
    date: '2024-01-20',
    type: 'earned'
  },
  {
    id: '2',
    description: 'Redeemed for discount',
    points: 1000,
    date: '2024-01-15',
    type: 'redeemed'
  }
];

<LoyaltyPointsCard
  points={1500}
  history={history}
/>
```

### With Actions

```tsx
<LoyaltyPointsCard
  points={2500}
  tier="Gold"
  actions={[
    {
      label: 'Redeem points',
      onClick: () => openRedeemModal(),
      icon: 'gift'
    },
    {
      label: 'View all history',
      onClick: () => navigateToHistory(),
      variant: 'outline',
      icon: 'clock'
    }
  ]}
/>
```

## Variants

### Default (Blue)

```tsx
<LoyaltyPointsCard
  points={2500}
  variant="default"
/>
```

### Premium (Gold)

```tsx
<LoyaltyPointsCard
  points={5000}
  tier="Premium Member"
  variant="premium"
  tierIcon="award"
/>
```

### VIP (Purple)

```tsx
<LoyaltyPointsCard
  points={10000}
  tier="VIP Elite"
  variant="vip"
  tierIcon="diamond"
/>
```

## Customer Dashboard Integration

```tsx
function CustomerDashboard() {
  const { loyaltyData, loading } = useCustomerLoyalty();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LoyaltyPointsCard
        points={loyaltyData.points}
        tier={loyaltyData.tier}
        pointsToNextTier={loyaltyData.pointsToNextTier}
        nextTier={loyaltyData.nextTier}
        expiringPoints={loyaltyData.expiringPoints}
        currency="$"
        history={loyaltyData.recentTransactions}
        loading={loading}
        actions={[
          {
            label: 'Redeem rewards',
            onClick: () => openRedeemModal(),
            icon: 'gift'
          },
          {
            label: 'Earn more',
            onClick: () => navigateToEarn(),
            variant: 'outline',
            icon: 'plus'
          }
        ]}
      />
      
      {/* Other dashboard content */}
    </div>
  );
}
```

## Interactive Example

```tsx
function InteractiveLoyaltyCard() {
  const [points, setPoints] = useState(2500);
  const [history, setHistory] = useState([]);
  
  const handleRedeem = () => {
    if (points >= 1000) {
      setPoints(points - 1000);
      setHistory([{
        id: Date.now().toString(),
        description: 'Redeemed for $10 discount',
        points: 1000,
        date: new Date(),
        type: 'redeemed'
      }, ...history]);
    }
  };
  
  const calculateTier = (pts: number) => {
    if (pts >= 5000) return 'Platinum';
    if (pts >= 2000) return 'Gold';
    if (pts >= 1000) return 'Silver';
    return 'Bronze';
  };
  
  const tier = calculateTier(points);
  const nextTierPoints = {
    Bronze: 1000,
    Silver: 2000,
    Gold: 5000,
    Platinum: 10000
  };
  
  return (
    <LoyaltyPointsCard
      points={points}
      tier={tier}
      pointsToNextTier={nextTierPoints[tier] - points}
      nextTier={tier === 'Platinum' ? 'Max' : 'Next Tier'}
      currency="$"
      history={history}
      actions={[
        {
          label: 'Redeem 1000 pts',
          onClick: handleRedeem,
          icon: 'gift',
          variant: points >= 1000 ? 'default' : 'outline'
        }
      ]}
    />
  );
}
```

## Tier System Example

```tsx
function TierBasedRewards() {
  const tiers = [
    { name: 'Bronze', minPoints: 0, icon: 'shield', variant: 'default' },
    { name: 'Silver', minPoints: 1000, icon: 'star', variant: 'default' },
    { name: 'Gold', minPoints: 2500, icon: 'crown', variant: 'premium' },
    { name: 'Platinum', minPoints: 5000, icon: 'diamond', variant: 'vip' }
  ];
  
  const userPoints = 3200;
  const currentTier = tiers.findLast(t => userPoints >= t.minPoints);
  const nextTier = tiers.find(t => userPoints < t.minPoints);
  
  return (
    <LoyaltyPointsCard
      points={userPoints}
      tier={currentTier.name}
      tierIcon={currentTier.icon}
      variant={currentTier.variant}
      pointsToNextTier={nextTier ? nextTier.minPoints - userPoints : 0}
      nextTier={nextTier?.name}
      currency="$"
    />
  );
}
```

## Loading State

```tsx
<LoyaltyPointsCard
  points={0}
  loading={true}
/>
```

## Custom Points Label

```tsx
// For different reward systems
<LoyaltyPointsCard
  points={850}
  pointsLabel="stars"
  tier="Rising Star"
  tierIcon="star"
/>

<LoyaltyPointsCard
  points={1200}
  pointsLabel="miles"
  tier="Frequent Flyer"
  tierIcon="plane"
/>
```

## Responsive Design

The component is fully responsive:
- Stacks content appropriately on mobile
- Adjusts text sizes and spacing
- Maintains readability across devices

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Color contrast compliance
- Screen reader friendly progress indicators
- Keyboard accessible actions

## Best Practices

1. **Clear tier progression**: Show users how close they are to the next tier
2. **Expiration warnings**: Alert users about expiring points prominently
3. **Recent activity**: Show 3-5 recent transactions for context
4. **Clear actions**: Provide obvious redemption and earning options
5. **Value display**: Show monetary value if points have cash equivalence
6. **Loading states**: Always show loading skeleton during data fetching
7. **Mobile optimization**: Ensure the card is readable on small screens
8. **Consistent branding**: Use variant colors that match your brand