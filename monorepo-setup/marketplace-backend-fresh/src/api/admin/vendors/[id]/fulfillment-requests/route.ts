import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/vendors/:id/fulfillment-requests - Get fulfillment requests for distributor
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const { status, priority, limit = 50, offset = 0 } = req.query as {
    status?: string
    priority?: string
    limit?: string | number
    offset?: string | number
  }
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Verify vendor is a distributor
    const { data: vendors } = await query.graph({
      entity: "vendor",
      fields: ["id", "type"],
      filters: { id: vendorId },
    })

    if (!vendors.length || vendors[0].type !== 'distributor') {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Only distributor partners can access fulfillment requests"
      )
    }

    // Get fulfillment requests assigned to this distributor
    // In a real system, this would be a separate entity
    // For now, we'll simulate by getting orders with specific metadata
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "fulfillments.*",
        "total",
        "currency_code",
        "created_at",
        "shipping_address.*",
        "items.*",
        "items.variant.*",
        "items.product.*",
        "metadata",
      ],
      filters: {
        // In production, filter by distributor assignment
        ...(status && { status: status as any }),
      },
      pagination: {
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      },
    })

    // Transform orders to fulfillment request format
    const fulfillmentRequests = orders.map(order => {
      // Calculate total weight (mock calculation)
      const totalWeight = order.items ? order.items.reduce((sum: number, item: any) => {
        const weight = item?.variant?.weight || 100 // Default 100g if no weight
        return sum + (weight * item.quantity / 1000) // Convert to kg
      }, 0) : 0

      // Determine priority based on metadata or order value
      const priority = order.metadata?.priority || 
        (order.total > 10000 ? 'express' : 'standard')

      // Mock pickup location based on product vendor
      const firstVendorId = order.items && order.items[0]?.product?.metadata?.vendor_id
      const pickupLocation = {
        name: `Vendor ${firstVendorId} Warehouse`,
        address: "123 Warehouse St, City, State 12345",
        contact: "+1 (555) 123-4567"
      }

      return {
        id: order.id,
        order_id: order.id,
        display_id: order.id, // Order doesn't have display_id
        status: mapFulfillmentStatus(order.fulfillments),
        priority,
        pickup_location: pickupLocation,
        delivery_address: order.shipping_address,
        items: order.items ? order.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          variant_title: item.variant?.title,
          sku: item.variant?.sku,
          quantity: item.quantity,
          weight: item.variant?.weight || 100,
        })) : [],
        total_weight: totalWeight.toFixed(2),
        estimated_delivery: calculateEstimatedDelivery(priority as string),
        created_at: order.created_at,
        assigned_to: order.metadata?.assigned_driver || null,
      }
    })

    // Filter by priority if specified
    const filteredRequests = priority 
      ? fulfillmentRequests.filter(r => r.priority === priority)
      : fulfillmentRequests

    res.json({
      requests: filteredRequests,
      count: filteredRequests.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Error fetching fulfillment requests", 
      error: error.message 
    })
  }
}

function mapFulfillmentStatus(fulfillments: any): string {
  if (!fulfillments || fulfillments.length === 0) return 'pending'
  // Check fulfillment status based on actual fulfillments
  const hasDelivered = fulfillments.some((f: any) => f?.delivered_at)
  const hasShipped = fulfillments.some((f: any) => f?.shipped_at)
  const hasCanceled = fulfillments.some((f: any) => f?.canceled_at)
  
  if (hasDelivered) return 'delivered'
  if (hasCanceled) return 'canceled'
  if (hasShipped) return 'in_transit'
  return 'pending'
}

function mapFulfillmentStatusOld(status: string): string {
  const statusMap: Record<string, string> = {
    'not_fulfilled': 'pending',
    'partially_fulfilled': 'accepted',
    'fulfilled': 'in_transit',
    'delivered': 'delivered',
    'shipped': 'in_transit',
    'canceled': 'canceled',
  }
  return statusMap[status] || 'pending'
}

function calculateEstimatedDelivery(priority: string): string {
  const today = new Date()
  const daysToAdd = priority === 'urgent' ? 1 : priority === 'express' ? 2 : 3
  today.setDate(today.getDate() + daysToAdd)
  return today.toISOString()
}