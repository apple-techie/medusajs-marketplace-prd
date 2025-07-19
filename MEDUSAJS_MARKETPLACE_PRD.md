# Comprehensive Product Requirements Document
## MedusaJS-Powered Affiliate Marketplace Platform

### Table of Contents
1. [Executive Summary](#executive-summary)
2. [Business Model Overview](#business-model-overview)
3. [System Architecture](#system-architecture)
4. [API Specifications](#api-specifications)
5. [Database Schema Design](#database-schema-design)
6. [Driver Mobile Interface](#driver-mobile-interface)
7. [Delivery Provider Integrations](#delivery-provider-integrations)
8. [Commission Payout Workflows](#commission-payout-workflows)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Technical Requirements](#technical-requirements)
11. [Security & Compliance](#security-compliance)
12. [Success Metrics](#success-metrics)

---

## 1. Executive Summary

### Project Overview
Transform the existing custom marketplace platform into a MedusaJS-powered affiliate marketplace that connects shops (affiliates), brands (suppliers), distributors (fulfillment), and drivers (delivery) in a unique commission-based ecosystem.

### Key Differentiators
- **Affiliate Model**: Shops don't hold inventory but earn 15-25% commission
- **Tiered Commission**: Performance-based rewards for shops
- **Hybrid Delivery**: Own driver network with third-party fallback
- **Multi-Vendor**: Brands and distributors with volume-based platform fees

### Technology Stack
- **Backend**: MedusaJS (Node.js, TypeScript)
- **Database**: PostgreSQL (via MedusaJS)
- **Frontend**: Next.js 14 (existing)
- **Payments**: Stripe Connect
- **Delivery**: Custom + DoorDash API
- **Infrastructure**: AWS/Vercel

---

## 2. Business Model Overview

### Revenue Streams

#### 2.1 Shop Commissions (Platform Pays Out)
```
Bronze Tier (15%): $0 - $15,000 monthly sales
Silver Tier (20%): $15,001 - $50,000 monthly sales
Gold Tier (25%): $50,001+ monthly sales

Promotional: New shops get Gold tier for first 3 months
```

#### 2.2 Brand Platform Fees (Platform Collects)
```
Starter (10%): $0 - $100,000 monthly volume
Growth (15%): $100,001 - $500,000 monthly volume
Enterprise (20%): $500,001+ monthly volume
```

#### 2.3 Distributor Platform Fees (Platform Collects)
```
Pioneer Rate (3%): First distributor in region for 6 months
Standard (10%): New distributors base rate
Volume Discounts:
- 8%: $50,000+ monthly volume
- 6%: $100,000+ monthly volume
- 5%: $250,000+ monthly volume
- 3%: $500,000+ monthly volume (minimum)
```

#### 2.4 Delivery Economics
```
Driver Pay:
- Base: $4.00 per delivery
- Mileage: $0.75/mile after first 5 miles
- Example: 10-mile delivery = $4 + (5 × $0.75) = $7.75

Customer Charges:
- Delivery fee: Variable based on distance
- Platform keeps margin between customer fee and driver pay
```

### Transaction Flow Example
```
Customer Order: $100
├── Shop Commission (20%): -$20 → Shop receives
├── Product Cost: $50 → Brand receives $45 (after 10% fee)
├── Platform Gross: $30
├── Delivery Cost: -$8 → Driver receives
└── Platform Net: $22
```

---

## 3. System Architecture

### 3.1 High-Level Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  MedusaJS API   │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                         │
         │                       ├─── Stripe Connect ─────┤
         │                       ├─── DoorDash API ──────┤
         │                       ├─── SMS (Twilio) ──────┤
         │                       └─── Redis Cache ───────┘
         │
         └─── CDN (Images/Static Assets)
```

### 3.2 MedusaJS Module Architecture

```typescript
// src/modules/index.ts
export const modules = {
  // Core MedusaJS modules
  productModule: {
    resolve: "@medusajs/product",
  },
  inventoryModule: {
    resolve: "@medusajs/inventory",
  },
  cartModule: {
    resolve: "@medusajs/cart",
  },
  
  // Custom modules
  affiliateMarketplace: {
    resolve: "./modules/affiliate-marketplace",
    options: {
      enableCommissionTracking: true,
      tierUpdateFrequency: "daily",
    },
  },
  deliveryNetwork: {
    resolve: "./modules/delivery-network",
    options: {
      providers: ["internal", "doordash"],
      defaultProvider: "internal",
    },
  },
  vendorManagement: {
    resolve: "./modules/vendor-management",
    options: {
      vendorTypes: ["shop", "brand", "distributor"],
    },
  },
}
```

### 3.3 MedusaJS Payment Integration

```typescript
// Stripe Connect Integration (Custom Module Required)
export const stripeConnectModule = {
  resolve: "./modules/stripe-connect",
  options: {
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    connectOptions: {
      // Platform configuration
      platformFeePercent: 2.9, // Stripe's fee
      enabledCountries: ['US'],
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    },
  },
}

// Note: MedusaJS has basic Stripe support but NOT Stripe Connect
// We need to build custom integration for:
// - Connected account onboarding
// - Split payments
// - Platform fees
// - Automated transfers
```

### 3.4 Service Layer Architecture

```typescript
// Detailed service structure
src/
├── api/
│   ├── admin/
│   │   ├── vendors/
│   │   ├── commissions/
│   │   └── analytics/
│   ├── store/
│   │   ├── products/
│   │   ├── cart/
│   │   └── checkout/
│   └── vendor/
│       ├── dashboard/
│       ├── products/
│       └── orders/
├── modules/
│   ├── affiliate-marketplace/
│   │   ├── models/
│   │   │   ├── shop-tier.ts
│   │   │   ├── commission-rule.ts
│   │   │   └── payout.ts
│   │   ├── services/
│   │   │   ├── commission-calculator.ts
│   │   │   ├── tier-manager.ts
│   │   │   └── payout-processor.ts
│   │   └── subscribers/
│   │       ├── order-completed.ts
│   │       └── monthly-tier-update.ts
│   ├── loyalty-points/
│   │   ├── models/
│   │   │   ├── points-balance.ts
│   │   │   ├── points-transaction.ts
│   │   │   └── rewards-tier.ts
│   │   ├── services/
│   │   │   ├── points-calculator.ts
│   │   │   ├── points-redeemer.ts
│   │   │   └── rewards-manager.ts
│   │   └── subscribers/
│   │       └── order-points-award.ts
│   ├── unified-catalog/
│   │   ├── models/
│   │   │   ├── master-product.ts
│   │   │   ├── product-variant.ts
│   │   │   └── vendor-product-mapping.ts
│   │   ├── services/
│   │   │   ├── product-matcher.ts
│   │   │   ├── catalog-synchronizer.ts
│   │   │   └── price-aggregator.ts
│   │   └── subscribers/
│   │       └── product-sync.ts
│   ├── stripe-connect/
│   │   ├── models/
│   │   │   ├── connected-account.ts
│   │   │   ├── payout-schedule.ts
│   │   │   └── platform-fee.ts
│   │   ├── services/
│   │   │   ├── account-onboarding.ts
│   │   │   ├── payment-splitter.ts
│   │   │   └── transfer-manager.ts
│   │   └── webhooks/
│   │       └── stripe-webhook-handler.ts
│   ├── delivery-network/
│   │   ├── models/
│   │   │   ├── driver.ts
│   │   │   ├── delivery-route.ts
│   │   │   └── delivery-assignment.ts
│   │   ├── services/
│   │   │   ├── driver-manager.ts
│   │   │   ├── route-optimizer.ts
│   │   │   ├── delivery-tracker.ts
│   │   │   └── provider-selector.ts
│   │   ├── providers/
│   │   │   ├── internal-driver.ts
│   │   │   ├── doordash.ts
│   │   │   └── provider-interface.ts
│   │   └── subscribers/
│   │       └── order-fulfillment.ts
│   └── vendor-management/
│       ├── models/
│       │   ├── vendor.ts
│       │   ├── vendor-product.ts
│       │   └── vendor-settings.ts
│       ├── services/
│       │   ├── vendor-onboarding.ts
│       │   ├── fee-calculator.ts
│       │   └── vendor-analytics.ts
│       └── strategies/
│           ├── shop-strategy.ts
│           ├── brand-strategy.ts
│           └── distributor-strategy.ts
```

---

## 4. API Specifications

### 4.1 Shop (Affiliate) APIs

#### Get Shop Dashboard
```typescript
GET /api/vendor/shop/dashboard
Authorization: Bearer {shop_token}

Response:
{
  "shop": {
    "id": "shop_123",
    "name": "Vape Shop LA",
    "tier": {
      "current": "silver",
      "commission_rate": 0.20,
      "monthly_sales": 35000,
      "next_tier_threshold": 50000,
      "promotional": {
        "active": true,
        "original_tier": "bronze",
        "expires_at": "2025-10-19T00:00:00Z",
        "type": "new_signup"
      }
    }
  },
  "metrics": {
    "today": {
      "sales": 2500,
      "commissions": 500,
      "orders": 12
    },
    "month_to_date": {
      "sales": 35000,
      "commissions": 7000,
      "orders": 168
    }
  },
  "recent_orders": [...],
  "referral_link": "https://platform.com/shop/vape-shop-la"
}
```

#### Generate Referral Link
```typescript
POST /api/vendor/shop/referral-links
{
  "campaign": "summer-sale",
  "utm_params": {
    "source": "instagram",
    "medium": "story"
  }
}

Response:
{
  "link": "https://platform.com/shop/vape-shop-la?campaign=summer-sale&utm_source=instagram",
  "qr_code": "data:image/png;base64,...",
  "short_link": "https://plat.fm/vsl-summer"
}
```

### 4.2 Brand APIs

#### List Brand Products
```typescript
GET /api/vendor/brand/products
Authorization: Bearer {brand_token}

Response:
{
  "products": [
    {
      "id": "prod_123",
      "name": "Premium Vape Juice",
      "wholesale_price": 15.00,
      "suggested_retail": 29.99,
      "inventory": {
        "available": 500,
        "reserved": 50,
        "incoming": 1000
      },
      "performance": {
        "units_sold_mtd": 250,
        "revenue_mtd": 3750,
        "platform_fees_mtd": 375
      }
    }
  ],
  "pagination": {...}
}
```

#### Update Product Pricing
```typescript
PUT /api/vendor/brand/products/{id}/pricing
{
  "wholesale_price": 14.50,
  "minimum_order_quantity": 10,
  "volume_discounts": [
    { "quantity": 100, "discount_percent": 5 },
    { "quantity": 500, "discount_percent": 10 }
  ]
}
```

### 4.3 Distributor APIs

#### Get Fulfillment Queue
```typescript
GET /api/vendor/distributor/fulfillment-queue
Authorization: Bearer {distributor_token}

Response:
{
  "pending_orders": [
    {
      "id": "order_123",
      "priority": "high",
      "items": [
        {
          "product_id": "prod_123",
          "quantity": 10,
          "location": "Warehouse A, Bin 23"
        }
      ],
      "pickup_deadline": "2025-07-19T14:00:00Z",
      "assigned_driver": {
        "id": "driver_456",
        "name": "John Doe",
        "eta": "2025-07-19T13:45:00Z"
      }
    }
  ],
  "stats": {
    "pending": 15,
    "in_progress": 8,
    "completed_today": 45
  }
}
```

### 4.4 Driver APIs

#### Get Available Deliveries
```typescript
GET /api/driver/deliveries/available
Authorization: Bearer {driver_token}
Query: ?lat=34.0522&lng=-118.2437

Response:
{
  "deliveries": [
    {
      "id": "delivery_123",
      "pickup": {
        "address": "123 Warehouse St",
        "distance_miles": 2.3,
        "ready_at": "2025-07-19T14:00:00Z"
      },
      "dropoff": {
        "address": "456 Customer Ave",
        "distance_miles": 5.8
      },
      "earnings": {
        "base": 4.00,
        "mileage": 0.60,
        "total": 4.60
      },
      "expires_in_seconds": 120
    }
  ]
}
```

#### Accept Delivery
```typescript
POST /api/driver/deliveries/{id}/accept
{
  "current_location": {
    "lat": 34.0522,
    "lng": -118.2437
  }
}

Response:
{
  "delivery": {
    "id": "delivery_123",
    "status": "assigned",
    "pickup": {
      "address": "123 Warehouse St",
      "contact": "Warehouse Manager",
      "phone": "+1234567890",
      "instructions": "Use loading dock B",
      "map_url": "https://maps.google.com/?q=..."
    },
    "items": [
      {
        "description": "Small box - Vape products",
        "quantity": 1,
        "handling": "fragile"
      }
    ]
  }
}
```

### 4.5 Customer APIs

#### Search Products with Shop Attribution
```typescript
GET /api/store/products?shop=vape-shop-la
Query: ?category=e-liquids&brand=premium-vapes

Response:
{
  "products": [
    {
      "id": "prod_123",
      "name": "Premium Vape Juice",
      "price": 29.99,
      "brand": {
        "id": "brand_456",
        "name": "Premium Vapes",
        "logo": "https://..."
      },
      "availability": {
        "in_stock": true,
        "quantity": 450
      },
      "attributed_shop": {
        "id": "shop_789",
        "name": "Vape Shop LA"
      }
    }
  ]
}
```

---

## 5. Database Schema Design

### 5.1 Extended MedusaJS Tables

```sql
-- Shop Tiers Table
CREATE TABLE shop_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES vendors(id),
  tier VARCHAR(10) NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  commission_rate DECIMAL(5,4) NOT NULL,
  monthly_sales DECIMAL(10,2) DEFAULT 0,
  is_promotional BOOLEAN DEFAULT FALSE,
  promotional_expires_at TIMESTAMP,
  promotional_reason VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_shop_tier UNIQUE (shop_id)
);

-- Commission Tracking
CREATE TABLE commission_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  shop_id UUID NOT NULL REFERENCES vendors(id),
  commission_rate DECIMAL(5,4) NOT NULL,
  order_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payout_id UUID REFERENCES payouts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver Management
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  vehicle_type VARCHAR(20) NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  insurance_verified BOOLEAN DEFAULT FALSE,
  background_check_status VARCHAR(20) DEFAULT 'pending',
  current_location GEOGRAPHY(POINT),
  status VARCHAR(20) DEFAULT 'offline',
  total_deliveries INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery Assignments
CREATE TABLE delivery_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  driver_id UUID REFERENCES drivers(id),
  provider VARCHAR(20) NOT NULL, -- 'internal', 'doordash', etc
  provider_reference_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  pickup_address JSONB NOT NULL,
  dropoff_address JSONB NOT NULL,
  pickup_completed_at TIMESTAMP,
  delivery_completed_at TIMESTAMP,
  total_distance_miles DECIMAL(5,2),
  driver_pay DECIMAL(6,2),
  customer_delivery_fee DECIMAL(6,2),
  route_polyline TEXT,
  tracking_url TEXT,
  proof_of_delivery JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor Fee Tracking
CREATE TABLE vendor_platform_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  vendor_type VARCHAR(20) NOT NULL,
  fee_percentage DECIMAL(5,4) NOT NULL,
  order_amount DECIMAL(10,2) NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL,
  volume_tier VARCHAR(20),
  is_promotional_rate BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shop Referral Tracking
CREATE TABLE shop_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES vendors(id),
  customer_id UUID REFERENCES customers(id),
  session_id VARCHAR(255),
  referral_code VARCHAR(50),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  first_visit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  converted_at TIMESTAMP,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0
);

-- Monthly Volume Tracking
CREATE TABLE vendor_monthly_volumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_sales DECIMAL(12,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  fee_tier VARCHAR(20),
  average_order_value DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_vendor_month UNIQUE (vendor_id, year, month)
);
```

### 5.2 Indexes for Performance

```sql
-- Commission queries
CREATE INDEX idx_commission_shop_date ON commission_records(shop_id, created_at DESC);
CREATE INDEX idx_commission_status ON commission_records(status) WHERE status = 'pending';

-- Driver location queries
CREATE INDEX idx_driver_location ON drivers USING GIST(current_location);
CREATE INDEX idx_driver_status ON drivers(status) WHERE status = 'available';

-- Delivery tracking
CREATE INDEX idx_delivery_order ON delivery_assignments(order_id);
CREATE INDEX idx_delivery_driver ON delivery_assignments(driver_id);
CREATE INDEX idx_delivery_status ON delivery_assignments(status);

-- Volume tracking
CREATE INDEX idx_volume_vendor_date ON vendor_monthly_volumes(vendor_id, year DESC, month DESC);
```

---

## 6. Stripe Connect Integration

### 6.1 Overview

MedusaJS provides basic Stripe payment processing but does NOT include Stripe Connect functionality out of the box. We need to build a custom module to handle:

- Connected account onboarding
- Split payments and platform fees
- Automated transfers to vendors
- Compliance and KYC management

### 6.2 Custom Stripe Connect Module

```typescript
// modules/stripe-connect/models/connected-account.ts
export class ConnectedAccount {
  id: string;
  vendor_id: string;
  stripe_account_id: string;
  account_type: 'express' | 'standard' | 'custom';
  capabilities: {
    card_payments: boolean;
    transfers: boolean;
    tax_reporting_us_1099_k: boolean;
  };
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  created_at: Date;
  updated_at: Date;
}

// modules/stripe-connect/services/account-onboarding.ts
export class AccountOnboardingService {
  async createConnectedAccount(vendor: Vendor): Promise<ConnectedAccount> {
    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: vendor.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: vendor.business_type,
      business_profile: {
        mcc: '5999', // Miscellaneous retail
        name: vendor.business_name,
        url: vendor.website,
      },
      metadata: {
        vendor_id: vendor.id,
        vendor_type: vendor.vendor_type,
      },
    });

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.APP_URL}/vendor/onboarding/refresh`,
      return_url: `${process.env.APP_URL}/vendor/onboarding/complete`,
      type: 'account_onboarding',
    });

    // Save to database
    return await this.saveConnectedAccount(vendor.id, account);
  }

  async handleOnboardingComplete(accountId: string): Promise<void> {
    const account = await stripe.accounts.retrieve(accountId);
    
    // Update account status
    await this.updateAccountStatus(accountId, {
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements,
    });

    // Send welcome email if fully onboarded
    if (account.charges_enabled && account.payouts_enabled) {
      await this.sendVendorWelcomeEmail(account.metadata.vendor_id);
    }
  }
}
```

### 6.3 Payment Splitting Implementation

```typescript
// modules/stripe-connect/services/payment-splitter.ts
export class PaymentSplitterService {
  async processOrderPayment(order: Order): Promise<PaymentResult> {
    // Step 1: Charge customer full amount
    const charge = await stripe.charges.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      customer: order.stripe_customer_id,
      description: `Order ${order.id}`,
      metadata: {
        order_id: order.id,
      },
      // Important: Hold funds on platform account first
      on_behalf_of: null,
      transfer_group: order.id,
    });

    // Step 2: Calculate splits
    const splits = await this.calculatePaymentSplits(order);

    // Step 3: Create transfers
    for (const split of splits) {
      await this.createTransfer(split, charge.id, order.id);
    }

    return {
      charge_id: charge.id,
      splits: splits,
      platform_profit: this.calculatePlatformProfit(order, splits),
    };
  }

  private async calculatePaymentSplits(order: Order): Promise<PaymentSplit[]> {
    const splits: PaymentSplit[] = [];

    // Shop commission (if attributed)
    if (order.attributed_shop_id) {
      const shop = await this.getShop(order.attributed_shop_id);
      const commission = order.subtotal * shop.commission_rate;
      
      splits.push({
        recipient_type: 'shop',
        recipient_id: shop.id,
        stripe_account_id: shop.stripe_account_id,
        amount: commission,
        description: 'Referral commission',
      });
    }

    // Vendor payments (minus platform fees)
    for (const item of order.items) {
      const vendor = await this.getVendor(item.vendor_id);
      const platformFee = this.calculatePlatformFee(vendor, item);
      const vendorAmount = item.total - platformFee;

      splits.push({
        recipient_type: vendor.vendor_type,
        recipient_id: vendor.id,
        stripe_account_id: vendor.stripe_account_id,
        amount: vendorAmount,
        description: `Payment for order items`,
        platform_fee: platformFee,
      });
    }

    return splits;
  }

  private async createTransfer(
    split: PaymentSplit,
    chargeId: string,
    transferGroup: string
  ): Promise<void> {
    await stripe.transfers.create({
      amount: Math.round(split.amount * 100),
      currency: 'usd',
      destination: split.stripe_account_id,
      source_transaction: chargeId,
      transfer_group: transferGroup,
      description: split.description,
      metadata: {
        order_id: transferGroup,
        recipient_type: split.recipient_type,
        recipient_id: split.recipient_id,
        platform_fee: split.platform_fee || 0,
      },
    });
  }
}
```

### 6.4 Webhook Handling

```typescript
// modules/stripe-connect/webhooks/stripe-webhook-handler.ts
export class StripeWebhookHandler {
  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'account.updated':
        await this.handleAccountUpdate(event.data.object);
        break;
        
      case 'account.application.deauthorized':
        await this.handleAccountDeauthorized(event.data.object);
        break;
        
      case 'transfer.created':
        await this.handleTransferCreated(event.data.object);
        break;
        
      case 'transfer.failed':
        await this.handleTransferFailed(event.data.object);
        break;
        
      case 'payout.created':
        await this.handlePayoutCreated(event.data.object);
        break;
        
      case 'payout.failed':
        await this.handlePayoutFailed(event.data.object);
        break;
    }
  }

  private async handleAccountUpdate(account: Stripe.Account): Promise<void> {
    // Update connected account status
    await this.db.connected_accounts.update({
      where: { stripe_account_id: account.id },
      data: {
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        requirements: account.requirements,
        updated_at: new Date(),
      },
    });

    // Notify vendor if action required
    if (account.requirements.currently_due.length > 0) {
      await this.notifyVendorActionRequired(account);
    }
  }
}
```

---

## 7. Loyalty Points System

### 7.1 Points Structure

```typescript
// Points earning rules
const POINTS_RULES = {
  // Customer earns
  purchase: 1, // 1 point per dollar spent
  referral: 500, // 500 points for referring new customer
  review: 50, // 50 points for product review
  
  // Redemption
  redemption_rate: 0.01, // 1 point = $0.01
  minimum_redemption: 500, // Minimum 500 points to redeem
};

// Rewards tiers
const REWARDS_TIERS = {
  bronze: { threshold: 0, multiplier: 1.0 },
  silver: { threshold: 5000, multiplier: 1.2 },
  gold: { threshold: 20000, multiplier: 1.5 },
  platinum: { threshold: 50000, multiplier: 2.0 },
};
```

### 7.2 Points Management Module

```typescript
// modules/loyalty-points/models/points-balance.ts
export class PointsBalance {
  id: string;
  customer_id: string;
  current_balance: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tier_progress: number;
  next_tier_threshold: number;
  created_at: Date;
  updated_at: Date;
}

// modules/loyalty-points/services/points-calculator.ts
export class PointsCalculatorService {
  async calculateOrderPoints(order: Order): Promise<PointsCalculation> {
    const customer = await this.getCustomer(order.customer_id);
    const balance = await this.getPointsBalance(customer.id);
    
    // Base points
    let points = Math.floor(order.subtotal * POINTS_RULES.purchase);
    
    // Apply tier multiplier
    const tierMultiplier = REWARDS_TIERS[balance.tier].multiplier;
    points = Math.floor(points * tierMultiplier);
    
    // Bonus points for specific conditions
    if (this.isFirstOrder(customer.id)) {
      points += 200; // First order bonus
    }
    
    if (order.items.some(item => item.is_new_product)) {
      points += 100; // Trying new products bonus
    }
    
    return {
      base_points: Math.floor(order.subtotal * POINTS_RULES.purchase),
      tier_multiplier: tierMultiplier,
      bonus_points: points - Math.floor(order.subtotal * POINTS_RULES.purchase * tierMultiplier),
      total_points: points,
    };
  }
  
  async awardPoints(
    customerId: string,
    points: number,
    reason: string,
    orderId?: string
  ): Promise<PointsTransaction> {
    const balance = await this.getPointsBalance(customerId);
    
    // Create transaction
    const transaction = await this.db.points_transactions.create({
      data: {
        customer_id: customerId,
        type: 'earned',
        amount: points,
        reason: reason,
        order_id: orderId,
        balance_before: balance.current_balance,
        balance_after: balance.current_balance + points,
        created_at: new Date(),
      },
    });
    
    // Update balance
    await this.updatePointsBalance(customerId, points);
    
    // Check for tier upgrade
    await this.checkTierUpgrade(customerId);
    
    return transaction;
  }
}
```

### 7.3 Points Redemption

```typescript
// modules/loyalty-points/services/points-redeemer.ts
export class PointsRedeemerService {
  async applyPointsToOrder(
    order: Order,
    pointsToRedeem: number
  ): Promise<PointsRedemption> {
    const balance = await this.getPointsBalance(order.customer_id);
    
    // Validate redemption
    if (pointsToRedeem > balance.current_balance) {
      throw new Error('Insufficient points balance');
    }
    
    if (pointsToRedeem < POINTS_RULES.minimum_redemption) {
      throw new Error(`Minimum redemption is ${POINTS_RULES.minimum_redemption} points`);
    }
    
    // Calculate discount
    const discountAmount = pointsToRedeem * POINTS_RULES.redemption_rate;
    const maxDiscount = order.subtotal * 0.5; // Max 50% discount
    
    const finalDiscount = Math.min(discountAmount, maxDiscount);
    const pointsUsed = Math.floor(finalDiscount / POINTS_RULES.redemption_rate);
    
    // Create redemption record
    const redemption = await this.db.points_redemptions.create({
      data: {
        order_id: order.id,
        customer_id: order.customer_id,
        points_redeemed: pointsUsed,
        discount_amount: finalDiscount,
        created_at: new Date(),
      },
    });
    
    // Deduct points
    await this.deductPoints(order.customer_id, pointsUsed, 'Order redemption', order.id);
    
    return redemption;
  }
}
```

### 7.4 Points Dashboard API

```typescript
// API endpoint for customer points dashboard
GET /api/customer/loyalty/dashboard
Authorization: Bearer {customer_token}

Response:
{
  "balance": {
    "current": 12500,
    "lifetime_earned": 45000,
    "lifetime_redeemed": 32500,
    "expiring_soon": {
      "amount": 500,
      "expires_at": "2025-12-31T23:59:59Z"
    }
  },
  "tier": {
    "current": "silver",
    "multiplier": 1.2,
    "progress": {
      "current": 12500,
      "next_threshold": 20000,
      "percentage": 62.5
    },
    "benefits": [
      "1.2x points on all purchases",
      "Early access to sales",
      "Free shipping on orders over $50"
    ]
  },
  "recent_transactions": [
    {
      "id": "trans_123",
      "type": "earned",
      "amount": 150,
      "reason": "Purchase - Order #12345",
      "date": "2025-07-15T10:30:00Z",
      "balance_after": 12500
    }
  ],
  "redemption_options": [
    {
      "points": 500,
      "value": "$5.00",
      "description": "$5 off your next order"
    },
    {
      "points": 1000,
      "value": "$10.00",
      "description": "$10 off your next order"
    }
  ]
}
```

---

## 8. Unified Product Catalog

### 8.1 Master Product Concept

The unified catalog system recognizes when multiple vendors list the same product and consolidates them into a single product listing on the frontend while maintaining separate vendor offerings on the backend.

```typescript
// modules/unified-catalog/models/master-product.ts
export class MasterProduct {
  id: string;
  name: string;
  normalized_name: string; // For matching
  description: string;
  category_id: string;
  brand_id: string;
  
  // Aggregated data from all vendors
  lowest_price: number;
  highest_price: number;
  total_inventory: number;
  vendor_count: number;
  
  // Common attributes
  attributes: {
    upc?: string;
    ean?: string;
    manufacturer_sku?: string;
    weight?: number;
    dimensions?: object;
  };
  
  // SEO optimized data
  slug: string;
  meta_title: string;
  meta_description: string;
  
  created_at: Date;
  updated_at: Date;
}

// modules/unified-catalog/models/vendor-product-mapping.ts
export class VendorProductMapping {
  id: string;
  master_product_id: string;
  vendor_id: string;
  vendor_product_id: string;
  
  // Vendor-specific data
  vendor_sku: string;
  vendor_price: number;
  vendor_inventory: number;
  vendor_title: string; // Original title from vendor
  
  // Matching confidence
  match_confidence: number; // 0-100
  match_method: 'upc' | 'ean' | 'title' | 'manual' | 'ml_model';
  verified: boolean;
  
  created_at: Date;
  updated_at: Date;
}
```

### 8.2 Product Matching Service

```typescript
// modules/unified-catalog/services/product-matcher.ts
export class ProductMatcherService {
  async matchVendorProduct(vendorProduct: VendorProduct): Promise<MasterProduct | null> {
    // Step 1: Try exact matches
    let masterProduct = await this.matchByUPC(vendorProduct.upc);
    if (masterProduct) return masterProduct;
    
    masterProduct = await this.matchByEAN(vendorProduct.ean);
    if (masterProduct) return masterProduct;
    
    // Step 2: Try fuzzy matching
    masterProduct = await this.fuzzyMatchByTitle(vendorProduct);
    if (masterProduct) return masterProduct;
    
    // Step 3: ML-based matching (if confidence > threshold)
    const mlMatch = await this.mlMatcher.findMatch(vendorProduct);
    if (mlMatch && mlMatch.confidence > 0.85) {
      return mlMatch.masterProduct;
    }
    
    // No match found - create new master product
    return null;
  }
  
  private async fuzzyMatchByTitle(vendorProduct: VendorProduct): Promise<MasterProduct | null> {
    // Normalize title
    const normalizedTitle = this.normalizeProductTitle(vendorProduct.title);
    
    // Search for similar products
    const candidates = await this.db.master_products.findMany({
      where: {
        brand_id: vendorProduct.brand_id,
        category_id: vendorProduct.category_id,
      },
    });
    
    // Calculate similarity scores
    const matches = candidates.map(candidate => ({
      product: candidate,
      score: this.calculateSimilarity(normalizedTitle, candidate.normalized_name),
    }));
    
    // Return best match if score > threshold
    const bestMatch = matches.sort((a, b) => b.score - a.score)[0];
    return bestMatch && bestMatch.score > 0.8 ? bestMatch.product : null;
  }
  
  private normalizeProductTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }
  
  private calculateSimilarity(str1: string, str2: string): number {
    // Implement Levenshtein distance or similar algorithm
    // Return score between 0 and 1
    return this.levenshteinSimilarity(str1, str2);
  }
}
```

### 8.3 Catalog Synchronization

```typescript
// modules/unified-catalog/services/catalog-synchronizer.ts
export class CatalogSynchronizerService {
  async syncVendorProduct(vendorProduct: VendorProduct): Promise<void> {
    // Find or create master product
    let masterProduct = await this.productMatcher.matchVendorProduct(vendorProduct);
    
    if (!masterProduct) {
      masterProduct = await this.createMasterProduct(vendorProduct);
    }
    
    // Create or update mapping
    await this.createOrUpdateMapping(masterProduct.id, vendorProduct);
    
    // Update master product aggregates
    await this.updateMasterProductAggregates(masterProduct.id);
    
    // Trigger frontend cache invalidation
    await this.invalidateProductCache(masterProduct.id);
  }
  
  private async createMasterProduct(vendorProduct: VendorProduct): Promise<MasterProduct> {
    return await this.db.master_products.create({
      data: {
        name: vendorProduct.title,
        normalized_name: this.normalizeProductTitle(vendorProduct.title),
        description: vendorProduct.description,
        category_id: vendorProduct.category_id,
        brand_id: vendorProduct.brand_id,
        lowest_price: vendorProduct.price,
        highest_price: vendorProduct.price,
        total_inventory: vendorProduct.inventory,
        vendor_count: 1,
        attributes: {
          upc: vendorProduct.upc,
          ean: vendorProduct.ean,
          manufacturer_sku: vendorProduct.manufacturer_sku,
        },
        slug: this.generateSlug(vendorProduct.title),
        created_at: new Date(),
      },
    });
  }
  
  private async updateMasterProductAggregates(masterProductId: string): Promise<void> {
    const mappings = await this.db.vendor_product_mappings.findMany({
      where: { master_product_id: masterProductId },
    });
    
    const prices = mappings.map(m => m.vendor_price);
    const inventory = mappings.reduce((sum, m) => sum + m.vendor_inventory, 0);
    
    await this.db.master_products.update({
      where: { id: masterProductId },
      data: {
        lowest_price: Math.min(...prices),
        highest_price: Math.max(...prices),
        total_inventory: inventory,
        vendor_count: mappings.length,
        updated_at: new Date(),
      },
    });
  }
}
```

### 8.4 Frontend Product Display

```typescript
// API endpoint for unified product listing
GET /api/store/products/{master_product_id}

Response:
{
  "product": {
    "id": "master_123",
    "name": "Premium Vape Juice - Strawberry",
    "description": "Premium quality vape juice...",
    "brand": {
      "id": "brand_456",
      "name": "Premium Vapes",
      "logo": "https://..."
    },
    "category": {
      "id": "cat_789",
      "name": "E-Liquids"
    },
    "price_range": {
      "min": 24.99,
      "max": 29.99
    },
    "images": [
      {
        "url": "https://...",
        "alt": "Product image"
      }
    ],
    "in_stock": true,
    "total_inventory": 850
  },
  "vendors": [
    {
      "id": "vendor_123",
      "name": "Vape Distributor LA",
      "type": "distributor",
      "price": 24.99,
      "inventory": 500,
      "shipping": {
        "estimated_days": 2,
        "cost": 5.99
      },
      "rating": 4.8,
      "reviews_count": 234
    },
    {
      "id": "vendor_456",
      "name": "Premium Vapes Direct",
      "type": "brand",
      "price": 29.99,
      "inventory": 350,
      "shipping": {
        "estimated_days": 3,
        "cost": 0, // Free shipping
      },
      "rating": 4.9,
      "reviews_count": 567
    }
  ],
  "shop_attribution": {
    "id": "shop_789",
    "name": "Vape Shop LA",
    "commission_eligible": true
  }
}
```

### 8.5 Price Aggregation Service

```typescript
// modules/unified-catalog/services/price-aggregator.ts
export class PriceAggregatorService {
  async getBestPriceForProduct(
    masterProductId: string,
    customerLocation?: Location
  ): Promise<PriceOption[]> {
    const mappings = await this.getActiveVendorMappings(masterProductId);
    
    const priceOptions = await Promise.all(
      mappings.map(async (mapping) => {
        const vendor = await this.getVendor(mapping.vendor_id);
        const shipping = await this.calculateShipping(vendor, customerLocation);
        
        return {
          vendor_id: vendor.id,
          vendor_name: vendor.name,
          vendor_type: vendor.vendor_type,
          product_price: mapping.vendor_price,
          shipping_cost: shipping.cost,
          total_price: mapping.vendor_price + shipping.cost,
          estimated_delivery: shipping.estimated_days,
          in_stock: mapping.vendor_inventory > 0,
          inventory: mapping.vendor_inventory,
        };
      })
    );
    
    // Sort by total price (product + shipping)
    return priceOptions.sort((a, b) => a.total_price - b.total_price);
  }
  
  async applyVendorSelectionToCart(
    cartId: string,
    vendorSelections: VendorSelection[]
  ): Promise<void> {
    for (const selection of vendorSelections) {
      await this.db.cart_items.update({
        where: {
          cart_id: cartId,
          master_product_id: selection.master_product_id,
        },
        data: {
          selected_vendor_id: selection.vendor_id,
          vendor_price: selection.price,
          vendor_product_id: selection.vendor_product_id,
        },
      });
    }
    
    // Recalculate cart totals
    await this.recalculateCartTotals(cartId);
  }
}
```

---

## 9. Authentication & Catalog Visibility

### 9.1 Catalog Access Control

```typescript
// modules/catalog-visibility/models/catalog-rules.ts
export interface CatalogVisibilityRules {
  default_visibility: 'public' | 'authenticated' | 'verified';
  product_visibility_rules: {
    public_categories: string[];      // Categories visible to all
    restricted_categories: string[];  // Require authentication
    verified_only_categories: string[]; // Require account verification
  };
  brand_visibility_rules: {
    public_brands: string[];
    restricted_brands: string[];
  };
}

// modules/catalog-visibility/services/visibility-service.ts
export class CatalogVisibilityService {
  async getVisibleProducts(
    userId?: string,
    isAuthenticated: boolean = false,
    isVerified: boolean = false
  ): Promise<Product[]> {
    let query = this.db.products.findMany({
      where: {
        is_active: true,
        AND: [],
      },
    });

    if (!isAuthenticated) {
      // Only show public products
      query.where.AND.push({
        OR: [
          { visibility: 'public' },
          { category_id: { in: this.getPublicCategories() } },
          { brand_id: { in: this.getPublicBrands() } },
        ],
      });
    } else if (!isVerified) {
      // Show public + authenticated products
      query.where.AND.push({
        visibility: { in: ['public', 'authenticated'] },
        is_restricted: false,
      });
    }
    // Verified users see everything

    return query;
  }

  async enforceProductVisibility(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const productId = req.params.productId;
    const product = await this.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = req.user;
    const canView = await this.canUserViewProduct(product, user);

    if (!canView) {
      return res.status(403).json({ 
        error: 'This product requires authentication',
        redirect: '/login',
      });
    }

    req.product = product;
    next();
  }
}
```

### 9.2 Homepage Product Display

```typescript
// API endpoint for homepage data
GET /api/store/homepage

Response:
{
  "hero": {
    "title": "Premium Vape Marketplace",
    "subtitle": "Trusted brands, verified products",
    "cta": {
      "text": "Shop Now",
      "link": "/products",
      "requires_auth": true
    }
  },
  "featured_brands": [
    {
      "id": "brand_123",
      "name": "Premium Vapes",
      "logo": "https://...",
      "description": "Industry leader since 2015",
      "product_count": 45,
      "is_verified": true,
      "featured_products": [
        {
          "id": "prod_456",
          "name": "Starter Kit",
          "price": 49.99,
          "image": "https://...",
          "is_public": true
        }
      ]
    }
  ],
  "product_categories": [
    {
      "id": "cat_789",
      "name": "E-Liquids",
      "icon": "/category-eliquids.svg",
      "product_count": 234,
      "is_public": true,
      "preview_products": [...]
    },
    {
      "id": "cat_890",
      "name": "Premium Collection",
      "icon": "/category-premium.svg",
      "product_count": 89,
      "is_public": false,
      "requires_auth": true,
      "blur_preview": true
    }
  ],
  "auth_prompt": {
    "show": true,
    "message": "Sign in to access our full catalog",
    "benefits": [
      "Access to 500+ exclusive products",
      "Member-only pricing",
      "Loyalty rewards program",
      "Priority customer support"
    ]
  }
}
```

### 9.3 Progressive Disclosure UI

```tsx
// components/product-grid.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function ProductGrid({ category }: { category: string }) {
  const { isAuthenticated, isVerified } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [restrictedCount, setRestrictedCount] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {!isAuthenticated && restrictedCount > 0 && (
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-semibold">
                  {restrictedCount} more products available
                </p>
                <p className="text-sm text-muted-foreground">
                  Sign in to view our complete catalog
                </p>
              </div>
            </div>
            <Button onClick={() => router.push('/login')}>
              Sign In to View
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const isRestricted = product.visibility !== 'public';

  if (isRestricted && !isAuthenticated) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md bg-background/80 z-10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardContent className="p-4 opacity-50">
          <div className="aspect-square bg-muted rounded-md mb-4" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
          {product.is_new && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              New
            </span>
          )}
        </div>
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.brand.name}</p>
        <p className="font-bold mt-2">${product.price}</p>
      </CardContent>
    </Card>
  );
}
```

---

## 10. Restricted Product Obfuscation

### 10.1 Product Data Model with Obfuscation

```typescript
// modules/product-obfuscation/models/obfuscated-product.ts
export interface ProductObfuscation {
  id: string;
  product_id: string;
  obfuscated_name: string;
  obfuscated_description: string;
  obfuscated_category: string;
  obfuscated_brand: string;
  classification_code: string; // For internal reference
  created_at: Date;
  updated_at: Date;
}

// Extended product model
export interface Product extends BaseProduct {
  // ... existing fields
  is_restricted: boolean;
  restriction_tags: string[];
  obfuscation?: ProductObfuscation;
}
```

### 10.2 Obfuscation Service

```typescript
// modules/product-obfuscation/services/obfuscation-service.ts
export class ProductObfuscationService {
  private obfuscationMappings = {
    categories: {
      'thc-products': 'Specialty Items - Type A',
      'cbd-products': 'Wellness Products - Type B',
      'nicotine-high': 'Premium Products - Type C',
      'regulated-items': 'Restricted Items - Type D',
    },
    brands: {
      'cannabis-brand': 'Specialty Brand',
      'restricted-brand': 'Premium Manufacturer',
    },
    productTypes: {
      'vape-cartridge': 'Cartridge Product',
      'concentrate': 'Concentrated Product',
      'edible': 'Consumable Product',
      'tincture': 'Liquid Product',
    },
  };

  async obfuscateProduct(product: Product): Promise<ObfuscatedProduct> {
    if (!product.is_restricted) {
      return product; // No obfuscation needed
    }

    const obfuscation = await this.getOrCreateObfuscation(product);
    
    return {
      ...product,
      // Replace sensitive data with obfuscated versions
      name: obfuscation.obfuscated_name,
      description: obfuscation.obfuscated_description,
      category_name: obfuscation.obfuscated_category,
      brand_name: obfuscation.obfuscated_brand,
      // Keep non-sensitive data
      price: product.price,
      weight: product.weight,
      dimensions: product.dimensions,
      // Add obfuscation reference
      _obfuscation_applied: true,
      _original_id: product.id,
    };
  }

  private async getOrCreateObfuscation(product: Product): Promise<ProductObfuscation> {
    // Check if obfuscation already exists
    let obfuscation = await this.db.product_obfuscations.findUnique({
      where: { product_id: product.id },
    });

    if (!obfuscation) {
      obfuscation = await this.createObfuscation(product);
    }

    return obfuscation;
  }

  private async createObfuscation(product: Product): Promise<ProductObfuscation> {
    // Generate consistent obfuscated names
    const categoryMapping = this.getCategoryMapping(product.category_id);
    const typeMapping = this.getProductTypeMapping(product);
    const code = this.generateClassificationCode(product);

    return await this.db.product_obfuscations.create({
      data: {
        product_id: product.id,
        obfuscated_name: `${typeMapping} - ${code}`,
        obfuscated_description: 'Specialty product for verified customers',
        obfuscated_category: categoryMapping,
        obfuscated_brand: 'Verified Vendor',
        classification_code: code,
        created_at: new Date(),
      },
    });
  }

  private generateClassificationCode(product: Product): string {
    // Generate a consistent code that can be reverse-looked up internally
    const hash = crypto.createHash('sha256')
      .update(product.id)
      .digest('hex')
      .substring(0, 8)
      .toUpperCase();
    
    return `SKU-${hash}`;
  }
}
```

### 10.3 Payment Processing Integration

```typescript
// modules/payment-processing/services/stripe-adapter.ts
export class StripePaymentAdapter {
  private obfuscationService: ProductObfuscationService;

  async createPaymentIntent(order: Order): Promise<Stripe.PaymentIntent> {
    // Prepare order data with obfuscation
    const processedItems = await this.processOrderItems(order.items);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      metadata: {
        order_id: order.id,
        customer_id: order.customer_id,
        // Don't include sensitive product names
      },
      description: this.generateSafeDescription(processedItems),
      statement_descriptor: 'VAPE MARKETPLACE',
      statement_descriptor_suffix: order.id.substring(0, 10),
    });

    return paymentIntent;
  }

  private async processOrderItems(items: OrderItem[]): Promise<ProcessedItem[]> {
    return Promise.all(
      items.map(async (item) => {
        const product = await this.getProduct(item.product_id);
        
        if (product.is_restricted) {
          const obfuscated = await this.obfuscationService.obfuscateProduct(product);
          return {
            name: obfuscated.name,
            description: obfuscated.description,
            amount: item.price,
            quantity: item.quantity,
            classification: obfuscated._original_id,
          };
        }
        
        return {
          name: product.name,
          description: product.description,
          amount: item.price,
          quantity: item.quantity,
        };
      })
    );
  }

  private generateSafeDescription(items: ProcessedItem[]): string {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return `Marketplace order - ${itemCount} items`;
  }
}
```

### 10.4 Delivery Integration with Obfuscation

```typescript
// modules/delivery/services/delivery-adapter.ts
export class DeliveryAdapter {
  async createDoorDashDelivery(order: Order): Promise<DoorDashDelivery> {
    const safeItems = await this.getSafeItemsForDelivery(order.items);
    
    const delivery = await doordash.createDelivery({
      pickup_address: order.pickup_address,
      dropoff_address: order.delivery_address,
      items: safeItems.map(item => ({
        name: item.safe_name,
        quantity: item.quantity,
        description: item.safe_description,
        // Never include actual product details for restricted items
      })),
      order_value: order.total,
      tip: order.delivery_tip,
    });

    return delivery;
  }

  private async getSafeItemsForDelivery(items: OrderItem[]): Promise<SafeDeliveryItem[]> {
    return Promise.all(
      items.map(async (item) => {
        const product = await this.getProduct(item.product_id);
        
        if (product.is_restricted) {
          return {
            safe_name: 'Packaged Goods',
            safe_description: `Package ${item.id.substring(0, 8)}`,
            quantity: item.quantity,
            weight: product.weight || 'Standard',
            special_instructions: 'Handle with care',
          };
        }
        
        return {
          safe_name: product.name,
          safe_description: product.category_name,
          quantity: item.quantity,
          weight: product.weight,
        };
      })
    );
  }
}
```

### 10.5 Admin Dashboard Display

```tsx
// components/admin/product-display.tsx
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function AdminProductDisplay({ product }: { product: Product }) {
  const [showObfuscated, setShowObfuscated] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{product.name}</CardTitle>
          {product.is_restricted && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Restricted</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowObfuscated(!showObfuscated)}
              >
                {showObfuscated ? <EyeOff /> : <Eye />}
                {showObfuscated ? 'Show Real' : 'Show Obfuscated'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showObfuscated && product.obfuscation ? (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm">Obfuscated Data (External View):</h4>
            <p><span className="font-medium">Name:</span> {product.obfuscation.obfuscated_name}</p>
            <p><span className="font-medium">Category:</span> {product.obfuscation.obfuscated_category}</p>
            <p><span className="font-medium">Brand:</span> {product.obfuscation.obfuscated_brand}</p>
            <p><span className="font-medium">Code:</span> {product.obfuscation.classification_code}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p><span className="font-medium">Category:</span> {product.category_name}</p>
            <p><span className="font-medium">Brand:</span> {product.brand_name}</p>
            <p><span className="font-medium">SKU:</span> {product.sku}</p>
            <p><span className="font-medium">Price:</span> ${product.price}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 11. UI/UX Design System

### 11.1 Technology Stack

```json
{
  "frontend": {
    "framework": "Next.js 14",
    "ui_library": "shadcn/ui",
    "styling": "Tailwind CSS 4",
    "state_management": "Zustand",
    "data_fetching": "TanStack Query",
    "forms": "React Hook Form + Zod",
    "animations": "Framer Motion"
  }
}
```

### 11.2 Design System Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors for marketplace
        shop: {
          bronze: "#CD7F32",
          silver: "#C0C0C0",
          gold: "#FFD700",
        },
        vendor: {
          brand: "#8B5CF6",
          distributor: "#10B981",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

### 11.3 Component Library Structure

```typescript
// components/ui/index.ts
export * from './accordion'
export * from './alert'
export * from './alert-dialog'
export * from './avatar'
export * from './badge'
export * from './button'
export * from './calendar'
export * from './card'
export * from './checkbox'
export * from './collapsible'
export * from './command'
export * from './context-menu'
export * from './dialog'
export * from './dropdown-menu'
export * from './form'
export * from './hover-card'
export * from './input'
export * from './label'
export * from './menubar'
export * from './navigation-menu'
export * from './popover'
export * from './progress'
export * from './radio-group'
export * from './scroll-area'
export * from './select'
export * from './separator'
export * from './sheet'
export * from './skeleton'
export * from './slider'
export * from './switch'
export * from './table'
export * from './tabs'
export * from './textarea'
export * from './toast'
export * from './toggle'
export * from './toggle-group'
export * from './tooltip'

// Custom marketplace components
export * from './product-card'
export * from './vendor-badge'
export * from './commission-display'
export * from './delivery-tracker'
export * from './restricted-badge'
```

### 11.4 Homepage Layout

```tsx
// app/page.tsx
import { HeroSection } from '@/components/home/hero-section'
import { BrandShowcase } from '@/components/home/brand-showcase'
import { CategoryGrid } from '@/components/home/category-grid'
import { AuthPrompt } from '@/components/home/auth-prompt'
import { FeaturedProducts } from '@/components/home/featured-products'

export default async function HomePage() {
  const { brands, categories, featuredProducts } = await getHomePageData()
  
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <CategoryGrid categories={categories} />
      </section>
      
      <section className="bg-muted/50 py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Featured Brands</h2>
          <BrandShowcase brands={brands} />
        </div>
      </section>
      
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Popular Products</h2>
        <FeaturedProducts products={featuredProducts} />
      </section>
      
      <AuthPrompt />
    </div>
  )
}

// components/home/hero-section.tsx
export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      <div className="container relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Premium Vape Marketplace
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Trusted brands, verified products, and fast delivery from authorized retailers
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            Browse Products
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Become a Partner
          </Button>
        </div>
      </div>
    </section>
  )
}
```

---

## 12. Driver Mobile Interface

### 6.1 Mobile-First Web Design

```html
<!-- Driver Dashboard (Mobile Responsive) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Driver Dashboard - Marketplace Delivery</title>
  <style>
    /* Mobile-first CSS */
    .driver-app {
      max-width: 100vw;
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .status-bar {
      position: fixed;
      top: 0;
      width: 100%;
      background: #2563eb;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
    }
    
    .earnings-card {
      background: white;
      margin: 80px 1rem 1rem;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .delivery-card {
      background: white;
      margin: 1rem;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .action-button {
      width: 100%;
      padding: 1rem;
      font-size: 1.1rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      margin-top: 1rem;
    }
    
    .accept-btn {
      background: #10b981;
      color: white;
    }
    
    .navigate-btn {
      background: #3b82f6;
      color: white;
    }
    
    .complete-btn {
      background: #8b5cf6;
      color: white;
    }
  </style>
</head>
<body>
  <div class="driver-app">
    <!-- Status Bar -->
    <div class="status-bar">
      <div class="driver-status">
        <span id="status-indicator">● Online</span>
      </div>
      <div class="toggle-status">
        <button id="toggle-btn">Go Offline</button>
      </div>
    </div>
    
    <!-- Earnings Summary -->
    <div class="earnings-card">
      <h2>Today's Earnings</h2>
      <div class="earnings-amount">$47.25</div>
      <div class="delivery-count">8 deliveries completed</div>
      <div class="online-time">Online for 5h 23m</div>
    </div>
    
    <!-- Available Deliveries -->
    <div id="delivery-list">
      <div class="delivery-card">
        <div class="delivery-header">
          <span class="pickup-distance">2.3 mi to pickup</span>
          <span class="earnings">$7.45</span>
        </div>
        <div class="addresses">
          <div class="pickup">
            <strong>Pickup:</strong> Warehouse District
          </div>
          <div class="dropoff">
            <strong>Dropoff:</strong> Downtown LA
          </div>
        </div>
        <div class="delivery-details">
          <span class="total-distance">Total: 8.1 miles</span>
          <span class="time-estimate">~25 mins</span>
        </div>
        <button class="action-button accept-btn" onclick="acceptDelivery('del_123')">
          Accept Delivery
        </button>
      </div>
    </div>
    
    <!-- Active Delivery View -->
    <div id="active-delivery" style="display:none;">
      <div class="delivery-card">
        <h3>Active Delivery</h3>
        <div class="step-indicator">
          <div class="step active">Heading to Pickup</div>
          <div class="step">At Pickup</div>
          <div class="step">Delivering</div>
          <div class="step">Complete</div>
        </div>
        
        <div class="current-destination">
          <h4>Pickup Location</h4>
          <p>123 Warehouse St, Los Angeles, CA 90001</p>
          <p>Contact: John (555) 123-4567</p>
          <p>Instructions: Use loading dock B</p>
          <button class="action-button navigate-btn" onclick="openMaps()">
            Open in Maps
          </button>
          <button class="action-button complete-btn" onclick="markPickupComplete()">
            Mark Pickup Complete
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    // Progressive Web App functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/driver-sw.js');
    }
    
    // Geolocation tracking
    let watchId;
    function startLocationTracking() {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          updateLocation,
          handleLocationError,
          { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
        );
      }
    }
    
    function updateLocation(position) {
      fetch('/api/driver/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getDriverToken()}`
        },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      });
    }
    
    // Delivery management
    async function acceptDelivery(deliveryId) {
      const response = await fetch(`/api/driver/deliveries/${deliveryId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getDriverToken()}`
        }
      });
      
      if (response.ok) {
        showActiveDelivery(await response.json());
      }
    }
    
    function openMaps() {
      const destination = getCurrentDestination();
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
      window.open(mapsUrl, '_blank');
    }
    
    // Real-time updates via WebSocket
    const ws = new WebSocket('wss://api.platform.com/driver-updates');
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === 'new_delivery') {
        addDeliveryToList(update.delivery);
      }
    };
  </script>
