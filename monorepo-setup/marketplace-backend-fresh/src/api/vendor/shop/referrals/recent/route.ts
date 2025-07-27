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
    
    // Verify it's a shop partner
    if (vendor.type !== 'shop_partner') {
      return res.status(403).json({ error: "This endpoint is only for shop partners" })
    }
    
    // Mock recent referrals - in a real system, these would come from a referral tracking table
    const mockReferrals = [
      {
        id: `ref_${Date.now()}_1`,
        customer_name: 'John Smith',
        referred_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'converted' as const,
        order_value: 18500,
        commission_earned: 2775 // 15% commission
      },
      {
        id: `ref_${Date.now()}_2`,
        customer_name: 'Sarah Johnson',
        referred_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const,
        order_value: undefined,
        commission_earned: undefined
      },
      {
        id: `ref_${Date.now()}_3`,
        customer_name: 'Mike Wilson',
        referred_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'converted' as const,
        order_value: 24500,
        commission_earned: 3675 // 15% commission
      },
      {
        id: `ref_${Date.now()}_4`,
        customer_name: 'Emily Davis',
        referred_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const,
        order_value: undefined,
        commission_earned: undefined
      },
      {
        id: `ref_${Date.now()}_5`,
        customer_name: 'Robert Brown',
        referred_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'expired' as const,
        order_value: undefined,
        commission_earned: undefined
      }
    ]
    
    res.json({
      referrals: mockReferrals.slice(0, 5), // Return top 5 recent referrals
      count: mockReferrals.length
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch recent referrals",
      message: error.message 
    })
  }
}