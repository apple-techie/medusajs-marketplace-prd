import { LocationType } from "../modules/marketplace/models/fulfillment-location"
import { RuleType, RuleOperator, RuleAction } from "../modules/marketplace/models/routing-rule"

export default async function seedFulfillmentRouting({ container }) {
  const marketplaceService = container.resolve("marketplace")
  
  console.log("🚚 Seeding fulfillment routing data...")
  
  // Create sample fulfillment locations
  const locations = [
    {
      name: "NYC Distribution Center",
      code: "NYC-DC-01",
      type: LocationType.DISTRIBUTION_CENTER,
      vendor_id: null, // Shared distribution center
      
      // Address
      address_line_1: "123 Warehouse Way",
      city: "New York",
      state_province: "NY",
      postal_code: "10001",
      country_code: "US",
      
      // Coordinates (Manhattan)
      latitude: 40.7128,
      longitude: -74.0060,
      
      // Operational
      is_active: true,
      handles_returns: true,
      handles_exchanges: true,
      
      // Processing
      processing_time_hours: 24,
      cutoff_time: "15:00",
      timezone: "America/New_York",
      
      // Zones
      shipping_zones: ["NY", "NJ", "CT", "PA", "MA", "VT", "NH", "ME"],
      excluded_states: [],
      
      // Performance
      fulfillment_rate: 0.95,
      average_processing_hours: 20,
      error_rate: 0.02,
      
      // Capacity
      max_orders_per_day: 5000,
      current_capacity_percent: 45,
      
      // Costs (in cents)
      handling_fee_cents: 300,
      pick_pack_fee_cents: 200,
      
      metadata: {
        has_refrigeration: true,
        has_hazmat_license: false,
        square_feet: 50000
      }
    },
    {
      name: "LA Fulfillment Hub",
      code: "LA-FH-01",
      type: LocationType.WAREHOUSE,
      vendor_id: null,
      
      address_line_1: "456 Logistics Blvd",
      city: "Los Angeles",
      state_province: "CA",
      postal_code: "90001",
      country_code: "US",
      
      // Coordinates (Downtown LA)
      latitude: 34.0522,
      longitude: -118.2437,
      
      is_active: true,
      handles_returns: true,
      handles_exchanges: false,
      
      processing_time_hours: 36,
      cutoff_time: "14:00",
      timezone: "America/Los_Angeles",
      
      shipping_zones: ["CA", "NV", "AZ", "OR", "WA"],
      excluded_states: [],
      
      fulfillment_rate: 0.92,
      average_processing_hours: 32,
      error_rate: 0.03,
      
      max_orders_per_day: 3000,
      current_capacity_percent: 60,
      
      handling_fee_cents: 250,
      pick_pack_fee_cents: 200,
      
      metadata: {
        has_refrigeration: false,
        has_hazmat_license: true,
        square_feet: 35000
      }
    },
    {
      name: "Chicago Central Hub",
      code: "CHI-CH-01",
      type: LocationType.DISTRIBUTION_CENTER,
      vendor_id: null,
      
      address_line_1: "789 Distribution Dr",
      city: "Chicago",
      state_province: "IL",
      postal_code: "60601",
      country_code: "US",
      
      // Coordinates (Chicago Loop)
      latitude: 41.8781,
      longitude: -87.6298,
      
      is_active: true,
      handles_returns: true,
      handles_exchanges: true,
      
      processing_time_hours: 24,
      cutoff_time: "16:00",
      timezone: "America/Chicago",
      
      shipping_zones: ["IL", "IN", "MI", "WI", "OH", "IA", "MO", "MN"],
      excluded_states: [],
      
      fulfillment_rate: 0.94,
      average_processing_hours: 22,
      error_rate: 0.025,
      
      max_orders_per_day: 4000,
      current_capacity_percent: 55,
      
      handling_fee_cents: 275,
      pick_pack_fee_cents: 200,
      
      metadata: {
        has_refrigeration: true,
        has_hazmat_license: true,
        square_feet: 45000
      }
    },
    {
      name: "Miami Store Location",
      code: "MIA-ST-01",
      type: LocationType.STORE,
      vendor_id: null, // Would be assigned to specific vendor
      
      address_line_1: "321 Retail Plaza",
      city: "Miami",
      state_province: "FL",
      postal_code: "33101",
      country_code: "US",
      
      // Coordinates (Downtown Miami)
      latitude: 25.7617,
      longitude: -80.1918,
      
      is_active: true,
      handles_returns: true,
      handles_exchanges: true,
      
      processing_time_hours: 48,
      cutoff_time: "12:00",
      timezone: "America/New_York",
      
      shipping_zones: ["FL", "GA"],
      excluded_states: [],
      
      fulfillment_rate: 0.88,
      average_processing_hours: 45,
      error_rate: 0.05,
      
      max_orders_per_day: 100,
      current_capacity_percent: 30,
      
      handling_fee_cents: 400,
      pick_pack_fee_cents: 300,
      
      metadata: {
        has_refrigeration: false,
        store_hours: "9:00-21:00",
        pickup_available: true
      }
    },
    {
      name: "Austin Dropship Partner",
      code: "AUS-DS-01",
      type: LocationType.DROPSHIP,
      vendor_id: null, // Would be assigned to dropship vendor
      
      address_line_1: "555 Vendor Way",
      city: "Austin",
      state_province: "TX",
      postal_code: "78701",
      country_code: "US",
      
      // Coordinates (Downtown Austin)
      latitude: 30.2672,
      longitude: -97.7431,
      
      is_active: true,
      handles_returns: false,
      handles_exchanges: false,
      
      processing_time_hours: 72,
      cutoff_time: "10:00",
      timezone: "America/Chicago",
      
      shipping_zones: ["TX", "OK", "AR", "LA", "NM"],
      excluded_states: [],
      
      fulfillment_rate: 0.85,
      average_processing_hours: 60,
      error_rate: 0.08,
      
      max_orders_per_day: 500,
      current_capacity_percent: 40,
      
      handling_fee_cents: 0, // No handling fee for dropship
      pick_pack_fee_cents: 0,
      
      metadata: {
        dropship_cutoff_days: 3,
        min_order_value_cents: 5000
      }
    }
  ]
  
  // Create fulfillment locations
  console.log("Creating fulfillment locations...")
  const createdLocations: any[] = []
  for (const location of locations) {
    try {
      const created = await marketplaceService.createFulfillmentLocation(location)
      createdLocations.push(created)
      console.log(`✅ Created location: ${created.name} (${created.code})`)
    } catch (error) {
      console.error(`❌ Failed to create location ${location.name}:`, error.message)
    }
  }
  
  // Create sample routing rules
  const rules = [
    {
      name: "Require refrigerated location for cold items",
      description: "Routes cold/frozen items only to locations with refrigeration",
      rule_type: RuleType.PRODUCT,
      field_path: "metadata.requires_refrigeration",
      operator: RuleOperator.EQUALS,
      value: true,
      action: RuleAction.REQUIRE_LOCATION,
      action_value: { 
        metadata: { has_refrigeration: true }
      },
      priority: 100,
      is_active: true,
      metadata: {
        reason: "Product safety requirement"
      }
    },
    {
      name: "Exclude hazmat from non-licensed locations",
      description: "Prevents hazardous materials from being sent to unlicensed locations",
      rule_type: RuleType.PRODUCT,
      field_path: "metadata.is_hazmat",
      operator: RuleOperator.EQUALS,
      value: true,
      action: RuleAction.REQUIRE_LOCATION,
      action_value: {
        metadata: { has_hazmat_license: true }
      },
      priority: 99,
      is_active: true,
      metadata: {
        reason: "Legal compliance requirement"
      }
    },
    {
      name: "Prefer warehouse for bulk orders",
      description: "Routes orders over 50 units to warehouses",
      rule_type: RuleType.WEIGHT,
      field_path: "total_quantity",
      operator: RuleOperator.GREATER_THAN,
      value: 50,
      action: RuleAction.PREFER_LOCATION,
      action_value: {
        type: [LocationType.WAREHOUSE, LocationType.DISTRIBUTION_CENTER]
      },
      priority: 50,
      is_active: true
    },
    {
      name: "Exclude store fulfillment for large items",
      description: "Prevents store locations from fulfilling oversized items",
      rule_type: RuleType.PRODUCT,
      field_path: "metadata.is_oversized",
      operator: RuleOperator.EQUALS,
      value: true,
      action: RuleAction.EXCLUDE_LOCATION,
      action_value: {
        type: LocationType.STORE
      },
      priority: 60,
      is_active: true
    },
    {
      name: "Regional shipping restriction - Hawaii",
      description: "Only LA hub ships to Hawaii",
      rule_type: RuleType.REGION,
      field_path: "shipping_address.state_province",
      operator: RuleOperator.EQUALS,
      value: "HI",
      action: RuleAction.REQUIRE_LOCATION,
      action_value: {
        code: "LA-FH-01"
      },
      priority: 80,
      is_active: true
    },
    {
      name: "Express shipping location preference",
      description: "Routes express orders to distribution centers",
      rule_type: RuleType.CUSTOMER,
      field_path: "shipping_option.service_level",
      operator: RuleOperator.EQUALS,
      value: "express",
      action: RuleAction.PREFER_LOCATION,
      action_value: {
        type: LocationType.DISTRIBUTION_CENTER
      },
      priority: 40,
      is_active: true
    },
    {
      name: "High-value order surcharge",
      description: "Adds insurance surcharge for orders over $500",
      rule_type: RuleType.VALUE,
      field_path: "order_total_cents",
      operator: RuleOperator.GREATER_THAN,
      value: 50000,
      action: RuleAction.APPLY_SURCHARGE,
      action_value: {
        surcharge_cents: 500,
        surcharge_type: "insurance"
      },
      priority: 30,
      is_active: true
    }
  ]
  
  // Create routing rules
  console.log("\nCreating routing rules...")
  const createdRules: any[] = []
  for (const rule of rules) {
    try {
      const created = await marketplaceService.createRoutingRule(rule)
      createdRules.push(created)
      console.log(`✅ Created rule: ${created.name}`)
    } catch (error) {
      console.error(`❌ Failed to create rule ${rule.name}:`, error.message)
    }
  }
  
  console.log(`
🎉 Fulfillment routing seed completed!
   - Created ${createdLocations.length} fulfillment locations
   - Created ${createdRules.length} routing rules
   
You can now test the routing system using the API endpoints:
   POST /store/routing/simulate
   GET /admin/fulfillment-locations
   GET /admin/routing-rules
  `)
}