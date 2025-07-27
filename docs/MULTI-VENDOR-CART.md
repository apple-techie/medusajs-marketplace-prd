# Multi-Vendor Cart Implementation

## Overview

The multi-vendor cart functionality allows customers to purchase products from multiple vendors in a single checkout flow. The system automatically:
- Groups items by vendor
- Calculates commission for each vendor
- Validates fulfillment capabilities
- Splits orders for vendor-specific processing

## Key Components

### 1. MultiVendorCartService
Located in `src/modules/marketplace/services/multi-vendor-cart.ts`

**Key Methods:**
- `processMultiVendorCart(cart)` - Groups cart items by vendor and calculates totals
- `validateCartFulfillment(cart)` - Ensures all items can be fulfilled
- `splitCartIntoVendorOrders(cart)` - Prepares vendor-specific order data
- `enrichCartWithVendorData(cart)` - Adds vendor metadata to cart

### 2. VendorOrder Model
Located in `src/modules/marketplace/models/vendor-order.ts`

Tracks vendor-specific order information:
- Links to main order
- Vendor payout calculations
- Item details
- Status tracking (pending → confirmed → processing → shipped → delivered)

### 3. API Endpoints

#### Store APIs
- `GET /store/carts/:id/vendor-summary` - Get vendor breakdown for a cart
- `POST /store/carts/:id/validate-fulfillment` - Validate cart can be fulfilled
- `POST /store/vendor-checkout` - Process multi-vendor checkout

#### Vendor APIs
- `GET /vendor/orders` - Get orders for authenticated vendor

## Usage Examples

### 1. Get Vendor Summary for Cart
```javascript
// GET /store/carts/cart_01ABC123/vendor-summary
{
  "cart_id": "cart_01ABC123",
  "vendor_summary": {
    "vendor_count": 2,
    "vendors": [
      {
        "vendor_id": "vendor_001",
        "vendor_name": "Urban Style Shop",
        "vendor_type": "shop",
        "item_count": 2,
        "subtotal": 8997,
        "commission": 1799.4,
        "vendor_payout": 7197.6
      },
      {
        "vendor_id": "vendor_002",
        "vendor_name": "TechBrand Electronics",
        "vendor_type": "brand",
        "item_count": 1,
        "subtotal": 34999,
        "commission": 3499.9,
        "vendor_payout": 31499.1
      }
    ],
    "total_amount": 43996,
    "total_commission": 5299.3,
    "total_vendor_payout": 38696.7
  }
}
```

### 2. Validate Cart Fulfillment
```javascript
// POST /store/carts/cart_01ABC123/validate-fulfillment
{
  "cart_id": "cart_01ABC123",
  "fulfillment_valid": true,
  "message": "All items can be fulfilled"
}
```

### 3. Process Multi-Vendor Checkout
```javascript
// POST /store/vendor-checkout
{
  "cart_id": "cart_01ABC123"
}

// Response
{
  "order_id": "order_01DEF456",
  "vendor_orders": [
    {
      "vendor_id": "vendor_001",
      "vendor_name": "Urban Style Shop",
      "item_count": 2,
      "vendor_payout": 7197.6
    },
    {
      "vendor_id": "vendor_002",
      "vendor_name": "TechBrand Electronics",
      "item_count": 1,
      "vendor_payout": 31499.1
    }
  ],
  "message": "Multi-vendor checkout completed successfully"
}
```

## Commission Calculation

Commission is calculated based on vendor type and tier:

### Shop Partners (Tiered Commission)
- Bronze (0-$50k/month): 15%
- Silver ($50k-$200k/month): 20%
- Gold ($200k+/month): 25%

### Fixed Commission
- Brand Partners: 10%
- Distributor Partners: 5%

## Next Steps

1. **Payment Integration**: Implement Stripe Connect for automated vendor payouts
2. **Fulfillment Routing**: Add logic to route orders to optimal fulfillment locations
3. **Notifications**: Send order notifications to vendors
4. **Inventory Management**: Real-time inventory checks across vendors
5. **Shipping Calculation**: Calculate shipping costs per vendor