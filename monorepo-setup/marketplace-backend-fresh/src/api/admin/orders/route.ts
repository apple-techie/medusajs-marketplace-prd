import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { limit = 20, offset = 0, status } = req.query
  
  try {
    const filters: any = {}
    if (status) {
      filters.status = status
    }

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
        "sales_channel.*"
      ],
      filters,
      pagination: {
        take: Number(limit),
        skip: Number(offset)
      }
    })

    // Calculate totals for orders that don't have them
    const ordersWithTotals = orders.map(order => {
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
      
      // Don't add payment_status and fulfillment_status as they don't exist on Order type
      
      return order
    })

    res.json({ 
      orders: ordersWithTotals,
      count: ordersWithTotals.length,
      limit: Number(limit),
      offset: Number(offset)
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message })
  }
}