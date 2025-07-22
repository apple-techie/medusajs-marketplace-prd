# Tabs Component

A flexible tabbed interface component for organizing content into separate views. Supports multiple visual variants, sizes, orientations, and features like icons and badges. Perfect for product details, settings pages, dashboards, and multi-step forms.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/molecules/Tabs';

// Basic tabs
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
  <TabsContent value="tab3">Content for tab 3</TabsContent>
</Tabs>

// With icons and badges
<Tabs defaultValue="products">
  <TabsList>
    <TabsTrigger value="products" icon={<Icon icon="package" />}>
      Products
    </TabsTrigger>
    <TabsTrigger value="orders" badge={<Badge>5</Badge>}>
      Orders
    </TabsTrigger>
  </TabsList>
  <TabsContent value="products">Products content</TabsContent>
  <TabsContent value="orders">Orders content</TabsContent>
</Tabs>

// Using the hook
function MyComponent() {
  const tabs = useTabs('settings');
  
  return (
    <Tabs {...tabs}>
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">Profile content</TabsContent>
      <TabsContent value="settings">Settings content</TabsContent>
    </Tabs>
  );
}
```

## Component Props

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled active tab value |
| `defaultValue` | `string` | - | Default active tab (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Callback when tab changes |
| `variant` | `'default' \| 'underline' \| 'pills' \| 'bordered'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tab size |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab layout direction |
| `className` | `string` | - | Additional CSS classes |

### TabsList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | TabsTrigger components |
| `className` | `string` | - | Additional CSS classes |

### TabsTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Unique tab identifier (required) |
| `disabled` | `boolean` | `false` | Disable tab |
| `icon` | `ReactNode` | - | Icon to display |
| `badge` | `ReactNode` | - | Badge component |
| `className` | `string` | - | Additional CSS classes |

### TabsContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Tab identifier (required) |
| `forceMount` | `boolean` | `false` | Keep content mounted when inactive |
| `className` | `string` | - | Additional CSS classes |

## Examples

### E-commerce Use Cases

#### Product Details Tabs
```tsx
function ProductDetailsTabs() {
  return (
    <Tabs defaultValue="description" variant="underline">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews" badge={<Badge size="sm">24</Badge>}>
          Reviews
        </TabsTrigger>
        <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description">
        <div className="prose">
          <h3>Product Description</h3>
          <p>Detailed product information...</p>
        </div>
      </TabsContent>
      
      <TabsContent value="specifications">
        <table className="w-full">
          <tbody>
            <tr>
              <td>Brand</td>
              <td>AudioTech Pro</td>
            </tr>
            {/* More specs */}
          </tbody>
        </table>
      </TabsContent>
      
      <TabsContent value="reviews">
        <div className="space-y-4">
          {/* Review components */}
        </div>
      </TabsContent>
      
      <TabsContent value="shipping">
        <p>Shipping and return policy information...</p>
      </TabsContent>
    </Tabs>
  );
}
```

#### Vendor Dashboard
```tsx
function VendorDashboard() {
  return (
    <Tabs defaultValue="overview" variant="pills">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="products" badge={<Badge>156</Badge>}>
          Products
        </TabsTrigger>
        <TabsTrigger value="orders" badge={<Badge variant="danger">5</Badge>}>
          Orders
        </TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <DashboardOverview />
      </TabsContent>
      
      <TabsContent value="products">
        <ProductManagement />
      </TabsContent>
      
      <TabsContent value="orders">
        <OrderManagement />
      </TabsContent>
      
      <TabsContent value="analytics">
        <AnalyticsDashboard />
      </TabsContent>
      
      <TabsContent value="settings">
        <VendorSettings />
      </TabsContent>
    </Tabs>
  );
}
```

#### Order Status Tabs
```tsx
function OrderStatusTabs() {
  const [orderCounts, setOrderCounts] = useState({
    pending: 8,
    processing: 3,
    shipped: 12,
    delivered: 45,
    cancelled: 2
  });
  
  return (
    <Tabs defaultValue="pending" variant="bordered">
      <TabsList>
        <TabsTrigger value="pending" badge={
          orderCounts.pending > 0 && <Badge variant="warning">{orderCounts.pending}</Badge>
        }>
          Pending
        </TabsTrigger>
        <TabsTrigger value="processing" badge={
          orderCounts.processing > 0 && <Badge variant="primary">{orderCounts.processing}</Badge>
        }>
          Processing
        </TabsTrigger>
        <TabsTrigger value="shipped" badge={
          orderCounts.shipped > 0 && <Badge variant="success">{orderCounts.shipped}</Badge>
        }>
          Shipped
        </TabsTrigger>
        <TabsTrigger value="delivered">
          Delivered
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled
        </TabsTrigger>
      </TabsList>
      
      {/* Tab contents with order lists */}
    </Tabs>
  );
}
```