</body>
</html>
```

### 6.2 Driver App Features

#### Core Features
1. **Status Management**
   - Online/Offline toggle
   - Break management
   - Availability scheduling

2. **Delivery Flow**
   - Browse available deliveries
   - Accept/Reject deliveries
   - Navigation integration
   - Pickup confirmation
   - Delivery confirmation with photo
   - Customer signature capture

3. **Earnings Tracking**
   - Real-time earnings
   - Daily/Weekly/Monthly summaries
   - Payout history
   - Tips tracking

4. **Communication**
   - In-app messaging with support
   - Customer contact (masked numbers)
   - Delivery instructions

5. **Performance Metrics**
   - Acceptance rate
   - On-time percentage
   - Customer ratings
   - Delivery history

---

## 7. Delivery Provider Integrations

### 7.1 Provider Interface

```typescript
// Base interface for all delivery providers
interface DeliveryProvider {
  name: string;
  
  // Check if provider is available for the given location
  isAvailable(pickup: Location, dropoff: Location): Promise<boolean>;
  
  // Get delivery quote
  getQuote(request: DeliveryRequest): Promise<DeliveryQuote>;
  
  // Create delivery
  createDelivery(request: DeliveryRequest): Promise<Delivery>;
  
  // Track delivery
  trackDelivery(deliveryId: string): Promise<DeliveryStatus>;
  
