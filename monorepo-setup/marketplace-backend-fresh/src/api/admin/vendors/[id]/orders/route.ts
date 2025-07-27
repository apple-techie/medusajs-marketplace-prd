import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/vendors/:id/orders - Get vendor's orders
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const { status, fulfillment_status, limit = 50, offset = 0 } = req.query
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Build filters
    const filters: any = {}
    
    if (status) {
      filters.status = status
    }
    
    // Remove fulfillment_status filter as it doesn't exist on Order type

    // Get orders that contain products from this vendor
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "fulfillments.*",
        "payment_collections.*",
        "total",
        "subtotal",
        "shipping_total",
        "tax_total",
        "discount_total",
        "currency_code",
        "created_at",
        "customer.*",
        "shipping_address.*",
        "items.*",
        "items.variant.*",
        "items.product.*",
        "fulfillments.*",
        "fulfillments.items.*",
      ],
      filters,
      pagination: {
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      },
    })

    // Filter orders to only include those with vendor's products
    const vendorOrders = orders.filter(order => 
      order.items?.some((item: any) => 
        item.product?.metadata?.vendor_id === vendorId
      )
    )

    // Transform orders to only include vendor's items
    const transformedOrders = vendorOrders.map(order => {
      const vendorItems = (order.items || []).filter((item: any) => 
        item.product?.metadata?.vendor_id === vendorId
      )
      
      // Recalculate totals for vendor items only
      const vendorSubtotal = vendorItems.reduce((sum: number, item: any) => 
        sum + (item.unit_price * item.quantity), 0
      )
      
      return {
        ...order,
        items: vendorItems,
        // Keep original totals for now (in a real system, you'd calculate vendor-specific totals)
        vendor_subtotal: vendorSubtotal,
      }
    })

    res.json({
      orders: transformedOrders,
      count: transformedOrders.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching vendor orders", 
      error: error.message 
    })
  }
}