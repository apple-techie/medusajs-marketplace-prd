# Payment Processing & Financial Management

## Overview

The payment processing system handles all financial transactions, including payment collection, refunds, vendor payouts, and commission calculations. It ensures secure, compliant, and efficient financial operations across the marketplace.

## Payment Gateway Integration

### Supported Gateways
1. **Stripe**: Primary payment processor
2. **PayPal**: Alternative payment method
3. **Square**: POS integration
4. **Authorize.net**: Enterprise option
5. **Cryptocurrency**: Via CoinPayments

### Gateway Configuration
```typescript
interface PaymentGateway {
  id: string;
  provider: 'stripe' | 'paypal' | 'square' | 'authnet' | 'crypto';
  api_key: string;
  secret_key: string;
  webhook_secret: string;
  environment: 'sandbox' | 'production';
  supported_currencies: string[];
  supported_payment_methods: PaymentMethodType[];
  metadata: {
    merchant_id?: string;
    account_id?: string;
    additional_config: Record<string, any>;
  };
}
```

## Transaction Management

### Transaction Flow
```typescript
interface Transaction {
  id: string;
  order_id: string;
  type: 'payment' | 'refund' | 'partial_refund' | 'chargeback';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: Money;
  currency: string;
  gateway: string;
  gateway_transaction_id: string;
  payment_method: PaymentMethod;
  customer_id: string;
  metadata: {
    ip_address: string;
    user_agent: string;
    risk_score?: number;
    fraud_checks?: FraudCheck[];
  };
  created_at: Date;
  completed_at?: Date;
}
```

### Payment States
1. **Authorized**: Funds reserved but not captured
2. **Captured**: Payment collected from customer
3. **Partially Captured**: Partial amount collected
4. **Refunded**: Full refund issued
5. **Partially Refunded**: Partial refund issued
6. **Voided**: Authorization cancelled
7. **Failed**: Payment attempt failed

## Vendor Payouts

### Payout Schedule
```typescript
interface PayoutSchedule {
  vendor_id: string;
  vendor_type: 'shop' | 'brand' | 'distributor' | 'driver';
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  day_of_week?: number; // 0-6 for weekly
  day_of_month?: number; // 1-31 for monthly
  minimum_payout: Money;
  hold_period_days: number; // Funds held before payout
  payment_method: 'bank_transfer' | 'paypal' | 'check';
  bank_details?: BankAccount;
}
```

### Payout Calculation
```typescript
interface PayoutCalculator {
  calculatePayout(vendor: Vendor, period: DateRange): PayoutDetails {
    const sales = this.getSalesForPeriod(vendor.id, period);
    const commissions = this.calculateCommissions(sales, vendor.commission_rate);
    const deductions = this.getDeductions(vendor.id, period);
    const previousBalance = this.getPreviousBalance(vendor.id);
    
    return {
      gross_sales: sales.total,
      commission_earned: commissions,
      platform_fees: this.calculatePlatformFees(sales),
      deductions: deductions,
      previous_balance: previousBalance,
      net_payout: commissions - deductions + previousBalance,
      transactions: sales.transactions,
    };
  }
}
```

## Commission Management

### Commission Calculation
```typescript
interface CommissionEngine {
  calculateCommission(order: Order): CommissionBreakdown {
    const breakdown = {
      shop_commission: 0,
      brand_revenue: 0,
      distributor_fee: 0,
      driver_fee: 0,
      platform_fee: 0,
    };
    
    // Shop commission (if referred)
    if (order.referral_shop_id) {
      const shop = this.getShop(order.referral_shop_id);
      breakdown.shop_commission = order.subtotal * shop.commission_rate;
    }
    
    // Brand revenue (after shop commission)
    breakdown.brand_revenue = order.subtotal - breakdown.shop_commission;
    
    // Distributor fulfillment fee
    breakdown.distributor_fee = this.calculateFulfillmentFee(order);
    
    // Driver delivery fee
    breakdown.driver_fee = order.delivery_fee * 0.8; // 80% to driver
    
    // Platform fee
    breakdown.platform_fee = order.subtotal * 0.05; // 5% platform fee
    
    return breakdown;
  }
}
```

### Commission Tiers
- **Bronze Tier**: 5-10% commission
- **Silver Tier**: 10-15% commission  
- **Gold Tier**: 15-20% commission
- **Custom Agreements**: Negotiated rates

## Refund Processing

### Refund Policy
```typescript
interface RefundPolicy {
  full_refund_period_days: 30;
  partial_refund_period_days: 60;
  restocking_fee_percentage: 15;
  return_shipping_paid_by: 'customer' | 'merchant';
  refund_methods: ['original_payment', 'store_credit'];
  auto_approve_threshold: Money;
}
```

### Refund Workflow
1. **Request Initiation**: Customer or support initiates
2. **Validation**: Check eligibility and policy
3. **Approval**: Auto or manual approval
4. **Processing**: Issue refund via gateway
5. **Inventory**: Update stock if applicable
6. **Notification**: Inform all parties

## Financial Reporting

### Revenue Reports
```typescript
interface RevenueReport {
  period: DateRange;
  gross_revenue: Money;
  refunds: Money;
  net_revenue: Money;
  breakdown_by_category: CategoryRevenue[];
  breakdown_by_vendor: VendorRevenue[];
  breakdown_by_payment_method: PaymentMethodRevenue[];
  tax_collected: Money;
  platform_fees_earned: Money;
}
```

### Vendor Statements
```typescript
interface VendorStatement {
  vendor_id: string;
  period: DateRange;
  opening_balance: Money;
  sales: {
    count: number;
    gross_amount: Money;
    commissions_earned: Money;
    fees_deducted: Money;
  };
  adjustments: Adjustment[];
  payouts: Payout[];
  closing_balance: Money;
  next_payout_date: Date;
  next_payout_amount: Money;
}
```

## Fraud Prevention

### Fraud Detection Rules
```typescript
interface FraudDetectionRules {
  velocity_checks: {
    max_transactions_per_hour: 5;
    max_amount_per_day: 5000;
    max_cards_per_customer: 3;
  };
  
  risk_factors: {
    new_customer_threshold_days: 7;
    high_risk_countries: string[];
    suspicious_email_domains: string[];
    mismatched_billing_shipping: boolean;
  };
  
  automatic_actions: {
    high_risk_hold: boolean;
    require_3ds: boolean;
    manual_review_threshold: number;
  };
}
```

### Risk Scoring
```typescript
interface RiskScorer {
  calculateRiskScore(transaction: Transaction): RiskScore {
    let score = 0;
    
    // Customer history
    if (this.isNewCustomer(transaction.customer_id)) score += 20;
    if (this.hasChargebacks(transaction.customer_id)) score += 30;
    
    // Transaction patterns
    if (this.isUnusualAmount(transaction)) score += 15;
    if
