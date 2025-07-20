# Operations Dashboard Specifications

## Table of Contents
1. [Overview](#overview)
2. [Dashboard Layout](#dashboard-layout)
3. [Real-Time Monitoring](#real-time-monitoring)
4. [Performance Metrics](#performance-metrics)
5. [Alert Management](#alert-management)
6. [Implementation Details](#implementation-details)

---

## 1. Overview

The Operations Dashboard provides a centralized command center for operations teams to monitor, manage, and optimize order fulfillment across all hubs in real-time.

### Key Features
- Real-time order tracking and status updates
- Hub performance monitoring
- Alert and issue management
- Performance analytics and reporting
- Resource allocation tools

### User Roles
- Operations Manager
- Fulfillment Coordinator
- Warehouse Supervisor
- System Administrator

---

## 2. Dashboard Layout

### 2.1 Main Dashboard View

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
      <HubStatusGrid hubs={hubs} />
      
      {/* Order Flow Visualization */}
      <OrderFlowVisualization data={metrics.orderFlow} />
      
      {/* Active Issues */}
      <ActiveIssuesPanel issues={alerts.active} />
    </div>
  );
}
```

### 2.2 Navigation Structure

```typescript
const operationsNavigation = [
  {
    name: 'Command Center',
    href: '/operations',
    icon: LayoutDashboard,
  },
  {
    name: 'Order Queue',
    href: '/operations/orders',
    icon: Package,
  },
  {
    name: 'Hub Management',
    href: '/operations/hubs',
    icon: Building,
  },
  {
    name: 'Performance',
    href: '/operations/performance',
    icon: BarChart3,
  },
  {
    name: 'Alerts',
    href: '/operations/alerts',
    icon: AlertCircle,
  },
  {
    name: 'Reports',
    href: '/operations/reports',
    icon: FileText,
  },
];
```

---

## 3. Real-Time Monitoring

### 3.1 Live Order Tracking

```tsx
// components/operations/live-order-tracker.tsx
export function LiveOrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
    
    ws.on('order:update', (data) => {
      setOrders(prev => updateOrderInList(prev, data));
    });
    
    ws.on('order:new', (data) => {
      setOrders(prev => [data, ...prev]);
    });
    
    return () => ws.close();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Order Status</CardTitle>
        <CardDescription>Real-time order tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {orders.map((order) => (
            <OrderStatusRow key={order.id} order={order} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3.2 Hub Performance Monitor

```tsx
// components/operations/hub-performance-monitor.tsx
export function HubPerformanceMonitor({ hubId }: { hubId: string }) {
  const { data, isLoading } = useHubMetrics(hubId, { 
    refreshInterval: 5000 // 5 second refresh
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data?.hubName}</CardTitle>
        <Badge variant={getStatusVariant(data?.status)}>
          {data?.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Orders/Hour</p>
            <p className="text-2xl font-bold">{data?.ordersPerHour}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Process Time</p>
            <p className="text-2xl font-bold">{data?.avgProcessTime}m</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Staff Active</p>
            <p className="text-2xl font-bold">{data?.activeStaff}/{data?.totalStaff}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Capacity</p>
            <Progress value={data?.capacityUsed} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3.3 Real-Time Metrics Stream

```typescript
// services/real-time-metrics.service.ts
export class RealTimeMetricsService {
  private metricsStream = new EventEmitter();
  
  async startMetricsStream() {
    setInterval(async () => {
      const metrics = await this.collectMetrics();
      this.metricsStream.emit('metrics:update', metrics);
      
      // Check for anomalies
      const anomalies = this.detectAnomalies(metrics);
      if (anomalies.length > 0) {
        this.metricsStream.emit('anomaly:detected', anomalies);
      }
    }, 1000); // Update every second
  }
  
  private async collectMetrics(): Promise<OperationsMetrics> {
    const [orders, hubs, performance] = await Promise.all([
      this.getOrderMetrics(),
      this.getHubMetrics(),
      this.getPerformanceMetrics(),
    ]);
    
    return {
      timestamp: new Date(),
      orders,
      hubs,
      performance,
      system: await this.getSystemMetrics(),
    };
  }
  
  private detectAnomalies(metrics: OperationsMetrics): Anomaly[] {
    const anomalies: Anomaly[] = [];
    
    // Order backlog detection
    if (metrics.orders.queueLength > metrics.orders.avgQueueLength * 2) {
      anomalies.push({
        type: 'order_backlog',
        severity: 'high',
        message: 'Order queue length is 2x above average',
        value: metrics.orders.queueLength,
      });
    }
    
    // Hub capacity warnings
    metrics.hubs.forEach(hub => {
      if (hub.utilization > 90) {
        anomalies.push({
          type: 'hub_capacity',
          severity: 'medium',
          message: `${hub.name} is at ${hub.utilization}% capacity`,
          hubId: hub.id,
        });
      }
    });
    
    return anomalies;
  }
}
```

---

## 4. Performance Metrics

### 4.1 KPI Dashboard

```tsx
// components/operations/kpi-dashboard.tsx
export function KPIDashboard() {
  const { kpis } = useOperationsKPIs();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Order Fulfillment Rate"
        value={kpis.fulfillmentRate}
        target={99}
        format="percentage"
        trend={kpis.fulfillmentTrend}
      />
      <KPICard
        title="Average Processing Time"
        value={kpis.avgProcessingTime}
        target={120}
        format="minutes"
        trend={kpis.processingTrend}
      />
      <KPICard
        title="On-Time Delivery"
        value={kpis.onTimeDelivery}
        target={95}
        format="percentage"
        trend={kpis.deliveryTrend}
      />
      <KPICard
        title="Cost per Order"
        value={kpis.costPerOrder}
        target={15}
        format="currency"
        trend={kpis.costTrend}
      />
    </div>
  );
}
```

### 4.2 Performance Analytics

```tsx
// components/operations/performance-analytics.tsx
export function PerformanceAnalytics() {
  const [timeRange, setTimeRange] = useState('24h');
  const [metric, setMetric] = useState('fulfillment_rate');
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Performance Trends</CardTitle>
          <div className="flex gap-2">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fulfillment_rate">Fulfillment Rate</SelectItem>
                <SelectItem value="processing_time">Processing Time</SelectItem>
                <SelectItem value="order_volume">Order Volume</SelectItem>
                <SelectItem value="error_rate">Error Rate</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup value={timeRange} onValueChange={setTimeRange}>
              <ToggleGroupItem value="24h">24H</ToggleGroupItem>
              <ToggleGroupItem value="7d">7D</ToggleGroupItem>
              <ToggleGroupItem value="30d">30D</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PerformanceChart metric={metric} timeRange={timeRange} />
      </CardContent>
    </Card>
  );
}
```

### 4.3 Hub Comparison

```tsx
// components/operations/hub-comparison.tsx
export function HubComparison() {
  const { hubs } = useHubComparison();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hub Performance Comparison</CardTitle>
        <CardDescription>Comparative metrics across all fulfillment centers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hub</TableHead>
              <TableHead>Orders Today</TableHead>
              <TableHead>Avg Time</TableHead>
              <TableHead>Efficiency</TableHead>
              <TableHead>SLA %</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hubs.map((hub) => (
              <TableRow key={hub.id}>
                <TableCell className="font-medium">{hub.name}</TableCell>
                <TableCell>{hub.ordersToday}</TableCell>
                <TableCell>{hub.avgProcessingTime}m</TableCell>
                <TableCell>
                  <Progress value={hub.efficiency} className="w-20" />
                </TableCell>
                <TableCell>
                  <span className={cn(
                    hub.slaCompliance >= 95 ? "text-green-600" : "text-red-600"
                  )}>
                    {hub.slaCompliance}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getHubStatusVariant(hub.status)}>
                    {hub.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

---

## 5. Alert Management

### 5.1 Alert System

```typescript
// services/alert-management.service.ts
export class AlertManagementService {
  private alertRules: AlertRule[] = [];
  
  async evaluateAlerts(): Promise<Alert[]> {
    const metrics = await this.metricsService.getCurrentMetrics();
    const alerts: Alert[] = [];
    
    for (const rule of this.alertRules) {
      if (this.evaluateRule(rule, metrics)) {
        alerts.push(this.createAlert(rule, metrics));
      }
    }
    
    return alerts;
  }
  
  private createAlert(rule: AlertRule, metrics: any): Alert {
    return {
      id: generateId(),
      ruleId: rule.id,
      severity: rule.severity,
      title: rule.title,
      message: this.formatMessage(rule.messageTemplate, metrics),
      timestamp: new Date(),
      status: 'active',
      assignee: rule.defaultAssignee,
      actions: rule.suggestedActions,
    };
  }
}
```

### 5.2 Alert Dashboard

```tsx
// components/operations/alert-dashboard.tsx
export function AlertDashboard() {
  const { alerts, acknowledge, resolve } = useAlerts();
  
  return (
    <div className="space-y-4">
      {/* Alert Summary */}
      <div className="grid grid-cols-4 gap-4">
        <AlertSummaryCard
          severity="critical"
          count={alerts.critical.length}
          color="red"
        />
        <AlertSummaryCard
          severity="high"
          count={alerts.high.length}
          color="orange"
        />
        <AlertSummaryCard
          severity="medium"
          count={alerts.medium.length}
          color="yellow"
        />
        <AlertSummaryCard
          severity="low"
          count={alerts.low.length}
          color="blue"
        />
      </div>
      
      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AlertList
            alerts={alerts.all}
            onAcknowledge={acknowledge}
            onResolve={resolve}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

### 5.3 Alert Configuration

```tsx
// components/operations/alert-configuration.tsx
export function AlertConfiguration() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Rules</CardTitle>
        <Button onClick={() => setShowNewRule(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rules.map((rule) => (
            <AlertRuleCard
              key={rule.id}
              rule={rule}
              onEdit={(rule) => handleEditRule(rule)}
              onDelete={(id) => handleDeleteRule(id)}
              onToggle={(id) => handleToggleRule(id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 6. Implementation Details

### 6.1 WebSocket Integration

```typescript
// services/websocket.service.ts
export class OperationsWebSocketService {
  private io: Server;
  
  initialize(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });
    
    this.io.on('connection', (socket) => {
      // Authentication
      socket.on('authenticate', async (token) => {
        const user = await this.authenticateUser(token);
        if (user && user.role.includes('operations')) {
          socket.join('operations');
          socket.emit('authenticated', { user });
        }
      });
      
      // Subscribe to specific
