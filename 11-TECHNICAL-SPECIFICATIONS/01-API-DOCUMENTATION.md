# API Documentation & Technical Specifications

## Overview

This document provides comprehensive API documentation and technical specifications for the MedusaJS marketplace platform.

## API Architecture

### RESTful API Design
- **Base URL**: `https://api.marketplace.com/v1`
- **Authentication**: Bearer token (JWT)
- **Content-Type**: `application/json`
- **Rate Limiting**: Tiered based on user role

### API Versioning
```
/v1/ - Current stable version
/v2/ - Beta version (when applicable)
/legacy/ - Deprecated endpoints
```

## Authentication Endpoints

### User Authentication
```typescript
// Login
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string,
  refresh_token: string,
  user: User
}

// Register
POST /auth/register
Body: {
  email: string,
  password: string,
  name: string,
  role: 'customer' | 'shop' | 'brand' | 'distributor' | 'driver'
}

// Refresh Token
POST /auth/refresh
Body: {
  refresh_token: string
}

// Logout
POST /auth/logout
Headers: {
  Authorization: Bearer {token}
}
```

## Vendor Management APIs

### Shop APIs
```typescript
// Get shop details
GET /shops/:shopId

// Update shop profile
PUT /shops/:shopId
Body: {
  name?: string,
  description?: string,
  logo?: string,
  settings?: ShopSettings
}

// Get shop analytics
GET /shops/:shopId/analytics
Query: {
  start_date: string,
  end_date: string,
  metrics: string[]
}

// Generate referral link
POST /shops/:shopId/referral-links
Body: {
  campaign_name: string,
  utm_params: UTMParams
}
```

### Brand APIs
```typescript
// List brand products
GET /brands/:brandId/products
Query: {
  page: number,
  limit: number,
  category?: string,
  status?: 'active' | 'draft' | 'out_of_stock'
}

// Create product
POST /brands/:brandId/products
Body: {
  name: string,
  description: string,
  variants: ProductVariant[],
  categories: string[],
  images: string[]
}

// Update inventory
PUT /brands/:brandId/inventory
Body: {
  updates: [{
    variant_id: string,
    quantity: number,
    location_id?: string
  }]
}
```

## Order Management APIs

### Order APIs
```typescript
// Create order
POST /orders
Body: {
  items: OrderItem[],
  shipping_address: Address,
  payment_method: string,
  shop_referral_code?: string
}

// Get order details
GET /orders/:orderId

// Update order status
PUT /orders/:orderId/status
Body: {
  status: OrderStatus,
  notes?: string
}

// Track order
GET /orders/:orderId/tracking
```

## Operations APIs

### Fulfillment Hub APIs
```typescript
// Get hub status
GET /hubs/:hubId/status

// Process fulfillment
POST /hubs/:hubId/fulfillments
Body: {
  order_id: string,
  items: FulfillmentItem[]
}

// Transfer inventory
POST /hubs/transfers
Body: {
  source_hub: string,
  destination_hub: string,
  items: TransferItem[],
  priority: 'normal' | 'urgent'
}
```

## Delivery Network APIs

### Driver APIs
```typescript
// Get available deliveries
GET /drivers/deliveries/available
Query: {
  location: "lat,lng",
  radius: number
}

// Accept delivery
POST /drivers/deliveries/:deliveryId/accept

// Update delivery status
PUT /drivers/deliveries/:deliveryId/status
Body: {
  status: 'picked_up' | 'in_transit' | 'delivered',
  location?: GeoPoint,
  proof_of_delivery?: string
}

// Get earnings
GET /drivers/earnings
Query: {
  period: 'daily' | 'weekly' | 'monthly'
}
```

## WebSocket Events

### Real-Time Updates
```typescript
// Connection
ws://api.marketplace.com/realtime

// Subscribe to events
{
  "action": "subscribe",
  "channels": ["orders", "inventory", "deliveries"]
}

// Order updates
{
  "event": "order.status_changed",
  "data": {
    "order_id": "123",
    "old_status": "pending",
    "new_status": "processing"
  }
}

// Inventory updates
{
  "event": "inventory.updated",
  "data": {
    "variant_id": "456",
    "old_quantity": 100,
    "new_quantity": 95
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "request_id": "req_123456"
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## SDK Examples

### JavaScript/TypeScript SDK
```typescript
import { MarketplaceSDK } from '@marketplace/sdk';

const sdk = new MarketplaceSDK({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Create order
const order = await sdk.orders.create({
  items: [
    { variant_id: '123', quantity: 2 }
  ],
  shipping_address: {
    line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105'
  }
});

// Track order
const tracking = await sdk.orders.track(order.id);
```

## Webhooks

### Webhook Configuration
```typescript
POST /webhooks
Body: {
  url: string,
  events: string[],
  secret: string
}

// Webhook payload
{
  "event": "order.completed",
  "timestamp": "2025-01-19T12:00:00Z",
  "data": {
    // Event-specific data
  },
  "signature": "sha256=..."
}
```

## Performance Guidelines

### Best Practices
1. **Pagination**: Use cursor-based pagination for large datasets
2. **Caching**: Implement ETags for conditional requests
3. **Compression**: Enable gzip compression
4. **Batch Operations**: Use bulk endpoints when available
5. **Field Selection**: Request only needed fields using `fields` parameter

### Rate Limits
```typescript
interface RateLimits {
  anonymous: "100 requests/hour",
  authenticated: "1000 requests/hour",
  vendor: "5000 requests/hour",
  enterprise: "Custom limits"
}
```

## Testing

### Test Environment
- **Base URL**: `https://api-staging.marketplace.com/v1`
- **Test Credentials**: Available in developer portal
- **Sandbox Mode**: Safe testing without real transactions

### Postman Collection
Available at: `https://docs.marketplace.com/postman-collection.json`
