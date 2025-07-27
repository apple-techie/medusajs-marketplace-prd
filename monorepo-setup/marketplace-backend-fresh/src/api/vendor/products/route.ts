import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Helper function to validate vendor JWT
const validateVendorToken = (req: MedusaRequest) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "No authorization token provided"
    )
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "marketplace_jwt_secret_2025_production_key") as any
    return decoded
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "Invalid or expired token"
    )
  }
}

// Helper function to set CORS headers
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

/**
 * GET /vendor/products
 * Get all products for the authenticated vendor
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  const decoded = validateVendorToken(req)
  const vendorId = decoded.actor_id
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get all products and filter by vendor_id in metadata
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
        "images.*",
        "categories.*",
        "tags.*",
        "metadata"
      ]
    })
    
    // Filter products by vendor_id in metadata
    const vendorProducts = products.filter((product: any) => 
      product.metadata?.vendor_id === vendorId
    )
    
    res.json({ products: vendorProducts })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to fetch products",
      details: error.message
    })
  }
}

/**
 * POST /vendor/products
 * Create a new product for the vendor
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  const decoded = validateVendorToken(req)
  const vendorId = decoded.actor_id
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  const productService = req.scope.resolve("product")
  const reqBody = req.body as any
  
  try {
    // Get vendor details for metadata
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Create the product in MedusaJS with vendor metadata
    const [product] = await productService.createProducts([{
      title: reqBody.title,
      handle: reqBody.handle || reqBody.title.toLowerCase().replace(/\s+/g, '-'),
      description: reqBody.description,
      status: reqBody.status || 'draft',
      category_ids: reqBody.categories?.map((c: any) => c.id || c).filter(Boolean) || [],
      images: reqBody.images || [],
      metadata: {
        vendor_id: vendorId,
        vendor_name: vendor.name,
        commission_rate: vendor.commission_rate
      },
      variants: reqBody.variants || [{
        title: "Default",
        sku: reqBody.sku,
        inventory_quantity: reqBody.inventory_quantity || 0,
        prices: reqBody.prices || []
      }]
    }])
    
    res.json({ product })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to create product",
      details: error.message
    })
  }
}

/**
 * OPTIONS /vendor/products
 * Handle CORS preflight
 */
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  res.status(200).end()
}