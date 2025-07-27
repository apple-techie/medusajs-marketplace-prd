import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { LocationType } from "../../../modules/marketplace/models/fulfillment-location"

// GET /admin/fulfillment-locations - List all fulfillment locations
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    const filters: any = {}
    
    if (req.query.is_active !== undefined) {
      filters.is_active = req.query.is_active === "true"
    }
    
    if (req.query.type) {
      filters.type = req.query.type as LocationType
    }
    
    if (req.query.vendor_id) {
      filters.vendor_id = req.query.vendor_id as string
    }
    
    const locations = await marketplaceService.getFulfillmentLocations({ filters })
    
    res.json({
      fulfillment_locations: locations,
      count: locations.length
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch fulfillment locations",
      error: error.message
    })
  }
}

// POST /admin/fulfillment-locations - Create a new fulfillment location
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const marketplaceService = req.scope.resolve("marketplace")
  
  try {
    const location = await marketplaceService.createFulfillmentLocation(req.body)
    
    res.status(201).json({
      fulfillment_location: location,
      message: "Fulfillment location created successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create fulfillment location",
      error: error.message
    })
  }
}