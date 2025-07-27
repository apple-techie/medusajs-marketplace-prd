# Fulfillment Routing Specifications

## Table of Contents
1. [Overview](#overview)
2. [Routing Algorithm](#routing-algorithm)
3. [Hub Selection Criteria](#hub-selection-criteria)
4. [Inventory Allocation](#inventory-allocation)
5. [Routing Optimization](#routing-optimization)
6. [Implementation Details](#implementation-details)

---

## 1. Overview

The fulfillment routing system intelligently determines the optimal fulfillment hub for each order based on multiple factors including proximity, inventory availability, hub capacity, and cost efficiency.

### Key Objectives
- Minimize delivery time and cost
- Optimize inventory utilization across hubs
- Balance workload across fulfillment centers
- Ensure high order fulfillment rates
- Support business rules and priorities

---

## 2. Routing Algorithm

### 2.1 Core Algorithm

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
}
```

### 2.2 Scoring System

```typescript
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
```

---

## 3. Hub Selection Criteria

### 3.1 Primary Factors

#### Geographic Proximity
```typescript
private calculateProximityScore(
  shippingAddress: Address,
  hubLocation: Location
): number {
  const distance = this.geoService.calculateDistance(shippingAddress, hubLocation);
  
  // Score based on distance thresholds
  if (distance <= 50) return 1.0;  // Same city
  if (distance <= 200) return 0.8; // Same state/region
  if (distance <= 500) return 0.6; // Neighboring states
  if (distance <= 1000) return 0.4; // Same coast
  return 0.2; // Cross-country
}
```

#### Inventory Availability
```typescript
private async calculateInventoryScore(
  items: OrderItem[],
  hub: FulfillmentHub
): Promise<number> {
  const availability = await Promise.all(
    items.map(async (item) => {
      const stock = await hub.getInventoryLevel(item.variantId);
      return stock >= item.quantity ? 1 : stock / item.quantity;
    })
  );
  
  // All items must be available for full score
  const minAvailability = Math.min(...availability);
  return minAvailability;
}
```

#### Hub Capacity
```typescript
private calculateCapacityScore(hub: FulfillmentHub): number {
  const utilizationRate = hub.currentOrders / hub.maxCapacity;
  
  if (utilizationRate < 0.5) return 1.0;  // Low utilization
  if (utilizationRate < 0.7) return 0.8;  // Moderate utilization
  if (utilizationRate < 0.85) return 0.6; // High utilization
  if (utilizationRate < 0.95) return 0.3; // Very high utilization
  return 0.1; // Near capacity
}
```

### 3.2 Secondary Factors

- **Processing Speed**: Historical average processing time
- **Cost Efficiency**: Shipping cost from hub to destination
- **Hub Specialization**: Expertise in specific product categories
- **Service Level**: Hub's SLA compliance rate
- **Weather/Seasonal**: Current conditions affecting operations

---

## 4. Inventory Allocation

### 4.1 Allocation Strategy

```typescript
export class InventoryAllocationService {
  async allocateInventory(
    order: Order,
    hubId: string
  ): Promise<AllocationResult> {
    const allocations: InventoryAllocation[] = [];
    
    await this.manager.transaction(async (transactionalManager) => {
      for (const item of order.items) {
        // Reserve inventory at the selected hub
        const allocation = await this.reserveInventory(
          transactionalManager,
          hubId,
          item.variantId,
          item.quantity
        );
        
        allocations.push(allocation);
        
        // Update available inventory
        await this.updateAvailableInventory(
          transactionalManager,
          hubId,
          item.variantId,
          -item.quantity
        );
      }
    });
    
    return {
      orderId: order.id,
      hubId,
      allocations,
      status: 'allocated',
    };
  }
}
```

### 4.2 Fallback Mechanisms

```typescript
async handleAllocationFailure(
  order: Order,
  primaryHub: string,
  failedItems: string[]
): Promise<RoutingDecision> {
  // Try alternative hubs
  const alternativeHubs = await this.getAlternativeHubs(order, primaryHub);
  
  for (const hub of alternativeHubs) {
    const canFulfill = await this.checkPartialFulfillment(hub, failedItems);
    if (canFulfill) {
      return this.createSplitFulfillment(order, primaryHub, hub, failedItems);
    }
  }
  
  // If no single hub can fulfill, consider multi-hub fulfillment
  return this.createMultiHubFulfillment(order);
}
```

---

## 5. Routing Optimization

### 5.1 Real-Time Optimization

```typescript
export class RoutingOptimizer {
  private cache: Map<string, RoutingDecision> = new Map();
  
  async optimizeRouting(order: Order): Promise<RoutingDecision> {
    // Check cache for recent similar orders
    const cacheKey = this.generateCacheKey(order);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached)) {
      return this.adjustForCurrentConditions(cached);
    }
    
    // Real-time factors
    const realTimeFactors = await this.getRealTimeFactors();
    
    // Optimize based on current conditions
    const optimized = await this.performOptimization(order, realTimeFactors);
    
    // Cache the decision
    this.cache.set(cacheKey, optimized);
    
    return optimized;
  }
  
  private async getRealTimeFactors(): Promise<RealTimeFactors> {
    return {
      hubLoads: await this.getHubLoadFactors(),
      trafficConditions: await this.getTrafficData(),
      weatherImpacts: await this.getWeatherImpacts(),
      carrierAvailability: await this.getCarrierStatus(),
    };
  }
}
```

### 5.2 Machine Learning Integration

```typescript
export class MLRoutingPredictor {
  async predictOptimalHub(order: Order): Promise<HubPrediction> {
    const features = this.extractFeatures(order);
    
    // Call ML model for prediction
    const prediction = await this.mlModel.predict({
      orderFeatures: features,
      historicalData: await this.getHistoricalPatterns(order),
      currentConditions: await this.getCurrentConditions(),
    });
    
    return {
      recommendedHub: prediction.hubId,
      confidence: prediction.confidence,
      alternativeHubs: prediction.alternatives,
      expectedDeliveryTime: prediction.deliveryEstimate,
    };
  }
}
```

---

## 6. Implementation Details

### 6.1 Database Schema

```sql
-- Routing decisions table
CREATE TABLE routing_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  hub_id UUID NOT NULL REFERENCES fulfillment_hubs(id),
  score DECIMAL(5,2) NOT NULL,
  routing_factors JSONB NOT NULL,
  alternative_hubs UUID[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_routing_order (order_id),
  INDEX idx_routing_hub (hub_id)
);

-- Routing rules table
CREATE TABLE routing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  priority INTEGER NOT NULL,
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hub performance metrics
CREATE TABLE hub_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES fulfillment_hubs(id),
  date DATE NOT NULL,
  orders_processed INTEGER DEFAULT 0,
  avg_processing_time INTERVAL,
  fulfillment_rate DECIMAL(5,2),
  on_time_rate DECIMAL(5,2),
  UNIQUE(hub_id, date)
);
```

### 6.2 API Endpoints

```typescript
// Route order endpoint
POST /api/admin/orders/:orderId/route
{
  "priority": "standard",
  "preferredHub": "hub_123", // optional
  "constraints": {
    "maxDistance": 500,
    "requireSameDay": false
  }
}

// Get routing decision
GET /api/admin/orders/:orderId/routing

// Override routing decision
PUT /api/admin/orders/:orderId/routing
{
  "hubId": "hub_456",
  "reason": "Manual override - customer preference"
}

// Routing analytics
GET /api/admin/analytics/routing
?startDate=2025-01-01
&endDate=2025-01-31
&groupBy=hub
```

### 6.3 Event Handling

```typescript
// Event subscribers
export class RoutingEventSubscriber {
  constructor({ eventBusService, routingService }) {
    // Subscribe to order events
    eventBusService.subscribe('order.placed', async ({ order }) => {
      const routing = await routingService.routeOrder(order);
      await eventBusService.emit('order.routed', { order, routing });
    });
    
    // Subscribe to inventory events
    eventBusService.subscribe('inventory.low', async ({ hub, variant }) => {
      await routingService.updateHubInventoryScore(hub, variant);
    });
    
    // Subscribe to hub events
    eventBusService.subscribe('hub.capacity_changed', async ({ hub }) => {
      await routingService.recalculateHubScores(hub);
    });
  }
}
```

### 6.4 Monitoring and Alerts

```typescript
export class RoutingMonitor {
  async checkRoutingHealth(): Promise<HealthStatus> {
    const metrics = await this.getRoutingMetrics();
    
    const alerts = [];
    
    // Check for routing failures
    if (metrics.failureRate > 0.05) {
      alerts.push({
        severity: 'high',
        message: `High routing failure rate: ${metrics.failureRate * 100}%`,
      });
    }
    
    // Check for hub imbalances
    const imbalance = this.calculateHubImbalance(metrics.hubUtilization);
    if (imbalance > 0.3) {
      alerts.push({
        severity: 'medium',
        message: 'Significant hub utilization imbalance detected',
      });
    }
    
    return {
      status: alerts.length === 0 ? 'healthy' : 'degraded',
      metrics,
      alerts,
    };
  }
}
```

---

## Summary

The fulfillment routing system provides intelligent order routing with:

1. **Multi-factor scoring algorithm** considering proximity, inventory, capacity, speed, and cost
2. **Real-time optimization** based on current conditions
3. **Fallback mechanisms** for handling edge cases
4. **Machine learning integration** for predictive routing
5. **Comprehensive monitoring** and alerting
6. **Flexible rule engine** for business-specific routing logic

The system ensures optimal order fulfillment while balancing operational efficiency across the fulfillment network.
