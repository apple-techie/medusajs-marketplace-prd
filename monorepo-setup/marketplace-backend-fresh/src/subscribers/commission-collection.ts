import { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { MARKETPLACE_MODULE } from "../modules/marketplace"
import MarketplaceModuleService from "../modules/marketplace/service"

/**
 * Subscriber to mark commissions as collected when order is delivered
 */
export default async function commissionCollectionHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const marketplaceService: MarketplaceModuleService = container.resolve(MARKETPLACE_MODULE)
  
  try {
    // Mark commission as collected for this order
    await marketplaceService.markCommissionCollected(data.id)
    
    console.log(`Commission marked as collected for order ${data.id}`)
  } catch (error) {
    console.error("Error marking commission as collected:", error)
  }
}

export const config: SubscriberConfig = {
  event: ["order.completed", "order.fulfillment.delivered"],
}