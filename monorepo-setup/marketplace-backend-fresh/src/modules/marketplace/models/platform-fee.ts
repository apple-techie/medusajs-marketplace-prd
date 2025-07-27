import { model } from "@medusajs/framework/utils"

const VendorPlatformFee = model.define("vendor_platform_fee", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  order_id: model.text(),
  
  // Fee details
  vendor_type: model.text(),
  fee_percentage: model.number(),
  order_amount: model.number(),
  fee_amount: model.number(),
  
  // Volume tracking
  volume_tier: model.text().nullable(),
  is_promotional_rate: model.boolean().default(false),
  promotional_reason: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})

export default VendorPlatformFee