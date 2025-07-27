import { Migration } from "@mikro-orm/migrations"

export class AddStripeOnboardingFields extends Migration {
  async up(): Promise<void> {
    // Add new Stripe Connect fields
    this.addSql(`
      ALTER TABLE vendor
      ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS stripe_details_submitted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS stripe_onboarding_started_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS stripe_onboarding_completed_at TIMESTAMPTZ;
    `)
    
    // Add index on stripe_account_id for faster lookups
    this.addSql(`
      CREATE INDEX IF NOT EXISTS IDX_vendor_stripe_account_id 
      ON vendor(stripe_account_id) 
      WHERE stripe_account_id IS NOT NULL;
    `)
  }

  async down(): Promise<void> {
    this.addSql(`
      ALTER TABLE vendor
      DROP COLUMN IF EXISTS stripe_charges_enabled,
      DROP COLUMN IF EXISTS stripe_payouts_enabled,
      DROP COLUMN IF EXISTS stripe_details_submitted,
      DROP COLUMN IF EXISTS stripe_onboarding_started_at,
      DROP COLUMN IF EXISTS stripe_onboarding_completed_at;
    `)
    
    this.addSql(`DROP INDEX IF EXISTS IDX_vendor_stripe_account_id;`)
  }
}