import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../../../modules/marketplace"

/**
 * GET /admin/vendors/:id/payouts/calculate
 * Calculate next payout amount for vendor
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  
  try {
    const calculation = await marketplaceService.calculateNextPayout(vendorId)
    
    res.json({ calculation })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to calculate vendor payout",
      details: error.message
    })
  }
}