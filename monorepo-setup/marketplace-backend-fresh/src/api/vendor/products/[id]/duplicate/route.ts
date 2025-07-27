import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"
import MarketplaceModuleService from "../../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../../modules/marketplace"
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
 * POST /vendor/products/:id/duplicate
 * Duplicate a product
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  const decoded = validateVendorToken(req)
  const vendorId = decoded.actor_id
  const productId = req.params.id
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  const productService = req.scope.resolve("product")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Verify vendor owns this product
    const { data: productCheck } = await query.graph({
      entity: "product",
      fields: ["id", "metadata"],
      filters: { id: productId }
    })
    
    if (!productCheck[0] || productCheck[0].metadata?.vendor_id !== vendorId) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You don't have permission to duplicate this product"
      )
    }
    
    // Get the original product
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
        "images.*",
        "categories.*",
        "tags.*"
      ],
      filters: {
        id: productId
      }
    })
    
    if (products.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Product not found"
      )
    }
    
    const originalProduct = products[0]
    
    // Get vendor for metadata
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Create the duplicate
    const [duplicatedProduct] = await productService.createProducts([{
      title: `${originalProduct.title} (Copy)`,
      handle: `${originalProduct.handle}-copy-${Date.now()}`,
      description: originalProduct.description || undefined,
      status: 'draft', // Always create duplicates as draft
      metadata: {
        vendor_id: vendorId,
        vendor_name: vendor.name,
        commission_rate: vendor.commission_rate
      },
      category_ids: originalProduct.categories?.map((c: any) => c?.id).filter(Boolean) || [],
      images: originalProduct.images?.map((img: any) => ({ url: img.url })) || [],
      variants: originalProduct.variants?.map((v: any) => ({
        title: v.title,
        sku: `${v.sku}-copy`,
        inventory_quantity: (v as any).inventory_quantity || 0,
        prices: (v as any).prices?.map((p: any) => ({
          amount: p.amount,
          currency_code: p.currency_code
        })) || []
      })) || []
    }])
    
    res.json({ product: duplicatedProduct })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to duplicate product",
      details: error.message
    })
  }
}

/**
 * OPTIONS /vendor/products/:id/duplicate
 * Handle CORS preflight
 */
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  res.status(200).end()
}