### Advanced Examples

#### Vertical Settings Tabs
```tsx
function SettingsTabs() {
  return (
    <Tabs defaultValue="account" orientation="vertical" className="min-h-[400px]">
      <TabsList className="flex-col h-full w-48">
        <TabsTrigger value="account" className="w-full justify-start">
          <Icon icon="user" className="mr-2" />
          Account
        </TabsTrigger>
        <TabsTrigger value="password" className="w-full justify-start">
          <Icon icon="lock" className="mr-2" />
          Password
        </TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start">
          <Icon icon="bell" className="mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="billing" className="w-full justify-start">
          <Icon icon="creditCard" className="mr-2" />
          Billing
        </TabsTrigger>
      </TabsList>
      
      <div className="flex-1 pl-8">
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        {/* Other content panels */}
      </div>
    </Tabs>
  );
}
```

#### Controlled Tabs with External Controls
```tsx
function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setActiveTab('overview')}>
          Go to Overview
        </button>
        <button onClick={() => setActiveTab('analytics')}>
          Go to Analytics
        </button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">Overview content</TabsContent>
        <TabsContent value="analytics">Analytics content</TabsContent>
        <TabsContent value="reports">Reports content</TabsContent>
      </Tabs>
    </div>
  );
}
```

#### Lazy Loading with forceMount
```tsx
function LazyTabs() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Immediate</TabsTrigger>
        <TabsTrigger value="tab2">Lazy Load</TabsTrigger>
        <TabsTrigger value="tab3">Keep Mounted</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tab1">
        <p>This content renders immediately</p>
      </TabsContent>
      
      <TabsContent value="tab2">
        <ExpensiveComponent />
      </TabsContent>
      
      <TabsContent value="tab3" forceMount>
        <p>This stays mounted even when inactive</p>
      </TabsContent>
    </Tabs>
  );
}
```

### Styling Examples

#### All Variants
```tsx
// Default - Simple text tabs
<Tabs variant="default">

// Underline - With animated underline indicator
<Tabs variant="underline">

// Pills - Contained pill-style tabs
<Tabs variant="pills">

// Bordered - Connected border tabs
<Tabs variant="bordered">
```

#### Custom Styling
```tsx
<Tabs defaultValue="custom" className="custom-tabs">
  <TabsList className="bg-gray-100 p-1 rounded-lg">
    <TabsTrigger 
      value="custom" 
      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
    >
      Custom Styled
    </TabsTrigger>
  </TabsList>
  <TabsContent value="custom" className="mt-8">
    Custom content styling
  </TabsContent>
</Tabs>
```

## Accessibility

- Full keyboard navigation support
- Proper ARIA roles and attributes
- Focus indicators on all interactive elements
- Screen reader announcements for tab changes
- Disabled state handling

## Best Practices

1. **Use descriptive values** - Tab values should be meaningful identifiers
2. **Provide default value** - Always set a default active tab
3. **Consider mobile** - Use scrollable tab lists for many tabs
4. **Lazy load content** - Use forceMount sparingly for performance
5. **Show counts** - Use badges to indicate content quantity
6. **Group related content** - Only use tabs for truly related sections
7. **Maintain state** - Consider preserving tab state in URLs or storage

## Common Patterns

### Tab Router Integration
```tsx
function RoutedTabs() {
  const router = useRouter();
  const activeTab = router.query.tab || 'overview';
  
  const handleTabChange = (value: string) => {
    router.push({ query: { ...router.query, tab: value } });
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      {/* Tab content */}
    </Tabs>
  );
}
```

### Tab State Persistence
```tsx
function PersistentTabs() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'default';
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem('activeTab', value);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      {/* Tab content */}
    </Tabs>
  );
}
```

### Dynamic Tabs
```tsx
function DynamicTabs({ categories }) {
  return (
    <Tabs defaultValue={categories[0]?.id}>
      <TabsList>
        {categories.map(category => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map(category => (
        <TabsContent key={category.id} value={category.id}>
          <CategoryContent category={category} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
```