  // Cancel delivery
  cancelDelivery(deliveryId: string): Promise<void>;
  
  // Webhook handler
  handleWebhook(payload: any): Promise<void>;
}

interface DeliveryRequest {
  pickup: {
    address: Address;
    contact: Contact;
    instructions?: string;
    ready_at?: Date;
  };
  dropoff: {
    address: Address;
    contact: Contact;
    instructions?: string;
  };
  items: DeliveryItem[];
  requirements?: {
    vehicle_type?: 'bicycle' | 'car' | 'van';
    signature_required?: boolean;
    id_verification?: boolean;
  };
}
```

### 7.2 Internal Driver Provider

```typescript
class InternalDriverProvider implements DeliveryProvider {
  name = 'internal';
  
  async isAvailable(pickup: Location, dropoff: Location): Promise<boolean> {
    // Check if we have available drivers in the area
    const availableDrivers = await this.getAvailableDriversNear(pickup, 5); // 5 mile radius
    return availableDrivers.length > 0;
  }
  
  async getQuote(request: DeliveryRequest): Promise<DeliveryQuote> {
    const distance = await this.calculateDistance(request.pickup, request.dropoff);
    const driverPay = this.calculateDriverPay(distance);
    const platformFee = 2.00; // Platform markup
    
    return {
      provider: 'internal',
      total: driverPay + platformFee,
      driver_pay: driverPay,
      estimated_pickup: new Date(Date.now() + 15 * 60000), // 15 mins
      estimated_delivery: new Date(Date.now() + 45 * 60000), // 45 mins
    };
  }
  
