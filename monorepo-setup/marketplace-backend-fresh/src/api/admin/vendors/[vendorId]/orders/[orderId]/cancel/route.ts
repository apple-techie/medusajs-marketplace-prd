import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// POST /admin/vendors/:vendorId/orders/:orderId/cancel - Cancel order items
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { vendorId, orderId } = req.params
  const { reason, items } = req.body as { reason?: string; items?: string[] } // items is optional, if not provided cancel all vendor items
  
  const orderService = req.scope.resolve(Modules.ORDER)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get order details
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "status",
        "items.*",
        "items.product.*",
        "fulfillments.*",
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

    // Check if order can be canceled
    if (order.status === 'completed' || order.status === 'archived') {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot cancel a completed or archived order"
      )
    }

    // Get vendor's items
    const vendorItems = (order.items || []).filter((item: any) => 
      item.product?.metadata?.vendor_id === vendorId
    )

    if (vendorItems.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "No items to cancel for this vendor"
      )
    }

    // Check if any vendor items are already fulfilled
    const fulfilledVendorItems = order.fulfillments?.some((fulfillment: any) => 
      fulfillment.items.some((fItem: any) => 
        vendorItems.some((vItem: any) => vItem.id === fItem.item_id)
      )
    )

    if (fulfilledVendorItems) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot cancel items that have already been fulfilled"
      )
    }

    // If specific items provided, validate them
    let itemsToCancel = vendorItems
    if (items && items.length > 0) {
      itemsToCancel = vendorItems.filter((item: any) => 
        items.includes(item.id)
      )
      
      if (itemsToCancel.length !== items.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Some items do not belong to this vendor or order"
        )
      }
    }

    // Cancel the items
    // In a real implementation, this would handle partial cancellations
    // For now, we'll cancel the entire order if all items are vendor's
    const allOrderItems = order.items || []
    const allItemsAreVendors = allOrderItems.length > 0 && allOrderItems.every((item: any) => 
      item.product?.metadata?.vendor_id === vendorId
    )

    if (allItemsAreVendors) {
      // Cancel entire order - using cancel method
      await orderService.cancel(orderId)
    } else {
      // In a real system, implement partial cancellation
      // For now, just mark in metadata
      await orderService.updateOrders(orderId, {
        metadata: {
          ...order.metadata,
          [`vendor_${vendorId}_canceled_items`]: itemsToCancel.map((i: any) => i.id),
          [`vendor_${vendorId}_cancel_reason`]: reason,
          [`vendor_${vendorId}_canceled_at`]: new Date().toISOString(),
        }
      })
    }

    res.json({
      success: true,
      canceled_items: itemsToCancel.map((item: any) => ({
        id: item.id,
        title: item.title,
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Failed to cancel order items",
      error: error.message 
    })
  }
}