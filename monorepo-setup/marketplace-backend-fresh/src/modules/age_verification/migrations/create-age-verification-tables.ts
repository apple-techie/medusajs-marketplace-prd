import { Migration } from "@mikro-orm/migrations"

export class CreateAgeVerificationTables extends Migration {
  async up(): Promise<void> {
    // Create enum types
    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'failed', 'expired');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    
    this.addSql(`
      DO $$ BEGIN
        CREATE TYPE verification_method AS ENUM ('session', 'id_upload', 'credit_card', 'third_party');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    
    // Create age_verification_session table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS age_verification_session (
        id TEXT PRIMARY KEY,
        session_token TEXT NOT NULL UNIQUE,
        customer_id TEXT,
        ip_address TEXT NOT NULL,
        user_agent TEXT,
        status verification_status NOT NULL DEFAULT 'pending'::verification_status,
        method verification_method NOT NULL,
        age_threshold INTEGER NOT NULL DEFAULT 21,
        birth_date TIMESTAMP,
        verified_age INTEGER,
        verification_data JSONB,
        verified_at TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        verification_provider TEXT,
        reference_id TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `)
    
    // Create age_restricted_product table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS age_restricted_product (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL UNIQUE,
        minimum_age INTEGER NOT NULL DEFAULT 21,
        restriction_reason TEXT,
        requires_id_check BOOLEAN DEFAULT false,
        restricted_states JSONB,
        restricted_zip_codes JSONB,
        compliance_category TEXT,
        license_required BOOLEAN DEFAULT false,
        show_age_gate BOOLEAN DEFAULT true,
        age_gate_message TEXT,
        metadata JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `)
    
    // Create indexes
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_age_verification_session_token ON age_verification_session(session_token);
      CREATE INDEX IF NOT EXISTS idx_age_verification_customer ON age_verification_session(customer_id);
      CREATE INDEX IF NOT EXISTS idx_age_verification_status ON age_verification_session(status);
      CREATE INDEX IF NOT EXISTS idx_age_verification_expires ON age_verification_session(expires_at);
      CREATE INDEX IF NOT EXISTS idx_age_restricted_product_id ON age_restricted_product(product_id);
      CREATE INDEX IF NOT EXISTS idx_age_restricted_active ON age_restricted_product(is_active);
    `)
  }

  async down(): Promise<void> {
    // Drop indexes
    this.addSql(`
      DROP INDEX IF EXISTS idx_age_verification_session_token;
      DROP INDEX IF EXISTS idx_age_verification_customer;
      DROP INDEX IF EXISTS idx_age_verification_status;
      DROP INDEX IF EXISTS idx_age_verification_expires;
      DROP INDEX IF EXISTS idx_age_restricted_product_id;
      DROP INDEX IF EXISTS idx_age_restricted_active;
    `)
    
    // Drop tables
    this.addSql(`
      DROP TABLE IF EXISTS age_verification_session;
      DROP TABLE IF EXISTS age_restricted_product;
    `)
    
    // Drop enum types
    this.addSql(`
      DROP TYPE IF EXISTS verification_status;
      DROP TYPE IF EXISTS verification_method;
    `)
  }
}