  async createDelivery(request: DeliveryRequest): Promise<Delivery> {
    // Find best available driver
    const driver = await this.findOptimalDriver(request);
    
    if (!driver) {
      throw new Error('No drivers available');
    }
    
    // Create delivery assignment
    const delivery = await this.db.delivery_assignments.create({
      driver_id: driver.id,
      provider: 'internal',
      status: 'assigned',
      pickup_address: request.pickup.address,
      dropoff_address: request.dropoff.address,
      // ... other fields
    });
    
    // Notify driver via push notification
    await this.notifyDriver(driver, delivery);
    
    return delivery;
  }
  
  private calculateDriverPay(distance: number): number {
    const basePay = 4.00;
    const mileageRate = 0.75;
    const freeDistance = 5;
    
    const chargeableMiles = Math.max(0, distance - freeDistance);
    return basePay + (chargeableMiles * mileageRate);
  }
  
  private async findOptimalDriver(request: DeliveryRequest): Promise<Driver | null> {
    const candidates = await this.getAvailableDriversNear(request.pickup.location, 5);
    
    if (candidates.length === 0) return null;
    
    // Score drivers based on:
    // - Distance to pickup
    // - Driver rating
    // - Recent delivery count (avoid overloading)
    const scored = candidates.map(driver => ({
      driver,
      score: this.scoreDriver(driver, request)
    }));
    
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.driver || null;
  }
  
