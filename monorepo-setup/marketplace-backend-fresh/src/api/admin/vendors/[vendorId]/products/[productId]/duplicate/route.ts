import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// POST /admin/vendors/:vendorId/products/:productId/duplicate - Duplicate a product
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { vendorId, productId } = req.params
  const productService = req.scope.resolve(Modules.PRODUCT)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get original product with all details
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
        "images.*",
        "collection.*",
        "type.*",
        "tags.*",
      ],
      filters: {
        id: productId,
      },
    })

    if (!products.length || products[0].metadata?.vendor_id !== vendorId) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Product not found or does not belong to this vendor"
      )
    }

    const originalProduct = products[0]
    
    // Prepare duplicate data
    const duplicateData = {
      title: `${originalProduct.title} (Copy)`,
      handle: `${originalProduct.handle}-copy-${Date.now()}`,
      subtitle: originalProduct.subtitle,
      description: originalProduct.description,
      status: 'draft', // Always set duplicates as draft
      collection_id: originalProduct.collection_id,
      type_id: originalProduct.type_id,
      tags: originalProduct.tags?.map((tag: any) => tag.value) || [],
      discountable: originalProduct.discountable,
      metadata: {
        ...originalProduct.metadata,
        duplicated_from: productId,
        duplicated_at: new Date().toISOString(),
      },
      // Duplicate variants
      variants: originalProduct.variants?.map((variant: any) => ({
        title: variant.title,
        sku: `${variant.sku || ''}-copy`,
        barcode: variant.barcode,
        hs_code: variant.hs_code,
        inventory_quantity: variant.inventory_quantity || 0,
        allow_backorder: variant.allow_backorder,
        manage_inventory: variant.manage_inventory,
        weight: variant.weight,
        length: variant.length,
        height: variant.height,
        width: variant.width,
        prices: variant.prices?.map((price: any) => ({
          amount: price.amount,
          currency_code: price.currency_code,
        })) || [],
      })) || [],
      // Note: Images will need to be re-added manually or through a separate process
    }
    
    // Create duplicate product
    const [duplicateProduct] = await productService.createProducts([duplicateData] as any)
    
    // Create vendor_product relation
    const marketplaceModule = req.scope.resolve("marketplace")
    if (marketplaceModule?.createVendorProducts) {
      const { data: [originalVendorProduct] } = await query.graph({
        entity: "marketplace_vendor_product",
        fields: ["*"],
        filters: {
          vendor_id: vendorId,
          product_id: productId,
        },
      })
      
      await marketplaceModule.createVendorProducts({
        vendor_id: vendorId,
        product_id: duplicateProduct.id,
        commission_rate: originalVendorProduct?.commission_rate || 0.20,
      })
    }
    
    // Fetch complete duplicate product data
    const { data: [completeProduct] } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
        "images.*",
        "collection.*",
        "type.*",
        "tags.*",
      ],
      filters: { id: duplicateProduct.id },
    })
    
    res.json({
      product: completeProduct,
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Failed to duplicate product",
      error: error.message 
    })
  }
}