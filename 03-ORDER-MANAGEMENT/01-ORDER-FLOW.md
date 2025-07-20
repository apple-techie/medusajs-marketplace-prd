# Order Flow and Processing

## Overview

The order flow system manages the complete lifecycle of orders from placement through delivery, including intelligent routing, multi-vendor coordination, and real-time tracking.

## Order Lifecycle

### 1. Order Placement

```typescript
interface OrderCreation {
  // Customer Information
  customerId: string;
  shippingAddress: Address;
  billingAddress: Address;
  
  // Order Items
  items: OrderItem[];
  
  // Delivery Options
  deliveryType: 'standard' | 'express' | 'scheduled';
  scheduledDelivery?: Date;
  
  // Payment
  paymentMethodId: string;
  
  // Special Instructions
  notes?: string;
  ageVerified: boolean;
}

interface OrderItem {
  variantId: string;
  quantity: number;
  price: number;
  vendorId: string;
  vendorType: 'brand' | 'distributor';
}
```

### 2. Order States

```typescript
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  PACKED = 'packed',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

enum FulfillmentStatus {
  NOT_FULFILLED = 'not_fulfilled',
  PARTIALLY_FULFILLED = 'partially_fulfilled',
  FULFILLED = 'fulfilled',
  PARTIALLY_SHIPPED = 'partially_shipped',
  SHIPPED = 'shipped',
  PARTIALLY_RETURNED = 'partially_returned',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
}
```

## Order Processing Flow

### Step 1: Order Validation

```typescript
class OrderValidationService {
  async validateOrder(orderData: OrderCreation): Promise<ValidationResult> {
    const validations = await Promise.all([
      this.validateInventory(orderData.items),
      this.validateShippingAddress(orderData.shippingAddress),
      this.validatePaymentMethod(orderData.paymentMethodId),
      this.validateAgeRestrictions(orderData),
      this.validateDeliveryWindow(orderData),
    ]);
    
    const errors = validations.filter(v => !v.valid);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: this.getWarnings(validations),
    };
  }
  
  private async validateInventory(items: OrderItem[]): Promise<Validation> {
    const inventoryChecks = await Promise.all(
      items.map(async (item) => {
        const available = await this.inventoryService.checkAvailability(
          item.variantId,
          item.quantity
        );
        
        return {
          item,
          available,
          locations: await this.inventoryService.getAvailableLocations(
            item.variantId,
            item.quantity
          ),
        };
      })
    );
    
    const unavailable = inventoryChecks.filter(check => !check.available);
    
    return {
      valid: unavailable.length === 0,
      message: unavailable.length > 0 
        ? `${unavailable.length} items are out of stock`
        : 'All items available',
      details: inventoryChecks,
    };
  }
}
```

### Step 2: Order Routing

```typescript
class OrderRoutingService {
  async routeOrder(order: Order): Promise<RoutingDecision[]> {
    // Group items by optimal fulfillment location
    const itemGroups = await this.groupItemsByLocation(order);
    
    // Create routing decisions for each group
    const routingDecisions = await Promise.all(
      itemGroups.map(async (group) => {
        const hub = await this.selectOptimalHub(group, order.shippingAddress);
        
        return {
          hubId: hub.id,
          items: group.items,
          estimatedProcessingTime: hub.estimateProcessingTime(group.items),
          estimatedDeliveryTime: await this.calculateDeliveryTime(
            hub,
            order.shippingAddress,
            order.deliveryType
          ),
          cost: await this.calculateFulfillmentCost(hub, group, order),
        };
      })
    );
    
    return this.optimizeRoutingDecisions(routingDecisions);
  }
  
  private async selectOptimalHub(
    itemGroup: ItemGroup,
    shippingAddress: Address
  ): Promise<FulfillmentHub> {
    const availableHubs = await this.getHubsWithInventory(itemGroup.items);
    
    const scoredHubs = await Promise.all(
      availableHubs.map(async (hub) => ({
        hub,
        score: await this.calculateHubScore(hub, itemGroup, shippingAddress),
      }))
    );
    
    return scoredHubs
      .sort((a, b) => b.score - a.score)
      [0].hub;
  }
}
```

### Step 3: Payment Processing