  private scoreDriver(driver: Driver, request: DeliveryRequest): number {
    let score = 100;
    
    // Distance penalty (closer is better)
    const distance = this.calculateDistance(driver.current_location, request.pickup.location);
    score -= distance * 2; // -2 points per mile
    
    // Rating bonus
    score += (driver.rating || 4.5) * 10;
    
    // Availability bonus (fewer recent deliveries)
    const recentDeliveries = driver.deliveries_today || 0;
    score -= recentDeliveries * 5;
    
    return score;
  }
}
```

### 7.3 DoorDash Integration

```typescript
class DoorDashProvider implements DeliveryProvider {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://openapi.doordash.com/drive/v2';
  
  name = 'doordash';
  
  async isAvailable(pickup: Location, dropoff: Location): Promise<boolean> {
    try {
      const response = await this.apiCall('POST', '/delivery_availability', {
        pickup_address: this.formatAddress(pickup),
        dropoff_address: this.formatAddress(dropoff),
      });
      
      return response.available;
    } catch (error) {
      console.error('DoorDash availability check failed:', error);
      return false;
    }
  }
  
  async getQuote(request: DeliveryRequest): Promise<DeliveryQuote> {
    const quote = await this.apiCall('POST', '/quotes', {
      pickup_address: this.formatAddress(request.pickup.address),
      pickup_phone_number: request.pickup.contact.phone,
      dropoff_address: this.formatAddress(request.dropoff.address),
      dropoff_phone_number: request.dropoff.contact.phone,
      order_value: this.calculateOrderValue(request.items),
    });
    
    return {
      provider: 'doordash',
      total: quote.fee / 100, // Convert cents to dollars
      estimated_pickup: new Date(quote.pickup_time_estimated),
      estimated_delivery: new Date(quote.dropoff_time_estimated),
      quote_id: quote.quote_id,
    };
  }
  
