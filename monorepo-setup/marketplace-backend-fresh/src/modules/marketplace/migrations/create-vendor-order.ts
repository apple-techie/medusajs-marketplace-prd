import { Migration } from "@mikro-orm/migrations"

export class CreateVendorOrder extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS vendor_order (
        id TEXT NOT NULL PRIMARY KEY,
        order_id TEXT NOT NULL,
        vendor_id TEXT NOT NULL,
        vendor_name TEXT NOT NULL,
        vendor_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        subtotal NUMERIC NOT NULL,
        commission_rate NUMERIC NOT NULL DEFAULT 0,
        commission_amount NUMERIC NOT NULL,
        vendor_payout NUMERIC NOT NULL,
        items JSONB NOT NULL,
        fulfilled_at TIMESTAMPTZ,
        shipped_at TIMESTAMPTZ,
        delivered_at TIMESTAMPTZ,
        cancelled_at TIMESTAMPTZ,
        notes TEXT,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `)
    
    // Add indexes
    this.addSql(`CREATE INDEX IDX_vendor_order_vendor_id ON vendor_order(vendor_id);`)
    this.addSql(`CREATE INDEX IDX_vendor_order_order_id ON vendor_order(order_id);`)
    this.addSql(`CREATE INDEX IDX_vendor_order_status ON vendor_order(status);`)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS vendor_order;`)
  }
}