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
    const productModule = req.scope.resolve(Modules.PRODUCT)
    const inventoryModule = req.scope.resolve(Modules.INVENTORY)
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    // Get vendor products
    const vendorProducts = await marketplaceService.listVendorProducts({ vendor_id: vendorId })
    
    if (!vendorProducts.length) {
      return res.json({
        stats: {
          total_items: 0,
          low_stock_items: 0,
          out_of_stock_items: 0,
          total_value: 0,
          items_to_reorder: 0
        }
      })
    }
    
    // Get unique product IDs
    const productIds = [...new Set(vendorProducts.map(vp => vp.product_id))]
    
    // Get products with variants
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "variants.*",
        "variants.inventory_items.*",
        "variants.inventory_items.inventory.*",
        "variants.prices.*"
      ],
      filters: {
        id: productIds as string[]
      }
    })
    
    // Calculate stats
    let totalItems = 0
    let lowStockItems = 0
    let outOfStockItems = 0
    let totalValue = 0
    let itemsToReorder = 0
    
    const LOW_STOCK_THRESHOLD = 10
    const REORDER_POINT = 20
    
    for (const product of products) {
      for (const variant of product.variants || []) {
        totalItems++
        
        // Get inventory level
        let quantity = 0
        let reserved_quantity = 0
        
        if (variant.inventory_items && variant.inventory_items.length > 0) {
          const inventoryItem = variant.inventory_items[0]
          if (inventoryItem && inventoryItem.inventory && Array.isArray(inventoryItem.inventory) && inventoryItem.inventory.length > 0) {
            const inv = inventoryItem.inventory[0]
            quantity = inv.stocked_quantity || 0
            reserved_quantity = inv.reserved_quantity || 0
          }
        }
        
        const availableQuantity = quantity - reserved_quantity
        
        // Count stock statuses
        if (availableQuantity === 0) {
          outOfStockItems++
          itemsToReorder++
        } else if (availableQuantity <= LOW_STOCK_THRESHOLD) {
          lowStockItems++
          if (availableQuantity <= REORDER_POINT) {
            itemsToReorder++
          }
        } else if (availableQuantity <= REORDER_POINT) {
          itemsToReorder++
        }
        
        // Calculate value from prices
        const variantWithPrices = variant as any
        if (variantWithPrices.prices && Array.isArray(variantWithPrices.prices) && variantWithPrices.prices.length > 0) {
          // Get the first price (should filter by currency_code in production)
          const price = variantWithPrices.prices[0]
          if (price && typeof price.amount === 'number') {
            totalValue += price.amount * availableQuantity
          }
        }
      }
    }
    
    res.json({
      stats: {
        total_items: totalItems,
        low_stock_items: lowStockItems,
        out_of_stock_items: outOfStockItems,
        total_value: Math.round(totalValue),
        items_to_reorder: itemsToReorder
      }
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch inventory stats",
      message: error.message 
    })
  }
}