  async createDelivery(request: DeliveryRequest): Promise<Delivery> {
    const delivery = await this.apiCall('POST', '/deliveries', {
      external_delivery_id: generateUUID(),
      pickup_address: this.formatAddress(request.pickup.address),
      pickup_instructions: request.pickup.instructions,
      pickup_phone_number: request.pickup.contact.phone,
      pickup_business_name: request.pickup.contact.name,
      dropoff_address: this.formatAddress(request.dropoff.address),
      dropoff_instructions: request.dropoff.instructions,
      dropoff_phone_number: request.dropoff.contact.phone,
      dropoff_contact_given_name: request.dropoff.contact.first_name,
      order_value: this.calculateOrderValue(request.items),
      items: request.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        description: item.description,
      })),
    });
    
    return {
      id: delivery.external_delivery_id,
      provider: 'doordash',
      provider_reference_id: delivery.delivery_id,
      tracking_url: delivery.tracking_url,
      status: this.mapDoorDashStatus(delivery.delivery_status),
      // ... map other fields
    };
  }
  
  async handleWebhook(payload: any): Promise<void> {
    // Verify webhook signature
    if (!this.verifyWebhookSignature(payload)) {
      throw new Error('Invalid webhook signature');
    }
    
    const { event_type, delivery } = payload;
    
    switch (event_type) {
      case 'delivery.status_update':
        await this.updateDeliveryStatus(
          delivery.external_delivery_id,
          this.mapDoorDashStatus(delivery.delivery_status)
        );
        break;
        
      case 'delivery.completed':
        await this.completeDelivery(delivery.external_delivery_id, {
          delivered_at: new Date(delivery.delivered_at),
          signature: delivery.signature_image_url,
        });
        break;
    }
  }
  
  private async apiCall(method: string, endpoint: string, data?: any): Promise<any> {
    const jwt = this.generateJWT();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`DoorDash API error: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

### 7.4 Delivery Provider Selection Strategy

```typescript
class DeliveryProviderSelector {
  private providers: Map<string, DeliveryProvider> = new Map();
  
  constructor() {
    this.providers.set('internal', new InternalDriverProvider());
    this.providers.set('doordash', new DoorDashProvider());
    // Future: Uber Direct, Postmates, Onfleet
  }
  
  async selectProvider(request: DeliveryRequest): Promise<{
    provider: DeliveryProvider;
    quote: DeliveryQuote;
  }> {
    const quotes: Array<{provider: DeliveryProvider; quote: DeliveryQuote}> = [];
    
    // Get quotes from all available providers
    for (const [name, provider] of this.providers) {
      try {
        const isAvailable = await provider.isAvailable(
          request.pickup.location,
          request.dropoff.location
        );
        
        if (isAvailable) {
          const quote = await provider.getQuote(request);
          quotes.push({ provider, quote });
        }
      } catch (error) {
        console.error(`Failed to get quote from ${name}:`, error);
      }
    }
    
    if (quotes.length === 0) {
      throw new Error('No delivery providers available');
    }
    
    // Selection strategy:
    // 1. Prefer internal drivers (better margins)
    // 2. If internal not available, choose cheapest
    // 3. Consider delivery time if customer paid for express
    
    const internalQuote = quotes.find(q => q.provider.name === 'internal');
    if (internalQuote) {
      return internalQuote;
    }
    
    // Sort by total cost
    quotes.sort((a, b) => a.quote.total - b.quote.total);
    return quotes[0];
  }
}
```

---

## 8. Commission Payout Workflows

### 8.1 Commission Calculation Engine

```typescript
class CommissionCalculationEngine {
  async calculateOrderCommissions(order: Order): Promise<CommissionBreakdown> {
    const shop = await this.getAttributedShop(order);
    if (!shop) {
      return { commissions: [], fees: [] };
    }
    
    const commissions: Commission[] = [];
    const fees: PlatformFee[] = [];
    
    // Calculate shop commission
    const shopTier = await this.getShopTier(shop.id);
    const shopCommission = this.calculateShopCommission(order, shopTier);
    commissions.push(shopCommission);
    
    // Calculate platform fees for each vendor
    for (const item of order.items) {
      const vendor = await this.getVendor(item.vendor_id);
      const fee = this.calculateVendorFee(vendor, item);
      fees.push(fee);
    }
    
    // Validate platform profitability
    const totalRevenue = order.total;
    const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
    const totalCOGS = order.items.reduce((sum, item) => sum + item.wholesale_cost, 0);
    const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
    const deliveryCost = order.delivery_cost || 0;
    
    const platformProfit = totalRevenue - totalCommissions - totalCOGS + totalFees - deliveryCost;
    
    return {
      commissions,
      fees,
      summary: {
        revenue: totalRevenue,
        commissions_paid: totalCommissions,
        cogs: totalCOGS,
        fees_collected: totalFees,
        delivery_cost: deliveryCost,
        platform_profit: platformProfit,
        margin_percentage: (platformProfit / totalRevenue) * 100,
      }
    };
  }
  
  private calculateShopCommission(order: Order, tier: ShopTier): Commission {
    const commissionRate = tier.commission_rate;
    const commissionAmount = order.subtotal * commissionRate;
    
    return {
      id: generateUUID(),
      order_id: order.id,
      shop_id: tier.shop_id,
      type: 'shop_referral',
      rate: commissionRate,
      base_amount: order.subtotal,
      commission_amount: commissionAmount,
      tier: tier.tier,
      status: 'pending',
      created_at: new Date(),
    };
  }
  
  private calculateVendorFee(vendor: Vendor, orderItem: OrderItem): PlatformFee {
    let feeRate: number;
    
    switch (vendor.vendor_type) {
      case 'brand':
        feeRate = this.getBrandFeeRate(vendor);
        break;
      case 'distributor':
        feeRate = this.getDistributorFeeRate(vendor);
        break;
      default:
        feeRate = 0;
    }
    
    return {
      id: generateUUID(),
      vendor_id: vendor.id,
      order_item_id: orderItem.id,
      vendor_type: vendor.vendor_type,
      fee_rate: feeRate,
      base_amount: orderItem.wholesale_total,
      fee_amount: orderItem.wholesale_total * feeRate,
      created_at: new Date(),
    };
  }
  
  private getBrandFeeRate(brand: Vendor): number {
    const monthlyVolume = this.getMonthlyVolume(brand.id);
    
    if (monthlyVolume <= 100000) return 0.10;
    if (monthlyVolume <= 500000) return 0.15;
    return 0.20;
  }
  
  private getDistributorFeeRate(distributor: Vendor): number {
    // Check if first in region with promotional rate
    if (this.hasPromotionalRate(distributor)) {
      return 0.03;
    }
    
    const monthlyVolume = this.getMonthlyVolume(distributor.id);
    
    if (monthlyVolume >= 500000) return 0.03;
    if (monthlyVolume >= 250000) return 0.05;
    if (monthlyVolume >= 100000) return 0.06;
    if (monthlyVolume >= 50000) return 0.08;
    return 0.10;
  }
}
```

### 8.2 Payout Processing

```typescript
class PayoutProcessor {
  async processShopPayouts(): Promise<PayoutBatch> {
    // Run daily or weekly
    const pendingCommissions = await this.getPendingCommissions();
    const payoutBatch = await this.createPayoutBatch();
    
    for (const shop of this.groupCommissionsByShop(pendingCommissions)) {
      try {
        const payout = await this.createShopPayout(shop, payoutBatch);
        await this.markCommissionsPaid(shop.commission_ids, payout.id);
      } catch (error) {
        await this.handlePayoutError(shop, error);
      }
    }
    
    return payoutBatch;
  }
  
  private async createShopPayout(
    shop: ShopPayoutGroup,
    batch: PayoutBatch
  ): Promise<Payout> {
    // Minimum payout threshold
    if (shop.total_amount < 10.00) {
      return null; // Skip, will be included in next batch
    }
    
    // Create Stripe transfer
    const transfer = await stripe.transfers.create({
      amount: Math.round(shop.total_amount * 100), // Convert to cents
      currency: 'usd',
      destination: shop.stripe_account_id,
      transfer_group: batch.id,
      metadata: {
        shop_id: shop.id,
        commission_count: shop.commission_ids.length,
        period: batch.period,
      },
    });
    
    // Record payout
    return await this.db.payouts.create({
      batch_id: batch.id,
      vendor_id: shop.id,
      vendor_type: 'shop',
      amount: shop.total_amount,
      commission_ids: shop.commission_ids,
      stripe_transfer_id: transfer.id,
      status: 'processing',
      created_at: new Date(),
    });
  }
  
  async processVendorPayments(): Promise<void> {
    // Process payments TO brands/distributors for fulfilled orders
    const completedOrders = await this.getCompletedUnpaidOrders();
    
    for (const order of completedOrders) {
      const vendorPayments = await this.calculateVendorPayments(order);
      
      for (const payment of vendorPayments) {
        try {
          await this.createVendorPayment(payment);
        } catch (error) {
          await this.handleVendorPaymentError(payment, error);
        }
      }
    }
  }
  
  private async createVendorPayment(payment: VendorPayment): Promise<void> {
    // Calculate net amount (wholesale price - platform fee)
    const netAmount = payment.wholesale_amount - payment.platform_fee;
    
    // Create Stripe transfer
    const transfer = await stripe.transfers.create({
      amount: Math.round(netAmount * 100),
      currency: 'usd',
      destination: payment.stripe_account_id,
      source_transaction: payment.charge_id, // Original customer charge
      metadata: {
        vendor_id: payment.vendor_id,
        order_id: payment.order_id,
        platform_fee: payment.platform_fee,
      },
    });
    
    // Record payment
    await this.db.vendor_payments.create({
      vendor_id: payment.vendor_id,
      order_id: payment.order_id,
      gross_amount: payment.wholesale_amount,
      platform_fee: payment.platform_fee,
      net_amount: netAmount,
      stripe_transfer_id: transfer.id,
      status: 'completed',
      created_at: new Date(),
    });
  }
}
```

### 8.3 Financial Reporting

```typescript
class FinancialReportingService {
  async generatePlatformFinancialReport(
    startDate: Date,
    endDate: Date
  ): Promise<PlatformFinancialReport> {
    const orders = await this.getOrdersInPeriod(startDate, endDate);
    
    const report: PlatformFinancialReport = {
      period: { start: startDate, end: endDate },
      revenue: {
        gross_sales: 0,
        delivery_fees: 0,
        total: 0,
      },
      costs: {
        shop_commissions: 0,
        product_costs: 0,
        delivery_costs: 0,
        payment_processing: 0,
        total: 0,
      },
      fees_collected: {
        brand_fees: 0,
        distributor_fees: 0,
        total: 0,
      },
      profit: {
        gross: 0,
        net: 0,
        margin_percentage: 0,
      },
      metrics: {
        total_orders: orders.length,
        average_order_value: 0,
        shop_performance: [],
        vendor_performance: [],
      },
    };
    
    // Calculate financials
    for (const order of orders) {
      // Revenue
      report.revenue.gross_sales += order.subtotal;
      report.revenue.delivery_fees += order.delivery_fee || 0;
      
      // Costs
      const commissions = await this.getOrderCommissions(order.id);
      report.costs.shop_commissions += commissions.reduce((sum, c) => sum + c.amount, 0);
      
      const productCosts = await this.getOrderProductCosts(order.id);
      report.costs.product_costs += productCosts;
      
      report.costs.delivery_costs += order.delivery_cost || 0;
      report.costs.payment_processing += order.total * 0.029 + 0.30; // Stripe fees
      
      // Fees collected
      const fees = await this.getOrderPlatformFees(order.id);
      for (const fee of fees) {
        if (fee.vendor_type === 'brand') {
          report.fees_collected.brand_fees += fee.amount;
        } else if (fee.vendor_type === 'distributor') {
          report.fees_collected.distributor_fees += fee.amount;
        }
      }
    }
    
    // Calculate totals
    report.revenue.total = report.revenue.gross_sales + report.revenue.delivery_fees;
    report.costs.total = Object.values(report.costs).reduce((sum, cost) => sum + cost, 0);
    report.fees_collected.total = report.fees_collected.brand_fees + report.fees_collected.distributor_fees;
    
    // Calculate profit
    report.profit.gross = report.revenue.total - report.costs.product_costs;
    report.profit.net = report.revenue.total - report.costs.total + report.fees_collected.total;
    report.profit.margin_percentage = (report.profit.net / report.revenue.total) * 100;
    
    // Calculate metrics
    report.metrics.average_order_value = report.revenue.gross_sales / orders.length;
    
    return report;
  }
  
  async generateShopStatement(shopId: string, month: number, year: number): Promise<ShopStatement> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const commissions = await this.getShopCommissions(shopId, startDate, endDate);
    const tier = await this.getShopTierForPeriod(shopId, startDate);
    
    return {
      shop_id: shopId,
      period: { month, year },
      tier_info: {
        tier: tier.tier,
        commission_rate: tier.commission_rate,
        monthly_sales: tier.monthly_sales,
      },
      commissions: {
        count: commissions.length,
        total_sales: commissions.reduce((sum, c) => sum + c.order_amount, 0),
        total_earned: commissions.reduce((sum, c) => sum + c.amount, 0),
        details: commissions.map(c => ({
          order_id: c.order_id,
          order_date: c.created_at,
          order_amount: c.order_amount,
          commission_rate: c.rate,
          commission_amount: c.amount,
          status: c.status,
        })),
      },
      payouts: await this.getShopPayouts(shopId, startDate, endDate),
      summary: {
        beginning_balance: 0, // Calculate from previous period
        commissions_earned: commissions.reduce((sum, c) => sum + c.amount, 0),
        payouts_received: 0, // Sum of payouts
        ending_balance: 0, // Calculate
      },
    };
  }
}
```

---

## 9. Implementation Roadmap

### 9.1 Phase 1: Foundation (Weeks 1-2)

#### Week 1: MedusaJS Setup & Core Architecture
- **Day 1-2**: MedusaJS installation and configuration
  - Set up development environment
  - Configure PostgreSQL with MedusaJS
  - Initialize project structure
  
- **Day 3-4**: Custom module development
  - Create vendor-management module
  - Create affiliate-marketplace module
  - Create delivery-network module
  
- **Day 5**: Authentication & authorization
  - Extend MedusaJS auth for vendor types
  - Implement role-based access control
  - Create vendor onboarding flow

#### Week 2: Data Migration & Integration
- **Day 1-2**: Database schema migration
  - Map existing tables to MedusaJS structure
  - Create migration scripts
  - Set up data synchronization
  
- **Day 3-4**: API compatibility layer
  - Create adapter endpoints for existing frontend
  - Implement backwards compatibility
  - Test with existing Next.js app
  
- **Day 5**: Testing & validation
  - Unit tests for core modules
  - Integration tests
  - Data integrity validation

### 9.2 Phase 2: Affiliate System (Weeks 3-4)

#### Week 3: Commission Engine
- **Day 1-2**: Shop tier management
  - Implement tier calculation logic
  - Create promotional tier system
  - Build tier update cron jobs
  
- **Day 3-4**: Commission calculation
  - Order attribution system
  - Commission calculation service
  - Commission tracking and reporting
  
- **Day 5**: Shop dashboard
  - Analytics and metrics
  - Referral link generation
  - Commission history

#### Week 4: Vendor Fee System
- **Day 1-2**: Brand fee structure
  - Volume tracking
  - Fee calculation
  - Brand dashboard updates
  
- **Day 3-4**: Distributor fee structure
  - Regional tracking
  - Promotional rates
  - Volume discounts
  
- **Day 5**: Financial reconciliation
  - Platform profit calculation
  - Fee collection tracking
  - Financial reporting

### 9.3 Phase 3: Delivery Network (Weeks 5-6)

#### Week 5: Driver Platform
- **Day 1-2**: Driver onboarding
  - Registration flow
  - Background check integration
  - Vehicle verification
  
- **Day 3-4**: Driver dashboard
  - Mobile-responsive web interface
  - Real-time delivery tracking
  - Earnings and performance metrics
  - GPS integration for location updates
  
- **Day 5**: Driver assignment algorithm
  - Location-based matching
  - Load balancing
  - Performance-based routing
  - Real-time availability tracking

#### Week 6: Delivery Integration
- **Day 1-2**: Internal delivery system
  - Delivery creation workflow
  - Route optimization
  - Driver notification system
  - Proof of delivery capture
  
- **Day 3-4**: DoorDash integration
  - API integration
  - Webhook handling
  - Fallback logic
  - Cost tracking
  
- **Day 5**: Delivery provider selection
  - Provider availability checking
  - Cost comparison
  - Automatic failover
  - Performance monitoring

### 9.4 Phase 4: Platform Integration (Weeks 7-8)

#### Week 7: Order Management
- **Day 1-2**: Multi-vendor checkout
  - Cart splitting by vendor
  - Commission calculation at checkout
  - Fee application
  - Delivery assignment
  
- **Day 3-4**: Order fulfillment
  - Vendor order creation
  - Inventory updates
  - Status tracking
  - Notification system
  
- **Day 5**: Payment processing
  - Stripe Connect integration
  - Payment splitting
  - Fee collection
  - Refund handling

#### Week 8: Launch Preparation
- **Day 1-2**: Performance optimization
  - Query optimization
  - Caching implementation
  - Load testing
  - Scalability improvements
  
- **Day 3-4**: Admin tools
  - Platform admin dashboard
  - Vendor management tools
  - Financial reporting
  - System monitoring
  
- **Day 5**: Launch readiness
  - Final testing
  - Documentation
  - Training materials
  - Deployment preparation

---

## 10. Technical Requirements

### 10.1 Infrastructure Requirements

#### Hosting & Deployment
```yaml
# Production Environment
production:
  compute:
    - type: "AWS ECS Fargate"
      instances: 4
      cpu: "2 vCPU"
      memory: "4 GB"
      auto_scaling:
        min: 2
        max: 10
        target_cpu: 70
    
  database:
    - type: "AWS RDS PostgreSQL"
      version: "14.x"
      instance: "db.r6g.xlarge"
      storage: "500 GB"
      multi_az: true
      read_replicas: 2
    
  cache:
    - type: "AWS ElastiCache Redis"
      version: "7.x"
      node_type: "cache.r6g.large"
      nodes: 3
      cluster_mode: true
    
  storage:
    - type: "AWS S3"
      buckets:
        - name: "platform-assets"
          purpose: "Product images, documents"
        - name: "platform-backups"
          purpose: "Database backups"
    
  cdn:
    - type: "AWS CloudFront"
      origins:
        - "S3 assets bucket"
        - "Application load balancer"
