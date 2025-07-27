import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { limit = 20, offset = 0, type, order = "name" } = req.query
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)

  try {
    // Build filters
    const filters: any = {
      status: "active",
    }

    if (type && type !== "all") {
      filters.type = type
    }

    // Get vendors
    const vendors = await marketplaceService.listVendors(filters, {
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
        "metadata",
      ],
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: order === "-name" ? { name: "DESC" } : { name: "ASC" },
    })

    // TODO: Add product count for each vendor using query.graph with links
    const vendorsWithCount = vendors.map((vendor: any) => ({
      ...vendor,
      product_count: 0, // Placeholder until we implement the link query
    }))

    // Get total count
    const allVendors = await marketplaceService.listVendors(filters)

    res.json({
      vendors: vendorsWithCount,
      count: allVendors.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch vendors",
      details: error.message,
    })
  }
}