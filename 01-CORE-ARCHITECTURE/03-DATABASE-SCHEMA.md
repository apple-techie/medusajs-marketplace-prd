# Database Schema Design

## Overview

The database schema extends MedusaJS's core tables with custom tables for vendor management, commission tracking, delivery operations, and marketplace-specific features.

## Extended MedusaJS Tables

### Shop Tiers Table
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
```

### Commission Tracking
```sql
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
```

### Driver Management
```sql
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
```

### Delivery Assignments
```sql
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
```

### Vendor Fee Tracking
```sql
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
```

### Shop Referral Tracking
```sql
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
```

### Monthly Volume Tracking
```sql
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

### Loyalty Points Tables
```sql
-- Points Balance
CREATE TABLE points_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  current_balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  lifetime_redeemed INTEGER DEFAULT 0,
  tier VARCHAR(20) DEFAULT 'bronze',
  tier_progress INTEGER DEFAULT 0,
  next_tier_threshold INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_customer_balance UNIQUE (customer_id)
);

-- Points Transactions
CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired', 'adjusted')),
  amount INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  order_id UUID REFERENCES orders(id),
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Unified Catalog Tables
```sql
-- Master Products
CREATE TABLE master_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  normalized_name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES product_categories(id),
  brand_id UUID REFERENCES brands(id),
  lowest_price DECIMAL(10,2),
  highest_price DECIMAL(10,2),
  total_inventory INTEGER DEFAULT 0,
  vendor_count INTEGER DEFAULT 0,
  attributes JSONB,
  slug VARCHAR(255) UNIQUE NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor Product Mappings
CREATE TABLE vendor_product_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_product_id UUID NOT NULL REFERENCES master_products(id),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  vendor_product_id UUID NOT NULL REFERENCES products(id),
  vendor_sku VARCHAR(255),
  vendor_price DECIMAL(10,2) NOT NULL,
  vendor_inventory INTEGER DEFAULT 0,
  vendor_title VARCHAR(255),
  match_confidence DECIMAL(3,2),
  match_method VARCHAR(20),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_vendor_product UNIQUE (vendor_id, vendor_product_id)
);
```

### Stripe Connect Tables
```sql
-- Connected Accounts
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  stripe_account_id VARCHAR(255) UNIQUE NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  capabilities JSONB,
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  requirements JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_vendor_account UNIQUE (vendor_id)
);

-- Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID,
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  vendor_type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission_ids UUID[],
  stripe_transfer_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  processed_at TIMESTAMP,
  failed_at TIMESTAMP,
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Product Obfuscation Tables
```sql
-- Product Obfuscation
CREATE TABLE product_obfuscations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  obfuscated_name VARCHAR(255) NOT NULL,
  obfuscated_description TEXT,
  obfuscated_category VARCHAR(255),
  obfuscated_brand VARCHAR(255),
  classification_code VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_product_obfuscation UNIQUE (product_id)
);
```

## Indexes for Performance

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

-- Points queries
CREATE INDEX idx_points_customer ON points_transactions(customer_id, created_at DESC);
CREATE INDEX idx_points_order ON points_transactions(order_id) WHERE order_id IS NOT NULL;

-- Product catalog
CREATE INDEX idx_master_products_category ON master_products(category_id);
CREATE INDEX idx_master_products_brand ON master_products(brand_id);
CREATE INDEX idx_vendor_mappings_master ON vendor_product_mappings(master_product_id);
CREATE INDEX idx_vendor_mappings_vendor ON vendor_product_mappings(vendor_id);

-- Referral tracking
CREATE INDEX idx_referrals_shop ON shop_referrals(shop_id);
CREATE INDEX idx_referrals_customer ON shop_referrals(customer_id);
CREATE INDEX idx_referrals_session ON shop_referrals(session_id);
```

## Database Partitioning

```sql
-- Partition large tables for better performance
-- Orders table partitioned by month
CREATE TABLE orders_2025_01 PARTITION OF orders
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE orders_2025_02 PARTITION OF orders
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Commission records partitioned by month
CREATE TABLE commission_records_2025_01 PARTITION OF commission_records
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Points transactions partitioned by year
CREATE TABLE points_transactions_2025 PARTITION OF points_transactions
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

## Data Retention Policies

```sql
-- Archive old data
CREATE TABLE archived_orders AS 
SELECT * FROM orders WHERE created_at < NOW() - INTERVAL '2 years';

-- Clean up old sessions
DELETE FROM shop_referrals 
WHERE first_visit_at < NOW() - INTERVAL '90 days' 
AND converted_at IS NULL;

-- Aggregate old commission data
INSERT INTO commission_summaries (shop_id, year, month, total_amount, order_count)
SELECT 
  shop_id,
  EXTRACT(YEAR FROM created_at),
  EXTRACT(MONTH FROM created_at),
  SUM(commission_amount),
  COUNT(*)
FROM commission_records
WHERE created_at < NOW() - INTERVAL '1 year'
GROUP BY shop_id, EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at);
```

## Database Maintenance

### Regular Maintenance Tasks
1. **Daily**: Update statistics on high-traffic tables
2. **Weekly**: Vacuum analyze all tables
3. **Monthly**: Reindex frequently updated tables
4. **Quarterly**: Archive old data and optimize storage

### Backup Strategy
- **Continuous**: WAL archiving to S3
- **Daily**: Full database backup
- **Weekly**: Test restore procedures
- **Monthly**: Backup retention cleanup
