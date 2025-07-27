import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"

/**
 * POST /admin/payouts/batch
 * Create batch payouts for multiple vendors
 */
export const POST = async (
  req: MedusaRequest<{
    vendor_ids?: string[]
    end_date?: string
    min_amount?: number
  }>,
  res: MedusaResponse
) => {
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  
  try {
    const options: any = {}
    
    if (req.body.vendor_ids) {
      options.vendorIds = req.body.vendor_ids
    }
    
    if (req.body.end_date) {
      options.endDate = new Date(req.body.end_date)
    }
    
    if (req.body.min_amount) {
      options.minAmount = req.body.min_amount
    }
    
    const result = await marketplaceService.createBatchPayouts(options)
    
    res.json({ batch_result: result })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to create batch payouts",
      details: error.message
    })
  }
}