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
    
    // Mock promo codes - in a real system, these would come from the discount module
    const mockPromoCodes = [
      {
        id: 'promo_1',
        code: 'WELCOME420',
        description: 'Welcome offer for new customers - 20% off first order',
        discount_type: 'percentage' as const,
        discount_value: 20,
        min_order_value: 5000, // $50.00
        valid_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usage_count: 23,
        usage_limit: 100,
        is_active: true
      },
      {
        id: 'promo_2',
        code: 'SAVE10',
        description: 'Save $10 on orders over $75',
        discount_type: 'fixed' as const,
        discount_value: 1000, // $10.00
        min_order_value: 7500, // $75.00
        valid_from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        usage_count: 45,
        usage_limit: null,
        is_active: true
      },
      {
        id: 'promo_3',
        code: 'FLASHSALE25',
        description: '48-hour flash sale - 25% off everything',
        discount_type: 'percentage' as const,
        discount_value: 25,
        min_order_value: null,
        valid_from: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        valid_until: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        usage_count: 78,
        usage_limit: 200,
        is_active: true
      },
      {
        id: 'promo_4',
        code: 'LOYALTY15',
        description: 'Loyalty discount - 15% off for returning customers',
        discount_type: 'percentage' as const,
        discount_value: 15,
        min_order_value: 4000, // $40.00
        valid_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        usage_count: 156,
        usage_limit: null,
        is_active: true
      },
      {
        id: 'promo_5',
        code: 'EXPIRED20',
        description: 'Past promotion - 20% off (expired)',
        discount_type: 'percentage' as const,
        discount_value: 20,
        min_order_value: null,
        valid_from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        valid_until: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        usage_count: 89,
        usage_limit: 100,
        is_active: false
      },
      {
        id: 'promo_6',
        code: 'FREESHIP',
        description: 'Free shipping on orders over $100',
        discount_type: 'fixed' as const,
        discount_value: 0, // Special case for free shipping
        min_order_value: 10000, // $100.00
        valid_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usage_count: 34,
        usage_limit: null,
        is_active: true
      }
    ]
    
    res.json({
      promo_codes: mockPromoCodes,
      count: mockPromoCodes.length
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch promo codes",
      message: error.message 
    })
  }
}