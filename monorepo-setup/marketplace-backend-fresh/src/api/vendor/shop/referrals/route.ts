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

// Helper to generate referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
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
    
    // Mock referral links - in a real system, these would come from a database
    const mockReferralLinks = [
      {
        id: `link_${Date.now()}_1`,
        name: 'Instagram Campaign',
        code: 'INSTA123',
        url: `https://marketplace.com/ref/INSTA123`,
        clicks: 245,
        conversions: 32,
        conversion_rate: 13.1,
        total_commission: 48500,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        product_id: null,
        product_name: null,
        category: 'social_media'
      },
      {
        id: `link_${Date.now()}_2`,
        name: 'Blog Post - CBD Guide',
        code: 'BLOG456',
        url: `https://marketplace.com/ref/BLOG456`,
        clicks: 189,
        conversions: 28,
        conversion_rate: 14.8,
        total_commission: 42300,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        product_id: 'prod_cbd_1000',
        product_name: 'Organic CBD Tincture 1000mg',
        category: 'blog'
      },
      {
        id: `link_${Date.now()}_3`,
        name: 'Email Newsletter',
        code: 'EMAIL789',
        url: `https://marketplace.com/ref/EMAIL789`,
        clicks: 156,
        conversions: 18,
        conversion_rate: 11.5,
        total_commission: 27800,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        product_id: null,
        product_name: null,
        category: 'email'
      },
      {
        id: `link_${Date.now()}_4`,
        name: 'YouTube Review',
        code: 'YT2024',
        url: `https://marketplace.com/ref/YT2024`,
        clicks: 423,
        conversions: 45,
        conversion_rate: 10.6,
        total_commission: 68900,
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        product_id: 'prod_vape_1',
        product_name: 'Premium THC Vape Pen',
        category: 'social_media'
      },
      {
        id: `link_${Date.now()}_5`,
        name: 'Old Campaign',
        code: 'OLD123',
        url: `https://marketplace.com/ref/OLD123`,
        clicks: 78,
        conversions: 5,
        conversion_rate: 6.4,
        total_commission: 7500,
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: false,
        product_id: null,
        product_name: null,
        category: 'general'
      }
    ]
    
    res.json({
      referral_links: mockReferralLinks,
      count: mockReferralLinks.length
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch referral links",
      message: error.message 
    })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  try {
    const decoded = validateVendorToken(req)
    const vendorId = decoded.app_metadata?.vendor_id
    
    if (!vendorId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const { name, product_id, category } = req.body as any
    
    if (!name) {
      return res.status(400).json({ error: "Link name is required" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a shop partner
    if (vendor.type !== 'shop_partner') {
      return res.status(403).json({ error: "This endpoint is only for shop partners" })
    }
    
    // Generate new referral link
    const code = generateReferralCode()
    const newLink = {
      id: `link_${Date.now()}`,
      name,
      code,
      url: `https://marketplace.com/ref/${code}`,
      clicks: 0,
      conversions: 0,
      conversion_rate: 0,
      total_commission: 0,
      created_at: new Date().toISOString(),
      is_active: true,
      product_id: product_id || null,
      product_name: product_id ? 'Sample Product' : null,
      category: category || 'general',
      vendor_id: vendorId
    }
    
    // In a real system, save to database
    console.log('Created referral link:', newLink)
    
    res.json({
      referral_link: newLink,
      success: true
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to create referral link",
      message: error.message 
    })
  }
}