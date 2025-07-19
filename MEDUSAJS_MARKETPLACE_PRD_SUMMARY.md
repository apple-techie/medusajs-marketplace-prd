# MedusaJS Marketplace PRD - Executive Summary

## Overview
Transform the existing marketplace platform into a MedusaJS-powered affiliate marketplace with a unique commission-based business model.

## Key Business Model Components

### 1. Shop (Affiliate) Commissions
- **Bronze**: 15% commission ($0-$15K monthly sales)
- **Silver**: 20% commission ($15K-$50K monthly sales)
- **Gold**: 25% commission ($50K+ monthly sales)
- **New shops get Gold tier for first 3 months**

### 2. Brand Platform Fees
- **Starter**: 10% fee ($0-$100K monthly volume)
- **Growth**: 15% fee ($100K-$500K monthly volume)
- **Enterprise**: 20% fee ($500K+ monthly volume)

### 3. Distributor Platform Fees
- **Pioneer**: 3% for first distributor in region (6 months)
- **Standard**: 10% base rate
- **Volume discounts**: Down to 3% minimum at $500K+

### 4. Delivery Economics
- **Driver Pay**: $4 base + $0.75/mile after 5 miles
- **Platform keeps margin between customer fee and driver pay**

## Revenue Flow Example
```
$100 Customer Order:
- Shop Commission (20%): $20
- Brand receives: $45 (after 10% platform fee)
- Platform gross: $30
- Delivery cost: $8
- Platform net profit: $22
```

## Technology Stack
- **Backend**: MedusaJS (Node.js, TypeScript)
- **Database**: PostgreSQL
- **Frontend**: Next.js 14 (existing)
- **Payments**: Stripe Connect (custom module required)
- **Delivery**: Custom drivers + DoorDash API
- **Infrastructure**: AWS/Vercel

## Important Notes on MedusaJS
- **Stripe Connect**: NOT included in MedusaJS - requires custom module
- **Loyalty Points**: Custom module required
- **Unified Catalog**: Custom module for product matching/deduplication

## Key Features

### 1. Affiliate Marketplace
- Shops earn commissions without holding inventory
- Performance-based tier system
- Referral link generation and tracking
- Automated commission calculations

### 2. Multi-Vendor Platform
- Brands list products at wholesale prices
- Distributors handle warehousing/fulfillment
- Volume-based platform fees
- Automated vendor payments

### 3. Hybrid Delivery Network
- Own driver fleet with mobile app
- DoorDash integration as fallback
- Smart routing and assignment
- Real-time tracking

### 4. Financial Management
- Automated commission payouts
- Platform fee collection
- Financial reporting
- Stripe Connect integration

### 5. Loyalty Points System
- Earn 1 point per dollar spent
- Tiered rewards (Bronze/Silver/Gold/Platinum)
- Points multipliers based on tier
- Redemption for discounts

### 6. Unified Product Catalog
- Automatic product matching across vendors
- Single product listing with multiple vendor options
- Price comparison and aggregation
- Intelligent deduplication using UPC/EAN/fuzzy matching

### 7. Authentication-Gated Catalog
- Products can be public, authenticated-only, or verified-only
- Progressive disclosure UI with blurred previews
- Homepage shows brands and categories
- Sign-in prompts for restricted content

### 8. Restricted Product Obfuscation
- Products tagged "restricted" show real names internally
- External APIs (Stripe, DoorDash) receive generic names
- Example: "Premium THC Vape" → "Specialty Product - SKU-A1B2C3D4"
- Maintains compliance while preserving internal clarity

### 9. UI/UX Design System
- Built with React, shadcn/ui, and Tailwind CSS 4
- Mobile-responsive design
- Custom marketplace components
- Progressive Web App for driver dashboard

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- MedusaJS setup and configuration
- Custom module development
- Database migration
- API compatibility layer

### Phase 2: Affiliate System (Weeks 3-4)
- Commission engine
- Shop tier management
- Vendor fee system
- Financial reconciliation

### Phase 3: Delivery Network (Weeks 5-6)
- Driver platform
- Mobile dashboard
- DoorDash integration
- Provider selection logic

### Phase 4: Platform Integration (Weeks 7-8)
- Multi-vendor checkout
- Order management
- Payment processing
- Launch preparation

## Success Metrics

### Business Targets
- **GMV Growth**: 20% month-over-month
- **Platform Margin**: 22% average
- **Shop Retention**: >80%
- **Order Fulfillment**: >95% on-time

### Technical Targets
- **API Response**: <200ms (p95)
- **Uptime**: 99.9%
- **Checkout Success**: >98%
- **Page Load**: <2 seconds

## Key Differentiators

1. **Unique Business Model**
   - Shops as affiliates, not inventory holders
   - Performance-based rewards
   - Multi-stakeholder ecosystem

2. **Flexible Delivery**
   - Hybrid model optimizes cost and service
   - Own drivers for better margins
   - Third-party fallback for coverage

3. **Scalable Architecture**
   - MedusaJS provides proven e-commerce foundation
   - Modular design for easy expansion
   - Built for high performance

## Investment Requirements

### Development Team
- 2 Senior Backend Engineers
- 1 Frontend Engineer
- 1 DevOps Engineer
- 1 QA Engineer
- 1 Project Manager

### Timeline
- **Total Duration**: 8 weeks
- **MVP Launch**: Week 6
- **Full Launch**: Week 8

### Infrastructure Costs (Monthly)
- **AWS Hosting**: ~$2,000-5,000
- **Third-party Services**: ~$500-1,000
- **Total**: ~$2,500-6,000

## Risk Mitigation

1. **Technical Risks**
   - Phased implementation reduces complexity
   - Backward compatibility maintains operations
   - Comprehensive testing at each phase

2. **Business Risks**
   - Existing vendors continue operating during transition
   - Commission structure incentivizes adoption
   - Multiple revenue streams reduce dependency

3. **Operational Risks**
   - DoorDash fallback ensures delivery coverage
   - Automated systems reduce manual errors
   - Real-time monitoring enables quick response

## Conclusion

This MedusaJS-powered platform creates a unique marketplace that:
- Reduces inventory risk for shops
- Provides scalable fulfillment for brands
- Offers flexible delivery options
- Generates sustainable platform profits

The 8-week implementation plan provides a clear path to launch with minimal disruption to existing operations while positioning the platform for significant growth.
