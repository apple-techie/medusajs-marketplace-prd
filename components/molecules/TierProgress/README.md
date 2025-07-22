# TierProgress Component

A commission tier progress display component for vendor dashboards. Shows current tier status, revenue progress, and path to next tier with visual progress indicators.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { TierProgress, Tier } from '@/components/molecules/TierProgress';

// Basic usage
<TierProgress
  currentTier={{
    id: 'gold',
    name: 'Gold',
    minRevenue: 10000,
    commissionRate: 20
  }}
  nextTier={{
    id: 'platinum',
    name: 'Platinum',
    minRevenue: 25000,
    commissionRate: 25
  }}
  currentRevenue={15000}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentTier` | `Tier` | - | **Required**. Current tier information |
| `nextTier` | `Tier` | - | Next tier information |
| `tiers` | `Tier[]` | `[]` | All available tiers |
| `currentRevenue` | `number` | - | **Required**. Current revenue amount |
| `period` | `string` | `'This month'` | Time period label |
| `showAllTiers` | `boolean` | `false` | Show all tier options |
| `showBenefits` | `boolean` | `true` | Show tier benefits |
| `showProjection` | `boolean` | `false` | Show revenue projection |
| `projectedRevenue` | `number` | - | Projected revenue amount |
| `onTierClick` | `(tier: Tier) => void` | - | Tier click handler |
| `onLearnMore` | `() => void` | - | Learn more click handler |
| `loading` | `boolean` | `false` | Loading state |
| `currency` | `string` | `'$'` | Currency symbol |
| `variant` | `'default' \| 'compact' \| 'detailed'` | `'default'` | Display variant |
| `status` | `'active' \| 'achieved' \| 'locked'` | `'active'` | Visual status |
| `className` | `string` | - | Additional CSS classes |

### Tier Type

```tsx
interface Tier {
  id: string;
  name: string;
  minRevenue: number;
  maxRevenue?: number;
  commissionRate: number;
  benefits?: string[];
  icon?: string;
  color?: string;
}
```

## Common Patterns

### Basic Progress Display

```tsx
<TierProgress
  currentTier={{
    id: 'silver',
    name: 'Silver',
    minRevenue: 5000,
    commissionRate: 18
  }}
  nextTier={{
    id: 'gold',
    name: 'Gold',
    minRevenue: 10000,
    commissionRate: 20
  }}
  currentRevenue={7500}
/>
```

### With Period Label

```tsx
<TierProgress
  currentTier={currentTier}
  nextTier={nextTier}
  currentRevenue={15000}
  period="November 2024"
/>
```

### With Revenue Projection

```tsx
<TierProgress
  currentTier={goldTier}
  nextTier={platinumTier}
  currentRevenue={20000}
  showProjection
  projectedRevenue={28000}
/>
// Shows if projection reaches next tier
```

### Detailed Variant with Benefits

```tsx
<TierProgress
  currentTier={{
    id: 'gold',
    name: 'Gold',
    minRevenue: 10000,
    commissionRate: 20,
    benefits: [
      'Priority support',
      'Featured listings',
      'Weekly payouts'
    ]
  }}
  nextTier={platinumTier}
  currentRevenue={15000}
  variant="detailed"
  showBenefits
/>
```

### With All Tiers Display

```tsx
const tiers: Tier[] = [
  { id: 'bronze', name: 'Bronze', minRevenue: 0, commissionRate: 15 },
  { id: 'silver', name: 'Silver', minRevenue: 5000, commissionRate: 18 },
  { id: 'gold', name: 'Gold', minRevenue: 10000, commissionRate: 20 },
  { id: 'platinum', name: 'Platinum', minRevenue: 25000, commissionRate: 25 }
];

<TierProgress
  currentTier={tiers[2]}
  nextTier={tiers[3]}
  currentRevenue={15000}
  tiers={tiers}
  variant="detailed"
  showAllTiers
  onTierClick={(tier) => showTierDetails(tier)}
/>
```

## Variants

### Default

```tsx
<TierProgress
  currentTier={currentTier}
  nextTier={nextTier}
  currentRevenue={15000}
/>
// Shows revenue, current tier, and progress bar
```

### Compact

```tsx
<TierProgress
  currentTier={currentTier}
  nextTier={nextTier}
  currentRevenue={15000}
  variant="compact"
/>
// Minimal display with tier and progress
```

### Detailed

```tsx
<TierProgress
  currentTier={currentTier}
  nextTier={nextTier}
  currentRevenue={15000}
  variant="detailed"
  showBenefits
  showAllTiers
