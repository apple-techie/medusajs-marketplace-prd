import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"
import MarketplaceModuleService from "../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
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

// Helper to verify vendor owns the product
const verifyProductOwnership = async (vendorId: string, productId: string, query: any) => {
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "metadata"],
    filters: { id: productId }
  })
  
  if (!products[0] || products[0].metadata?.vendor_id !== vendorId) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You don't have permission to access this product"
    )
  }
  
  return products[0]
}

/**
 * GET /vendor/products/:id
 * Get a specific product
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  const decoded = validateVendorToken(req)
  const vendorId = decoded.actor_id
  const productId = req.params.id
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Verify vendor owns this product
    const vendorProduct = await verifyProductOwnership(vendorId, productId, query)
    
    // Get the product details
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
    
    const product = products[0]
    
    res.json({ 
      product: {
        ...product,
        vendor_product: vendorProduct
      }
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to fetch product",
      details: error.message
    })
  }
}

/**
 * PUT /vendor/products/:id
 * Update a product
 */
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  const decoded = validateVendorToken(req)
  const vendorId = decoded.actor_id
  const productId = req.params.id
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  const productService = req.scope.resolve("product")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const reqBody = req.body as any
  
  try {
    // Verify vendor owns this product
    await verifyProductOwnership(vendorId, productId, query)
    
    // Update the product
    const updateData: any = {
      title: reqBody.title,
      handle: reqBody.handle,
      description: reqBody.description,
      status: reqBody.status,
      category_ids: reqBody.categories?.map((c: any) => c.id || c).filter(Boolean),
      tags: reqBody.tags,
      images: reqBody.images
    }
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })
    
    const product = await productService.updateProducts(productId, updateData)
    
    res.json({ product })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to update product",
      details: error.message
    })
  }
}

/**
 * DELETE /vendor/products/:id
 * Delete a product
 */
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  const decoded = validateVendorToken(req)
  const vendorId = decoded.actor_id
  const productId = req.params.id
  
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(MARKETPLACE_MODULE)
  const productService = req.scope.resolve("product")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Verify vendor owns this product
    await verifyProductOwnership(vendorId, productId, query)
    
    // For now, we'll just delete the product
    // The vendor relationship is maintained through metadata
    
    // Delete the product
    await productService.deleteProducts([productId])
    
    res.json({ success: true })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    res.status(500).json({
      error: "Failed to delete product",
      details: error.message
    })
  }
}

/**
 * OPTIONS /vendor/products/:id
 * Handle CORS preflight
 */
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  res.status(200).end()
}