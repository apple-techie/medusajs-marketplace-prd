import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params
  
  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "*",
        "items.*",
        "items.variant.*",
        "items.variant.product.*",
        "customer.*",
        "shipping_address.*",
        "billing_address.*",
        "payment_collections.*",
        "fulfillments.*",
        "fulfillments.items.*",
        "shipping_methods.*",
        "sales_channel.*",
        "region.*",
        "region.countries.*"
      ],
      filters: {
        id
      }
    })

    if (!orders.length) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Calculate totals if they're missing
    const order = orders[0]
    
    // Always calculate totals based on items
    let subtotal = 0
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        if (!item) return
        subtotal += (item.unit_price || 0) * (item.quantity || 0)
      })
    }
    
    // Set totals
    if (!order.subtotal) order.subtotal = subtotal
    if (!order.total) order.total = subtotal // Simplified - would normally include tax, shipping, etc.

    res.json({ order })
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message })
  }
}