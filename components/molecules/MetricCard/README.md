# MetricCard Component

A versatile dashboard metric display card component with support for trends, sparklines, progress bars, and various display variants. Perfect for analytics dashboards, admin panels, and data visualization.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { MetricCard } from '@/components/molecules/MetricCard';

// Basic usage
<MetricCard
  title="Total Revenue"
  value="$45,678"
  icon="dollar-sign"
/>

// With trend and change
<MetricCard
  title="Monthly Sales"
  value="$12,345"
  trend="up"
  change="+15%"
  icon="trending-up"
/>

// With progress bar
<MetricCard
  title="Storage Used"
  value="75 GB"
  subtitle="of 100 GB"
  progress={{
    value: 75,
    max: 100,
    showPercentage: true
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required**. Metric title |
| `value` | `string \| number` | - | **Required**. Metric value |
| `subtitle` | `string` | - | Additional context below value |
| `description` | `string` | - | Detailed description (detailed variant) |
| `trend` | `'up' \| 'down' \| 'neutral'` | - | Trend direction |
| `change` | `string \| number` | - | Change amount |
| `changeLabel` | `string` | `'from last period'` | Change period label |
| `icon` | `string` | - | Icon name |
| `iconColor` | `string` | - | Icon color class |
| `iconBackground` | `boolean` | `true` | Show icon background |
| `variant` | `'default' \| 'compact' \| 'detailed' \| 'minimal'` | `'default'` | Display variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size |
| `badge` | `object` | - | Badge configuration |
| `badge.text` | `string` | - | Badge text |
| `badge.variant` | `string` | - | Badge variant |
| `progress` | `object` | - | Progress bar configuration |
| `progress.value` | `number` | - | Current value |
| `progress.max` | `number` | `100` | Maximum value |
| `progress.label` | `string` | - | Progress label |
| `progress.showPercentage` | `boolean` | - | Show percentage |
| `sparkline` | `number[]` | - | Data points for sparkline |
| `sparklineColor` | `string` | `'currentColor'` | Sparkline color |
| `loading` | `boolean` | `false` | Loading state |
| `href` | `string` | - | Make card a link |
| `onClick` | `() => void` | - | Click handler |
| `comparison` | `object` | - | Comparison data (detailed variant) |
| `comparison.label` | `string` | - | Comparison label |
| `comparison.value` | `string \| number` | - | Comparison value |
| `comparison.trend` | `'better' \| 'worse' \| 'same'` | - | Comparison trend |
| `footerAction` | `object` | - | Footer action configuration |
| `footerAction.label` | `string` | - | Action label |
| `footerAction.onClick` | `() => void` | - | Action handler |
| `className` | `string` | - | Container CSS classes |
| `valueClassName` | `string` | - | Value CSS classes |
| `iconClassName` | `string` | - | Icon container CSS classes |
| `aria-label` | `string` | - | Accessibility label |

## Variants

### Default
Standard metric card with icon, value, and optional trend.

```tsx
<MetricCard
  title="Total Orders"
  value="1,234"
  icon="shopping-cart"
  trend="up"
  change="+12%"
/>
```

### Compact
Condensed layout for space-constrained dashboards.

```tsx
<MetricCard
  title="Page Views"
  value="23.4K"
  variant="compact"
  icon="eye"
/>
```

### Minimal
Text-only display without icons or trends.

```tsx
<MetricCard
  title="Active Users"
  value="456"
  variant="minimal"
/>
```

### Detailed
Comprehensive variant with description, comparison, and additional features.

```tsx
<MetricCard
  title="Conversion Rate"
  value="3.45%"
  subtitle="Average"
  description="Based on 10,234 sessions in the last 30 days"
  variant="detailed"
  comparison={{
    label: "Industry average",
    value: "2.8%",
    trend: "better"
  }}
/>
```

## Common Patterns

### Revenue Metrics

```tsx
<MetricCard
  title="Monthly Revenue"
  value="$124,563"
  trend="up"
  change="+22.5%"
  icon="dollar-sign"
  badge={{ text: "Record", variant: "success" }}
/>
```

### Performance Metrics

```tsx
<MetricCard
  title="Server Response Time"
  value="124ms"
  trend="down"
  change="-15ms"
  changeLabel="improvement"
  icon="zap"
  comparison={{
    label: "Target",
    value: "200ms",
    trend: "better"
  }}
/>
```

### User Metrics

```tsx
<MetricCard
  title="Active Users"
  value="8,942"
  subtitle="currently online"
  icon="users"
  sparkline={[100, 120, 115, 130, 125, 140, 135, 150]}
/>
```

### Storage/Usage Metrics

```tsx
<MetricCard
  title="Disk Usage"
  value="75%"
  progress={{
    value: 75,
    max: 100,
    label: "Used",
    showPercentage: true
  }}
  icon="hard-drive"
/>
```

## Interactive Cards

### Clickable Card

```tsx
<MetricCard
  title="Error Rate"
  value="0.02%"
  icon="alert-triangle"
  onClick={() => navigate('/errors')}
/>
```

### Card as Link

```tsx
<MetricCard
  title="View Report"
  value="98.5%"
  subtitle="accuracy"
  icon="file-text"
  href="/reports/accuracy"
/>
```

### With Footer Action

```tsx
<MetricCard
  title="Team Members"
  value="24"
  icon="users"
  footerAction={{
    label: "Manage team",
    onClick: () => navigate('/team')
  }}
/>
```

## Dashboard Examples

### KPI Dashboard

```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <MetricCard
    title="Revenue"
    value="$45,678"
    trend="up"
    change="+12%"
    icon="dollar-sign"
  />
  <MetricCard
    title="Orders"
    value="234"
    trend="up"
    change="+18"
    icon="shopping-bag"
  />
  <MetricCard
    title="Customers"
    value="1,234"
    trend="down"
    change="-5%"
    icon="users"
  />
  <MetricCard
    title="Avg Order"
    value="$195"
    trend="up"
    change="+$15"
    icon="calculator"
  />
</div>
```

### Performance Dashboard

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <MetricCard
    title="Uptime"
    value="99.9%"
    badge={{ text: "Healthy", variant: "success" }}
    icon="server"
  />
  <MetricCard
    title="Response Time"
    value="145ms"
    sparkline={[150, 140, 155, 145, 140, 145]}
    icon="activity"
  />
  <MetricCard
    title="Error Rate"
    value="0.12%"
    trend="down"
    change="-0.03%"
    icon="alert-circle"
  />
</div>
```

## Loading States

```tsx
<MetricCard
  title="Loading..."
  value="---"
  loading
/>
```

## Custom Styling

### Custom Colors

```tsx
<MetricCard
  title="Premium Plan"
  value="$299"
  subtitle="/month"
  icon="crown"
  iconColor="text-yellow-500"
  className="bg-gradient-to-br from-yellow-50 to-orange-50"
  valueClassName="text-yellow-700"
/>
```

### Without Icon Background

```tsx
<MetricCard
  title="Critical Alert"
  value="3"
  subtitle="issues"
  icon="alert-circle"
  iconColor="text-red-600"
  iconBackground={false}
/>
```

## Real-time Updates

```tsx
const [activeUsers, setActiveUsers] = useState(234);

useEffect(() => {
  const interval = setInterval(() => {
    setActiveUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
  }, 5000);
  
  return () => clearInterval(interval);
}, []);

<MetricCard
  title="Active Sessions"
  value={activeUsers.toLocaleString()}
  subtitle="users online"
  icon="activity"
  badge={{ text: "Live", variant: "secondary" }}
/>
```

## Accessibility

- Semantic HTML structure
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliant
- Focus indicators

## Best Practices

1. **Icons**: Choose descriptive icons that represent the metric
2. **Trends**: Use colors consistently (green for positive, red for negative)
3. **Values**: Format numbers appropriately (currency, percentages, etc.)
4. **Loading**: Show loading state during data fetches
5. **Interactivity**: Use cursor pointer for clickable cards
6. **Responsive**: Test grid layouts on different screen sizes
7. **Performance**: Memoize sparkline calculations for large datasets
8. **Accessibility**: Always provide meaningful titles and labels