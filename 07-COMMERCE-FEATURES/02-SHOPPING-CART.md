# Shopping Cart & Checkout

## Overview

The shopping cart and checkout system provides a seamless purchasing experience with support for multiple fulfillment locations, age verification, and various payment methods.

## Cart Management

### Cart Structure
```typescript
interface Cart {
  id: string;
  customer_id?: string;
  session_id: string;
  items: CartItem[];
  shipping_address?: Address;
  billing_address?: Address;
  selected_shipping_method?: ShippingMethod;
  applied_discounts: AppliedDiscount[];
  subtotal: Money;
  shipping_total: Money;
  tax_total: Money;
  discount_total: Money;
  total: Money;
  currency: string;
  metadata: {
    source_shop_id?: string;
    referral_code?: string;
    age_verified?: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

interface CartItem {
  id: string;
  variant_id: string;
  quantity: number;
  price: Money;
  subtotal: Money;
  fulfillment_hub_id?: string;
  metadata: Record<string, any>;
}
```

### Cart Operations
- Add/update/remove items
- Merge guest cart with customer cart on login
- Automatic cart abandonment tracking
- Cart persistence across sessions
- Multi-currency support

## Checkout Flow

### Checkout Steps
1. **Cart Review**: Review items and apply discounts
2. **Age Verification**: Verify age for restricted products
3. **Customer Information**: Email and contact details
4. **Shipping Address**: Delivery location selection
5. **Shipping Method**: Choose delivery speed/method
6. **Payment Method**: Select and enter payment details
7. **Order Review**: Final review before placement
8. **Order Confirmation**: Success page with order details

### Guest Checkout
- No account required for purchase
- Option to create account post-purchase
- Email-based order tracking
- Simplified checkout flow

### Express Checkout
- One-click checkout for returning customers
- Saved addresses and payment methods
- Default shipping preferences
- Skip redundant steps

## Shipping & Delivery

### Shipping Calculation
```typescript
interface ShippingCalculator {
  calculateRates(cart: Cart, address: Address): ShippingRate[];
  
  factors: {
    distance: number;
    weight: number;
    dimensions: Dimensions;
    delivery_speed: 'standard' | 'express' | 'same_day';
    fulfillment_hub: FulfillmentHub;
  };
}
```

### Delivery Options
1. **Standard Delivery**: 2-3 business days
2. **Express Delivery**: Next business day
3. **Same-Day Delivery**: For eligible areas
4. **Scheduled Delivery**: Choose specific date/time
5. **Pickup at Hub**: Customer pickup option

### Delivery Zones
- Zone-based pricing
- Distance calculations from fulfillment hubs
- Service area restrictions
- Real-time availability checks

## Payment Processing

### Supported Payment Methods
1. **Credit/Debit Cards**: Visa, Mastercard, Amex, Discover
2. **Digital Wallets**: Apple Pay, Google Pay, PayPal
3. **Buy Now Pay Later**: Klarna, Afterpay, Affirm
4. **Cryptocurrency**: Bitcoin, Ethereum (optional)
5. **Store Credit**: Gift cards and loyalty points

### Payment Security
- PCI DSS compliance
- Tokenized card storage
- 3D Secure authentication
- Fraud detection and prevention
- SSL/TLS encryption

### Payment Flow
```typescript
interface PaymentProcessor {
  async processPayment(order: Order, payment: PaymentMethod): Promise<PaymentResult> {
    // 1. Validate payment method
    // 2. Calculate final amount
    // 3. Apply fraud checks
    // 4. Process with payment gateway
    // 5. Handle response
    // 6. Update order status
  }
}
```

## Tax Calculation

### Tax Engine
- Real-time tax calculation
- Multi-jurisdictional support
- Product-specific tax rates
- Tax-exempt customer handling
- Nexus management

### Tax Integration
```typescript
interface TaxCalculator {
  calculateTax(cart: Cart, address: Address): TaxBreakdown;
  
  considerations: {
    product_tax_codes: Map<string, string>;
    customer_exemptions: CustomerExemption[];
    nexus_states: string[];
    origin_based_vs_destination_based: boolean;
  };
}
```

## Promotions & Discounts

### Discount Types
1. **Cart-Level Discounts**: Apply to entire order
2. **Product Discounts**: Specific item discounts
3. **Shipping Discounts**: Free or reduced shipping
4. **Bundle Discounts**: Multi-product deals
5. **Loyalty Discounts**: Points redemption

### Coupon System
```typescript
interface Coupon {
  code: string;
  type: 'percentage' | 'fixed' | 'shipping' | 'bogo';
  value: number;
  minimum_purchase?: Money;
  valid_from: Date;
  valid_to: Date;
  usage_limit?: number;
  usage_per_customer?: number;
  applicable_products?: string[];
  applicable_categories?: string[];
  stackable: boolean;
}
```

## Order Validation

### Pre-Order Checks
1. **Inventory Availability**: Real-time stock verification
2. **Age Verification**: For restricted products
3. **Address Validation**: Delivery feasibility
4. **Payment Validation**: Sufficient funds/credit
5. **Fraud Detection**: Risk assessment

### Validation Rules
```typescript
interface OrderValidator {
  async validate(order: Order): Promise<ValidationResult> {
    const checks = [
      this.validateInventory(),
      this.validateAgeRequirements(),
      this.validateShippingAddress(),
      this.validatePaymentMethod(),
      this.validateMinimumOrder(),
      this.validateDeliveryZone(),
    ];
    
    return Promise.all(checks);
  }
}
```

## Checkout UI Components

### Cart Summary
```tsx
export function CartSummary({ cart }: { cart: Cart }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      {/* Line Items */}
      <div className="space-y-3 mb-4">
        {cart.items.map((item) => (
          <CartLineItem key={item.id} item={item} />
        ))}
      </div>
      
      {/* Totals */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatMoney(cart.subtotal)}</span>
        </div>
        {cart.discount_total > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatMoney(cart.discount_total)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatMoney(cart.shipping_total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatMoney(cart.tax_total)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-2">
          <span>Total</span>
          <span>{formatMoney(cart.total)}</span>
        </div>
      </div>
    </div>
  );
}
```

### Checkout Form
```tsx
export function CheckoutForm() {
  const [step, setStep] = useState(1);
  const { cart, customer } = useCheckout();
  
  return
