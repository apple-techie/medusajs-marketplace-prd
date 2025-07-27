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
    
    const { variant_id, adjustment_type, quantity, reason } = req.body as {
      variant_id?: string
      adjustment_type?: string
      quantity?: number
      reason?: string
    }
    
    if (!variant_id || !adjustment_type || !quantity || !reason) {
      return res.status(400).json({ error: "Missing required fields" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    const productModule = req.scope.resolve(Modules.PRODUCT)
    const inventoryModule = req.scope.resolve(Modules.INVENTORY)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Verify vendor owns the product
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: [
        "id",
        "product_id",
        "inventory_items.*",
        "product.id"
      ],
      filters: {
        id: variant_id
      }
    })
    
    if (!variants.length) {
      return res.status(404).json({ error: "Variant not found" })
    }
    
    const variant = variants[0]
    const vendorProducts = await marketplaceService.listVendorProducts({ 
      vendor_id: vendorId,
      product_id: variant.product_id
    })
    
    if (!vendorProducts.length) {
      return res.status(403).json({ error: "You do not have permission to adjust this product's inventory" })
    }
    
    // Get vendor's fulfillment location
    const vendorLocations = await marketplaceService.listFulfillmentLocations({ vendor_id: vendorId })
    if (!vendorLocations.length) {
      return res.status(400).json({ error: "No fulfillment location found for vendor" })
    }
    
    const locationId = vendorLocations[0].stock_location_id
    
    // Get inventory item ID
    const inventoryItems = (variant as any).inventory_items
    if (!inventoryItems?.length) {
      return res.status(400).json({ error: "No inventory item found for this variant" })
    }
    
    const inventoryItemId = inventoryItems[0].inventory_item_id || inventoryItems[0].id
    
    // Get current inventory level
    const inventoryLevels = await inventoryModule.listInventoryLevels({
      inventory_item_id: inventoryItemId,
      location_id: locationId
    })
    
    if (!inventoryLevels.length) {
      // Create inventory level if it doesn't exist
      await inventoryModule.createInventoryLevels([{
        inventory_item_id: inventoryItemId,
        location_id: locationId,
        stocked_quantity: adjustment_type === 'add' ? quantity : 0
      }])
    } else {
      // Update existing inventory level
      const currentLevel = inventoryLevels[0]
      const newQuantity = adjustment_type === 'add' 
        ? (currentLevel.stocked_quantity || 0) + quantity
        : Math.max(0, (currentLevel.stocked_quantity || 0) - quantity)
      
      await inventoryModule.updateInventoryLevels([{
        inventory_item_id: inventoryItemId,
        location_id: locationId,
        stocked_quantity: newQuantity
      }])
    }
    
    // Log the adjustment (in a real system, this would be saved to a database)
    console.log('Inventory adjustment:', {
      vendor_id: vendorId,
      variant_id,
      adjustment_type,
      quantity,
      reason,
      timestamp: new Date().toISOString()
    })
    
    res.json({
      success: true,
      message: `Successfully ${adjustment_type === 'add' ? 'added' : 'removed'} ${quantity} units`,
      adjustment: {
        variant_id,
        adjustment_type,
        quantity,
        reason,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to adjust inventory",
      message: error.message 
    })
  }
}