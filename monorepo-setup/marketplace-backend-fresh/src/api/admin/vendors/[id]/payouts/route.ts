import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../../modules/marketplace"

/**
 * GET /admin/vendors/:id/payouts
 * Get vendor payout history
 */
export const GET = async (
  req: MedusaRequest<{
    status?: string
    start_date?: string
    end_date?: string
    limit?: number
    offset?: number
  }>,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  
  try {
    const options: any = {
      limit: req.query.limit || 20,
      offset: req.query.offset || 0
    }
    
    if (req.query.status) {
      options.status = req.query.status
    }
    
    if (req.query.start_date) {
      options.startDate = new Date(req.query.start_date as string)
    }
    
    if (req.query.end_date) {
      options.endDate = new Date(req.query.end_date as string)
    }
    
    const result = await marketplaceService.getVendorPayouts(vendorId, options)
    
    res.json(result)
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to fetch vendor payouts",
      details: error.message
    })
  }
}

/**
 * POST /admin/vendors/:id/payouts
 * Create a new payout for vendor
 */
export const POST = async (
  req: MedusaRequest<{
    end_date?: string
    adjustments?: Array<{
      type: string
      amount: number
      description: string
    }>
  }>,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  
  try {
    const options: any = {}
    
    if (req.body.end_date) {
      options.endDate = new Date(req.body.end_date)
    }
    
    if (req.body.adjustments) {
      options.adjustments = req.body.adjustments
    }
    
    const payout = await marketplaceService.createVendorPayout(vendorId, options)
    
    res.status(201).json({ payout })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to create vendor payout",
      details: error.message
    })
  }
}