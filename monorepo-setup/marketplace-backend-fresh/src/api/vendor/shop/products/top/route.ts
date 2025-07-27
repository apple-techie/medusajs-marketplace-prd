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
    
    // Mock top performing products - in a real system, these would come from referral tracking
    const mockTopProducts = [
      {
        id: `prod_${Date.now()}_1`,
        product_name: 'Premium THC Vape Pen',
        brand: 'Green Valley Co',
        referral_count: 45,
        conversion_rate: 15.5,
        total_commission: 68500 // $685.00
      },
      {
        id: `prod_${Date.now()}_2`,
        product_name: 'Organic CBD Tincture 1000mg',
        brand: 'Pure Leaf Labs',
        referral_count: 38,
        conversion_rate: 12.2,
        total_commission: 52300 // $523.00
      },
      {
        id: `prod_${Date.now()}_3`,
        product_name: 'Delta-8 Gummies Pack',
        brand: 'Happy Hemp',
        referral_count: 32,
        conversion_rate: 18.7,
        total_commission: 44800 // $448.00
      },
      {
        id: `prod_${Date.now()}_4`,
        product_name: 'Live Resin Cartridge',
        brand: 'Crystal Clear',
        referral_count: 28,
        conversion_rate: 14.3,
        total_commission: 38900 // $389.00
      },
      {
        id: `prod_${Date.now()}_5`,
        product_name: 'Full Spectrum CBD Oil',
        brand: 'Nature\'s Best',
        referral_count: 25,
        conversion_rate: 11.0,
        total_commission: 32100 // $321.00
      }
    ]
    
    res.json({
      products: mockTopProducts.slice(0, 5), // Return top 5 products
      count: mockTopProducts.length
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch top products",
      message: error.message 
    })
  }
}