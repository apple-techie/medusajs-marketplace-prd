# Fulfillment Routing System

## Overview

The fulfillment routing system is an intelligent order routing algorithm that optimizes fulfillment location selection based on multiple factors including inventory availability, distance, cost, delivery time, and vendor reliability. It's built using MedusaJS's native workflow engine and integrates seamlessly with the inventory and fulfillment modules.

## Architecture

### Core Components

1. **Fulfillment Routing Service** - Core algorithm implementation
2. **MedusaJS Workflow** - Orchestrates the routing process
3. **Smart Fulfillment Provider** - Custom fulfillment provider integration
4. **Location & Rule Models** - Data structures for locations and routing rules

### System Flow

```
Order Placed → Routing Request → Location Scoring → Optimal Route Selection → Fulfillment Creation
     ↓              ↓                    ↓                    ↓                      ↓
  Validate      Check          Calculate Scores      Select Best         Create Vendor
  Address      Inventory        (5 factors)          Location(s)           Orders
```

## Scoring Algorithm

The routing algorithm uses a weighted multi-factor scoring model:

### 1. **Inventory Score (25% weight)**
- Full availability: 100 points
- Partial availability: 0-80 points (based on % available)
- No availability: 0 points

### 2. **Distance Score (20% weight)**
- <50 miles: 100 points
- 50-150 miles: 90 points
- 150-300 miles: 80 points
- 300-500 miles: 70 points
- 500-1000 miles: 50 points
- 1000-2000 miles: 30 points
- >2000 miles: 10 points

### 3. **Cost Score (25% weight)**
Based on estimated shipping + handling costs:
- <$5: 100 points
- $5-10: 90 points
- $10-15: 80 points
- $15-20: 70 points
- $20-30: 50 points
- $30-50: 30 points
- >$50: 10 points

### 4. **Time Score (20% weight)**
Based on estimated delivery days:
- Next day: 100 points
- 2 days: 90 points
- 3 days: 80 points
- 5 days: 60 points
- 7 days: 40 points
- >7 days: 20 points

### 5. **Reliability Score (10% weight)**
Based on historical performance:
- Fulfillment rate × (1 - error rate) × 100

## Data Models

### Fulfillment Location
```typescript
{
  id: string
  name: string
  code: string // e.g., "NYC-01"
  type: "warehouse" | "store" | "dropship" | "distribution_center"
  vendor_id?: string
  
  // Address & coordinates
  address: {...}
  latitude: number
  longitude: number
  
  // Capabilities
  processing_time_hours: number
  cutoff_time: string // "14:00"
  timezone: string
  shipping_zones: string[]
  excluded_states: string[]
  
  // Performance metrics
  fulfillment_rate: number
  average_processing_hours: number
  error_rate: number
  
  // Costs
  handling_fee_cents: number
  pick_pack_fee_cents: number
}
```

### Routing Rule
```typescript
{
  id: string
  name: string
  rule_type: "product" | "category" | "vendor" | "customer" | "region" | "weight" | "value"
  
  // Condition
  field_path: string // e.g., "product.metadata.requires_refrigeration"
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in"
  value: any
  
  // Action
  action: "require_location" | "exclude_location" | "prefer_location" | "apply_surcharge"
  action_value: any
  
  priority: number // Higher = evaluated first
}
```

## API Endpoints

### Admin APIs

#### Manage Fulfillment Locations
```
GET /admin/fulfillment-locations
POST /admin/fulfillment-locations
PUT /admin/fulfillment-locations/:id
DELETE /admin/fulfillment-locations/:id
```

#### Manage Routing Rules
```
GET /admin/routing-rules
POST /admin/routing-rules
PUT /admin/routing-rules/:id
DELETE /admin/routing-rules/:id
```

### Store APIs

#### Simulate Routing
```
POST /store/routing/simulate

Request:
{
  "customer_address": {
    "city": "New York",
    "state_province": "NY",
    "postal_code": "10001",
    "country_code": "US",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "items": [
    {
      "product_id": "prod_123",
      "variant_id": "var_123",
      "quantity": 2,
      "vendor_id": "vendor_456"
    }
  ],
  "shipping_option": {
    "service_level": "standard" // or "express", "overnight"
  }
}

Response:
{
  "routing": {
    "request_id": "routing_123",
    "optimal_routing": [
      {
        "location_id": "loc_789",
        "vendor_id": "vendor_456",
        "items": [...],
        "estimated_cost": 1299,
        "estimated_delivery_days": 3
      }
    ],
    "total_estimated_cost": 1299,
    "total_estimated_delivery_days": 3
  }
}
```

