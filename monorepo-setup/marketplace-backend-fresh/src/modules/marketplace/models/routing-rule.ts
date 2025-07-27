import { model } from "@medusajs/framework/utils"

export enum RuleType {
  PRODUCT = "product",
  CATEGORY = "category", 
  VENDOR = "vendor",
  CUSTOMER = "customer",
  REGION = "region",
  WEIGHT = "weight",
  VALUE = "value"
}

export enum RuleOperator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  CONTAINS = "contains",
  GREATER_THAN = "greater_than",
  LESS_THAN = "less_than",
  IN = "in",
  NOT_IN = "not_in"
}

export enum RuleAction {
  REQUIRE_LOCATION = "require_location",
  EXCLUDE_LOCATION = "exclude_location",
  PREFER_LOCATION = "prefer_location",
  APPLY_SURCHARGE = "apply_surcharge",
  REQUIRE_SHIPPING_METHOD = "require_shipping_method"
}

const RoutingRule = model.define("routing_rule", {
  id: model.id().primaryKey(),
  
  // Rule Definition
  name: model.text(),
  description: model.text().nullable(),
  rule_type: model.enum(RuleType),
  
  // Condition
  field_path: model.text(), // e.g., "product.metadata.requires_refrigeration"
  operator: model.enum(RuleOperator),
  value: model.json(), // Can be string, number, array, etc.
  
  // Action
  action: model.enum(RuleAction),
  action_value: model.json(), // location_id, surcharge amount, etc.
  
  // Priority and Status
  priority: model.number().default(0), // Higher priority rules evaluated first
  is_active: model.boolean().default(true),
  
  // Applicability
  applies_to_vendor_types: model.json().nullable(), // ["shop", "brand", "distributor"]
  applies_to_product_categories: model.json().nullable(),
  applies_to_regions: model.json().nullable(),
  
  // Time-based Rules
  valid_from: model.dateTime().nullable(),
  valid_until: model.dateTime().nullable(),
  
  // Metadata
  metadata: model.json().nullable()
})
  .indexes([
    {
      on: ["is_active", "priority"],
      name: "IDX_routing_rule_active_priority"
    },
    {
      on: ["rule_type"],
      name: "IDX_routing_rule_type"
    }
  ])

export default RoutingRule