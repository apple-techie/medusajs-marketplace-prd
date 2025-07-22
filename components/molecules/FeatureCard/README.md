# FeatureCard Component

A versatile feature card component for showcasing platform features, benefits, and capabilities. Includes multiple variants, feature lists, badges, and a comparison table component.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge next
```

## Usage

```tsx
import { FeatureCard, FeatureCardGrid, FeatureComparison } from '@/components/molecules/FeatureCard';

// Basic feature card
<FeatureCard
  title="Fast Delivery"
  description="Get your orders delivered within 24 hours"
  icon="truck"
/>

// With features list
<FeatureCard
  title="Premium Features"
  description="Everything you need to succeed"
  icon="crown"
  features={[
    'Advanced analytics',
    'Priority support',
    'Custom integrations'
  ]}
  action={{
    label: 'Learn More',
    href: '/features'
  }}
/>

// Feature grid
<FeatureCardGrid
  features={[
    { id: 1, title: 'Secure', description: 'Bank-level security', icon: 'shield' },
    { id: 2, title: 'Fast', description: 'Lightning quick', icon: 'zap' },
  ]}
  columns={3}
/>

// Feature comparison
<FeatureComparison
  title="Compare Plans"
  features={[
    { name: 'API Access', basic: false, pro: true, enterprise: true },
    { name: 'Storage', basic: '5GB', pro: '50GB', enterprise: 'Unlimited' },
  ]}
/>
```

## Components

### FeatureCard

The main feature card component with multiple display options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required**. Feature title |
| `description` | `string` | - | **Required**. Feature description |
| `icon` | `string` | - | Icon name to display |
| `image` | `string` | - | Image URL (replaces icon) |
| `variant` | `'default' \| 'centered' \| 'horizontal' \| 'minimal' \| 'detailed'` | `'default'` | Card variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Content alignment |
| `features` | `string[]` | - | List of feature items |
| `badge` | `string` | - | Badge text |
| `badgeVariant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Badge style |
| `action` | `{ label: string; href?: string; onClick?: () => void }` | - | Call-to-action |
| `iconColor` | `string` | - | Custom icon color class |
| `iconBackground` | `boolean` | `true` | Show icon background |
| `border` | `boolean` | `true` | Show card border |
| `shadow` | `boolean` | `false` | Show card shadow |
| `hover` | `boolean` | `true` | Enable hover effects |
| `className` | `string` | - | Container CSS classes |
| `iconClassName` | `string` | - | Icon wrapper CSS classes |
| `contentClassName` | `string` | - | Content CSS classes |
| `aria-label` | `string` | - | Accessibility label |

### FeatureCardGrid

Grid wrapper for displaying multiple feature cards.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `features` | `Array<FeatureCardProps & { id: string \| number }>` | - | **Required**. Array of features |
| `columns` | `2 \| 3 \| 4` | `3` | Number of columns |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Grid gap size |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size |
| `className` | `string` | - | Grid CSS classes |

### FeatureComparison

Comparison table for displaying feature availability across tiers.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Table title |
| `description` | `string` | - | Table description |
| `features` | `Array<{ name: string; basic?: boolean \| string; pro?: boolean \| string; enterprise?: boolean \| string }>` | - | **Required**. Feature list |
| `className` | `string` | - | Container CSS classes |

## Variants

### Default
Standard card with icon, title, and description.

```tsx
<FeatureCard
  title="24/7 Support"
  description="Our team is always here to help"
  icon="headphones"
/>
```

### Centered
Center-aligned content for emphasis.

```tsx
<FeatureCard
  title="Premium Quality"
  description="Only the best products"
  icon="gem"
  variant="centered"
/>
```

### Horizontal
Side-by-side layout for wider containers.

```tsx
<FeatureCard
  title="Free Shipping"
  description="On all orders over $50"
  icon="truck"
  variant="horizontal"
/>
```

### Minimal
Compact design with minimal styling.

```tsx
<FeatureCard
  title="Secure Checkout"
  description="SSL encrypted"
  icon="lock"
  variant="minimal"
/>
```

### Detailed
Expanded card with features list and actions.

```tsx
<FeatureCard
  title="Enterprise Plan"
  description="Everything you need to scale"
  icon="building"
  variant="detailed"
  features={[
    'Unlimited users',
    'Priority support',
    'Custom integrations',
    'Dedicated account manager'
  ]}
  action={{
    label: 'Contact Sales',
    href: '/contact'
  }}
/>
```

## Examples

### Platform Features