## MedusaJS Workflow Integration

The system uses MedusaJS workflows for orchestration:

### Main Workflow: `fulfillment-routing`
1. **Validate Order** - Ensures order has shipping address
2. **Check Inventory** - Parallel inventory checks across locations
3. **Calculate Routing** - Runs scoring algorithm
4. **Reserve Inventory** - Reserves items at selected locations
5. **Create Fulfillments** - Creates fulfillment and vendor order records

### Simulation Workflow: `simulate-routing`
- Runs routing calculation without creating records
- Used for shipping rate calculation at checkout

## Smart Fulfillment Provider

Custom fulfillment provider that integrates with the routing system:

### Features
- Dynamic shipping rate calculation based on routing
- Automatic order routing on fulfillment creation
- Support for standard/express/overnight service levels
- Fallback pricing when routing fails

### Configuration
```javascript
// In medusa-config.js
{
  modules: {
    fulfillment: {
      providers: [
        {
          resolve: "./src/modules/marketplace/providers/smart-fulfillment",
          id: "smart-fulfillment",
          options: {
            // Provider options
          }
        }
      ]
    }
  }
}
```

## Usage Examples

### 1. Create a Fulfillment Location
```javascript
const location = await marketplaceService.createFulfillmentLocation({
  name: "NYC Distribution Center",
  code: "NYC-DC-01",
  type: "distribution_center",
  vendor_id: "vendor_123",
  address_line_1: "123 Warehouse Way",
  city: "New York",
  state_province: "NY",
  postal_code: "10001",
  country_code: "US",
  latitude: 40.7128,
  longitude: -74.0060,
  processing_time_hours: 24,
  cutoff_time: "15:00",
  shipping_zones: ["NY", "NJ", "CT", "PA"]
})
```

### 2. Create a Routing Rule
```javascript
const rule = await marketplaceService.createRoutingRule({
  name: "Require refrigerated location for cold items",
  rule_type: "product",
  field_path: "metadata.requires_refrigeration",
  operator: "equals",
  value: true,
  action: "require_location",
  action_value: { type: "distribution_center", has_refrigeration: true },
  priority: 100
})
```

### 3. Test Routing
```javascript
const routing = await marketplaceService.calculateFulfillmentRouting({
  customer_address: {
    city: "Los Angeles",
    state_province: "CA",
    postal_code: "90001",
    country_code: "US"
  },
  items: [
    {
      product_id: "prod_abc",
      variant_id: "var_xyz",
      quantity: 1,
      vendor_id: "vendor_123"
    }
  ]
})
```

## Advanced Features

### Split Shipments
The algorithm can split orders across multiple locations when:
- No single location has all items
- Cost optimization suggests splitting
- Different vendors require different locations

### Rule Engine
Routing rules allow complex business logic:
- Product-specific requirements (e.g., hazmat, refrigeration)
- Geographic restrictions
- Vendor preferences
- Customer-specific routing

### Performance Optimization
- Caching of distance calculations
- Parallel inventory checks
- Optimized database queries with indexes
- Configurable timeout for routing calculations

## Future Enhancements

1. **Machine Learning Integration**
   - Predictive delivery time estimation
   - Dynamic weight adjustment based on outcomes
   - Anomaly detection for routing issues

2. **Advanced Constraints**
   - Carrier-specific routing
   - Time-window delivery
   - Capacity planning
   - Multi-modal transportation

3. **Real-time Updates**
   - Live inventory synchronization
   - Dynamic re-routing for delays
   - Weather-based adjustments

4. **Analytics Dashboard**
   - Routing performance metrics
   - Cost optimization insights
   - Vendor performance tracking

## Environment Variables

```env
# Routing Configuration
ROUTING_ALGORITHM_VERSION=1.0.0
ROUTING_TIMEOUT_MS=5000
ROUTING_CACHE_TTL=300

# Google Maps API (for geocoding)
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Testing

### Unit Tests
```bash
npm test src/modules/marketplace/services/fulfillment-routing.spec.ts
```

### Integration Tests
```bash
npm test:integration src/workflows/fulfillment-routing.spec.ts
```

### Load Testing
Use the simulation endpoint to test routing performance:
```bash
artillery run tests/load/routing-simulation.yml
```