```typescript
class PaymentProcessingService {
  async processOrderPayment(order: Order): Promise<PaymentResult> {
    // Calculate payment splits
    const splits = await this.calculatePaymentSplits(order);
    
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.total * 100, // Convert to cents
      currency: 'usd',
      customer: order.stripeCustomerId,
      payment_method: order.paymentMethodId,
      confirm: true,
      transfer_group: `order_${order.id}`,
      metadata: {
        order_id: order.id,
        platform: 'medusajs_marketplace',
      },
    });
    
    // Create transfers to vendors
    if (paymentIntent.status === 'succeeded') {
      await this.createVendorTransfers(order, splits, paymentIntent);
    }
    
    return {
      success: paymentIntent.status === 'succeeded',
      paymentIntentId: paymentIntent.id,
      splits,
    };
  }
  
  private async calculatePaymentSplits(order: Order): Promise<PaymentSplit[]> {
    const splits: PaymentSplit[] = [];
    
    // Group items by vendor
    const vendorGroups = this.groupItemsByVendor(order.items);
    
    for (const [vendorId, items] of vendorGroups) {
      const vendor = await this.vendorService.getVendor(vendorId);
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Calculate fees based on vendor type
      const platformFee = this.calculatePlatformFee(vendor, subtotal);
      const vendorPayout = subtotal - platformFee;
      
      splits.push({
        vendorId,
        vendorType: vendor.type,
        subtotal,
        platformFee,
        vendorPayout,
        stripeAccountId: vendor.stripeAccountId,
      });
    }
    
    return splits;
  }
}
```

### Step 4: Fulfillment Creation

```typescript
class FulfillmentService {
  async createFulfillments(
    order: Order,
    routingDecisions: RoutingDecision[]
  ): Promise<Fulfillment[]> {
    const fulfillments = await Promise.all(
      routingDecisions.map(async (decision) => {
        const fulfillment = await this.createFulfillment({
          orderId: order.id,
          hubId: decision.hubId,
          items: decision.items,
          shippingAddress: order.shippingAddress,
          priority: this.calculatePriority(order),
          metadata: {
            deliveryType: order.deliveryType,
            estimatedDelivery: decision.estimatedDeliveryTime,
          },
        });
        
        // Notify fulfillment center
        await this.notifyFulfillmentCenter(fulfillment);
        
        // Reserve inventory
        await this.reserveInventory(fulfillment);
        
        return fulfillment;
      })
    );
    
    return fulfillments;
  }
  
  private calculatePriority(order: Order): Priority {
    if (order.deliveryType === 'express') return Priority.HIGH;
    if (order.scheduledDelivery) {
      const hoursUntilDelivery = differenceInHours(order.scheduledDelivery, new Date());
      if (hoursUntilDelivery < 24) return Priority.HIGH;
      if (hoursUntilDelivery < 48) return Priority.MEDIUM;
    }
    return Priority.NORMAL;
  }
}
```

## Multi-Vendor Order Handling

### Order Splitting

When an order contains items from multiple vendors, the system automatically splits it into sub-orders:

```typescript
interface MultiVendorOrder {
  parentOrderId: string;
  subOrders: SubOrder[];
  totalAmount: number;
  consolidatedShipping: boolean;
}

interface SubOrder {
  id: string;
  parentOrderId: string;
  vendorId: string;
  vendorType: VendorType;
  items: OrderItem[];
  fulfillmentId: string;
  status: OrderStatus;
  subtotal: number;
}

class MultiVendorOrderService {
  async processMultiVendorOrder(order: Order): Promise<MultiVendorOrder> {
    // Split order by vendor
    const subOrders = await this.splitOrderByVendor(order);
    
    // Determine if consolidated shipping is possible
    const canConsolidate = await this.checkConsolidationEligibility(subOrders);
    
    if (canConsolidate) {
      // Route all items to a single fulfillment center
      return this.createConsolidatedOrder(order, subOrders);
    } else {
      // Process each sub-order independently
      return this.createSplitOrder(order, subOrders);
    }
  }
  
  private async checkConsolidationEligibility(
    subOrders: SubOrder[]
  ): Promise<boolean> {
    // Check if all items are available at a single hub
    const commonHubs = await this.findCommonFulfillmentHubs(subOrders);
    
    return commonHubs.length > 0;
  }
}
```

## Real-Time Order Tracking

### WebSocket Events

```typescript
// Order tracking events
enum OrderTrackingEvent {
  ORDER_PLACED = 'order.placed',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_PROCESSING = 'order.processing',
  ORDER_PACKED = 'order.packed',
  ORDER_PICKED_UP = 'order.picked_up',
  ORDER_IN_TRANSIT = 'order.in_transit',
  ORDER_OUT_FOR_DELIVERY = 'order.out_for_delivery',
  ORDER_DELIVERED = 'order.delivered',
  ORDER_CANCELLED = 'order.cancelled',
}

class OrderTrackingService {
  async emitOrderUpdate(
    orderId: string,
    event: OrderTrackingEvent,
    data: any
  ): Promise<void> {
    // Update order status
    await this.updateOrderStatus(orderId, event);
    
    // Emit WebSocket event
    this.wsServer.to(`order:${orderId}`).emit(event, {
      orderId,
      timestamp: new Date(),
      event,
      data,
    });
    
    // Send push notification
    await this.sendPushNotification(orderId, event);
    
    // Log event for analytics
    await this.logTrackingEvent(orderId, event, data);
  }
}
```

### Customer Tracking Interface

