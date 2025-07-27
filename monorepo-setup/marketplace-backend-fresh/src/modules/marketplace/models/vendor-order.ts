import { model } from "@medusajs/framework/utils"

const VendorOrder = model.define("vendor_order", {
  id: model.id().primaryKey(),
  order_id: model.text().searchable(),
  vendor_id: model.text().searchable(),
  vendor_name: model.text(),
  vendor_type: model.text(),
  status: model
    .enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
    .default("pending"),
  subtotal: model.bigNumber(),
  commission_rate: model.number(),
  commission_amount: model.bigNumber(),
  vendor_payout: model.bigNumber(),
  items: model.json(),
  fulfilled_at: model.dateTime().nullable(),
  shipped_at: model.dateTime().nullable(),
  delivered_at: model.dateTime().nullable(),
  cancelled_at: model.dateTime().nullable(),
  notes: model.text().nullable(),
  metadata: model.json().nullable()
})
  .indexes([
    {
      on: ["vendor_id"],
      name: "IDX_vendor_order_vendor_id"
    },
    {
      on: ["order_id"],
      name: "IDX_vendor_order_order_id"
    },
    {
      on: ["status"],
      name: "IDX_vendor_order_status"
    }
  ])

export default VendorOrder