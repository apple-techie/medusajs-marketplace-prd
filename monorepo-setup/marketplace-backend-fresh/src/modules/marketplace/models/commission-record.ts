import { model } from "@medusajs/framework/utils"

const CommissionRecord = model.define("commission_record", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  vendor_id: model.text(),
  vendor_order_id: model.text().nullable(),
  
  // Commission details
  commission_rate: model.number(),
  order_amount: model.number(),
  commission_amount: model.number(),
  
  // Status tracking
  status: model.enum(["pending", "approved", "paid", "cancelled"]).default("pending"),
  calculated_at: model.dateTime(),
  approved_at: model.dateTime().nullable(),
  paid_at: model.dateTime().nullable(),
  
  // Payout reference
  payout_id: model.text().nullable(),
  
  // Metadata
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default CommissionRecord