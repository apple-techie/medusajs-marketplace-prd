import { Migration } from "@mikro-orm/migrations"

export class CreateFulfillmentRoutingTables extends Migration {
  async up(): Promise<void> {
    // Create fulfillment_location table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS fulfillment_location (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        vendor_id TEXT,
        
        -- Address
        address_line_1 TEXT NOT NULL,
        address_line_2 TEXT,
        city TEXT NOT NULL,
        state_province TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        country_code TEXT NOT NULL,
        
        -- Coordinates
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        
        -- Operational
        is_active BOOLEAN DEFAULT TRUE,
        handles_returns BOOLEAN DEFAULT FALSE,
        handles_exchanges BOOLEAN DEFAULT FALSE,
        
        -- Processing
        processing_time_hours INTEGER DEFAULT 24,
        cutoff_time TEXT DEFAULT '14:00',
        timezone TEXT DEFAULT 'America/New_York',
        
        -- Zones
        shipping_zones JSONB DEFAULT '[]',
        excluded_states JSONB DEFAULT '[]',
        
        -- Performance
        fulfillment_rate FLOAT DEFAULT 0.95,
        average_processing_hours FLOAT DEFAULT 24,
        error_rate FLOAT DEFAULT 0.02,
        
        -- Capacity
        max_orders_per_day INTEGER,
        current_capacity_percent FLOAT DEFAULT 0,
        
        -- Costs
        handling_fee_cents INTEGER DEFAULT 0,
        pick_pack_fee_cents INTEGER DEFAULT 0,
        
        -- Metadata
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `)
    
    // Create routing_rule table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS routing_rule (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        rule_type TEXT NOT NULL,
        
        -- Condition
        field_path TEXT NOT NULL,
        operator TEXT NOT NULL,
        value JSONB NOT NULL,
        
        -- Action
        action TEXT NOT NULL,
        action_value JSONB,
        
        -- Priority
        priority INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        
        -- Applicability
        applies_to_vendor_types JSONB,
        applies_to_product_categories JSONB,
        applies_to_regions JSONB,
        
        -- Time-based
        valid_from TIMESTAMPTZ,
        valid_until TIMESTAMPTZ,
        
        -- Metadata
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `)
    
    // Add indexes
    this.addSql(`CREATE INDEX IDX_fulfillment_location_vendor ON fulfillment_location(vendor_id);`)
    this.addSql(`CREATE INDEX IDX_fulfillment_location_active_type ON fulfillment_location(is_active, type);`)
    this.addSql(`CREATE INDEX IDX_fulfillment_location_coordinates ON fulfillment_location(latitude, longitude);`)
    
    this.addSql(`CREATE INDEX IDX_routing_rule_active_priority ON routing_rule(is_active, priority);`)
    this.addSql(`CREATE INDEX IDX_routing_rule_type ON routing_rule(rule_type);`)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS routing_rule;`)
    this.addSql(`DROP TABLE IF EXISTS fulfillment_location;`)
  }
}