/>
// Full display with benefits and all tiers
```

## Vendor Dashboard Integration

```tsx
function VendorDashboard() {
  const { vendorData, loading } = useVendorData();
  
  return (
    <TierProgress
      currentTier={vendorData.currentTier}
      nextTier={vendorData.nextTier}
      tiers={vendorData.allTiers}
      currentRevenue={vendorData.monthlyRevenue}
      period={`${currentMonth} ${currentYear}`}
      variant="detailed"
      showAllTiers
      showBenefits
      showProjection
      projectedRevenue={vendorData.projectedRevenue}
      loading={loading}
      onLearnMore={() => openTierGuide()}
      onTierClick={(tier) => showTierRequirements(tier)}
    />
  );
}
```

## Interactive Example

```tsx
function InteractiveTierProgress() {
  const [revenue, setRevenue] = useState(15000);
  
  const tiers = [
    { id: 'bronze', name: 'Bronze', minRevenue: 0, commissionRate: 15 },
    { id: 'silver', name: 'Silver', minRevenue: 5000, commissionRate: 18 },
    { id: 'gold', name: 'Gold', minRevenue: 10000, commissionRate: 20 },
    { id: 'platinum', name: 'Platinum', minRevenue: 25000, commissionRate: 25 }
  ];
  
  const getCurrentTier = (rev: number) => {
    return tiers.findLast(tier => rev >= tier.minRevenue) || tiers[0];
  };
  
  const getNextTier = (current: Tier) => {
    const index = tiers.findIndex(t => t.id === current.id);
    return index < tiers.length - 1 ? tiers[index + 1] : undefined;
  };
  
  const currentTier = getCurrentTier(revenue);
  const nextTier = getNextTier(currentTier);
  
  return (
    <div className="space-y-4">
      <input
        type="range"
        min="0"
        max="50000"
        value={revenue}
        onChange={(e) => setRevenue(Number(e.target.value))}
        className="w-full"
      />
      
      <TierProgress
        currentTier={currentTier}
        nextTier={nextTier}
        currentRevenue={revenue}
        tiers={tiers}
        variant="detailed"
        showAllTiers
      />
    </div>
  );
}
```

## Tier System Implementation

```tsx
function CommissionTierSystem() {
  const tiers: Tier[] = [
    {
      id: 'bronze',
      name: 'Bronze Partner',
      minRevenue: 0,
      maxRevenue: 5000,
      commissionRate: 15,
      benefits: ['Basic dashboard', 'Monthly payouts'],
      icon: 'shield',
      color: 'text-orange-600'
    },
    {
      id: 'silver',
      name: 'Silver Partner',
      minRevenue: 5000,
      maxRevenue: 10000,
      commissionRate: 18,
      benefits: ['Enhanced analytics', 'Bi-weekly payouts', 'Priority support'],
      icon: 'medal',
      color: 'text-gray-500'
    },
    {
      id: 'gold',
      name: 'Gold Partner',
      minRevenue: 10000,
      maxRevenue: 25000,
      commissionRate: 20,
      benefits: ['Advanced analytics', 'Weekly payouts', 'Dedicated manager'],
      icon: 'star',
      color: 'text-yellow-500'
    },
    {
      id: 'platinum',
      name: 'Platinum Partner',
      minRevenue: 25000,
      commissionRate: 25,
      benefits: ['Real-time analytics', 'Daily payouts', 'VIP support', 'API access'],
      icon: 'crown',
      color: 'text-purple-600'
    }
  ];
  
  return (
    <TierProgress
      currentTier={vendorTier}
      nextTier={nextVendorTier}
      tiers={tiers}
      currentRevenue={monthlyRevenue}
      variant="detailed"
      showAllTiers
      showBenefits
    />
  );
}
```

## Status Variations

```tsx
// Active tier (default)
<TierProgress
  currentTier={goldTier}
  nextTier={platinumTier}
  currentRevenue={15000}
  status="active"
/>

// Achieved tier
<TierProgress
  currentTier={platinumTier}
  currentRevenue={30000}
  status="achieved"
  variant="compact"
/>

// Locked tier
<TierProgress
  currentTier={bronzeTier}
  nextTier={silverTier}
  currentRevenue={1000}
  status="locked"
  variant="compact"
/>
```

## Custom Icons and Colors

```tsx
const customTiers: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    minRevenue: 0,
    commissionRate: 10,
    icon: 'rocket',
    color: 'text-blue-600'
  },
  {
    id: 'growth',
    name: 'Growth',
    minRevenue: 10000,
    commissionRate: 15,
    icon: 'trending-up',
    color: 'text-green-600'
  },
  {
    id: 'scale',
    name: 'Scale',
    minRevenue: 50000,
    commissionRate: 20,
    icon: 'zap',
    color: 'text-purple-600'
  }
];
```

## Loading State

```tsx
<TierProgress
  currentTier={defaultTier}
  currentRevenue={0}
  loading={true}
  variant="detailed"
/>
```

## Different Currencies

```tsx
// US Dollars
<TierProgress
  currentTier={currentTier}
  nextTier={nextTier}
  currentRevenue={15000}
  currency="$"
/>

// Euros
<TierProgress
  currentTier={currentTier}
  nextTier={nextTier}
  currentRevenue={15000}
  currency="€"
/>
```

## Responsive Design

The component is fully responsive:
- Adapts layout for mobile screens
- Maintains readability at all sizes
- Touch-friendly interactive elements

## Accessibility

- Semantic HTML structure
- Progress bar with ARIA attributes
- Keyboard accessible tier selection
- Screen reader friendly status indicators
- Color contrast compliance

## Best Practices

1. **Clear progression**: Show clear path to next tier
2. **Benefits display**: Highlight what vendors gain at each tier
3. **Real-time updates**: Keep revenue data current
4. **Projections**: Show projected earnings to motivate
5. **Visual hierarchy**: Make current status prominent
6. **Action prompts**: Guide vendors on how to advance
7. **Loading states**: Always show skeleton during data fetch
8. **Mobile optimization**: Ensure readability on small screens