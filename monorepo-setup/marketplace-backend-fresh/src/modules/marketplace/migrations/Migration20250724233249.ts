import { Migration } from "@mikro-orm/migrations"

export class Migration20250724233249 extends Migration {
  async up(): Promise<void> {
    // Create commission_record table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS commission_record (
        id TEXT NOT NULL PRIMARY KEY,
        order_id TEXT NOT NULL,
        vendor_id TEXT NOT NULL,
        vendor_order_id TEXT,
        
        -- Commission details
        commission_rate NUMERIC(5,4) NOT NULL,
        order_amount NUMERIC(10,2) NOT NULL,
        commission_amount NUMERIC(10,2) NOT NULL,
        
        -- Status tracking
        status TEXT NOT NULL DEFAULT 'pending',
        calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        approved_at TIMESTAMPTZ,
        paid_at TIMESTAMPTZ,
        
        -- Payout reference
        payout_id TEXT,
        
        -- Metadata
        notes TEXT,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `)
    
    // Create vendor_platform_fee table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS vendor_platform_fee (
        id TEXT NOT NULL PRIMARY KEY,
        vendor_id TEXT NOT NULL,
        order_id TEXT NOT NULL,
        
        -- Fee details
        vendor_type TEXT NOT NULL,
        fee_percentage NUMERIC(5,4) NOT NULL,
        order_amount NUMERIC(10,2) NOT NULL,
        fee_amount NUMERIC(10,2) NOT NULL,
        
        -- Volume tracking
        volume_tier TEXT,
        is_promotional_rate BOOLEAN DEFAULT FALSE,
        promotional_reason TEXT,
        
        -- Metadata
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `)
    
    // Create vendor_monthly_volume table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS vendor_monthly_volume (
        id TEXT NOT NULL PRIMARY KEY,
        vendor_id TEXT NOT NULL,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        
        -- Volume metrics
        total_sales NUMERIC(12,2) DEFAULT 0,
        total_orders INTEGER DEFAULT 0,
        total_items INTEGER DEFAULT 0,
        
        -- Commission tracking
        total_commission NUMERIC(10,2) DEFAULT 0,
        commission_tier TEXT,
        effective_commission_rate NUMERIC(5,4),
        
        -- Performance metrics
        average_order_value NUMERIC(8,2),
        return_rate NUMERIC(5,4),
        fulfillment_rate NUMERIC(5,4),
        
        -- Metadata
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        
        CONSTRAINT unique_vendor_month UNIQUE (vendor_id, year, month)
      );
    `)
    
    // Create payout table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS payout (
        id TEXT NOT NULL PRIMARY KEY,
        vendor_id TEXT NOT NULL,
        
        -- Payout details
        amount NUMERIC(10,2) NOT NULL,
        currency_code TEXT NOT NULL DEFAULT 'USD',
        status TEXT NOT NULL DEFAULT 'pending',
        
        -- Period
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        
        -- Payment details
        payment_method TEXT NOT NULL DEFAULT 'stripe_connect',
        stripe_transfer_id TEXT,
        stripe_payout_id TEXT,
        
        -- Status tracking
        initiated_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        failed_at TIMESTAMPTZ,
        failure_reason TEXT,
        
        -- Breakdown
        gross_sales NUMERIC(10,2) NOT NULL,
        total_commission NUMERIC(10,2) NOT NULL,
        adjustments NUMERIC(10,2) DEFAULT 0,
        
        -- Commission records
        commission_record_ids JSONB DEFAULT '[]',
        
        -- Metadata
        notes TEXT,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `)
    
    // Create payout_adjustment table for manual adjustments
    this.addSql(`
      CREATE TABLE IF NOT EXISTS payout_adjustment (
        id TEXT NOT NULL PRIMARY KEY,
        vendor_id TEXT NOT NULL,
        payout_id TEXT,
        
        -- Adjustment details
        type TEXT NOT NULL, -- 'credit', 'debit', 'refund', 'bonus', 'penalty'
        amount NUMERIC(10,2) NOT NULL,
        reason TEXT NOT NULL,
        
        -- Reference
        reference_type TEXT, -- 'order', 'return', 'manual'
        reference_id TEXT,
        
        -- Approval
        created_by TEXT NOT NULL,
        approved_by TEXT,
        approved_at TIMESTAMPTZ,
        
        -- Metadata
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `)
    
    // Add indexes for performance
    this.addSql(`
      CREATE INDEX IDX_commission_vendor_status ON commission_record(vendor_id, status);
      CREATE INDEX IDX_commission_order ON commission_record(order_id);
      CREATE INDEX IDX_commission_payout ON commission_record(payout_id);
      CREATE INDEX IDX_commission_created ON commission_record(created_at);
      
      CREATE INDEX IDX_platform_fee_vendor ON vendor_platform_fee(vendor_id);
      CREATE INDEX IDX_platform_fee_order ON vendor_platform_fee(order_id);
      
      CREATE INDEX IDX_monthly_volume_vendor_period ON vendor_monthly_volume(vendor_id, year, month);
      
      CREATE INDEX IDX_payout_vendor_status ON payout(vendor_id, status);
      CREATE INDEX IDX_payout_period ON payout(period_start, period_end);
      
      CREATE INDEX IDX_adjustment_vendor ON payout_adjustment(vendor_id);
      CREATE INDEX IDX_adjustment_payout ON payout_adjustment(payout_id);
    `)
  }

  async down(): Promise<void> {
    // Drop tables in reverse order
    this.addSql(`DROP TABLE IF EXISTS payout_adjustment;`)
    this.addSql(`DROP TABLE IF EXISTS payout;`)
    this.addSql(`DROP TABLE IF EXISTS vendor_monthly_volume;`)
    this.addSql(`DROP TABLE IF EXISTS vendor_platform_fee;`)
    this.addSql(`DROP TABLE IF EXISTS commission_record;`)
  }
}