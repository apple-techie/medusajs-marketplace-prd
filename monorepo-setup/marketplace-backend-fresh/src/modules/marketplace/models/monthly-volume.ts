import { model } from "@medusajs/framework/utils"

const VendorMonthlyVolume = model.define("vendor_monthly_volume", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  year: model.number(),
  month: model.number(),
  
  // Volume metrics
  total_sales: model.number().default(0),
  total_orders: model.number().default(0),
  total_items: model.number().default(0),
  
  // Commission tracking
  total_commission: model.number().default(0),
  commission_tier: model.text().nullable(),
  effective_commission_rate: model.number().nullable(),
  
  // Performance metrics
  average_order_value: model.number().nullable(),
  return_rate: model.number().nullable(),
  fulfillment_rate: model.number().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})
.indexes([
  {
    name: "unique_vendor_month",
    on: ["vendor_id", "year", "month"],
    unique: true,
  }
])

export default VendorMonthlyVolume