```tsx
// components/order/order-tracking.tsx
export function OrderTracking({ orderId }: { orderId: string }) {
  const { order, events } = useOrderTracking(orderId);
  
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.displayId}</CardTitle>
          <CardDescription>
            Placed on {format(order.createdAt, 'PPP')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{formatStatus(order.status)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="font-medium">
                {format(order.estimatedDelivery, 'PPP')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full",
                    index === 0 ? "bg-primary" : "bg-muted"
                  )} />
                  {index < events.length - 1 && (
                    <div className="w-0.5 h-16 bg-muted" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelative(event.timestamp, new Date())}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Delivery Map */}
      {order.status === 'out_for_delivery' && (
        <Card>
          <CardHeader>
            <CardTitle>Live Delivery Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryMap orderId={orderId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## Order Modifications

### Cancellation Flow

```typescript
class OrderCancellationService {
  async cancelOrder(
    orderId: string,
    reason: string,
    initiatedBy: 'customer' | 'vendor' | 'admin'
  ): Promise<CancellationResult> {
    const order = await this.orderService.getOrder(orderId);
    
    // Check if order can be cancelled
    if (!this.canCancelOrder(order)) {
      throw new Error('Order cannot be cancelled at this stage');
    }
    
    // Cancel fulfillments
    await this.cancelFulfillments(order);
    
    // Process refund
    const refund = await this.processRefund(order, reason);
    
    // Update order status
    await this.orderService.updateStatus(orderId, OrderStatus.CANCELLED);
    
    // Notify all parties
    await this.notifyCancellation(order, reason, initiatedBy);
    
    // Release inventory
    await this.releaseInventory(order);
    
    return {
      success: true,
      refundId: refund.id,
      refundAmount: refund.amount,
    };
  }
  
  private canCancelOrder(order: Order): boolean {
    const nonCancellableStatuses = [
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.REFUNDED,
    ];
    
    return !nonCancellableStatuses.includes(order.status);
  }
}
```

### Order Modifications

```typescript
interface OrderModification {
  type: 'add_item' | 'remove_item' | 'update_quantity' | 'change_address';
  itemId?: string;
  quantity?: number;
  newAddress?: Address;
  reason: string;
}

class OrderModificationService {
  async modifyOrder(
    orderId: string,
    modifications: OrderModification[]
  ): Promise<ModificationResult> {
    const order = await this.orderService.getOrder(orderId);
    
    // Check if modifications are allowed
    if (!this.canModifyOrder(order)) {
      throw new Error('Order cannot be modified at this stage');
    }
    
    // Apply modifications
    const results = await Promise.all(
      modifications.map(mod => this.applyModification(order, mod))
    );
    
    // Recalculate totals
    await this.recalculateOrderTotals(order);
    
    // Update routing if needed
    if (this.requiresRerouting(modifications)) {
      await this.rerouteOrder(order);
    }
    
    // Process payment adjustments
    await this.processPaymentAdjustments(order, results);
    
    return {
      success: true,
      modifiedOrder: order,
      adjustments: results,
    };
  }
}
```

## Performance Optimization

### Order Processing Queue

```typescript
class OrderProcessingQueue {
  private queue: Bull.Queue;
  
  constructor() {
    this.queue = new Bull('order-processing', {
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });
    
    this.setupProcessors();
  }
  
  private setupProcessors() {
    // Process order validation
    this.queue.process('validate-order', async (job) => {
      const { orderData } = job.data;
      return await this.orderValidationService.validateOrder(orderData);
    });
    
    // Process payment
    this.queue.process('process-payment', async (job) => {
      const { order } = job.data;
      return await this.paymentService.processOrderPayment(order);
    });
    
    // Create fulfillments
    this.queue.process('create-fulfillments', async (job) => {
      const { order, routingDecisions } = job.data;
      return await this.fulfillmentService.createFulfillments(order, routingDecisions);
    });
  }
  
  async addOrderToQueue(orderData: OrderCreation): Promise<string> {
    const job = await this.queue.add('validate-order', { orderData });
    return job.id;
  }
}
```

### Caching Strategy

```typescript
class OrderCacheService {
  private redis: Redis;
  
  async cacheOrder(order: Order): Promise<void> {
    const key = `order:${order.id}`;
    const ttl = this.calculateTTL(order);
    
    await this.redis.setex(
      key,
      ttl,
      JSON.stringify(order)
    );
    
    // Cache order items separately for efficient lookups
    await this.cacheOrderItems(order);
    
    // Cache customer's recent orders
    await this.updateCustomerOrderCache(order);
  }
  
  private calculateTTL(order: Order): number {
    // Active orders cached for 1 hour
    if (this.isActiveOrder(order)) return 3600;
    
    // Completed orders cached for 24 hours
    if (order.status === OrderStatus.DELIVERED) return 86400;
    
    // Default 30 minutes
    return 1800;
  }
}