```tsx
function PlatformFeatures() {
  const features = [
    {
      id: 1,
      title: 'Multi-Vendor Support',
      description: 'Manage multiple suppliers from one dashboard',
      icon: 'users',
      badge: 'Core',
      badgeVariant: 'primary' as const,
    },
    {
      id: 2,
      title: 'Real-time Analytics',
      description: 'Track performance with live dashboards',
      icon: 'bar-chart',
    },
    {
      id: 3,
      title: 'Smart Routing',
      description: 'AI-powered order fulfillment',
      icon: 'map-pin',
      badge: 'New',
      badgeVariant: 'success' as const,
    },
  ];

  return <FeatureCardGrid features={features} columns={3} />;
}
```

### Security Features

```tsx
function SecurityFeatures() {
  return (
    <FeatureCard
      title="Bank-Level Security"
      description="Your data is protected with enterprise-grade security"
      icon="shield"
      variant="detailed"
      features={[
        'SSL/TLS encryption',
        'PCI DSS compliant',
        'Regular security audits',
        'Data backup & recovery',
        '99.9% uptime SLA'
      ]}
      action={{
        label: 'Learn More',
        href: '/security'
      }}
      size="lg"
    />
  );
}
```

### Pricing Comparison

```tsx
function PricingComparison() {
  const features = [
    { name: 'Products', basic: '100', pro: '1,000', enterprise: 'Unlimited' },
    { name: 'Users', basic: '1', pro: '10', enterprise: 'Unlimited' },
    { name: 'API Access', basic: false, pro: true, enterprise: true },
    { name: 'Support', basic: 'Email', pro: '24/7 Chat', enterprise: 'Dedicated' },
    { name: 'Custom Domain', basic: false, pro: true, enterprise: true },
    { name: 'Analytics', basic: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
  ];

  return (
    <FeatureComparison
      title="Choose Your Plan"
      description="Select the perfect plan for your business needs"
      features={features}
    />
  );
}
```

### Service Benefits

```tsx
function ServiceBenefits() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FeatureCard
        title="Free Shipping"
        description="On orders over $50"
        icon="truck"
        variant="minimal"
        size="sm"
      />
      
      <FeatureCard
        title="Easy Returns"
        description="30-day return policy"
        icon="refresh-cw"
        variant="minimal"
        size="sm"
      />
      
      <FeatureCard
        title="Secure Payment"
        description="SSL encrypted checkout"
        icon="credit-card"
        variant="minimal"
        size="sm"
      />
      
      <FeatureCard
        title="24/7 Support"
        description="Always here to help"
        icon="headphones"
        variant="minimal"
        size="sm"
      />
    </div>
  );
}
```

### Feature Highlights

```tsx
function FeatureHighlights() {
  return (
    <div className="space-y-6">
      <FeatureCard
        title="AI-Powered Recommendations"
        description="Personalized product suggestions based on customer behavior"
        image="https://example.com/ai-feature.jpg"
        variant="horizontal"
        size="lg"
        action={{
          label: 'See Demo',
          onClick: () => console.log('Show demo')
        }}
      />
      
      <FeatureCard
        title="Advanced Analytics Dashboard"
        description="Real-time insights into your business performance"
        image="https://example.com/analytics.jpg"
        variant="horizontal"
        size="lg"
        badge="Beta"
        badgeVariant="warning"
        action={{
          label: 'Try Beta',
          href: '/analytics-beta'
        }}
      />
    </div>
  );
}
```

## Styling

### Icon Customization

```tsx
// Custom icon color
<FeatureCard
  title="Custom Icon"
  description="With custom styling"
  icon="heart"
  iconColor="text-red-500"
/>

// No icon background
<FeatureCard
  title="Minimal Icon"
  description="Without background"
  icon="star"
  iconBackground={false}
  iconColor="text-yellow-500"
/>
```

### Card Styling

```tsx
// With shadow
<FeatureCard
  title="Elevated Card"
  description="With shadow effect"
  icon="layers"
  shadow={true}
  border={false}
/>

// No hover effect
<FeatureCard
  title="Static Card"
  description="No hover animation"
  icon="lock"
  hover={false}
/>

// Custom classes
<FeatureCard
  title="Custom Styled"
  description="With custom CSS"
  icon="palette"
  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
  contentClassName="text-white"
  iconColor="text-white"
/>
```

## Accessibility

- Semantic HTML structure
- Proper ARIA labels for screen readers
- Keyboard navigable actions
- Focus states for interactive elements
- Sufficient color contrast
- Icon-only elements have text alternatives

## Best Practices

1. **Choose appropriate variants**: Match variant to your layout and content
2. **Use consistent sizing**: Keep cards the same size within a group
3. **Meaningful icons**: Choose icons that reinforce the feature concept
4. **Clear descriptions**: Keep descriptions concise and benefit-focused
5. **Strategic badges**: Use badges sparingly for important callouts
6. **Actionable CTAs**: Make action labels clear and specific
7. **Feature lists**: Keep feature items short and scannable
8. **Comparison tables**: Order features by importance
9. **Responsive grids**: Test layouts on different screen sizes
10. **Loading states**: Show skeletons while content loads