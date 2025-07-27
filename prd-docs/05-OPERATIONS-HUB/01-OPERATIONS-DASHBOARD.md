# Operations Dashboard Specifications

## Table of Contents
1. [Overview](#overview)
2. [Operations Team Dashboard](#operations-team-dashboard)
3. [Order Routing System](#order-routing-system)
4. [Fulfillment Hub Management](#fulfillment-hub-management)
5. [Inventory Synchronization](#inventory-synchronization)
6. [Inter-Hub Transfer Management](#inter-hub-transfer-management)
7. [Performance Monitoring](#performance-monitoring)
8. [Integration Architecture](#integration-architecture)
9. [User Roles and Permissions](#user-roles-and-permissions)

---

## 1. Overview

The operations dashboard is a dedicated interface for operations managers and fulfillment coordinators, providing real-time visibility into order processing, inventory levels, and hub performance.

### Key Objectives
- **Efficient Order Processing**: Automated routing to optimal fulfillment locations
- **Real-Time Inventory Visibility**: Synchronized inventory across all hubs
- **Operations Excellence**: Dedicated tools for operations teams
- **Scalable Architecture**: Support for multiple fulfillment centers
- **Performance Tracking**: KPIs and metrics for operational efficiency

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Order Management System                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Orders    │───▶│ Order Router │───▶│ Fulfillment  │ │
│  │   Service   │    │   Service    │    │   Service    │ │
│  └─────────────┘    └──────────────┘    └──────────────┘ │
│                             │                               │
│                             ▼                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Fulfillment Hub Network                 │  │
│  ├─────────────┬─────────────┬─────────────┬──────────┤  │
│  │   Hub A     │   Hub B     │   Hub C     │  Hub D   │  │
│  │ (Primary)   │ (Secondary) │ (Regional)  │ (Backup) │  │
│  └─────────────┴─────────────┴─────────────┴──────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Operations Team Dashboard

### 2.1 Layout Structure

```tsx
// app/operations/layout.tsx
export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <Link href="/operations" className="flex items-center gap-2">
            <Settings2 className="h-6 w-6" />
            <span className="font-semibold">Operations Center</span>
          </Link>
        </div>
        <nav className="px-4 space-y-1">
          <SidebarLink href="/operations" icon={LayoutDashboard}>
            Command Center
          </SidebarLink>
          <SidebarLink href="/operations/orders" icon={Package}>
            Order Queue
          </SidebarLink>
          <SidebarLink href="/operations/routing" icon={Route}>
            Order Routing
          </SidebarLink>
          <SidebarLink href="/operations/inventory" icon={Archive}>
            Inventory Control
          </SidebarLink>
          <SidebarLink href="/operations/transfers" icon={ArrowLeftRight}>
            Hub Transfers
          </SidebarLink>
          <SidebarLink href="/operations/performance" icon={BarChart3}>
            Performance
          </SidebarLink>
          <SidebarLink href="/operations/alerts" icon={AlertCircle}>
            System Alerts
          </SidebarLink>
          <SidebarLink href="/operations/settings" icon={Settings}>
            Hub Settings
          </SidebarLink>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
          <OperationsHeader />
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 2.2 Command Center Dashboard

```tsx
// app/operations/page.tsx
export default function OperationsCommandCenter() {
  const { metrics, alerts, hubs } = useOperationsData();
  
  return (
    <div className="p-6 space-y-6">
      {/* Critical Alerts Banner */}
      {alerts.critical.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Alerts</AlertTitle>
          <AlertDescription>
            {alerts.critical.map(alert => (
              <div key={alert.id}>{alert.message}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Orders in Queue"
          value={metrics.ordersInQueue}
          subtitle="Awaiting processing"
          icon={Clock}
          variant={metrics.ordersInQueue > 100 ? 'warning' : 'default'}
        />
        <MetricCard
          title="Processing Rate"
          value={`${metrics.processingRate}/hr`}
          subtitle="Last hour average"
          icon={TrendingUp}
        />
        <MetricCard
          title="Hub Utilization"
          value={`${metrics.hubUtilization}%`}
          subtitle="Average across all hubs"
          icon={Activity}
          variant={metrics.hubUtilization > 85 ? 'warning' : 'default'}
        />
        <MetricCard
          title="SLA Compliance"
          value={`${metrics.slaCompliance}%`}
          subtitle="24-hour delivery"
          icon={CheckCircle}
          variant={metrics.slaCompliance < 95 ? 'danger' : 'success'}
        />
      </div>
      
      {/* Hub Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Fulfillment Hub Status</CardTitle>
          <CardDescription>Real-time hub performance and capacity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hubs.map((hub) => (
              <HubStatusCard key={hub.id} hub={hub} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Order Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Flow</CardTitle>
            <CardDescription>Real-time order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderFlowChart data={metrics.orderFlow} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Processing Times</CardTitle>
            <CardDescription>Average by hub and order type</CardDescription>
          </CardHeader>
          <CardContent>
            <ProcessingTimeChart data={metrics.processingTimes} />
          </CardContent>
        </Card>
      </div>
      
      {/* Active Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Active Issues</CardTitle>
          <CardDescription>Requires immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <ActiveIssuesTable issues={alerts.active} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 3. Order Routing System

### 3.1 Routing Algorithm

```typescript
// services/order-routing.service.ts
import { MedusaService } from '@medusajs/medusa';

export class OrderRoutingService extends MedusaService {
  async routeOrder(order: Order): Promise<RoutingDecision> {
    // 1. Get available fulfillment hubs
    const hubs = await this.getAvailableHubs();
    
    // 2. Calculate routing scores for each hub
    const scoredHubs = await Promise.all(
      hubs.map(async (hub) => ({
        hub,
        score: await this.calculateRoutingScore(order, hub),
      }))
    );
    
    // 3. Sort by score and select optimal hub
    const optimalHub = scoredHubs
      .sort((a, b) => b.score - a.score)
      .find(({ hub }) => hub.canFulfill(order));
    
    if (!optimalHub) {
      throw new Error('No available hub can fulfill this order');
    }
    
    // 4. Create routing decision
    return {
      orderId: order.id,
      hubId: optimalHub.hub.id,
      score: optimalHub.score,
      estimatedProcessingTime: optimalHub.hub.estimateProcessingTime(order),
      alternativeHubs: scoredHubs.slice(1, 4).map(sh => sh.hub.id),
      routingFactors: this.getRoutingFactors(order, optimalHub.hub),
    };
  }
  
  private async calculateRoutingScore(
    order: Order,
    hub: FulfillmentHub
  ): Promise<number> {
    const factors = {
      // Geographic proximity (0-30 points)
      proximity: this.calculateProximityScore(order.shippingAddress, hub.location) * 30,
      
      // Inventory availability (0-25 points)
      inventory: await this.calculateInventoryScore(order.items, hub) * 25,
      
      // Hub capacity (0-20 points)
      capacity: this.calculateCapacityScore(hub) * 20,
      
      // Processing speed (0-15 points)
      speed: this.calculateSpeedScore(hub) * 15,
      
      // Cost efficiency (0-10 points)
      cost: this.calculateCostScore(order, hub) * 10,
    };
    
    // Apply business rules
    let totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    
    // Priority adjustments
    if (order.priority === 'express') {
      totalScore *= 1.2; // 20% boost for express orders
    }
    
    if (hub.specialization === order.productCategory) {
      totalScore *= 1.1; // 10% boost for specialized hubs
    }
    
    return Math.min(100, totalScore);
  }
}
```

### 3.2 Routing Rules Configuration

```tsx
// app/operations/routing/page.tsx
export default function OrderRoutingConfiguration() {
  const [rules, setRules] = useState<RoutingRule[]>([]);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Routing Rules</h1>
          <p className="text-muted-foreground">
            Configure automated order routing logic
          </p>
        </div>
        <Button onClick={() => setShowNewRule(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>
      
      {/* Active Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Active Routing Rules</CardTitle>
          <CardDescription>
            Rules are evaluated in priority order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="rules">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {rules.map((rule, index) => (
                    <Draggable key={rule.id} draggableId={rule.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-2"
                        >
                          <RoutingRuleCard
                            rule={rule}
                            dragHandleProps={provided.dragHandleProps}
                            onEdit={() => handleEditRule(rule)}
                            onDelete={() => handleDeleteRule(rule.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 4. Fulfillment Hub Management

### 4.1 Hub Configuration

```tsx
// app/operations/settings/hubs/page.tsx
export default function HubManagement() {
  const { hubs, loading } = useFulfillmentHubs();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fulfillment Hub Management</h1>
          <p className="text-muted-foreground">
            Configure and manage fulfillment centers
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Hub
        </Button>
      </div>
      
      {/* Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hubs.map((hub) => (
          <HubConfigCard key={hub.id} hub={hub} />
        ))}
      </div>
    </div>
  );
}
```

### 4.2 Order Queue Management

```tsx
// app/operations/orders/page.tsx
export default function OrderQueueManagement() {
  const [selectedHub, setSelectedHub] = useState<string>('all');
  const [filters, setFilters] = useState<OrderFilters>({});
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Processing Queue</h1>
          <p className="text-muted-foreground">
            Manage and process incoming orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Order Processing Table */}
      <Card>
        <CardContent className="p-0">
          <OrderProcessingTable
            hub={selectedHub}
            filters={filters}
            onOrderSelect={handleOrderSelect}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 5. Inventory Synchronization

### 5.1 Real-Time Inventory Sync

```typescript
// services/inventory-sync.service.ts
import { MedusaService } from '@medusajs/medusa';
import { EventEmitter } from 'events';

export class InventorySyncService extends MedusaService {
  private syncEmitter: EventEmitter;
  
  constructor(container) {
    super(container);
    this.syncEmitter = new EventEmitter();
    this.initializeWebSocketSync();
  }
  
  async syncInventoryAcrossHubs(
    variantId: string,
    sourceHub: string,
    adjustment: number,
    reason: string
  ): Promise<SyncResult> {
    const transaction = await this.manager.transaction(async (manager) => {
      // 1. Update source hub inventory
      const sourceInventory = await this.updateHubInventory(
        manager,
        sourceHub,
        variantId,
        adjustment,
        reason
      );
      
      // 2. Calculate total available inventory
      const totalInventory = await this.calculateTotalInventory(
        manager,
        variantId
      );
      
      // 3. Update variant availability
      await this.updateVariantAvailability(
        manager,
        variantId,
        totalInventory
      );
      
      // 4. Emit sync event for real-time updates
      this.syncEmitter.emit('inventory:updated', {
        variantId,
        hubId: sourceHub,
        adjustment,
        totalInventory,
        timestamp: new Date(),
      });
      
      return {
        variantId,
        sourceHub,
        adjustment,
        totalInventory,
        syncedHubs: await this.getSyncedHubs(variantId),
        timestamp: new Date(),
      };
    });
    
    return transaction;
  }
}
```

### 5.2 Inventory Control Dashboard

```tsx
// app/operations/inventory/page.tsx
export default function InventoryControl() {
  const [selectedHub, setSelectedHub] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Control</h1>
          <p className="text-muted-foreground">
            Real-time inventory management across all hubs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTransfer(true)}>
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Transfer Stock
          </Button>
          <Button variant="outline" onClick={() => setShowAdjustment(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Adjust Inventory
          </Button>
        </div>
      </div>
      
      {/* Inventory Display */}
      {view === 'grid' ? (
        <InventoryGrid hub={selectedHub} />
      ) : (
        <InventoryTable hub={selectedHub} />
      )}
    </div>
  );
}
```

---

## 6. Inter-Hub Transfer Management

### 6.1 Transfer Request System

```tsx
// app/operations/transfers/page.tsx
export default function HubTransfers() {
  const [activeTab, setActiveTab] = useState('pending');
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hub Transfer Management</h1>
          <p className="text-muted-foreground">
            Manage inventory transfers between fulfillment centers
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Transfer
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-transit">In Transit</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <TransferRequestList status="pending" />
        </TabsContent>
        
        <TabsContent value="in-transit" className="space-y-4">
          <TransferRequestList status="in-transit" />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <TransferRequestList status="completed" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 6.2 Transfer Creation Flow

```tsx
// components/operations/create-transfer-dialog.tsx
export function CreateTransferDialog({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [transferData, setTransferData] = useState<TransferRequest>({
    sourceHub: '',
    destinationHub: '',
    items: [],
    priority: 'normal',
    notes: '',
  });
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Hub Transfer</DialogTitle>
          <DialogDescription>
            Transfer inventory between fulfillment centers
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress Steps */}
        <div className="flex justify-between mb-6">
          {['Select Hubs', 'Choose Items', 'Review'].map((label, index) => (
            <div
              key={label}
              className={cn(
                "flex items-center",
                index < 2 && "flex-1"
              )}
            >
              <div className={cn(
                "flex items-center",
                index < step && "text-primary"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                  index < step ? "border-primary bg-primary text-primary-foreground" : "border-muted"
                )}>
                  {index < step - 1 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{label}</span>
              </div>
              {index < 2 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4",
                  index < step - 1 ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
        
        {/* Step Content */}
        {step === 1 && (
          <TransferHubSelection
            sourceHub={transferData.sourceHub}
            destinationHub={transferData.destinationHub}
            onUpdate={(data) => setTransferData({ ...transferData, ...data })}
          />
        )}
        
        {step === 2 && (
          <TransferItemSelection
            sourceHub={transferData.sourceHub}
            items={transferData.items}
            onUpdate={(items) => setTransferData({ ...transferData, items })}
          />
        )}
        
        {step === 3 && (
          <TransferReview
            transfer={transferData}
            onUpdate={(data) => setTransferData({ ...transferData, ...data })}
          />
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          <Button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleCreateTransfer(transferData);
              }
            }}
          >
            {step < 3 ? 'Next' : 'Create Transfer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 7. Performance Monitoring

### 7.1 Operations Analytics Dashboard

```tsx
// app/operations/performance/page.tsx
export default function PerformanceMonitoring() {
  const [dateRange, setDateRange] = useState('last7days');
  const [selectedHub, setSelectedHub] = useState('all');
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Monitor operational efficiency and KPIs
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Order Fulfillment Rate"
          value="98.5%"
          target="99%"
          trend="+0.5%"
          status="warning"
        />
        <KPICard
          title="Average Processing Time"
          value="2.3 hrs"
          target="< 2 hrs"
          trend="-15 min"
          status="success"
        />
        <KPICard
          title="On-Time Delivery"
          value="94.2%"
          target="95%"
          trend="-1.2%"
          status="danger"
        />
        <KPICard
          title="Inventory Accuracy"
          value="99.8%"
          target="99.5%"
          trend="+0.1%"
          status="success"
        />
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Processing Trends</CardTitle>
            <CardDescription>Daily order volume and processing times</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderProcessingChart data={processingData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hub Efficiency Comparison</CardTitle>
            <CardDescription>Performance metrics by fulfillment center</CardDescription>
          </CardHeader>
          <CardContent>
            <HubEfficiencyChart data={hubData} />
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>Comprehensive operational data by hub</CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceMetricsTable hub={selectedHub} dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  );
}
```

### 7.2 Real-Time Monitoring

```tsx
// components/operations/real-time-monitor.tsx
export function RealTimeMonitor() {
  const [metrics, setMetrics] = useState<RealtimeMetrics>();
  
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
    
    ws.on('metrics:update', (data) => {
      setMetrics(data);
    });
    
    return () => ws.close();
  }, []);
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricDisplay
        label="Orders/Min"
        value={metrics?.ordersPerMinute || 0}
        format="number"
      />
      <MetricDisplay
        label="Active Pickers"
        value={metrics?.activePickers || 0}
        format="number"
      />
      <MetricDisplay
        label="Queue Time"
        value={metrics?.avgQueueTime || 0}
        format="duration"
      />
      <MetricDisplay
        label="System Load"
        value={metrics?.systemLoad || 0}
        format="percentage"
      />
    </div>
  );
}
```

---

## 8. Integration Architecture

### 8.1 MedusaJS Module Structure

```typescript
// src/modules/operations/index.ts
import { Module } from '@medusajs/modules-sdk';
import { OperationsService } from './services/operations.service';
import { OrderRoutingService } from './services/order-routing.service';
import { InventorySyncService } from './services/inventory-sync.service';
import { FulfillmentHubService } from './services/fulfillment-hub.service';

export default Module({
  service: OperationsService,
  loaders: [
    {
      name: 'operations-models',
      loader: async (container, options) => {
        // Load database models
      },
    },
    {
      name: 'operations-subscribers',
      loader: async (container, options) => {
        // Set up event subscribers
      },
    },
  ],
  migrations: [
    // Database migrations
  ],
});
```

### 8.2 API Endpoints

```typescript
// src/api/admin/operations/route.ts
import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const operationsService = req.scope.resolve('operationsService');
  
  const metrics = await operationsService.getOperationalMetrics({
    hubId: req.query.hub_id,
    dateRange: req.query.date_range,
  });
  
  res.json({ metrics });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { action, data } = req.body;
  const operationsService = req.scope.resolve('operationsService');
  
  switch (action) {
    case 'route_order':
      const routing = await operationsService.routeOrder(data.orderId);
      res.json({ routing });
      break;
      
    case 'transfer_inventory':
      const transfer = await operationsService.createTransfer(data);
      res.json({ transfer });
      break;
      
    default:
      res.status(400).json({ error: 'Invalid action' });
  }
};
```

### 8.3 Event Subscribers

```typescript
// src/subscribers/operations.subscriber.ts
class OperationsSubscriber {
  constructor({ eventBusService, operationsService }) {
    this.eventBus = eventBusService;
    this.operations = operationsService;
    
    // Subscribe to order events
    this.eventBus.subscribe('order.placed', this.handleOrderPlaced.bind(this));
    this.eventBus.subscribe('order.fulfillment_created', this.handleFulfillmentCreated.bind(this));
    
    // Subscribe to inventory events
    this.eventBus.subscribe('inventory.adjusted', this.handleInventoryAdjusted.bind(this));
  }
  
  async handleOrderPlaced({ id, order }) {
    // Route order to optimal fulfillment hub
    const routing = await this.operations.routeOrder(order);
    
    // Create fulfillment at selected hub
    await this.operations.createFulfillment({
      orderId: order.id,
      hubId: routing.hubId,
      priority: order.metadata?.priority || 'standard',
    });
  }
  
  async handleInventoryAdjusted({ variantId, locationId, adjustment }) {
    // Sync inventory across hubs
    await this.operations.syncInventory({
      variantId,
      sourceHub: locationId,
      adjustment,
    });
  }
}
```

---

## 9. User Roles and Permissions

### 9.1 Operations Team Roles

```typescript
// src/types/operations-roles.ts
export enum OperationsRole {
  OPERATIONS_MANAGER = 'operations_manager',
  FULFILLMENT_COORDINATOR = 'fulfillment_coordinator',
  WAREHOUSE_SUPERVISOR = 'warehouse_supervisor',
  INVENTORY_SPECIALIST = 'inventory_specialist',
  PICKER_PACKER = 'picker_packer',
}

export const OperationsPermissions = {
  [OperationsRole.OPERATIONS_MANAGER]: [
    'operations:view_all',
    'operations:manage_hubs',
    'operations:configure_routing',
    'operations:approve_transfers',
    'operations:view_analytics',
    'operations:export_reports',
    'operations:manage_staff',
  ],
  
  [OperationsRole.FULFILLMENT_COORDINATOR]: [
    'operations:view_hub',
    'operations:process_orders',
    'operations:manage_queue',
    'operations:create_transfers',
    'operations:view_inventory',
    'operations:print_labels',
  ],
  
  [OperationsRole.WAREHOUSE_SUPERVISOR]: [
    'operations:view_hub',
    'operations:manage_inventory',
    'operations:approve_adjustments',
    'operations:manage_staff_schedule',
    'operations:view_hub_analytics',
  ],
  
  [OperationsRole.INVENTORY_SPECIALIST]: [
    'operations:view_inventory',
    'operations:adjust_inventory',
    'operations:create_transfers',
    'operations:receive_shipments',
    'operations:conduct_counts',
  ],
  
  [OperationsRole.PICKER_PACKER]: [
    'operations:view_assigned_orders',
    'operations:update_order_status',
    'operations:print_labels',
    'operations:report_issues',
  ],
};
```

### 9.2 Permission Middleware

```typescript
// src/middleware/operations-auth.ts
export function requireOperationsPermission(permission: string) {
  return async (req: MedusaRequest, res: MedusaResponse, next: NextFunction) => {
    const user = req.user;
    
    if (!user || !user.operations_role) {
      return res.status(403).json({
        error: 'Access denied: Operations role required',
      });
    }
    
    const userPermissions = OperationsPermissions[user.operations_role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: `Access denied: Missing permission ${permission}`,
      });
    }
    
    next();
  };
}
```

---

## Summary

The Operations Dashboard provides a comprehensive system for managing multi-location order fulfillment with:

1. **Dedicated Operations Dashboard**: Purpose-built interface for operations teams with real-time monitoring and control
2. **Intelligent Order Routing**: Automated routing based on proximity, inventory, capacity, and cost
3. **Multi-Hub Management**: Centralized control over multiple fulfillment centers
4. **Real-Time Inventory Sync**: Synchronized inventory levels across all locations
5. **Transfer Management**: Streamlined inter-hub inventory transfers
6. **Performance Analytics**: Comprehensive KPI tracking and reporting
7. **Role-Based Access**: Granular permissions for different operations roles

The system integrates seamlessly with MedusaJS while providing the specialized tools needed for efficient multi-location fulfillment operations.
