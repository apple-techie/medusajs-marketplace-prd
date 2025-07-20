# Commission and Fee Structure

## Shop Commission System

### Tier Structure
- **Bronze Tier (15%)**: $0 - $15,000 monthly sales
- **Silver Tier (20%)**: $15,001 - $50,000 monthly sales  
- **Gold Tier (25%)**: $50,001+ monthly sales
- **Promotional**: New shops get Gold tier for first 3 months

### Commission Calculation
```typescript
// Example calculation
Order Total: $100
Shop Commission Rate: 20% (Silver Tier)
Commission Earned: $20

// Monthly tier evaluation
if (monthlySales > 50000) tier = 'gold';
else if (monthlySales > 15000) tier = 'silver';
else tier = 'bronze';
```

### Payout Schedule
- **Frequency**: Weekly or monthly (shop choice)
- **Minimum Payout**: $10
- **Payment Method**: Direct deposit via Stripe Connect
- **Processing Time**: 2-3 business days

## Brand Platform Fees

### Fee Tiers
- **Starter (10%)**: $0 - $100,000 monthly volume
- **Growth (15%)**: $100,001 - $500,000 monthly volume
- **Enterprise (20%)**: $500,001+ monthly volume

### Fee Application
- Applied to wholesale price
- Deducted before brand payout
- Volume calculated monthly
- Tier evaluation on 1st of each month

## Distributor Platform Fees

### Fee Structure
- **Pioneer Rate (3%)**: First distributor in region for 6 months
- **Standard (10%)**: New distributors base rate
- **Volume Discounts**:
  - 8%: $50,000+ monthly volume
  - 6%: $100,000+ monthly volume
  - 5%: $250,000+ monthly volume
  - 3%: $500,000+ monthly volume (minimum)

### Regional Pioneer Program
- First distributor in new region gets 3% rate
- 6-month guarantee
- Helps platform expand coverage
- Incentivizes market development

## Financial Flow Example

```
Customer Order: $100.00
├── Product Subtotal: $100.00
├── Shop Commission (20%): -$20.00 → Shop receives
├── Product Cost: $50.00
│   ├── Brand receives: $45.00 (after 10% platform fee)
│   └── Platform fee: $5.00
├── Platform Gross Margin: $30.00
├── Delivery Cost: -$8.00 → Driver receives
└── Platform Net Profit: $22.00
```

## Commission Tracking

### Real-time Tracking
- Live dashboard updates
- Order attribution tracking
- Commission status (pending/paid)
- Historical reporting

### Attribution Rules
- 30-day cookie window
- Last-click attribution
- Cross-device tracking
- Referral link parameters

## Payout Processing

### Shop Payouts
```typescript
interface ShopPayout {
  shop_id: string;
  period: {
    start: Date;
    end: Date;
  };
  commissions: Commission[];
  total_sales: number;
  commission_amount: number;
  payout_method: 'weekly' | 'monthly';
  status: 'pending' | 'processing' | 'completed';
  stripe_transfer_id?: string;
}
```

### Vendor Payments
```typescript
interface VendorPayment {
  vendor_id: string;
  vendor_type: 'brand' | 'distributor';
  order_items: OrderItem[];
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  payment_timing: 'immediate' | 'net_7' | 'net_30';
}
```

## Reporting and Analytics

### Shop Reports
- Daily/weekly/monthly earnings
- Conversion rates by campaign
- Top performing products
- Customer lifetime value
- Tier progression tracking

### Platform Financial Reports
- Total GMV (Gross Merchandise Value)
- Platform revenue breakdown
- Commission payouts
- Fee collection
- Net profit margins

## Special Programs

### New Shop Incentives
- 3-month Gold tier promotion
- Bonus for first 10 sales
- Marketing support package
- Dedicated onboarding specialist

### Volume Bonuses
- Quarterly performance bonuses
- Year-end profit sharing for top shops
- Exclusive product access
- Co-marketing opportunities

### Brand Growth Programs
- Reduced fees for new product launches
- Marketing co-investment
- Featured placement opportunities
- Data analytics access
