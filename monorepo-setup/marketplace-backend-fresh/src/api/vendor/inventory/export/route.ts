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
      // Return empty CSV
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="inventory-${new Date().toISOString().split('T')[0]}.csv"`)
      return res.send('Product Title,Variant Title,SKU,Available,Reserved,Total,Status,Location,Last Updated\n')
    }
    
    // Get unique product IDs
    const productIds = [...new Set(vendorProducts.map(vp => vp.product_id))]
    
    // Get products with variants
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "status",
        "variants.*",
        "variants.inventory_items.*",
        "variants.inventory_items.inventory.*"
      ],
      filters: {
        id: productIds as string[]
      }
    })
    
    // Get vendor's fulfillment location
    const vendorLocations = await marketplaceService.listFulfillmentLocations({ vendor_id: vendorId })
    const defaultLocation = vendorLocations[0]
    
    // Create CSV content
    const csvRows = ['Product Title,Variant Title,SKU,Available,Reserved,Total,Status,Location,Last Updated']
    
    for (const product of products) {
      for (const variant of product.variants || []) {
        // Get inventory level for this variant
        let quantity = 0
        let reserved_quantity = 0
        let location = defaultLocation?.name || 'Main Warehouse'
        
        if (variant.inventory_items && variant.inventory_items.length > 0) {
          const inventoryItem = variant.inventory_items[0]
          if (inventoryItem && inventoryItem.inventory && Array.isArray(inventoryItem.inventory) && inventoryItem.inventory.length > 0) {
            const inv = inventoryItem.inventory[0]
            quantity = inv.stocked_quantity || 0
            reserved_quantity = inv.reserved_quantity || 0
          }
        }
        
        const availableQuantity = quantity - reserved_quantity
        
        // Determine status
        let status = 'In Stock'
        if (availableQuantity === 0) {
          status = 'Out of Stock'
        } else if (availableQuantity <= 10) {
          status = 'Low Stock'
        }
        
        // Add row to CSV
        csvRows.push([
          `"${product.title}"`,
          `"${variant.title || 'Default'}"`,
          `"${variant.sku || `SKU-${variant.id}`}"`,
          availableQuantity,
          reserved_quantity,
          quantity,
          status,
          `"${location}"`,
          new Date().toISOString()
        ].join(','))
      }
    }
    
    const csvContent = csvRows.join('\n')
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="inventory-${new Date().toISOString().split('T')[0]}.csv"`)
    res.send(csvContent)
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to export inventory",
      message: error.message 
    })
  }
}