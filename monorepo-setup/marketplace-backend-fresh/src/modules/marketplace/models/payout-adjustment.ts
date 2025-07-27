import { model } from "@medusajs/framework/utils"

const PayoutAdjustment = model.define("payout_adjustment", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  payout_id: model.text().nullable(),
  
  // Adjustment details
  type: model.enum(["credit", "debit", "refund", "bonus", "penalty"]),
  amount: model.number(),
  reason: model.text(),
  
  // Reference
  reference_type: model.text().nullable(), // 'order', 'return', 'manual'
  reference_id: model.text().nullable(),
  
  // Approval
  created_by: model.text(),
  approved_by: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})

export default PayoutAdjustment