import { model } from "@medusajs/framework/utils"

export enum VendorType {
  SHOP = "shop",
  BRAND = "brand", 
  DISTRIBUTOR = "distributor"
}

export enum VendorStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive"
}

const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  handle: model.text().unique(),
  name: model.text(),
  email: model.text().unique(),
  logo: model.text().nullable(),
  
  // Vendor type and status
  type: model.enum(VendorType),
  status: model.enum(VendorStatus).default(VendorStatus.PENDING),
  is_active: model.boolean().default(true),
  
  // Business information
  description: model.text().nullable(),
  website: model.text().nullable(),
  
  // Commission structure
  commission_rate: model.number().default(20), // Percentage
  commission_tier: model.text().default("bronze"), // bronze, silver, gold
  
  // Contact information
  contact_email: model.text().nullable(),
  contact_phone: model.text().nullable(),
  
  // Compliance
  tax_id: model.text().nullable(),
  verified_at: model.dateTime().nullable(),
  
  // Stripe Connect
  stripe_account_id: model.text().nullable(),
  stripe_onboarding_completed: model.boolean().default(false),
  stripe_charges_enabled: model.boolean().default(false),
  stripe_payouts_enabled: model.boolean().default(false),
  stripe_details_submitted: model.boolean().default(false),
  stripe_onboarding_started_at: model.dateTime().nullable(),
  stripe_onboarding_completed_at: model.dateTime().nullable(),
  
  // Address fields (flattened for simplicity)
  address_line_1: model.text().nullable(),
  address_line_2: model.text().nullable(),
  city: model.text().nullable(),
  state: model.text().nullable(),
  postal_code: model.text().nullable(),
  country_code: model.text().nullable(),
  
  // Metadata for additional fields
  metadata: model.json().nullable(),
})

export default Vendor