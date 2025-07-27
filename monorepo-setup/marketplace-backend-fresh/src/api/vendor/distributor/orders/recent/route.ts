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
    
    // Mock recent orders - in a real system, these would come from the order module
    const mockOrders = [
      {
        id: 'order_dist_1',
        order_number: 'DO-2025-0142',
        destination: 'Green Valley Dispensary, Downtown',
        items_count: 24,
        status: 'pending' as const,
        priority: 'urgent' as const,
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        expected_delivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'order_dist_2',
        order_number: 'DO-2025-0141',
        destination: 'Herbal Wellness Shop, Westside',
        items_count: 18,
        status: 'processing' as const,
        priority: 'express' as const,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expected_delivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'order_dist_3',
        order_number: 'DO-2025-0140',
        destination: 'Nature\'s Medicine, North Point',
        items_count: 36,
        status: 'in_transit' as const,
        priority: 'standard' as const,
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        expected_delivery: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'order_dist_4',
        order_number: 'DO-2025-0139',
        destination: 'Elevated Health Store, Eastside',
        items_count: 12,
        status: 'in_transit' as const,
        priority: 'express' as const,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        expected_delivery: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'order_dist_5',
        order_number: 'DO-2025-0138',
        destination: 'Cannabis Culture Shop, Midtown',
        items_count: 28,
        status: 'delivered' as const,
        priority: 'standard' as const,
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        expected_delivery: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    res.json({
      orders: mockOrders
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch recent orders",
      message: error.message 
    })
  }
}