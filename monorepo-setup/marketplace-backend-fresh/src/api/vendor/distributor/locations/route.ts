import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules, MedusaError } from "@medusajs/framework/utils"
import * as jwt from "jsonwebtoken"

// Set CORS headers helper
const setCorsHeaders = (req: MedusaRequest, res: MedusaResponse) => {
  const origin = req.headers.origin
  const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"]
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }
}

// Helper to validate vendor JWT
const validateVendorToken = (req: MedusaRequest) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "No authorization token provided")
  }
  
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "marketplace_jwt_secret_2025_production_key") as any
    return decoded
  } catch (error) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Invalid or expired token")
  }
}

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  res.status(200).end()
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  try {
    const decoded = validateVendorToken(req)
    const vendorId = decoded.app_metadata?.vendor_id
    
    if (!vendorId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a distributor partner
    if (vendor.type !== 'distributor_partner') {
      return res.status(403).json({ error: "This endpoint is only for distributor partners" })
    }
    
    // Mock location data - in a real system, these would come from fulfillment locations
    const mockLocations = [
      {
        id: 'loc_1',
        name: 'Main Distribution Center',
        city: 'Los Angeles',
        state: 'CA',
        inventory_value: 2500000, // $25,000.00
        stock_level: 85,
        pending_orders: 12,
        active_staff: 8,
        status: 'operational' as const
      },
      {
        id: 'loc_2',
        name: 'North Valley Hub',
        city: 'Sacramento',
        state: 'CA',
        inventory_value: 1800000, // $18,000.00
        stock_level: 72,
        pending_orders: 8,
        active_staff: 5,
        status: 'operational' as const
      },
      {
        id: 'loc_3',
        name: 'Bay Area Warehouse',
        city: 'Oakland',
        state: 'CA',
        inventory_value: 2100000, // $21,000.00
        stock_level: 45,
        pending_orders: 15,
        active_staff: 6,
        status: 'limited' as const
      },
      {
        id: 'loc_4',
        name: 'Central Coast Facility',
        city: 'San Luis Obispo',
        state: 'CA',
        inventory_value: 950000, // $9,500.00
        stock_level: 90,
        pending_orders: 4,
        active_staff: 3,
        status: 'operational' as const
      },
      {
        id: 'loc_5',
        name: 'Desert Distribution',
        city: 'Palm Springs',
        state: 'CA',
        inventory_value: 650000, // $6,500.00
        stock_level: 15,
        pending_orders: 2,
        active_staff: 2,
        status: 'offline' as const
      }
    ]
    
    res.json({
      locations: mockLocations
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch locations",
      message: error.message 
    })
  }
}