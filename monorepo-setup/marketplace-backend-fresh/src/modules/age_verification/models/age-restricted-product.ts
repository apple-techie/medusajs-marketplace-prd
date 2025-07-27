import { model } from "@medusajs/framework/utils"

export const AgeRestrictedProduct = model.define("age_restricted_product", {
  id: model.id().primaryKey(),
  
  // Product reference
  product_id: model.text().unique(),
  
  // Age restriction
  minimum_age: model.number().default(21), // 18 or 21
  
  // Restriction details
  restriction_reason: model.text().nullable(), // e.g., "alcohol", "tobacco", "cannabis"
  requires_id_check: model.boolean().default(false), // Force ID verification
  
  // Geographic restrictions
  restricted_states: model.json().nullable(), // Array of state codes where product is restricted
  restricted_zip_codes: model.json().nullable(), // Array of zip codes where product is restricted
  
  // Compliance
  compliance_category: model.text().nullable(), // e.g., "alcohol", "tobacco"
  license_required: model.boolean().default(false),
  
  // Display settings
  show_age_gate: model.boolean().default(true),
  age_gate_message: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
  is_active: model.boolean().default(true),
})

export default AgeRestrictedProduct