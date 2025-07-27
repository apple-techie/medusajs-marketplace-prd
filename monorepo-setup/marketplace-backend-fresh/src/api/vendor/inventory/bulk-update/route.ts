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

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  try {
    const decoded = validateVendorToken(req)
    const vendorId = decoded.app_metadata?.vendor_id
    
    if (!vendorId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const { variant_ids, update_type } = req.body as {
      variant_ids?: string[]
      update_type?: string
    }
    
    if (!variant_ids || !Array.isArray(variant_ids) || !update_type) {
      return res.status(400).json({ error: "Missing required fields" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    const productModule = req.scope.resolve(Modules.PRODUCT)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Verify vendor owns all variants
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: ["id", "product_id"],
      filters: {
        id: variant_ids
      }
    })
    
    const productIds = [...new Set(variants.map(v => v.product_id))]
    const vendorProducts = await marketplaceService.listVendorProducts({ 
      vendor_id: vendorId,
      product_id: productIds
    })
    
    const ownedProductIds = vendorProducts.map(vp => vp.product_id)
    const unauthorizedVariants = variants.filter(v => !ownedProductIds.includes(v.product_id))
    
    if (unauthorizedVariants.length > 0) {
      return res.status(403).json({ 
        error: "You do not have permission to update some of the selected variants" 
      })
    }
    
    // Perform bulk update based on type
    let updateCount = 0
    const results: any[] = []
    
    switch (update_type) {
      case 'mark_low_stock':
        // In a real system, this would update metadata or trigger alerts
        for (const variantId of variant_ids) {
          results.push({
            variant_id: variantId,
            action: 'marked_low_stock',
            timestamp: new Date().toISOString()
          })
          updateCount++
        }
        break
        
      case 'update_thresholds':
        // In a real system, this would update inventory thresholds
        for (const variantId of variant_ids) {
          results.push({
            variant_id: variantId,
            action: 'thresholds_updated',
            low_stock_threshold: 10,
            reorder_point: 20,
            reorder_quantity: 50,
            timestamp: new Date().toISOString()
          })
          updateCount++
        }
        break
        
      case 'generate_reorder':
        // In a real system, this would create purchase orders
        for (const variantId of variant_ids) {
          results.push({
            variant_id: variantId,
            action: 'reorder_generated',
            reorder_quantity: 50,
            timestamp: new Date().toISOString()
          })
          updateCount++
        }
        break
        
      default:
        return res.status(400).json({ error: "Invalid update type" })
    }
    
    res.json({
      success: true,
      message: `Successfully updated ${updateCount} items`,
      update_type,
      results
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to perform bulk update",
      message: error.message 
    })
  }
}