import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/vendors/:vendorId/products/:productId - Get single product
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { vendorId, productId } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Get product with vendor check
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
        "variants.inventory_quantity",
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
        "Product not found"
      )
    }

    res.json({
      product: products[0],
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Error fetching product", 
      error: error.message 
    })
  }
}

// PUT /admin/vendors/:vendorId/products/:productId - Update product
export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { vendorId, productId } = req.params
  const productService = req.scope.resolve(Modules.PRODUCT)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Verify product belongs to vendor
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
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

    // Update product - MedusaJS v2 uses updateProducts with single ID
    await productService.updateProducts(productId, req.body as any)
    
    // Fetch updated product
    const { data: [updatedProduct] } = await query.graph({
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
      filters: { id: productId },
    })
    
    res.json({
      product: updatedProduct,
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Failed to update product",
      error: error.message 
    })
  }
}

// DELETE /admin/vendors/:vendorId/products/:productId - Delete product
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { vendorId, productId } = req.params
  const productService = req.scope.resolve(Modules.PRODUCT)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  try {
    // Verify product belongs to vendor
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
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

    // Delete vendor_product relation if it exists
    const marketplaceModule = req.scope.resolve("marketplace")
    if (marketplaceModule?.deleteVendorProducts) {
      try {
        await marketplaceModule.deleteVendorProducts({
          vendor_id: vendorId,
          product_id: productId,
        })
      } catch (error) {
        // Continue even if relation doesn't exist
      }
    }

    // Delete product
    await productService.deleteProducts([productId])
    
    res.json({
      id: productId,
      object: "product",
      deleted: true,
    })
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    res.status(500).json({ 
      message: "Failed to delete product",
      error: error.message 
    })
  }
}