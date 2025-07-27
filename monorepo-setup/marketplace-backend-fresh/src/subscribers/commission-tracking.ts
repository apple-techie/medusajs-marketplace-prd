import { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { MARKETPLACE_MODULE } from "../modules/marketplace"
import MarketplaceModuleService from "../modules/marketplace/service"

/**
 * Subscriber to track commissions on order completion
 */
export default async function commissionTrackingHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const marketplaceService: MarketplaceModuleService = container.resolve(MARKETPLACE_MODULE)
  const orderService = container.resolve("order")
  
  try {
    // Get the order details
    const order = await orderService.retrieveOrder(data.id, {
      relations: ["items", "items.variant", "items.variant.product"]
    })
    
    // Get vendor orders for this order
    const vendorOrders = await marketplaceService.listVendorOrders({
      filters: { order_id: order.id }
    })
    
    // Record commission for each vendor order
    for (const vendorOrder of vendorOrders) {
      try {
        await marketplaceService.recordOrderCommission(
          order.id,
          vendorOrder.vendor_id,
          vendorOrder.subtotal || 0
        )
        
        console.log(`Commission recorded for vendor ${vendorOrder.vendor_id} on order ${order.id}`)
      } catch (error) {
        console.error(`Failed to record commission for vendor ${vendorOrder.vendor_id}:`, error)
      }
    }
  } catch (error) {
    console.error("Error in commission tracking subscriber:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}