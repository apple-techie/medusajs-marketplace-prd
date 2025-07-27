import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)

  try {
    // Get vendor details - use listVendors with id filter since retrieveVendor seems to have issues
    const vendors = await marketplaceService.listVendors({
      id: vendorId,
    }, {
      select: [
        "id",
        "name",
        "description",
        "type",
        "logo",
        "cover_image",
        "location",
        "status",
        "created_at",
        "updated_at",
        "metadata",
      ],
    })

    if (!vendors || vendors.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor not found"
      )
    }
    
    const vendor = vendors[0]
    
    if (vendor.status !== "active") {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Vendor not found"
      )
    }
    
    // Add product count and rating (mock for now)
    const vendorWithStats = {
      ...vendor,
      product_count: 0, // TODO: Get actual product count via links
      rating: 4.5, // In production, calculate from reviews
      review_count: 42, // In production, count actual reviews
    }

    res.json({
      vendor: vendorWithStats,
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to fetch vendor",
      details: error.message,
    })
  }
}