# Segment Integration for MedusaJS v2

This directory contains the custom Segment analytics integration for MedusaJS v2.

## Installation

1. Install the Segment Node.js SDK:
```bash
npm install @segment/analytics-node
```

2. Copy the integration files to your MedusaJS project:
```bash
# Copy the segment service
cp segment-integration/src/modules/segment/service.ts src/modules/segment/service.ts
cp segment-integration/src/modules/segment/index.ts src/modules/segment/index.ts

# Copy the segment loader
cp segment-integration/src/loaders/segment.ts src/loaders/segment.ts

# Copy the subscriber
cp segment-integration/src/subscribers/segment.ts src/subscribers/segment.ts
```

3. Make sure your `.env` file contains:
```env
SEGMENT_WRITE_KEY=LNrLhZmYA8yMAlOc8AVNYAz8gi4PPywj
```

## Features

- Automatic tracking of key e-commerce events
- Customer identification and traits
- Order tracking with revenue
- Product interactions
- Cart events
- Search tracking
- Custom event support

## Events Tracked

### Customer Events
- Customer Created
- Customer Updated
- Customer Login

### Order Events
- Order Placed
- Order Completed
- Order Refunded
- Order Cancelled

### Product Events
- Product Viewed
- Product Added to Cart
- Product Removed from Cart

### Cart Events
- Cart Updated
- Checkout Started

### Search Events
- Products Searched