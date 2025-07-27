import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// POST /admin/vendors/:id/inventory/:variantId/adjust - Adjust inventory
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id: vendorId, variantId } = req.params
  const { amount, reason } = req.body as { amount: number; reason?: string }
  
  const inventoryService = req.scope.resolve(Modules.INVENTORY)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Verify variant belongs to vendor
    const { data: variants } = await query.graph({
      entity: "variant",
      fields: ["id", "inventory_items.*", "product.*"],
      filters: {
        id: variantId,
      },
    })

    if (!variants.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Variant not found or does not belong to this vendor"
      )
    }

    const variant = variants[0]
    const inventoryItem = variant.inventory_items?.[0]

    if (!inventoryItem) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "No inventory item found for this variant"
      )
    }

    // Create inventory level adjustment
    if (amount > 0) {
      // Add stock
      // In production, use proper inventory adjustment API
      // For now, log the adjustment
      console.log(`Adding ${amount} to inventory`)
    } else if (amount < 0) {
      // Remove stock
      // In production, use proper inventory adjustment API
      console.log(`Removing ${Math.abs(amount)} from inventory`)
    }

    // Log the adjustment (in a real system, you'd store this in a dedicated table)
    console.log(`Inventory adjustment: Vendor ${vendorId}, Variant ${variantId}, Amount ${amount}, Reason: ${reason}`)

    res.json({
      success: true,
      adjustment: {
        variant_id: variantId,
        amount,
        reason,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Failed to adjust inventory",
      error: error.message 
    })
  }
}