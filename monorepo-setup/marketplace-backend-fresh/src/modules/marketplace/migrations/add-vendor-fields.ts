import { Migration } from "@mikro-orm/migrations"

export class AddVendorFields extends Migration {
  async up(): Promise<void> {
    // Create enum types for vendor_type and vendor_status first
    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE vendor_type AS ENUM ('shop', 'brand', 'distributor');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    
    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE vendor_status AS ENUM ('pending', 'active', 'suspended', 'inactive');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    
    // Add new columns to vendor table with proper types
    this.addSql(`
      ALTER TABLE vendor
      ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS type vendor_type NOT NULL DEFAULT 'shop'::vendor_type,
      ADD COLUMN IF NOT EXISTS status vendor_status NOT NULL DEFAULT 'pending'::vendor_status,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS website VARCHAR(500),
      ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) DEFAULT 20,
      ADD COLUMN IF NOT EXISTS commission_tier VARCHAR(50) DEFAULT 'bronze',
      ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100),
      ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS stripe_account_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS address_line_1 VARCHAR(500),
      ADD COLUMN IF NOT EXISTS address_line_2 VARCHAR(500),
      ADD COLUMN IF NOT EXISTS city VARCHAR(255),
      ADD COLUMN IF NOT EXISTS state VARCHAR(255),
      ADD COLUMN IF NOT EXISTS postal_code VARCHAR(50),
      ADD COLUMN IF NOT EXISTS country_code VARCHAR(2),
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `)
    
    // Add indexes for better query performance
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_vendor_email ON vendor(email);
      CREATE INDEX IF NOT EXISTS idx_vendor_type ON vendor(type);
      CREATE INDEX IF NOT EXISTS idx_vendor_status ON vendor(status);
      CREATE INDEX IF NOT EXISTS idx_vendor_is_active ON vendor(is_active);
    `)
  }

  async down(): Promise<void> {
    // Drop indexes
    this.addSql(`
      DROP INDEX IF EXISTS idx_vendor_email;
      DROP INDEX IF EXISTS idx_vendor_type;
      DROP INDEX IF EXISTS idx_vendor_status;
      DROP INDEX IF EXISTS idx_vendor_is_active;
    `)
    
    // Drop columns
    this.addSql(`
      ALTER TABLE vendor
      DROP COLUMN IF EXISTS email,
      DROP COLUMN IF EXISTS type,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS is_active,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS website,
      DROP COLUMN IF EXISTS commission_rate,
      DROP COLUMN IF EXISTS commission_tier,
      DROP COLUMN IF EXISTS contact_email,
      DROP COLUMN IF EXISTS contact_phone,
      DROP COLUMN IF EXISTS tax_id,
      DROP COLUMN IF EXISTS verified_at,
      DROP COLUMN IF EXISTS stripe_account_id,
      DROP COLUMN IF EXISTS stripe_onboarding_completed,
      DROP COLUMN IF EXISTS address_line_1,
      DROP COLUMN IF EXISTS address_line_2,
      DROP COLUMN IF EXISTS city,
      DROP COLUMN IF EXISTS state,
      DROP COLUMN IF EXISTS postal_code,
      DROP COLUMN IF EXISTS country_code,
      DROP COLUMN IF EXISTS metadata;
    `)
    
    // Drop enum types
    this.addSql(`DROP TYPE IF EXISTS vendor_type;`)
    this.addSql(`DROP TYPE IF EXISTS vendor_status;`)
  }
}