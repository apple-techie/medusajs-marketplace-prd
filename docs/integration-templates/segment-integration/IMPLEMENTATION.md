# Segment Integration Implementation Guide

## Overview

This custom Segment integration is designed for MedusaJS v2, providing comprehensive analytics tracking for your marketplace. Since the official `medusa-plugin-segment` is only compatible with v1, this implementation uses the Segment Node.js SDK directly.

## Key Features

1. **Automatic Event Tracking**
   - Order lifecycle events (placed, completed, refunded, cancelled)
   - Customer events (created, updated, logged in)
   - Product interactions (viewed, added to cart, removed)
   - Cart updates and checkout flows
   - Search tracking

2. **Customer Identification**
   - Automatic user identification on registration
   - Trait updates when customer profile changes
   - Anonymous tracking for guests

3. **Revenue Tracking**
   - Order revenue with product details
   - Tax, shipping, and discount breakdowns
   - Multi-currency support

## Architecture

### Module Structure
```
src/modules/segment/
├── index.ts       # Module definition
└── service.ts     # Core Segment service

src/subscribers/
└── segment.ts     # Event subscribers

src/api/middleware/
└── segment.ts     # HTTP middleware for tracking

src/loaders/
└── segment.ts     # Module loader
```

### Event Flow
1. MedusaJS emits events (e.g., "order.placed")
2. Subscribers catch these events
3. SegmentService formats and sends data to Segment
4. Segment processes and routes to your destinations

## Configuration

### Environment Variables
```env
SEGMENT_WRITE_KEY=LNrLhZmYA8yMAlOc8AVNYAz8gi4PPywj
```

### Module Options
- `writeKey`: Your Segment write key (required)
- `flushAt`: Number of events to batch (default: 20)
- `flushInterval`: Time before sending batch in ms (default: 10000)

## Event Reference

### Customer Events

**Customer Created**
```javascript
{
  event: "Customer Created",
  userId: "cust_123",
  properties: {
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe"
  }
}
```

### Order Events

**Order Placed**
```javascript
{
  event: "Order Placed",
  userId: "cust_123",
  properties: {
    order_id: "order_123",
    total: 99.99,
    currency: "USD",
    products: [{
      product_id: "prod_123",
      name: "Product Name",
      price: 49.99,
      quantity: 2
    }]
  }
}
```

### Product Events

**Product Viewed**
```javascript
{
  event: "Product Viewed",
  userId: "cust_123",
  properties: {
    product_id: "prod_123",
    name: "Product Name",
    price: 49.99,
    category: "Electronics"
  }
}
```

## Custom Events

You can track custom events by injecting the SegmentService:

```typescript
import { SEGMENT_MODULE } from "../modules/segment"
import SegmentService from "../modules/segment/service"

const segmentService = container.resolve<SegmentService>(SEGMENT_MODULE)

await segmentService.track({
  userId: "cust_123",
  event: "Custom Event",
  properties: {
    custom_property: "value"
  }
})
```

## Testing

To verify your integration:

1. Check Segment Debugger in your Segment workspace
2. Look for events appearing in real-time
3. Verify event properties match expected format
4. Test both authenticated and anonymous user flows

## Troubleshooting

### Events Not Appearing
- Verify SEGMENT_WRITE_KEY is correct
- Check MedusaJS logs for errors
- Ensure subscribers are loaded
- Verify network connectivity

### Missing Event Data
- Check that relations are loaded in subscribers
- Verify property mappings in service methods
- Enable debug logging in Segment service

## Next Steps

1. Copy integration files to your MedusaJS project
2. Install dependencies: `npm install @segment/analytics-node`
3. Update medusa-config.ts with the module
4. Deploy and monitor in Segment dashboard
5. Set up destinations in Segment (Google Analytics, Mixpanel, etc.)

## Notes

- This integration is optimized for MedusaJS v2
- Events are batched for performance
- Failed events are logged but don't block operations
- Consider implementing retry logic for critical events