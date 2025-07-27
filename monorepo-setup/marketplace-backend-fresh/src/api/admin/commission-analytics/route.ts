import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"

/**
 * GET /admin/commission-analytics
 * Get platform-wide commission analytics
 */
export const GET = async (
  req: MedusaRequest<{
    start_date?: string
    end_date?: string
  }>,
  res: MedusaResponse
) => {
  const { start_date, end_date } = req.query
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  
  try {
    // Parse dates if provided
    const startDate = start_date ? new Date(start_date as string) : undefined
    const endDate = end_date ? new Date(end_date as string) : undefined
    
    // Validate dates
    if (startDate && isNaN(startDate.getTime())) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid start_date format"
      )
    }
    
    if (endDate && isNaN(endDate.getTime())) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid end_date format"
      )
    }
    
    // Get analytics
    const analytics = await marketplaceService.getPlatformCommissionAnalytics(
      startDate,
      endDate
    )
    
    res.json({ analytics })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to fetch commission analytics",
      details: error.message
    })
  }
}