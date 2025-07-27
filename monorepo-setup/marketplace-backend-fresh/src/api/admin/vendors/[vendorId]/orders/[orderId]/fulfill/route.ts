import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// POST /admin/vendors/:vendorId/orders/:orderId/fulfill - Create fulfillment
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { vendorId, orderId } = req.params
  const { items, no_notification, tracking_numbers, tracking_company } = req.body as {
    items: { item_id: string; quantity: number }[]
    no_notification?: boolean
    tracking_numbers?: string[]
    tracking_company?: string
  }
  
  const orderService = req.scope.resolve(Modules.ORDER)
  const fulfillmentService = req.scope.resolve(Modules.FULFILLMENT)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Validate vendor owns the items being fulfilled
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "items.*",
        "items.product.*",
        "fulfillments.*",
        "fulfillments.items.*",
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

    // Validate all items belong to vendor
    for (const fulfillmentItem of items) {
      const orderItem = (order.items || []).find((item: any) => item.id === fulfillmentItem.item_id)
      
      if (!orderItem) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Order item ${fulfillmentItem.item_id} not found`
        )
      }
      
      if (orderItem.product?.metadata?.vendor_id !== vendorId) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `You do not have permission to fulfill item ${fulfillmentItem.item_id}`
        )
      }

      // Check if quantity is available to fulfill
      const fulfilledQuantity = order.fulfillments?.reduce((sum: number, f: any) => {
        const fItem = f.items.find((i: any) => i.item_id === fulfillmentItem.item_id)
        return sum + (fItem?.quantity || 0)
      }, 0) || 0

      const availableToFulfill = orderItem.quantity - fulfilledQuantity
      
      if (fulfillmentItem.quantity > availableToFulfill) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot fulfill ${fulfillmentItem.quantity} of item ${orderItem.title}. Only ${availableToFulfill} available.`
        )
      }
    }

    // Get vendor's fulfillment location
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["id"],
      filters: { id: vendorId },
    })

    const vendor = vendors[0]
    // In MedusaJS v2, fulfillment locations are managed separately
    // For now, we'll use a placeholder location ID
    const locationId = "default_location"

    // Create fulfillment
    const fulfillmentData: any = {
      order_id: orderId,
      location_id: locationId,
      items,
      no_notification,
      metadata: {
        vendor_id: vendorId,
      }
    }

    if (tracking_numbers && tracking_numbers.length > 0) {
      fulfillmentData.tracking_numbers = tracking_numbers
      fulfillmentData.tracking_company = tracking_company
    }

    const fulfillment = await fulfillmentService.createFulfillment(fulfillmentData)

    // Mark fulfillment as shipped if tracking info provided
    if (tracking_numbers && tracking_numbers.length > 0) {
      await fulfillmentService.updateFulfillment(fulfillment.id, {
        shipped_at: new Date(),
      })
    }

    res.json({
      fulfillment,
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Failed to create fulfillment",
      error: error.message 
    })
  }
}