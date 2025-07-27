import { model } from "@medusajs/framework/utils"

const Payout = model.define("payout", {
  id: model.id().primaryKey(),
  vendor_id: model.text(),
  
  // Payout details
  amount: model.number(),
  currency_code: model.text().default("USD"),
  status: model.enum(["pending", "processing", "completed", "failed", "cancelled"]).default("pending"),
  
  // Period
  period_start: model.dateTime(),
  period_end: model.dateTime(),
  
  // Payment details
  payment_method: model.text().default("stripe_connect"),
  stripe_transfer_id: model.text().nullable(),
  stripe_payout_id: model.text().nullable(),
  
  // Status tracking
  initiated_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  failed_at: model.dateTime().nullable(),
  failure_reason: model.text().nullable(),
  
  // Breakdown
  gross_sales: model.number(),
  total_commission: model.number(),
  adjustments: model.number().default(0),
  
  // Commission records
  commission_record_ids: model.json().default({} as Record<string, unknown>),
  
  // Metadata
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Payout