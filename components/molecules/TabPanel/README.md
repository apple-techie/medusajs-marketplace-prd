# TabPanel Component

A versatile tab panel component with multiple variants, keyboard navigation, and support for icons and badges. Perfect for organizing content into accessible tabbed interfaces.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { TabPanel } from '@/components/molecules/TabPanel';

// Basic usage
<TabPanel
  tabs={[
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Content for tab 1</div>
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Content for tab 2</div>
    }
  ]}
/>

// With icons and badges
<TabPanel
  tabs={[
    {
      id: 'overview',
      label: 'Overview',
      icon: 'file-text',
      content: <ProductOverview />
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: 'star',
      badge: 42,
      content: <ProductReviews />
    }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | - | **Required**. Array of tab configurations |
| `defaultTab` | `string` | - | Initial active tab ID |
| `activeTab` | `string` | - | Controlled active tab ID |
| `onChange` | `(tabId: string) => void` | - | Tab change handler |
| `variant` | `'default' \| 'pills' \| 'underline' \| 'boxed'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tab size |
| `fullWidth` | `boolean` | `false` | Full width tabs |
| `lazy` | `boolean` | `false` | Lazy load tab content |
| `keyboard` | `boolean` | `true` | Enable keyboard navigation |
| `autoFocus` | `boolean` | `false` | Auto focus active tab |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab orientation |
| `className` | `string` | - | Container CSS classes |
| `tabClassName` | `string` | - | Tab list CSS classes |
| `contentClassName` | `string` | - | Content area CSS classes |
| `aria-label` | `string` | - | Custom ARIA label |

### Tab Type

```tsx
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}
```

## Variants

### Default
Classic tabs with bottom border and active indicator:
```tsx
<TabPanel
  variant="default"
  tabs={tabs}
/>
```

### Pills
Rounded pill-style tabs:
```tsx
<TabPanel
  variant="pills"
  tabs={tabs}
/>
```

### Underline
Minimal tabs with underline indicator:
```tsx
<TabPanel
  variant="underline"
  tabs={tabs}
/>
```

### Boxed
Tabs in a contained box with background:
```tsx
<TabPanel
  variant="boxed"
  tabs={tabs}
/>
```

## Common Patterns

### Product Page Tabs

```tsx
<TabPanel
  variant="underline"
  tabs={[
    {
      id: 'description',
      label: 'Description',
      content: <ProductDescription />
    },
    {
      id: 'specs',
      label: 'Specifications',
      icon: 'list',
      content: <ProductSpecs />
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: 'star',
      badge: reviewCount,
      content: <ProductReviews />
    },
    {
      id: 'qa',
      label: 'Q&A',
      icon: 'message-circle',
      badge: questionCount,
      content: <ProductQA />
    }
  ]}
/>
```

### Settings Page (Vertical)

```tsx
<TabPanel
  variant="boxed"
  orientation="vertical"
  tabs={[
    {
      id: 'general',
      label: 'General',
      icon: 'settings',
      content: <GeneralSettings />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'bell',
      badge: 3,
      content: <NotificationSettings />
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: 'shield',
      content: <PrivacySettings />
    }
  ]}
/>
```

### Category Filters

```tsx
<TabPanel
  variant="pills"
  fullWidth
  tabs={[
    {
      id: 'all',
      label: 'All Products',
      badge: totalCount,
      content: <AllProducts />
    },
    {
      id: 'electronics',
      label: 'Electronics',
      badge: electronicsCount,
      content: <ElectronicsProducts />
    },
    {
      id: 'clothing',
      label: 'Clothing',
      badge: clothingCount,
      content: <ClothingProducts />
    }
  ]}
/>
```

### Controlled Tabs

```tsx
function ControlledExample() {
  const [activeTab, setActiveTab] = useState('tab1');
  
  return (
    <>
      <TabPanel
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={tabs}
      />
      <button onClick={() => setActiveTab('tab2')}>
        Go to Tab 2
      </button>
    </>
  );
}
```

### Lazy Loading

```tsx
<TabPanel
  lazy
  tabs={[
    {
      id: 'overview',
      label: 'Overview',
      content: <OverviewContent />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: <ExpensiveAnalyticsComponent />
    },
    {
      id: 'history',
      label: 'History',
      content: <LargeHistoryTable />
    }
  ]}
/>
```

### With Disabled Tabs

```tsx
<TabPanel
  tabs={[
    {
      id: 'active',
      label: 'Active Feature',
      content: <ActiveContent />
    },
    {
      id: 'beta',
      label: 'Beta Feature',
      badge: 'Beta',
      disabled: true,
      content: <BetaContent />
    },
    {
      id: 'coming',
      label: 'Coming Soon',
      disabled: true,
      content: null
    }
  ]}
/>
```

## Keyboard Navigation

When `keyboard` prop is `true` (default), the following keys are supported:

- **Arrow Keys**: Navigate between tabs (Left/Right for horizontal, Up/Down for vertical)
- **Home**: Go to first enabled tab
- **End**: Go to last enabled tab
- **Tab**: Move focus out of tab list

## Sizes

```tsx
// Small tabs
<TabPanel size="sm" tabs={tabs} />

// Medium tabs (default)
<TabPanel size="md" tabs={tabs} />

// Large tabs
<TabPanel size="lg" tabs={tabs} />
```

## Styling

### Custom Classes

```tsx
<TabPanel
  tabs={tabs}
  className="my-custom-container"
  tabClassName="my-custom-tabs"
  contentClassName="my-custom-content"
/>
```

### Full Width Tabs

```tsx
<TabPanel
  fullWidth
  tabs={tabs}
/>
```

## Accessibility

- Full keyboard navigation support
- Proper ARIA attributes (`role`, `aria-selected`, `aria-controls`, etc.)
- Focus management
- Screen reader friendly
- Disabled state support
- Automatic tab indexing

## Best Practices

1. **Tab IDs**: Use unique, descriptive IDs for each tab
2. **Content**: Keep tab content focused and relevant
3. **Labels**: Use clear, concise tab labels
4. **Icons**: Use icons to enhance recognition, not replace text
5. **Badges**: Use badges for counts or status indicators
6. **Lazy Loading**: Enable for tabs with heavy content
7. **Default Tab**: Set a sensible default active tab
8. **Keyboard**: Keep keyboard navigation enabled for accessibility