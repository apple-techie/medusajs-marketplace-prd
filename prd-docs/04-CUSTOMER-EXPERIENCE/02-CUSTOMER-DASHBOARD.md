# Customer Dashboard Specifications

## Table of Contents
1. [Overview](#overview)
2. [Dashboard Layout](#dashboard-layout)
3. [Account Management](#account-management)
4. [Order Tracking](#order-tracking)
5. [Loyalty Points System](#loyalty-points-system)
6. [Preferences Management](#preferences-management)
7. [Implementation Details](#implementation-details)

---

## 1. Overview

The customer dashboard provides a personalized interface for shoppers to manage their accounts, track orders, manage loyalty points, and customize their shopping experience.

### Key Features
- Account profile management
- Order history and tracking
- Loyalty points and rewards
- Saved addresses and payment methods
- Wishlist and favorites
- Preferences and notifications
- Reorder functionality

### Design Principles
- Mobile-first responsive design
- Intuitive navigation
- Quick access to key actions
- Personalized experience
- Accessibility compliance

---

## 2. Dashboard Layout

### 2.1 Main Layout Structure

```tsx
// app/account/layout.tsx
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Main Navigation */}
      <MainNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* User Profile Summary */}
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                {/* Navigation Menu */}
                <nav className="space-y-1">
                  <SidebarLink href="/account" icon={User}>
                    My Account
                  </SidebarLink>
                  <SidebarLink href="/account/orders" icon={Package}>
                    Orders
                  </SidebarLink>
                  <SidebarLink href="/account/loyalty" icon={Star}>
                    Loyalty Points
                  </SidebarLink>
                  <SidebarLink href="/account/addresses" icon={MapPin}>
                    Addresses
                  </SidebarLink>
                  <SidebarLink href="/account/payment" icon={CreditCard}>
                    Payment Methods
                  </SidebarLink>
                  <SidebarLink href="/account/wishlist" icon={Heart}>
                    Wishlist
                  </SidebarLink>
                  <SidebarLink href="/account/preferences" icon={Settings}>
                    Preferences
                  </SidebarLink>
                </nav>
              </CardContent>
            </Card>
          </aside>
          
          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
```

### 2.2 Dashboard Home Page

```tsx
// app/account/page.tsx
export default function CustomerDashboard() {
  const { customer } = useCustomer();
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">
          Manage your orders and account settings
        </p>
      </div>
      
      {/* Loyalty Points Card */}
      <LoyaltyPointsCard customer={customer} />
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActionCard
          title="Reorder Favorites"
          description="Quick reorder your favorite items"
          icon={Repeat}
          href="/account/reorder"
        />
        <QuickActionCard
          title="Track Orders"
          description={`${customer.activeOrders} active orders`}
          icon={Truck}
          href="/account/orders?status=active"
        />
      </div>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchases</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/account/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <RecentOrdersList orders={customer.recentOrders} />
        </CardContent>
      </Card>
      
      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Based on your purchase history</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductRecommendations customerId={customer.id} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 3. Account Management

### 3.1 Profile Management

```tsx
// app/account/profile/page.tsx
export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Profile Information</CardTitle>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date of Birth</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
```

### 3.2 Address Management

```tsx
// app/account/addresses/page.tsx
export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress } = useAddresses();
  const [showAddForm, setShowAddForm] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Saved Addresses</h2>
          <p className="text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>
      
      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={() => handleEdit(address)}
            onDelete={() => handleDelete(address.id)}
            onSetDefault={() => handleSetDefault(address.id)}
          />
        ))}
      </div>
      
      {/* Add/Edit Address Dialog */}
      <AddressFormDialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
```

---

## 4. Order Tracking

### 4.1 Orders List Page

```tsx
// app/account/orders/page.tsx
export default function OrdersPage() {
  const [filter, setFilter] = useState('all');
  const { orders, loading } = useOrders({ filter });
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order History</h2>
        <p className="text-muted-foreground">
          Track and manage your orders
        </p>
      </div>
      
      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
```

### 4.2 Order Detail Page

```tsx
// app/account/orders/[orderId]/page.tsx
export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { order, loading } = useOrder(params.orderId);
  
  if (loading) return <OrderDetailSkeleton />;
  if (!order) return <OrderNotFound />;
  
  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Order #{order.displayId}</h2>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={getOrderStatusVariant(order.status)}>
          {order.status}
        </Badge>
      </div>
      
      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline order={order} />
        </CardContent>
      </Card>
      
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderItemsList items={order.items} />
        </CardContent>
      </Card>
      
      {/* Delivery Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressDisplay address={order.shippingAddress} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodDisplay payment={order.payment} />
          </CardContent>
        </Card>
      </div>
      
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderSummary order={order} />
        </CardContent>
      </Card>
      
      {/* Actions */}
      <div className="flex gap-2">
        {order.status === 'delivered' && (
          <Button variant="outline">
            <Repeat className="h-4 w-4 mr-2" />
            Reorder
          </Button>
        )}
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
      </div>
    </div>
  );
}
```

---

## 5. Loyalty Points System

### 5.1 Loyalty Dashboard

```tsx
// app/account/loyalty/page.tsx
export default function LoyaltyPage() {
  const { loyalty } = useLoyalty();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Loyalty Points</h2>
        <p className="text-muted-foreground">
          Earn points and unlock exclusive rewards
        </p>
      </div>
      
      {/* Points Overview */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Available Points</p>
              <div className="text-4xl font-bold">
                {loyalty.availablePoints.toLocaleString()}
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm opacity-90">
                  {loyalty.tierName} Member
                </p>
                <Progress
                  value={(loyalty.pointsToNextTier / loyalty.nextTierThreshold) * 100}
                  className="h-2 bg-white/20"
                />
                <p className="text-xs opacity-75">
                  {loyalty.pointsToNextTier} points to {loyalty.nextTier}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Lifetime Points</p>
              <p className="text-2xl font-semibold">
                {loyalty.lifetimePoints.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
          <CardDescription>Redeem your points for exclusive benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <RewardsList
            rewards={loyalty.availableRewards}
            points={loyalty.availablePoints}
            onRedeem={handleRedeemReward}
          />
        </CardContent>
      </Card>
      
      {/* Points History */}
      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
        <CardContent>
          <PointsHistoryTable history={loyalty.history} />
        </CardContent>
      </Card>
      
      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Benefits</CardTitle>
          <CardDescription>Unlock more benefits as you progress</CardDescription>
        </CardHeader>
        <CardContent>
          <TierBenefitsList
            tiers={loyalty.tiers}
            currentTier={loyalty.tierName}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

### 5.2 Loyalty Components

```tsx
// components/loyalty/rewards-list.tsx
export function RewardsList({ rewards, points, onRedeem }: RewardsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rewards.map((reward) => (
        <Card key={reward.id} className="relative">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{reward.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {reward.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold">
                    {reward.pointsCost} pts
                  </span>
                  <Button
                    size="sm"
                    disabled={points < reward.pointsCost}
                    onClick={() => onRedeem(reward)}
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## 6. Preferences Management

### 6.1 Preferences Page

```tsx
// app/account/preferences/page.tsx
export default function PreferencesPage() {
  const { preferences, updatePreferences } = usePreferences();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Preferences</h2>
        <p className="text-muted-foreground">
          Customize your shopping experience
        </p>
      </div>
      
      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
          <CardDescription>
            Choose how you'd like to hear from us
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PreferenceToggle
            label="Email Notifications"
            description="Receive order updates and promotions via email"
            checked={preferences.emailNotifications}
            onCheckedChange={(checked) => 
              updatePreferences({ emailNotifications: checked })
            }
          />
          <PreferenceToggle
            label="SMS Notifications"
            description="Get order updates via text message"
            checked={preferences.smsNotifications}
            onCheckedChange={(checked) => 
              updatePreferences({ smsNotifications: checked })
            }
          />
          <PreferenceToggle
            label="Push Notifications"
            description="Receive notifications on your device"
            checked={preferences.pushNotifications}
            onCheckedChange={(checked) => 
              updatePreferences({ pushNotifications: checked })
            }
          />
        </CardContent>
      </Card>
      
      {/* Shopping Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Shopping Preferences</CardTitle>
          <CardDescription>
            Personalize your shopping experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Categories</Label>
            <CategorySelector
              selected={preferences.preferredCategories}
              onChange={(categories) => 
                updatePreferences({ preferredCategories: categories })
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label>Default Delivery Option</Label>
            <RadioGroup
              value={preferences.defaultDeliveryOption}
              onValueChange={(value) => 
                updatePreferences({ defaultDeliveryOption: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express">Express Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled">Scheduled Delivery</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Control your data and privacy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PreferenceToggle
            label="Personalized Recommendations"
            description="Show product recommendations based on your activity"
            checked={preferences.personalizedRecommendations}
            onCheckedChange={(checked) => 
              updatePreferences({ personalizedRecommendations: checked })
            }
          />
          <PreferenceToggle
            label="Marketing Analytics"
            description="Help us improve by sharing anonymous usage data"
            checked={preferences.marketingAnalytics}
            onCheckedChange={(checked) => 
              updatePreferences({ marketingAnalytics: checked })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 7. Implementation Details

### 7.1 Customer Hooks

```typescript
// hooks/use-customer.ts
export function useCustomer() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['customer', user?.id],
    queryFn: () => fetchCustomerData(user?.id),
    enabled: !!user?.id,
  });
  
  return {
    customer: data,
    loading: isLoading,
    error,
  };
}

// hooks/use-orders.ts
export function useOrders(filters?: OrderFilters) {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['orders', user?.id, filters],
    queryFn: () => fetchOrders(user?.id, filters),
    enabled: !!user?.id,
  });
  
  return {
    orders: data?.orders || [],
    pagination: data?.pagination,
    loading: isLoading,
  };
}

// hooks/use-loyalty.ts
export function useLoyalty() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: loyalty } = useQuery({
    queryKey: ['loyalty', user?.id],
    queryFn: () => fetchLoyaltyData(user?.id),
    enabled: !!user?.id,
  });
  
  const redeemReward = useMutation({
    mutationFn: (rewardId: string) => redeemLoyaltyReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries(['loyalty', user?.id]);
    },
  });
  
  return {
    loyalty,
    redeemReward: redeemReward.mutate,
  };
}
```

### 7.2 API Endpoints

```typescript
// Customer endpoints
GET /api/customers/me
PUT /api/customers/me

// Orders
GET /api/customers/me/orders
GET /api/customers/me/orders/:orderId

// Addresses
GET /api/customers/me/addresses
POST /api/customers/me/addresses
PUT /api/customers/me/addresses/:addressId
DELETE /api/customers/me/addresses/:addressId

// Payment methods
GET /api/customers/me/payment-methods
POST /api/customers/me/payment-methods
DELETE /api/customers/me/payment-methods/:methodId

// Loyalty
GET /api/customers/me/loyalty
GET /api/customers/me/loyalty/history
POST /api/customers/me/loyalty/redeem

// Preferences
GET /api/customers/me/preferences
PUT /api/customers/me/preferences

// Wishlist
GET /api/customers/me/wishlist
POST /api/customers/me/wishlist
DELETE /api/customers/me/wishlist/:itemId
```

### 7.3 Database Schema

```sql
-- Customer preferences
CREATE TABLE customer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT false,
  preferred_categories JSONB DEFAULT '[]',
  default_delivery_option VARCHAR(50) DEFAULT 'standard',
  personalized_recommendations BOOLEAN DEFAULT true,
  marketing_analytics BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id)
);

-- Loyalty points
CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  points INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'earned', 'redeemed', 'expired'
  description TEXT,
  order_id UUID REFERENCES orders(id),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_loyalty_customer (customer_id),
  INDEX idx_loyalty_expires (expires_at)
);

-- Wishlist
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, variant_id),
  INDEX idx_wishlist_customer (customer_id)
);
```

---

## Summary

The customer dashboard provides a comprehensive self-service interface with:

1. **Intuitive Navigation** - Easy access to all account features
2. **Order Management** - Complete order tracking and history
3. **Loyalty Integration** - Points tracking and reward redemption
4. **Profile Control** - Address, payment, and preference management
5. **Personalization** - Customized recommendations and settings
6. **Mobile Optimization** - Responsive design for all devices

The implementation focuses on user experience, performance, and seamless integration with the MedusaJS backend.
