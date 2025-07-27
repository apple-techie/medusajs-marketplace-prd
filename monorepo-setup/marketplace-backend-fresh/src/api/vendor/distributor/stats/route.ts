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
    const period = req.query.period as string || 'today'
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a distributor partner
    if (vendor.type !== 'distributor_partner') {
      return res.status(403).json({ error: "This endpoint is only for distributor partners" })
    }
    
    // Period multipliers for mock data
    let periodMultiplier = 1
    switch (period) {
      case 'today':
        periodMultiplier = 1
        break
      case 'week':
        periodMultiplier = 7
        break
      case 'month':
        periodMultiplier = 30
        break
    }
    
    // Mock distributor stats - in a real system, these would come from analytics
    const baseStats = {
      total_orders: 125,
      pending_fulfillments: 8,
      in_transit: 15,
      delivered_today: 42,
      total_locations: 5,
      active_transfers: 3,
      low_stock_alerts: 7,
      fulfillment_rate: 96.5,
      average_delivery_time: 3.2,
      total_revenue: 285000000 // $2,850,000.00
    }
    
    // Adjust stats based on period
    const stats = {
      total_orders: Math.floor(baseStats.total_orders * periodMultiplier),
      pending_fulfillments: baseStats.pending_fulfillments,
      in_transit: baseStats.in_transit,
      delivered_today: period === 'today' ? baseStats.delivered_today : Math.floor(baseStats.delivered_today * periodMultiplier),
      total_locations: baseStats.total_locations,
      active_transfers: baseStats.active_transfers,
      low_stock_alerts: baseStats.low_stock_alerts,
      fulfillment_rate: baseStats.fulfillment_rate,
      average_delivery_time: baseStats.average_delivery_time,
      total_revenue: Math.floor(baseStats.total_revenue * periodMultiplier),
      period_comparison: {
        orders: 12,
        revenue: 18,
        fulfillment_rate: 2.3,
        delivery_time: -5
      }
    }
    
    res.json({
      stats
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch distributor stats",
      message: error.message 
    })
  }
}