import { model } from "@medusajs/framework/utils"

export enum LocationType {
  WAREHOUSE = "warehouse",
  STORE = "store",
  DROPSHIP = "dropship",
  DISTRIBUTION_CENTER = "distribution_center"
}

const FulfillmentLocation = model.define("fulfillment_location", {
  id: model.id().primaryKey(),
  
  // Basic Information
  name: model.text().searchable(),
  code: model.text().unique(), // e.g., "NYC-01", "LA-DC"
  type: model.enum(LocationType),
  vendor_id: model.text().nullable(), // If vendor-specific location
  
  // Address
  address_line_1: model.text(),
  address_line_2: model.text().nullable(),
  city: model.text(),
  state_province: model.text(),
  postal_code: model.text(),
  country_code: model.text(),
  
  // Coordinates for distance calculation
  latitude: model.float(),
  longitude: model.float(),
  
  // Operational Details
  is_active: model.boolean().default(true),
  handles_returns: model.boolean().default(false),
  handles_exchanges: model.boolean().default(false),
  
  // Processing Capabilities
  processing_time_hours: model.number().default(24), // Default processing time
  cutoff_time: model.text().default("14:00"), // Daily cutoff for same-day processing
  timezone: model.text().default("America/New_York"),
  
  // Shipping Zones
  shipping_zones: model.json().default({} as Record<string, unknown>), // Array of supported shipping zones
  excluded_states: model.json().default({} as Record<string, unknown>), // States this location cannot ship to
  
  // Performance Metrics
  fulfillment_rate: model.float().default(0.95), // Historical fulfillment success rate
  average_processing_hours: model.float().default(24),
  error_rate: model.float().default(0.02),
  
  // Capacity
  max_orders_per_day: model.number().nullable(),
  current_capacity_percent: model.float().default(0),
  
  // Cost Factors
  handling_fee_cents: model.number().default(0), // Fixed handling fee per order
  pick_pack_fee_cents: model.number().default(0), // Per item fee
  
  // Metadata
  metadata: model.json().nullable()
})
  .indexes([
    {
      on: ["vendor_id"],
      name: "IDX_fulfillment_location_vendor"
    },
    {
      on: ["is_active", "type"],
      name: "IDX_fulfillment_location_active_type"
    },
    {
      on: ["latitude", "longitude"],
      name: "IDX_fulfillment_location_coordinates"
    }
  ])

export default FulfillmentLocation