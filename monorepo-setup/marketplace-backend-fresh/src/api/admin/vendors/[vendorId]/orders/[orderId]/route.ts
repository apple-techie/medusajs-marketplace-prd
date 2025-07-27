import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/vendors/:vendorId/orders/:orderId - Get single order details
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { vendorId, orderId } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get order with all details
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "*",
        "customer.*",
        "shipping_address.*",
        "billing_address.*",
        "items.*",
        "items.variant.*",
        "items.product.*",
        "items.thumbnail",
        "fulfillments.*",
        "fulfillments.items.*",
        "fulfillments.tracking_links.*",
        "payments.*",
        "shipping_methods.*",
      ],
      filters: {
        id: orderId
      },
    })

    if (!orders.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Order not found"
      )
    }

    const order = orders[0]

    // Check if vendor has products in this order
    const hasVendorProducts = (order.items || []).some((item: any) => 
      item.product?.metadata?.vendor_id === vendorId
    )

    if (!hasVendorProducts) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "This order does not contain any of your products"
      )
    }

    // Filter items to only include vendor's products
    const vendorItems = (order.items || []).filter((item: any) => 
      item.product?.metadata?.vendor_id === vendorId
    )

    // Filter fulfillments to only include those with vendor's items
    const vendorFulfillments = order.fulfillments?.filter((fulfillment: any) => 
      fulfillment.items.some((fItem: any) => 
        vendorItems.some((vItem: any) => vItem.id === fItem.item_id)
      )
    ) || []

    // Transform fulfillments to only include vendor's items
    const transformedFulfillments = vendorFulfillments.map((fulfillment: any) => ({
      ...fulfillment,
      items: fulfillment.items.filter((fItem: any) => 
        vendorItems.some((vItem: any) => vItem.id === fItem.item_id)
      )
    }))

    res.json({
      order: {
        ...order,
        items: vendorItems,
        fulfillments: transformedFulfillments,
      },
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Error fetching order details", 
      error: error.message 
    })
  }
}