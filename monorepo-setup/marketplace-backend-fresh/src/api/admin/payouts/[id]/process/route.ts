import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../../modules/marketplace"

/**
 * POST /admin/payouts/:id/process
 * Process a payout through Stripe
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const payoutId = req.params.id
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  
  try {
    const result = await marketplaceService.processVendorPayout(payoutId)
    
    res.json({ 
      payout: result.payout,
      transfer: result.transfer 
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to process payout",
      details: error.message
    })
  }
}