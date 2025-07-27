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
    const period = req.query.period as string || 'last_30_days'
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a shop partner
    if (vendor.type !== 'shop_partner') {
      return res.status(403).json({ error: "This endpoint is only for shop partners" })
    }
    
    // Calculate date ranges
    const now = new Date()
    let startDate: Date
    let endDate = new Date()
    
    switch (period) {
      case 'last_7_days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'last_30_days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'last_90_days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    
    // Mock shop partner stats - in a real system, these would come from referral tracking
    const mockStats = {
      total_referrals: 156,
      active_referrals: 42,
      total_commission_earned: 458500, // $4,585.00
      pending_commission: 78500, // $785.00
      conversion_rate: 12.5,
      average_order_value: 15500, // $155.00
      total_clicks: 1248,
      total_sales: 156,
      current_tier: 'Silver',
      next_tier_progress: 65
    }
    
    // Adjust stats based on period
    const periodMultiplier = {
      'last_7_days': 0.23,
      'last_30_days': 1,
      'last_90_days': 3,
      'this_month': 0.9,
      'last_month': 0.95
    }[period] || 1
    
    const adjustedStats = {
      total_referrals: Math.floor(mockStats.total_referrals * periodMultiplier),
      active_referrals: Math.floor(mockStats.active_referrals * periodMultiplier),
      total_commission_earned: Math.floor(mockStats.total_commission_earned * periodMultiplier),
      pending_commission: mockStats.pending_commission,
      conversion_rate: mockStats.conversion_rate,
      average_order_value: mockStats.average_order_value,
      total_clicks: Math.floor(mockStats.total_clicks * periodMultiplier),
      total_sales: Math.floor(mockStats.total_sales * periodMultiplier),
      current_tier: mockStats.current_tier,
      next_tier_progress: mockStats.next_tier_progress
    }
    
    res.json({
      stats: adjustedStats,
      period
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch shop stats",
      message: error.message 
    })
  }
}