```

#### Development Environment
```yaml
development:
  local:
    - docker_compose: true
    - services:
        - medusa_backend
        - postgres
        - redis
        - minio (S3 compatible)
    
  staging:
    - type: "AWS ECS"
      instances: 2
      database: "RDS PostgreSQL (smaller instance)"
      cache: "ElastiCache Redis (single node)"
```

### 10.2 Performance Requirements

#### API Response Times
```typescript
interface PerformanceTargets {
  api_endpoints: {
    product_list: { p95: 200, p99: 500 },        // milliseconds
    product_detail: { p95: 150, p99: 300 },
    cart_operations: { p95: 100, p99: 250 },
    checkout: { p95: 1000, p99: 2000 },
    search: { p95: 300, p99: 600 },
  };
  
  page_load: {
    time_to_first_byte: 200,
    first_contentful_paint: 1000,
    time_to_interactive: 2000,
  };
  
  throughput: {
    orders_per_minute: 100,
    concurrent_users: 10000,
    api_requests_per_second: 1000,
  };
}
```

#### Database Performance
```sql
-- Required indexes for performance
CREATE INDEX CONCURRENTLY idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status) WHERE status IN ('pending', 'processing');

CREATE INDEX CONCURRENTLY idx_products_vendor_id ON products(vendor_id);
CREATE INDEX CONCURRENTLY idx_products_category ON products(category_id);
CREATE INDEX CONCURRENTLY idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));

