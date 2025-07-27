# Vendor Types and Business Model

## Overview

The MedusaJS-powered marketplace supports three distinct vendor types, each with unique roles, commission structures, and operational requirements.

## 1. Shop (Affiliate) Model

### Business Model
- **Role**: Affiliate partners who refer customers but don't hold inventory
- **Revenue**: Earn commission on referred sales (15-25%)
- **Inventory**: None - products fulfilled by brands/distributors
- **Risk**: Minimal - no inventory or fulfillment responsibilities

### Commission Tiers
```
Bronze Tier (15%): $0 - $15,000 monthly sales
Silver Tier (20%): $15,001 - $50,000 monthly sales
Gold Tier (25%): $50,001+ monthly sales

Promotional: New shops get Gold tier for first 3 months
```

### Shop Features
- Referral link generation with tracking
- Custom marketing campaigns
- Real-time commission tracking
- Monthly performance analytics
- Tier progression tracking
- Marketing asset library

### Onboarding Requirements
- Business registration
- Tax information (W-9 or equivalent)
- Bank account for commission payouts
- Marketing plan submission
- Brand partnership preferences

## 2. Brand Model

### Business Model
- **Role**: Product manufacturers and brand owners
- **Revenue**: Wholesale pricing minus platform fees (10-20%)
- **Inventory**: Managed at brand warehouses or distributor locations
- **Risk**: Inventory management and product quality

### Platform Fee Structure
```
Starter (10%): $0 - $100,000 monthly volume
Growth (15%): $100,001 - $500,000 monthly volume
Enterprise (20%): $500,001+ monthly volume
```

### Brand Features
- Product catalog management
- Pricing and discount controls
- Inventory tracking across locations
- Sales analytics and reporting
- Multi-distributor management
- Brand page customization

### Onboarding Requirements
- Business license verification
- Product compliance documentation
- Insurance verification
- Stripe Connect account setup
- Initial product catalog
- Fulfillment capability proof

## 3. Distributor Model

### Business Model
- **Role**: Warehouse and fulfillment partners
- **Revenue**: Product margin minus platform fees (3-10%)
- **Inventory**: Physical inventory storage and management
- **Risk**: Inventory holding and fulfillment accuracy

### Platform Fee Structure
```
Pioneer Rate (3%): First distributor in region for 6 months
Standard (10%): New distributors base rate

Volume Discounts:
- 8%: $50,000+ monthly volume
- 6%: $100,000+ monthly volume
- 5%: $250,000+ monthly volume
- 3%: $500,000+ monthly volume (minimum)
```

### Distributor Features
- Warehouse management system
- Multi-brand inventory tracking
- Order fulfillment queue
- Driver pickup coordination
- Regional coverage management
- Performance analytics

### Onboarding Requirements
- Warehouse facility verification
- Business license and permits
- Insurance documentation
- Fulfillment capability assessment
- Technology integration testing
- Regional coverage definition

## Transaction Flow Example

```
Customer Order: $100
├── Shop Commission (20%): -$20 → Shop receives
├── Product Cost: $50 → Brand receives $45 (after 10% fee)
├── Platform Gross: $30
├── Delivery Cost: -$8 → Driver receives
└── Platform Net: $22
```

## Vendor Relationships

### Shop ↔ Brand
- Shops can partner with specific brands for exclusive promotions
- Brands can offer special commission rates to top-performing shops
- Co-marketing opportunities and campaigns

### Brand ↔ Distributor
- Brands choose which distributors carry their products
- Distributors can request to carry new brands
- Inventory consignment agreements available

### Distributor ↔ Driver
- Distributors coordinate with driver network for pickups
- Scheduled pickup windows for efficiency
- Performance tracking and optimization

## Platform Value Proposition

### For Shops
- Zero inventory risk
- High commission rates
- Marketing support
- Performance-based rewards
- Low barrier to entry

### For Brands
- Access to affiliate marketing network
- Reduced customer acquisition costs
- Multi-channel distribution
- Brand control and analytics
- Scalable growth

### For Distributors
- Diversified product portfolio
- Regional market advantage
- Volume-based incentives
- Operational efficiency tools
- Growth partnership opportunities
