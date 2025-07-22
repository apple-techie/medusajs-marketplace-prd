# Vendor Dashboard Specifications

## Overview

Each vendor type has a customized dashboard interface designed for their specific needs and workflows. All dashboards share a common design language while providing role-specific functionality. The implementation follows a hybrid approach using Mercur-inspired vendor management patterns adapted for our three distinct vendor types (Shop, Brand, Distributor).

## Shop Dashboard

### Overview
The shop dashboard is designed for affiliate partners who earn commissions by referring customers to the marketplace. It focuses on sales tracking, commission earnings, and marketing tools.

### Layout Structure

```tsx
// apps/vendor-portal/app/shop/layout.tsx
// Built on Mercur vendor dashboard patterns, adapted for shop partners
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar - Using shared vendor navigation component */}
      <VendorNavigation vendorType="shop">
        <NavLink href="/shop">Overview</NavLink>
        <NavLink href="/shop/sales">Sales</NavLink>
        <NavLink href="/shop/marketing">Marketing</NavLink>
        <NavLink href="/shop/analytics">Analytics</NavLink>
        <NavLink href="/shop/settings">Settings</NavLink>
      </VendorNavigation>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
```

### Key Features

#### 1. Commission Tracking
- Real-time commission earnings
- Tier progress visualization
- Historical earnings data
- Payout schedule and history

#### 2. Marketing Tools
- Referral link generator with UTM tracking
- QR code generation
- Marketing material downloads
- Campaign performance tracking

#### 3. Analytics Dashboard
- Sales performance metrics
- Conversion rate tracking
- Customer lifetime value
- Top performing products

### Shop Dashboard Components

```tsx
// app/shop/page.tsx
export default function ShopDashboard() {
  const { shop } = useShop();
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {shop.name}!</h1>
          <p className="text-muted-foreground">
            Here's your performance overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getTierVariant(shop.tier)} className="text-lg px-3 py-1">
            {shop.tier} Tier - {shop.commissionRate}%
          </Badge>
        </div>
      </div>
      
      {/* Tier Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Progress</CardTitle>
          <CardDescription>
            ${(shop.nextTierThreshold - shop.monthlySales).toLocaleString()} more in sales to reach {shop.nextTier} tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress 
              value={(shop.monthlySales / shop.nextTierThreshold) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-sm">
              <span>${shop.monthlySales.toLocaleString()}</span>
              <span>${shop.nextTierThreshold.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Sales"
          value={`$${shop.todaySales.toLocaleString()}`}
          subtitle={`${shop.todayOrders} orders`}
          icon={DollarSign}
        />
        <MetricCard
          title="Today's Commission"
          value={`$${shop.todayCommission.toLocaleString()}`}
          subtitle={`${shop.commissionRate}% rate`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Monthly Sales"
          value={`$${shop.monthlySales.toLocaleString()}`}
          subtitle={`${shop.monthlyOrders} orders`}
          icon={Calendar}
        />
        <MetricCard
          title="Pending Payout"
          value={`$${shop.pendingPayout.toLocaleString()}`}
          subtitle="Pays out weekly"
          icon={Wallet}
        />
      </div>
    </div>
  );
}
```

## Brand Dashboard

### Overview
The brand dashboard is designed for product manufacturers and brand owners who list their products on the marketplace. It focuses on inventory management, sales analytics, and brand performance.

### Layout Structure