CREATE INDEX CONCURRENTLY idx_commission_records_shop_id_date ON commission_records(shop_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_commission_records_payout ON commission_records(payout_id) WHERE payout_id IS NULL;

-- Partitioning for large tables
CREATE TABLE orders_2025 PARTITION OF orders
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 10.3 Security Requirements

#### Authentication & Authorization
```typescript
// JWT token structure
interface AuthToken {
  sub: string;           // User/Vendor ID
  type: 'customer' | 'vendor' | 'driver' | 'admin';
  vendor_type?: 'shop' | 'brand' | 'distributor';
  permissions: string[];
  iat: number;
  exp: number;
}

// Permission matrix
const permissions = {
  shop: [
    'view:own-analytics',
    'generate:referral-links',
    'view:commission-history',
    'update:shop-profile',
  ],
  brand: [
    'create:products',
    'update:products',
    'view:inventory',
    'view:brand-analytics',
    'manage:pricing',
  ],
  distributor: [
    'view:fulfillment-queue',
    'update:inventory',
    'manage:warehouse',
    'view:distribution-analytics',
  ],
  driver: [
    'view:available-deliveries',
    'accept:deliveries',
    'update:delivery-status',
    'view:earnings',
  ],
  admin: ['*'], // All permissions
};
```

#### Data Security
```typescript
// Encryption for sensitive data
class SecurityService {
  // PII encryption
  encryptPII(data: string): string {
    return crypto.AES.encrypt(data, process.env.ENCRYPTION_KEY).toString();
  }
  
  // API key management
  generateAPIKey(): { key: string; hash: string } {
    const key = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    return { key, hash };
  }
  
  // Rate limiting
  rateLimits = {
    public_api: { window: '1m', max: 60 },
    authenticated_api: { window: '1m', max: 200 },
    checkout: { window: '5m', max: 10 },
    driver_location_update: { window: '1m', max: 120 },
  };
}
```

#### Compliance Requirements
- **PCI DSS**: No credit card data stored, all handled by Stripe
- **GDPR**: Data export and deletion capabilities
- **CCPA**: California privacy compliance
- **SOC 2**: Security controls and audit trails
- **HIPAA**: Not applicable (no health data)

### 10.4 Monitoring & Observability

#### Application Monitoring
```typescript
// Sentry configuration
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Postgres(),
  ],
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
});

// Custom metrics
class MetricsService {
  // Business metrics
  trackOrder(order: Order) {
    this.increment('orders.created', {
      vendor_type: order.vendor_type,
      payment_method: order.payment_method,
    });
    this.histogram('orders.value', order.total);
  }
  
  trackCommission(commission: Commission) {
    this.increment('commissions.calculated', {
      shop_tier: commission.tier,
    });
    this.histogram('commissions.amount', commission.amount);
  }
  
  trackDelivery(delivery: Delivery) {
    this.increment('deliveries.created', {
      provider: delivery.provider,
    });
    this.histogram('deliveries.distance', delivery.distance);
    this.histogram('deliveries.duration', delivery.duration);
  }
}
```

#### Infrastructure Monitoring
```yaml
# CloudWatch alarms
alarms:
  - name: "High API Error Rate"
    metric: "4XXError"
    threshold: 10
    evaluation_periods: 2
    
  - name: "Database CPU High"
    metric: "CPUUtilization"
    threshold: 80
    evaluation_periods: 3
    
  - name: "Low Order Volume"
    metric: "Custom/Orders/Count"
    threshold: 50
    comparison: "LessThanThreshold"
    evaluation_periods: 4
    
  - name: "Payment Processing Failures"
    metric: "Custom/Payments/Failures"
    threshold: 5
    evaluation_periods: 1
```

---

## 11. Security & Compliance

### 11.1 Security Architecture

#### Network Security
```yaml
# AWS Security Groups
security_groups:
  - name: "medusa-backend"
    ingress:
      - port: 443
        source: "0.0.0.0/0"  # HTTPS from anywhere
      - port: 9000
        source: "10.0.0.0/16"  # Internal API
    egress:
      - port: 5432
        destination: "rds-security-group"  # PostgreSQL
      - port: 6379
        destination: "redis-security-group"  # Redis
      - port: 443
        destination: "0.0.0.0/0"  # External APIs
        
  - name: "rds-postgres"
    ingress:
      - port: 5432
        source: "medusa-backend"
        
  - name: "redis-cache"
    ingress:
      - port: 6379
        source: "medusa-backend"
```

#### API Security
```typescript
// API authentication middleware
export const authenticateRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthToken;
    
    // Check token expiration
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    // Verify user/vendor still exists and is active
    const entity = await getEntityById(decoded.sub, decoded.type);
    if (!entity || !entity.is_active) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = entity;
    req.permissions = decoded.permissions;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Permission checking
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.permissions?.includes(permission) && !req.permissions?.includes('*')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### 11.2 Data Privacy & Compliance

#### GDPR Compliance
```typescript
class GDPRService {
  // Data export
  async exportUserData(userId: string): Promise<UserDataExport> {
    const data = {
      profile: await this.getProfile(userId),
      orders: await this.getOrders(userId),
      addresses: await this.getAddresses(userId),
      payment_methods: await this.getPaymentMethods(userId),
      activity_logs: await this.getActivityLogs(userId),
    };
    
    return {
      user_id: userId,
      exported_at: new Date(),
      data: this.sanitizeForExport(data),
    };
  }
  
  // Data deletion
  async deleteUserData(userId: string): Promise<void> {
    // Soft delete with data anonymization
    await this.db.transaction(async (trx) => {
      // Anonymize personal data
      await trx.profiles.update({
        where: { id: userId },
        data: {
          email: `deleted-${userId}@example.com`,
          full_name: 'Deleted User',
          phone: null,
          date_of_birth: null,
          deleted_at: new Date(),
        },
      });
      
      // Remove addresses
      await trx.addresses.deleteMany({ where: { user_id: userId } });
      
      // Anonymize orders (keep for financial records)
      await trx.orders.updateMany({
        where: { user_id: userId },
        data: {
          customer_email: null,
          customer_name: 'Deleted User',
          customer_phone: null,
          shipping_address: null,
          billing_address: null,
        },
      });
    });
  }
  
  // Consent management
  async updateConsent(userId: string, consents: ConsentUpdate): Promise<void> {
    await this.db.user_consents.upsert({
      where: { user_id: userId },
      create: {
        user_id: userId,
        ...consents,
        consented_at: new Date(),
      },
      update: {
        ...consents,
        updated_at: new Date(),
      },
    });
  }
}
```

#### Audit Logging
```typescript
class AuditService {
  async logEvent(event: AuditEvent): Promise<void> {
    await this.db.audit_logs.create({
      data: {
        event_type: event.type,
        actor_id: event.actor_id,
        actor_type: event.actor_type,
        resource_type: event.resource_type,
        resource_id: event.resource_id,
        action: event.action,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        metadata: event.metadata,
        created_at: new Date(),
      },
    });
  }
  
  // Audit event types
  auditEvents = {
    // Authentication
    LOGIN: 'auth.login',
    LOGOUT: 'auth.logout',
    PASSWORD_RESET: 'auth.password_reset',
    
    // Vendor management
    VENDOR_CREATED: 'vendor.created',
    VENDOR_UPDATED: 'vendor.updated',
    VENDOR_SUSPENDED: 'vendor.suspended',
    
    // Financial
    PAYOUT_CREATED: 'finance.payout_created',
    COMMISSION_CALCULATED: 'finance.commission_calculated',
    REFUND_ISSUED: 'finance.refund_issued',
    
    // Products
    PRODUCT_CREATED: 'product.created',
    PRODUCT_UPDATED: 'product.updated',
    PRICE_CHANGED: 'product.price_changed',
    
    // Orders
    ORDER_PLACED: 'order.placed',
    ORDER_CANCELLED: 'order.cancelled',
    ORDER_REFUNDED: 'order.refunded',
  };
}
```

### 11.3 Payment Security

#### Stripe Security Implementation
```typescript
class PaymentSecurityService {
  // Webhook signature verification
  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return true;
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return false;
    }
  }
  
  // Secure payment method storage
  async storePaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    // Never store full card details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    await this.db.payment_methods.create({
      data: {
        customer_id: customerId,
        stripe_payment_method_id: paymentMethodId,
        type: paymentMethod.type,
        last_four: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
        exp_month: paymentMethod.card?.exp_month,
        exp_year: paymentMethod.card?.exp_year,
        is_default: false,
      },
    });
  }
  
  // Fraud detection
  async checkForFraud(order: Order): Promise<FraudCheckResult> {
    const riskFactors = [];
    
    // Check velocity
    const recentOrders = await this.getRecentOrders(order.user_id, 24); // Last 24 hours
    if (recentOrders.length > 5) {
      riskFactors.push('high_order_velocity');
    }
    
    // Check amount
    if (order.total > 1000) {
      riskFactors.push('high_order_value');
    }
    
    // Check shipping address
    const shippingRisk = await this.checkShippingAddress(order.shipping_address);
    if (shippingRisk) {
      riskFactors.push('risky_shipping_address');
    }
    
    // Calculate risk score
    const riskScore = riskFactors.length * 25;
    
    return {
      risk_score: riskScore,
      risk_factors: riskFactors,
      recommendation: riskScore > 50 ? 'manual_review' : 'approve',
    };
  }
}
```

---

## 12. Success Metrics

### 12.1 Business Metrics

#### Revenue Metrics
```typescript
interface RevenueMetrics {
  // Platform revenue
  gross_merchandise_value: number;      // Total sales
  net_revenue: number;                  // After commissions
  platform_profit: number;              // After all costs
  
  // Growth metrics
  revenue_growth_rate: number;          // Month-over-month
  average_order_value: number;
  customer_lifetime_value: number;
  
  // Efficiency metrics
  gross_margin: number;                 // (Revenue - COGS) / Revenue
  contribution_margin: number;          // After variable costs
  platform_take_rate: number;           // Platform profit / GMV
}

// Tracking implementation
class MetricsTracker {
  async trackDailyMetrics(): Promise<void> {
    const today = new Date();
    const metrics = await this.calculateDailyMetrics(today);
    
    await this.db.daily_metrics.create({
      data: {
        date: today,
        gmv: metrics.gmv,
        orders: metrics.orders,
        new_customers: metrics.new_customers,
        active_shops: metrics.active_shops,
        platform_profit: metrics.platform_profit,
        // ... other metrics
      },
    });
    
    // Send to analytics platform
    await this.sendToAnalytics(metrics);
    
    // Alert on anomalies
    await this.checkForAnomalies(metrics);
  }
}
```

#### Vendor Success Metrics
```typescript
interface VendorMetrics {
  shops: {
    total_active: number;
    new_this_month: number;
    tier_distribution: {
      bronze: number;
      silver: number;
      gold: number;
    };
    average_monthly_sales: number;
    churn_rate: number;
  };
  
  brands: {
    total_active: number;
    total_products: number;
    average_catalog_size: number;
    fill_rate: number;              // Orders fulfilled / Orders received
    average_processing_time: number;
  };
  
  distributors: {
    total_active: number;
    coverage_areas: number;
    average_delivery_time: number;
    fulfillment_accuracy: number;
  };
}
```

### 12.2 Operational Metrics

#### Platform Performance
```typescript
interface PerformanceMetrics {
  // Availability
  uptime_percentage: number;           // Target: 99.9%
  
  // Response times (p95)
  api_response_time: number;           // Target: <200ms
  page_load_time: number;              // Target: <2s
  checkout_completion_time: number;    // Target: <30s
  
  // Throughput
  requests_per_second: number;
  concurrent_users: number;
  orders_per_hour: number;
  
  // Error rates
  error_rate: number;                  // Target: <0.1%
  payment_failure_rate: number;        // Target: <1%
  
  // Infrastructure
  database_query_time: number;         // Target: <50ms
  cache_hit_rate: number;              // Target: >90%
  cdn_hit_rate: number;                // Target: >95%
}
```

#### Delivery Performance
```typescript
interface DeliveryMetrics {
  // Driver metrics
  active_drivers: number;
  driver_utilization: number;          // Active time / Online time
  average_earnings_per_hour: number;
  driver_satisfaction_score: number;
  
  // Delivery metrics
  average_delivery_time: number;       // Target: <45 minutes
  on_time_delivery_rate: number;       // Target: >95%
  delivery_success_rate: number;       // Target: >98%
  
  // Cost metrics
  average_delivery_cost: number;
  internal_vs_third_party_ratio: number;
  delivery_margin: number;
}
```

### 12.3 Customer Satisfaction

#### Customer Metrics
```typescript
interface CustomerMetrics {
  // Acquisition
  new_customer_acquisition_cost: number;
  customer_acquisition_channels: {
    shop_referral: number;
    organic: number;
    paid_ads: number;
    social_media: number;
  };
  
  // Engagement
  monthly_active_users: number;
  repeat_purchase_rate: number;        // Target: >40%
  average_order_frequency: number;
  cart_abandonment_rate: number;       // Target: <30%
  
  // Satisfaction
  net_promoter_score: number;          // Target: >50
  customer_satisfaction_score: number;  // Target: >4.5/5
  support_ticket_resolution_time: number;
  
  // Retention
  customer_retention_rate: number;     // Target: >80%
  churn_rate: number;                  // Target: <5%
  reactivation_rate: number;
}
```

### 12.4 Success Dashboard

```typescript
// Executive dashboard configuration
const executiveDashboard = {
  realtime_metrics: [
    'active_users',
    'orders_today',
    'gmv_today',
    'active_deliveries',
  ],
  
  daily_kpis: [
    'gmv',
    'order_count',
    'new_customers',
    'platform_profit',
    'shop_commissions',
    'delivery_performance',
  ],
  
  weekly_trends: [
    'revenue_growth',
    'customer_acquisition',
    'vendor_performance',
    'operational_efficiency',
  ],
  
  alerts: [
    {
      metric: 'error_rate',
      threshold: 1,
      comparison: 'greater_than',
      severity: 'critical',
    },
    {
      metric: 'order_volume',
      threshold: 0.8, // 80% of normal
      comparison: 'less_than',
      severity: 'warning',
    },
  ],
};
```

---

## Conclusion

This comprehensive PRD outlines the complete transformation of your marketplace platform to leverage MedusaJS while maintaining your unique business model. The key advantages include:

1. **Reduced Development Time**: Leveraging MedusaJS's proven e-commerce infrastructure
2. **Scalable Architecture**: Modular design supporting growth
3. **Unique Business Model**: Supporting your affiliate-based marketplace
4. **Flexible Delivery Network**: Hybrid model optimizing costs and service
5. **Comprehensive Monitoring**: Full visibility into platform performance

The implementation roadmap provides a clear path to launch in 8 weeks, with each phase building upon the previous to minimize risk and ensure success.

### Next Steps

1. **Technical Review**: Review this PRD with your technical team
2. **Resource Planning**: Allocate development resources for each phase
3. **Environment Setup**: Begin setting up development environments
4. **Vendor Communication**: Prepare existing vendors for the transition
5. **Migration Planning**: Create detailed data migration scripts

### Key Success Factors

- **Phased Approach**: Implement in manageable phases with clear milestones
- **Backward Compatibility**: Maintain existing frontend functionality during transition
- **Vendor Support**: Provide comprehensive training and documentation
- **Performance Monitoring**: Implement monitoring from day one
- **Iterative Improvement**: Plan for continuous optimization post-launch

This platform will position you uniquely in the market with a scalable, efficient, and profitable business model that benefits all stakeholders - shops, brands, distributors, drivers, and customers.
