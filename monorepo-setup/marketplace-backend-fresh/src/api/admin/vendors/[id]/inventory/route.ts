import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/vendors/:id/inventory - Get vendor's inventory
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get products with inventory data
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "variants.*",
        "variants.inventory_items.*",
      ],
      filters: {},
    })

    // Transform to inventory format
    const inventoryItems: any[] = []
    
    for (const product of products) {
      // Check if product belongs to vendor
      if (product.metadata?.vendor_id !== vendorId) continue
      
      for (const variant of product.variants || []) {
        // In MedusaJS v2, inventory is managed separately
        // For now, we'll create a simplified view
        inventoryItems.push({
          id: variant.id,
          product_id: product.id,
          variant_id: variant.id,
          product_title: product.title,
          variant_title: variant.title,
          sku: variant.sku,
          quantity: 0, // Would need to query inventory module
          reserved_quantity: 0,
          available_quantity: 0,
          threshold: 10, // Default threshold
          status: 'out_of_stock',
          last_restock: null,
        })
      }
    }

    res.json({
      inventory: inventoryItems,
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching inventory", 
      error: error.message 
    })
  }
}

function getInventoryStatus(available: number, threshold: number): string {
  if (available === 0) return 'out_of_stock'
  if (available <= threshold) return 'low_stock'
  return 'in_stock'
}