```tsx
// app/brand/layout.tsx
export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <Link href="/brand" className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <span className="font-semibold">Brand Portal</span>
          </Link>
        </div>
        <nav className="px-4 space-y-1">
          <SidebarLink href="/brand" icon={LayoutDashboard}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/brand/products" icon={Package}>
            Products
          </SidebarLink>
          <SidebarLink href="/brand/inventory" icon={Archive}>
            Inventory
          </SidebarLink>
          <SidebarLink href="/brand/orders" icon={ShoppingCart}>
            Orders
          </SidebarLink>
          <SidebarLink href="/brand/analytics" icon={BarChart}>
            Analytics
          </SidebarLink>
          <SidebarLink href="/brand/finance" icon={DollarSign}>
            Finance
          </SidebarLink>
          <SidebarLink href="/brand/settings" icon={Settings}>
            Settings
          </SidebarLink>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
          <BrandHeader />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Key Features

#### 1. Product Management
- Bulk product upload and editing
- Inventory tracking across locations
- Pricing rules and promotions
- Product performance analytics

#### 2. Order Management
- Real-time order notifications
- Bulk order processing
- Shipping label generation
- Return management

#### 3. Financial Dashboard
- Revenue tracking
- Platform fee breakdown
- Payout history
- Financial reports

### Product Management Interface

```tsx
// app/brand/products/page.tsx
export default function ProductManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-muted-foreground">
            Manage your product listings and inventory
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              className="max-w-sm"
            />
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="e-liquids">E-Liquids</SelectItem>
                <SelectItem value="devices">Devices</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

## Distributor Dashboard

### Overview
The distributor dashboard is designed for warehouse and fulfillment partners who handle inventory storage and order fulfillment. It focuses on inventory management, order processing, and logistics.

### Layout Structure

```tsx
// app/distributor/layout.tsx
export default function DistributorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <Link href="/distributor" className="flex items-center gap-2">
            <Truck className="h-6 w-6" />
            <span className="font-semibold">Distributor Hub</span>
          </Link>
        </div>
        <nav className="px-4 space-y-1">
          <SidebarLink href="/distributor" icon={LayoutDashboard}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/distributor/fulfillment" icon={Package}>
            Fulfillment Queue
          </SidebarLink>
          <SidebarLink href="/distributor/inventory" icon={Archive}>
            Inventory
          </SidebarLink>
          <SidebarLink href="/distributor/receiving" icon={PackageCheck}>
            Receiving
          </SidebarLink>
          <SidebarLink href="/distributor/drivers" icon={Car}>
            Driver Pickup
          </SidebarLink>
          <SidebarLink href="/distributor/analytics" icon={BarChart}>
            Analytics
          </SidebarLink>
          <SidebarLink href="/distributor/settings" icon={Settings}>
            Settings
          </SidebarLink>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
          <DistributorHeader />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Key Features

#### 1. Fulfillment Queue
- Real-time order queue management
- Priority-based order processing
- Batch picking optimization
- Driver assignment

#### 2. Inventory Management
- Multi-location inventory tracking
- Low stock alerts
- Receiving and putaway
- Cycle counting

#### 3. Performance Metrics
- Fulfillment rate tracking
- Processing time analytics
- Staff productivity metrics
- SLA compliance monitoring

### Fulfillment Queue Interface

```tsx
// app/distributor/fulfillment/page.tsx
export default function FulfillmentQueue() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fulfillment Queue</h1>
        <p className="text-muted-foreground">
          Process and manage outgoing orders
        </p>
      </div>
      
      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">45</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">Ready for Pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Completed Today</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Fulfillment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Queue</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <FulfillmentTable />
        </CardContent>
      </Card>
    </div>
  );
}
```

## Driver Dashboard

### Overview
The driver dashboard is a mobile-first interface designed for delivery drivers. It focuses on delivery management, navigation, and earnings tracking.

### Mobile Layout

```tsx
// app/driver/layout.tsx
export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Status Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-primary text-primary-foreground z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isOnline ? "bg-green-400" : "bg-gray-400"
            )} />
            <span className="font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground"
            onClick={toggleStatus}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-14">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t">
        <div className="grid grid-cols-4 h-full">
          <NavButton href="/driver" icon={Home} label="Home" />
          <NavButton href="/driver/deliveries" icon={Package} label="Deliveries" />
          <NavButton href="/driver/earnings" icon={DollarSign} label="Earnings" />
          <NavButton href="/driver/profile" icon={User} label="Profile" />
        </div>
      </nav>
    </div>
  );
}
```

### Key Features

#### 1. Delivery Management
- Available delivery notifications
- Route optimization
- Proof of delivery capture
- Customer communication

#### 2. Earnings Tracking
- Real-time earnings display
- Daily/weekly/monthly summaries
- Tip tracking
- Payout history

#### 3. Performance Metrics
- Acceptance rate
- On-time delivery rate
- Customer ratings
- Distance traveled

### Active Delivery Interface

```tsx
// components/driver/active-delivery-card.tsx
export function ActiveDeliveryCard({ delivery }: { delivery: Delivery }) {
  return (
    <div className="space-y-4">
      {/* Progress Steps */}
      <div className="flex justify-between mb-6">
        {['Pickup', 'In Transit', 'Deliver', 'Complete'].map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex flex-col items-center",
              index <= delivery.currentStep && "text-primary"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1",
              index <= delivery.currentStep ? "border-primary bg-primary text-primary-foreground" : "border-muted"
            )}>
              {index + 1}
            </div>
            <span className="text-xs">{step}</span>
          </div>
        ))}
      </div>
      
      {/* Current Task */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium mb-2">
          {delivery.currentStep === 0 ? 'Pickup Location' : 'Delivery Address'}
        </h4>
        <p className="text-sm mb-3">{delivery.currentAddress}</p>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={openMaps}>
            <Navigation className="h-4 w-4 mr-2" />
            Navigate
          </Button>
          <Button variant="outline" size="icon" onClick={callContact}>
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Delivery Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order #</span>
          <span className="font-medium">{delivery.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items</span>
          <span className="font-medium">{delivery.itemCount} packages</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Distance</span>
          <span className="font-medium">{delivery.totalDistance} miles</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Earnings</span>
          <span className="font-medium text-green-600">${delivery.earnings}</span>
        </div>
      </div>
      
      {/* Action Button */}
      <Button className="w-full" size="lg" onClick={handleNextStep}>
        {delivery.currentStep === 0 && 'Confirm Pickup'}
        {delivery.currentStep === 1 && 'Start Delivery'}
        {delivery.currentStep === 2 && 'Complete Delivery'}
      </Button>
    </div>
  );
}
```

## Common Dashboard Components

### Metric Card Component

```tsx
// components/dashboard/metric-card.tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'warning' | 'success' | 'danger';
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  subtitle,
  icon: Icon,
  variant = 'default',
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                trend === 'up' ? "text-green-600" : "text-red-600"
              )}>
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {change}
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn(
              "p-3 rounded-lg",
              variant === 'warning' && "bg-yellow-100",
              variant === 'success' && "bg-green-100",
              variant === 'danger' && "bg-red-100",
              variant === 'default' && "bg-muted"
            )}>
              <Icon className={cn(
                "h-6 w-6",
                variant === 'warning' && "text-yellow-600",
                variant === 'success' && "text-green-600",
                variant === 'danger' && "text-red-600",
                variant === 'default' && "text-muted-foreground"
              )} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Navigation Guards

```typescript
// hooks/use-vendor-auth.ts
export function useVendorAuth(requiredType?: VendorType) {
  const router = useRouter();
  const { user, vendor, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (!user || !vendor) {
        router.push('/login');
      } else if (requiredType && vendor.type !== requiredType) {
        router.push('/unauthorized');
      }
    }
  }, [user, vendor, isLoading, requiredType, router]);
  
  return { user, vendor, isLoading };
}
```

## Performance Optimizations

### Dashboard Data Loading

```typescript
// hooks/use-dashboard-data.ts
export function useDashboardData(vendorType: VendorType) {
  const queryClient = useQueryClient();
  
  // Prefetch critical data
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['dashboard', vendorType, 'metrics'],
      queryFn: () => fetchDashboardMetrics(vendorType),
    });
  }, [vendorType]);
  
  // Real-time updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
    
    ws.on('metrics:update', (data) => {
      queryClient.setQueryData(['dashboard', vendorType, 'metrics'], data);
    });
    
    return () => ws.close();
  }, [vendorType]);
}
```

### Mobile Optimizations

```typescript
// components/dashboard/responsive-table.tsx
export function ResponsiveTable({ data, columns }: TableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{column.label}</span>
                  <span className="font-medium">{item[column.key]}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return <DataTable columns={columns} data={data} />;
}
```
